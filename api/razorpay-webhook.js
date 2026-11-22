import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { timingSafeMatch } from './_security.js';
import { finalizeEventPayment } from './_finalizeEventPayment.js';

// Razorpay signs the RAW body, so Vercel's body parser must be off.
export const config = { api: { bodyParser: false } };

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://dgkubrwfrwcfpkgjoxmu.supabase.co';

async function readRaw(req) {
  const chunks = [];
  for await (const c of req) chunks.push(typeof c === 'string' ? Buffer.from(c) : c);
  return Buffer.concat(chunks);
}

/**
 * POST /api/razorpay-webhook   (set this URL in Razorpay Dashboard -> Webhooks)
 * Events: payment.captured, order.paid       Secret: RAZORPAY_WEBHOOK_SECRET
 *
 * Safety net: if the user paid but closed the browser before the app could
 * call /api/verify-event-payment, this still marks the payment PAID and
 * completes the registration.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET;
  const keyId = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.VITE_RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SERVICE_ROLE_KEY;
  if (!webhookSecret || !keyId || !keySecret || !serviceKey) {
    console.error('[razorpay-webhook] missing env (RAZORPAY_WEBHOOK_SECRET / keys / service role)');
    return res.status(500).json({ error: 'Not configured' });
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

  const payment = evt.payload?.payment?.entity;
  const orderId = payment?.order_id || evt.payload?.order?.entity?.id;
  if (!orderId || !payment?.id) return res.status(200).json({ ignored: true });

  try {
    // Never trust the webhook body for notes/amount: re-read the order from Razorpay
    const r = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`, {
      headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}` },
    });
    const order = await r.json();
    if (!r.ok) throw new Error('order lookup failed');

    // Only event orders (Basic Registration orders etc. are ignored here)
    if (order.notes?.type !== 'event' || order.status !== 'paid' || order.amount_paid !== order.amount) {
      return res.status(200).json({ ignored: true });
    }

    await finalizeEventPayment(createClient(SUPABASE_URL, serviceKey), order, payment.id);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[razorpay-webhook] error:', err);
    return res.status(500).json({ error: 'Retry' }); // Razorpay retries on non-2xx
  }
}
