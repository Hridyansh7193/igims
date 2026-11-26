import { supabase } from './supabaseClient';
import { loadRazorpayScript, RAZORPAY_KEY_ID } from './razorpay';

/**
 * Opens Razorpay Checkout for an event fee and resolves only after the server
 * has verified the payment signature + amount.
 *
 * Resolves  { payment_id, order_id, amount }
 * Rejects   Error (message is user-friendly); err.cancelled = true if the user closed the popup.
 */
export async function payForEvent({ slug, eventName, selection, form, prefill = {} }) {
  const { data: sess } = await supabase.auth.getSession();
  const token = sess?.session?.access_token;
  if (!token) throw new Error('Please sign in again to continue.');
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  // 1. Server creates the order and decides the amount
  const orderRes = await fetch('/api/create-event-order', {
    method: 'POST',
    headers,
    body: JSON.stringify({ slug, eventName, selection, form }),
  });
  const order = await orderRes.json().catch(() => ({}));
  if (!orderRes.ok) throw new Error(order.error || 'Could not start the payment.');

  // 2. Razorpay popup
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) throw new Error('Could not load the payment gateway. Check your internet and try again.');

  const keyToUse = order.key_id || RAZORPAY_KEY_ID;
  if (!keyToUse) throw new Error('Payment gateway is not configured.');

  const isPreviewHost = typeof window !== 'undefined' && (
    (window.location.hostname.endsWith('.vercel.app') && !window.location.hostname.includes('cerebrexiaigims')) ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );
  if (isPreviewHost && keyToUse.startsWith('rzp_live_')) {
    throw new Error('Security Alert: Live payments are blocked on Preview deployments.');
  }

  const response = await new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: keyToUse,
      order_id: order.order_id,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: "Cerebrexia '26 | IGIMS Patna",
      description: (eventName || 'Event Entry').replace(/[^\x20-\x7E]/g, '').trim().slice(0, 150),
      prefill: { name: prefill.name || '', email: prefill.email || '', contact: prefill.contact || '' },
      theme: { color: '#C0392B', backdrop_color: 'rgba(10, 5, 8, 0.92)' },
      modal: {
        ondismiss: () => {
          const e = new Error('Payment cancelled.');
          e.cancelled = true;
          reject(e);
        },
      },
      handler: resolve,
    });
    rzp.on('payment.failed', (r) => reject(new Error(r?.error?.description || 'Payment failed. Please try again.')));
    rzp.open();
  });

  // 3. Server verifies signature, amount and owner
  const verifyRes = await fetch('/api/verify-event-payment', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    }),
  });
  const verified = await verifyRes.json().catch(() => ({}));
  if (!verifyRes.ok || !verified.verified) {
    throw new Error(
      (verified.error || 'Payment could not be verified.') +
        ` If money was deducted, share this payment ID with the organisers: ${response.razorpay_payment_id}`
    );
  }
  return { payment_id: verified.payment_id, order_id: verified.order_id, amount: verified.amount };
}
