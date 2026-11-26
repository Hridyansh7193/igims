import {
  sanitizeAlphaNumDash,
  checkRateLimit,
  setSecureCorsHeaders,
  getCleanRazorpayKeys,
  isPaymentsEnabled,
} from './_security.js';

export default async function handler(req, res) {
  setSecureCorsHeaders(req, res, 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const rate = checkRateLimit(clientIp, 'create_rzp_order', 20, 60000);
  if (!rate.allowed) {
    return res.status(429).json({ error: 'Too many order requests. Please wait a minute.' });
  }

  const { amount = 2000, currency = 'INR', receipt, notes } = req.body || {};

  // Strict amount validation (OWASP A04: Insecure Design & Price Tampering)
  const numAmount = Number(amount);
  if (!Number.isFinite(numAmount) || numAmount < 0 || numAmount > 100000) {
    return res.status(400).json({ error: 'Invalid order amount' });
  }

  // Currency validation
  if (currency !== 'INR') {
    return res.status(400).json({ error: 'Only INR currency is accepted' });
  }

  const safeReceipt = sanitizeAlphaNumDash(String(receipt || `rcpt_${Date.now()}`)).slice(0, 40);

  // Sanitize notes strictly to printable ASCII (32-126) so Razorpay API never throws UTF-8 / emoji error
  const toAscii = (str, maxLen = 100) =>
    String(str || '')
      .replace(/[^\x20-\x7E]/g, '')
      .trim()
      .slice(0, maxLen);

  let safeNotes = undefined;
  if (notes && typeof notes === 'object') {
    safeNotes = {};
    for (const [k, v] of Object.entries(notes)) {
      if (typeof k === 'string' && v != null) {
        const cleanKey = toAscii(k, 40);
        const cleanVal = toAscii(v, 250);
        if (cleanKey) safeNotes[cleanKey] = cleanVal;
      }
    }
  }

  if (!isPaymentsEnabled()) {
    return res.status(403).json({ error: 'Payments are disabled on this deployment (PAYMENTS_ENABLED=false).' });
  }

  const { keyId, keySecret, error: keyError } = getCleanRazorpayKeys();
  if (keyError || !keyId || !keySecret) {
    return res.status(500).json({ error: keyError || 'Razorpay payment gateway is not configured on the server.' });
  }

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(numAmount * 100), // convert to paise
        currency: 'INR',
        receipt: safeReceipt,
        ...(safeNotes ? { notes: safeNotes } : {}),
      }),
    });

    const data = await rzpRes.json();

    if (!rzpRes.ok) {
      console.error('[create-razorpay-order] Razorpay API error:', data);
      return res.status(rzpRes.status).json({ error: 'Failed to create payment order' });
    }

    return res.status(200).json({
      order_id: data.id,
      amount: data.amount,
      currency: data.currency,
      key_id: keyId,
    });
  } catch (err) {
    console.error('[create-razorpay-order] Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
