import { createClient } from '@supabase/supabase-js';
import {
  sanitizeAlphaNumDash,
  checkRateLimit,
  setSecureCorsHeaders,
  getCleanServiceRoleKey,
  getCleanSupabaseKey,
  getCleanRazorpayKeys,
} from './_security.js';
import { computeFee } from './_eventFees.js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://dgkubrwfrwcfpkgjoxmu.supabase.co';
const SERVICE_KEY = getCleanServiceRoleKey(
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SERVICE_ROLE_KEY
);
const SUPABASE_ANON = getCleanSupabaseKey(
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

/**
 * POST /api/create-event-order
 * Header: Authorization: Bearer <supabase access token>
 * Body:   { slug, eventName, selection: { qty?, type?, games? } }
 *
 * The amount is ALWAYS computed here from api/_eventFees.js - the client's
 * amount is never trusted.
 */
export default async function handler(req, res) {
  setSecureCorsHeaders(req, res, 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(ip, 'create_event_order', 15, 60000).allowed) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute.' });
  }

  // 1. Authenticate the user
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'Please sign in first.' });
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
  const { data: userData, error: authErr } = await supabase.auth.getUser(token);
  const user = userData?.user;
  if (authErr || !user) return res.status(401).json({ error: 'Session expired. Please sign in again.' });

  // 2. Compute the amount server-side
  const { slug, eventName, selection, form } = req.body || {};
  const safeSlug = sanitizeAlphaNumDash(String(slug || ''));
  const fee = computeFee(safeSlug, selection || {});
  if (fee.error) return res.status(400).json({ error: fee.error });

  const { keyId: initialKeyId, keySecret: initialKeySecret, DEFAULT_KEY_ID, DEFAULT_KEY_SECRET } = getCleanRazorpayKeys();
  let keyId = initialKeyId;
  let keySecret = initialKeySecret;

  // Sanitize notes strictly to printable ASCII (32-126) so Razorpay API never throws UTF-8 / emoji error
  const toAscii = (str, maxLen = 100) =>
    String(str || '')
      .replace(/[^\x20-\x7E]/g, '')
      .trim()
      .slice(0, maxLen);

  const orderPayload = {
    amount: Math.round(fee.amount * 100),
    currency: 'INR',
    receipt: `ev_${Date.now()}`.slice(0, 40),
    notes: {
      type: 'event',
      user_id: user.id,
      slug: safeSlug,
      event_name: toAscii(eventName, 80),
      selection: toAscii(JSON.stringify(selection || {}), 150),
    },
  };

  try {
    let rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    });
    let data = await rzpRes.json();

    // If order creation fails with custom env keys (e.g. invalid secret or test key mismatch),
    // automatically retry with known working live keys
    if (!rzpRes.ok && (keyId !== DEFAULT_KEY_ID || keySecret !== DEFAULT_KEY_SECRET)) {
      console.warn('[create-event-order] Custom Razorpay keys failed. Retrying with production fallback keys...');
      keyId = DEFAULT_KEY_ID;
      keySecret = DEFAULT_KEY_SECRET;
      rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${DEFAULT_KEY_ID}:${DEFAULT_KEY_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });
      data = await rzpRes.json();
    }

    if (!rzpRes.ok) {
      console.error('[create-event-order] Razorpay error:', data);
      return res.status(502).json({
        error: data?.error?.description || 'Could not start the payment. Try again.',
      });
    }
    // Remember the form answers server-side so the webhook can finish the
    // registration even if the user closes the tab right after paying.
    if (SERVICE_KEY) {
      const pending = form && typeof form === 'object' && JSON.stringify(form).length < 60000 ? form : null;
      const { error: insErr } = await createClient(SUPABASE_URL, SERVICE_KEY).from('event_payments').insert({
        user_id: user.id,
        event_name: String(eventName || '').slice(0, 100) || null,
        form_slug: safeSlug,
        selection: JSON.stringify(selection || {}).slice(0, 200),
        amount_inr: fee.amount,
        razorpay_order_id: data.id,
        status: 'CREATED',
        payload: pending,
      });
      if (insErr) console.error('[create-event-order] pending row failed:', insErr);
    }

    return res.status(200).json({
      order_id: data.id,
      amount: data.amount,
      currency: data.currency,
      key_id: keyId,
      label: fee.label,
    });
  } catch (err) {
    console.error('[create-event-order] Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
