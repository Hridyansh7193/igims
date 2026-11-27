import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import {
  timingSafeMatch,
  isPaymentsEnabled,
  getCleanRazorpayKeys,
  getCleanServiceRoleKey,
  assertSafeDatabaseMutation,
} from './_security.js';
import { finalizeEventPayment } from './_finalizeEventPayment.js';
import { finalizeBasicRegistration } from './_finalizeBasicRegistration.js';

// Razorpay signs the RAW body, so Vercel's body parser must be off.
export const config = { api: { bodyParser: false } };

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;

async function readRaw(req) {
  const chunks = [];
  for await (const c of req) chunks.push(typeof c === 'string' ? Buffer.from(c) : c);
  return Buffer.concat(chunks);
}

/**
 * POST /api/razorpay-webhook   (set this URL in Razorpay Dashboard -> Webhooks)
 * Events: payment.captured, order.paid       Secret: RAZORPAY_WEBHOOK_SECRET
 *
 * Safety net: if the user paid (Event OR Basic Registration) and closed/reloaded
 * the browser before the app could verify, this marks the DB rows PAID, issues
 * BR QR passes, and emails the attendee automatically.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!isPaymentsEnabled()) {
    return res.status(200).json({ ignored: true, reason: 'Payments disabled on this deployment.' });
  }

  assertSafeDatabaseMutation(SUPABASE_URL);

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET;
  const { keyId, keySecret, error: keyError } = getCleanRazorpayKeys();
  const serviceKey =
    getCleanServiceRoleKey(process.env.SUPABASE_SERVICE_ROLE_KEY) ||
    getCleanServiceRoleKey(process.env.SUPABASE_SERVICE_KEY) ||
    getCleanServiceRoleKey(process.env.SERVICE_ROLE_KEY);

  if (keyError || !webhookSecret || !keyId || !keySecret || !serviceKey || !SUPABASE_URL) {
    console.error('[razorpay-webhook] missing or isolated environment variables', keyError || '');
    return res.status(500).json({ error: keyError || 'Webhook service is not configured' });
  }

  const raw = await readRaw(req);
  const signature = String(req.headers['x-razorpay-signature'] || '');
  const expected = crypto.createHmac('sha256', webhookSecret).update(raw).digest('hex');
  if (!timingSafeMatch(expected, signature)) return res.status(400).json({ error: 'Bad signature' });

  let evt;
  try { evt = JSON.parse(raw.toString('utf8')); } catch { return res.status(400).json({ error: 'Bad JSON' }); }

  if (evt.event !== 'payment.captured' && evt.event !== 'order.paid') {
    return res.status(200).json({ ignored: true });
  }

  const paymentEntity = evt.payload?.payment?.entity;
  const orderEntity = evt.payload?.order?.entity;
  const paymentId = paymentEntity?.id;
  const orderId = paymentEntity?.order_id || orderEntity?.id || null;

  if (!paymentId) return res.status(200).json({ ignored: true });

  const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`;
  const db = createClient(SUPABASE_URL, serviceKey);

  try {
    // Re-fetch authoritative payment & order directly from Razorpay API
    let order = null;
    if (orderId) {
      const r = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`, {
        headers: { Authorization: authHeader },
      });
      if (!r.ok) throw new Error('order lookup failed');
      order = await r.json();
    }

    let payment = paymentEntity;
    const rp = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: authHeader },
    });
    if (rp.ok) {
      payment = await rp.json();
    } else if (!order) {
      throw new Error('payment lookup failed');
    }

    const orderType = order?.notes?.type || payment?.notes?.type || '';

    // 1. Event registration order
    if (orderType === 'event') {
      if (!order || order.status !== 'paid' || order.amount_paid !== order.amount) {
        return res.status(200).json({ ignored: true });
      }
      await finalizeEventPayment(db, order, paymentId);
      return res.status(200).json({ ok: true, mode: 'event' });
    }

    // 2. Accommodation bookings are handled by accommodation flow (ignore unless explicitly BR)
    if (orderType === 'accommodation') {
      return res.status(200).json({ ignored: true, reason: 'accommodation handled separately' });
    }

    // 3. Basic Registration (explicit type='basic_registration' OR payment links / fallback BR orders)
    if (payment?.status !== 'captured' && order?.status !== 'paid') {
      return res.status(200).json({ ignored: true, reason: 'payment not captured' });
    }

    const brResult = await finalizeBasicRegistration(db, {
      payment,
      order,
      sendEmail: true,
    });

    return res.status(200).json({
      ok: true,
      mode: 'basic_registration',
      alreadyRecorded: brResult.alreadyRecorded,
      ticketsIssued: brResult.tickets?.length || 0,
      emailsSent: brResult.emailsSent,
    });
  } catch (err) {
    console.error('[razorpay-webhook] error:', err);
    return res.status(500).json({ error: 'Retry' }); // Razorpay retries on non-2xx
  }
}
