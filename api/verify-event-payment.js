import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { finalizeEventPayment } from './_finalizeEventPayment.js';
import { finalizeBasicRegistration } from './_finalizeBasicRegistration.js';
import {
  checkRateLimit,
  setSecureCorsHeaders,
  timingSafeMatch,
  getCleanServiceRoleKey,
  getCleanSupabaseKey,
  getCleanRazorpayKeys,
  isPaymentsEnabled,
  assertSafeDatabaseMutation,
} from './_security.js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON =
  getCleanSupabaseKey(process.env.SUPABASE_ANON_KEY) ||
  getCleanSupabaseKey(process.env.VITE_SUPABASE_ANON_KEY);
const SERVICE_KEY =
  getCleanServiceRoleKey(process.env.SUPABASE_SERVICE_ROLE_KEY) ||
  getCleanServiceRoleKey(process.env.SUPABASE_SERVICE_KEY) ||
  getCleanServiceRoleKey(process.env.SERVICE_ROLE_KEY);

/**
 * POST /api/verify-event-payment
 * Header: Authorization: Bearer <supabase access token>
 * Handles:
 *   1. Event checkout verification (default)
 *   2. Basic Registration (BR) checkout verification (mode: 'basic_registration')
 *   3. Manual BR payment ID verification/recovery by logged-in attendee (action: 'verify-br-payment-id')
 */
export default async function handler(req, res) {
  setSecureCorsHeaders(req, res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(ip, 'verify_event_payment', 20, 60000).allowed) {
    return res.status(429).json({ error: 'Too many requests.' });
  }

  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'Please sign in first.' });
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    return res.status(500).json({ error: 'Database service is not configured on the server.' });
  }
  const authClient = createClient(SUPABASE_URL, SUPABASE_ANON);
  const { data: userData, error: authErr } = await authClient.auth.getUser(token);
  const user = userData?.user;
  if (authErr || !user) return res.status(401).json({ error: 'Session expired. Please sign in again.' });

  if (!isPaymentsEnabled()) {
    return res.status(403).json({ error: 'Payments are disabled on this deployment (PAYMENTS_ENABLED=false).' });
  }

  assertSafeDatabaseMutation(SUPABASE_URL);

  const { keyId, keySecret, error: keyError } = getCleanRazorpayKeys();
  if (keyError || !keyId || !keySecret) {
    return res.status(500).json({ error: keyError || 'Payment gateway credentials not configured on the server.' });
  }

  const db = SERVICE_KEY
    ? createClient(SUPABASE_URL, SERVICE_KEY)
    : createClient(SUPABASE_URL, SUPABASE_ANON, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      });

  const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`;

  // ── PATH A: Manual BR Payment ID Verification ("Already Paid via Razorpay / UPI?") ──
  if (req.body?.action === 'verify-br-payment-id') {
    const paymentId = String(req.body?.razorpay_payment_id || '').trim();
    if (!/^pay_[A-Za-z0-9]+$/.test(paymentId)) {
      return res.status(400).json({ verified: false, error: 'Please enter a valid Razorpay Payment ID (starts with pay_).' });
    }

    let payment = null;
    try {
      const r = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
        headers: { Authorization: authHeader },
      });
      if (r.ok) {
        payment = await r.json();
      }
    } catch (err) {
      console.error('[verify-br-payment-id] Razorpay lookup failed:', err);
    }

    if (!payment) {
      return res.status(404).json({ verified: false, error: 'Payment ID not found in Razorpay. Please check the ID and try again.' });
    }

    if (payment.status !== 'captured') {
      return res.status(400).json({
        verified: false,
        error: `This payment has status "${payment.status}" in Razorpay and has not been captured.`,
      });
    }

    let order = null;
    if (payment.order_id) {
      try {
        const ro = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(payment.order_id)}`, {
          headers: { Authorization: authHeader },
        });
        if (ro.ok) order = await ro.json();
      } catch (_) {}
    }

    const noteUserId = order?.notes?.user_id || payment.notes?.user_id || null;
    if (noteUserId && noteUserId !== user.id) {
      return res.status(403).json({ verified: false, error: 'This payment belongs to a different account.' });
    }
    if ((order?.notes?.type || payment.notes?.type) === 'event') {
      return res.status(400).json({ verified: false, error: 'This Payment ID is for a specific event, not Basic Registration.' });
    }

    // Check if this payment ID is already linked to another user
    const { data: existingTkts } = await db
      .from('tickets')
      .select('user_id')
      .contains('metadata', { razorpay_payment_id: paymentId });

    if (Array.isArray(existingTkts) && existingTkts.some((t) => t.user_id && t.user_id !== user.id)) {
      return res.status(403).json({ verified: false, error: 'This Payment ID has already been claimed by another account.' });
    }

    // Verify ownership when notes.user_id wasn't stored (e.g. razorpay.me link): match email or phone
    if (!noteUserId) {
      const userEmail = (user.email || '').trim().toLowerCase();
      const payEmail = (payment.email || '').trim().toLowerCase();
      const { data: part } = await db.from('participants').select('phone_number').eq('user_id', user.id).maybeSingle();
      const userPhone = String(part?.phone_number || '').replace(/\D/g, '').slice(-10);
      const payPhone = String(payment.contact || '').replace(/\D/g, '').slice(-10);

      const emailMatches = Boolean(userEmail && payEmail && userEmail === payEmail);
      const phoneMatches = Boolean(userPhone && payPhone && userPhone === payPhone);
      if (!emailMatches && !phoneMatches) {
        return res.status(403).json({
          verified: false,
          error: 'The email/phone on this Razorpay payment does not match your account. Please contact the Booking Desk with your payment receipt.',
        });
      }
    }

    const result = await finalizeBasicRegistration(db, {
      payment,
      order,
      userIdHint: user.id,
      brPayload: req.body?.registration_data || null,
      sendEmail: true,
    });

    return res.status(200).json({
      verified: true,
      alreadyRecorded: result.alreadyRecorded,
      tickets: result.tickets,
      emailsSent: result.emailsSent,
      amount: Math.round(Number(payment.amount || 0) / 100),
      payment_id: payment.id,
      order_id: payment.order_id || null,
    });
  }

  // ── PATH B: Standard Razorpay Checkout Signature Verification (Event or BR) ──
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, mode, registration_data } = req.body || {};
  if (![razorpay_order_id, razorpay_payment_id, razorpay_signature].every((v) => typeof v === 'string' && v)) {
    return res.status(400).json({ error: 'Missing payment details.' });
  }

  // 1. Signature verification using strictly configured secret
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (!timingSafeMatch(expected, razorpay_signature)) {
    return res.status(400).json({ verified: false, error: 'Payment signature mismatch.' });
  }

  // 2. Cross-check the order with Razorpay API
  let order = null;
  try {
    const r = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(razorpay_order_id)}`, {
      headers: { Authorization: authHeader },
    });
    if (r.ok) {
      order = await r.json();
    }
  } catch (err) {
    console.error('[verify-event-payment] fetch order error:', err);
  }

  if (!order) {
    console.error('[verify-event-payment] order lookup failed for', razorpay_order_id);
    return res.status(502).json({ error: 'Could not confirm the payment. Contact the organisers with your payment ID: ' + razorpay_payment_id });
  }

  if (order.status !== 'paid' || order.amount_paid !== order.amount) {
    return res.status(400).json({ verified: false, error: 'Payment not completed.' });
  }
  if (order.notes?.user_id && order.notes.user_id !== user.id) {
    return res.status(403).json({ verified: false, error: 'This payment belongs to a different account.' });
  }

  // ── Branch B1: Basic Registration ──
  if (mode === 'basic_registration' || order.notes?.type === 'basic_registration') {
    let paymentObj = {
      id: razorpay_payment_id,
      order_id: razorpay_order_id,
      amount: order.amount,
      email: user.email,
      status: 'captured',
    };
    try {
      const rp = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(razorpay_payment_id)}`, {
        headers: { Authorization: authHeader },
      });
      if (rp.ok) paymentObj = await rp.json();
    } catch (_) {}

    const brResult = await finalizeBasicRegistration(db, {
      payment: paymentObj,
      order,
      userIdHint: user.id,
      brPayload: registration_data || null,
      sendEmail: true,
    });

    return res.status(200).json({
      verified: true,
      mode: 'basic_registration',
      tickets: brResult.tickets,
      emailsSent: brResult.emailsSent,
      amount: order.amount / 100,
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
    });
  }

  // ── Branch B2: Paid Event Registration ──
  if (order.notes?.type !== 'event' || order.notes?.user_id !== user.id) {
    return res.status(403).json({ verified: false, error: 'This payment belongs to a different account.' });
  }

  const result = await finalizeEventPayment(db, order, razorpay_payment_id);

  return res.status(200).json({
    verified: true,
    recorded: result.recorded,
    registered: result.registered,
    amount: order.amount / 100,
    payment_id: razorpay_payment_id,
    order_id: razorpay_order_id,
  });
}
