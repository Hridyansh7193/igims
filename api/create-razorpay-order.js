export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { amount = 2000, currency = 'INR', receipt } = req.body || {};

  const keyId = process.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TyVhU8uhXCiEMj';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'ToAZvgHo0GlOkbdkfV4WcU51';

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  try {
    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // in paise
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
      }),
    });

    const data = await rzpRes.json();

    if (!rzpRes.ok) {
      console.error('[create-razorpay-order] Razorpay API error:', data);
      return res.status(rzpRes.status).json({ error: data.error?.description || 'Failed to create Razorpay order' });
    }

    return res.status(200).json({
      order_id: data.id,
      amount: data.amount,
      currency: data.currency,
      key_id: keyId,
    });
  } catch (err) {
    console.error('[create-razorpay-order] Server error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
