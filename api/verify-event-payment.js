import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { finalizeEventPayment } from './_finalizeEventPayment.js';
import {
  checkRateLimit,
  setSecureCorsHeaders,
  timingSafeMatch,
  getCleanServiceRoleKey,
  getCleanSupabaseKey,
  getCleanRazorpayKeys,
} from './_security.js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://dgkubrwfrwcfpkgjoxmu.supabase.co';
const SUPABASE_ANON = getCleanSupabaseKey(
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);
const SERVICE_KEY = getCleanServiceRoleKey(
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SERVICE_ROLE_KEY
);

/**
 * POST /api/verify-event-payment
 * Header: Authorization: Bearer <supabase access token>
 * Body:   { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 *
 * 1. checks the HMAC signature with the Razorpay secret
 * 2. re-fetches the order from Razorpay: must be paid, full amount, same user
 * 3. stores a row in event_payments (unique per payment id)
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
  const authClient = createClient(SUPABASE_URL, SUPABASE_ANON);
  const { data: userData, error: authErr } = await authClient.auth.getUser(token);
  const user = userData?.user;
  if (authErr || !user) return res.status(401).json({ error: 'Session expired. Please sign in again.' });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  if (![razorpay_order_id, razorpay_payment_id, razorpay_signature].every((v) => typeof v === 'string' && v)) {
    return res.status(400).json({ error: 'Missing payment details.' });
  }

  const { keyId, keySecret, DEFAULT_KEY_ID, DEFAULT_KEY_SECRET } = getCleanRazorpayKeys();

  // 1. Signature verification (supports active key or default live key)
  const secretsToTest = Array.from(new Set([keySecret, DEFAULT_KEY_SECRET].filter(Boolean)));
  let signatureValid = false;
  let activeSecretUsed = keySecret;

  for (const s of secretsToTest) {
    const expected = crypto
      .createHmac('sha256', s)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    if (timingSafeMatch(expected, razorpay_signature)) {
      signatureValid = true;
      activeSecretUsed = s;
      break;
    }
  }

  if (!signatureValid) {
    return res.status(400).json({ verified: false, error: 'Payment signature mismatch.' });
  }

  // 2. Cross-check the order with Razorpay API (with fallback keypairs)
  let order = null;
  const keyPairs = [
    { id: keyId, secret: activeSecretUsed },
    { id: DEFAULT_KEY_ID, secret: DEFAULT_KEY_SECRET },
  ];

  for (const kp of keyPairs) {
    try {
      const r = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(razorpay_order_id)}`, {
        headers: { Authorization: `Basic ${Buffer.from(`${kp.id}:${kp.secret}`).toString('base64')}` },
      });
      if (r.ok) {
        order = await r.json();
        break;
      }
    } catch (err) {
      // try next key pair
    }
  }

  if (!order) {
    console.error('[verify-event-payment] order lookup failed for', razorpay_order_id);
    return res.status(502).json({ error: 'Could not confirm the payment. Contact the organisers with your payment ID: ' + razorpay_payment_id });
  }

  if (order.status !== 'paid' || order.amount_paid !== order.amount) {
    return res.status(400).json({ verified: false, error: 'Payment not completed.' });
  }
  if (order.notes?.type !== 'event' || order.notes?.user_id !== user.id) {
    return res.status(403).json({ verified: false, error: 'This payment belongs to a different account.' });
  }

  // 3. Record it + finish the registration server-side (idempotent)
  let result = { recorded: false, registered: false };
  if (SERVICE_KEY) {
    result = await finalizeEventPayment(createClient(SUPABASE_URL, SERVICE_KEY), order, razorpay_payment_id);
  } else {
    console.warn('[verify-event-payment] SUPABASE_SERVICE_ROLE_KEY not available - finalizing with user token');
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    result = await finalizeEventPayment(userClient, order, razorpay_payment_id);
  }

  return res.status(200).json({
    verified: true,
    recorded: result.recorded,
    registered: result.registered,
    amount: order.amount / 100,
    payment_id: razorpay_payment_id,
    order_id: razorpay_order_id,
  });
}
