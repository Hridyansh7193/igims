/**
 * Razorpay Payment Gateway Integration for Cerebrexia '26
 * Handles script loading, transaction creation, and gateway checkout invocation.
 */

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';
export const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID ||
  import.meta.env.RAZORPAY_KEY_ID ||
  'rzp_live_TyVhU8uhXCiEMj';
export const RAZORPAY_PAYMENT_PAGE_URL =
  import.meta.env.VITE_RAZORPAY_PAYMENT_LINK ||
  import.meta.env.RAZORPAY_PAYMENT_LINK ||
  import.meta.env.VITE_RAZORPAY_PAYMENT_PAGE_URL ||
  'https://razorpay.me/@igimscerebrexia2026';

/**
 * Loads the Razorpay checkout.js script asynchronously if not already loaded.
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);

    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('[Razorpay] Failed to load official checkout script from CDN.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * Opens the official Razorpay payment page (razorpay.me) in a new tab
 */
export function openRazorpayHostedPage() {
  if (typeof window !== 'undefined') {
    window.open(RAZORPAY_PAYMENT_PAGE_URL, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Launches the Razorpay payment gateway
 * @param {object} options
 * @param {number} options.amount - Final payable amount in INR (e.g. 2000)
 * @param {string} options.description - Description shown in gateway
 * @param {object} options.prefill - { name, email, contact }
 * @param {function} options.onSuccess - Callback on payment success (receives response)
 * @param {function} options.onDismiss - Callback on payment dismissal/cancel
 * @param {function} options.onFallbackPrompt - Called if key is not configured or popup needs fallback
 */
export async function openRazorpayCheckout({
  amount = 2000,
  description = "Basic Registration (BR)",
  prefill = {},
  onSuccess,
  onDismiss,
  onFallbackPrompt,
}) {
  const keyId = RAZORPAY_KEY_ID;

  // If amount is 0 (100% promo discount / VIP Basic Registration), auto-complete without payment gateway
  if (amount <= 0) {
    if (onSuccess) {
      onSuccess({
        razorpay_payment_id: `pay_comp_${Date.now()}`,
        razorpay_order_id: `order_vip_${Date.now()}`,
        razorpay_signature: 'complimentary_promo_signature',
        method: 'COMPLIMENTARY',
      });
    }
    return;
  }

  // Load SDK script
  const isLoaded = await loadRazorpayScript();

  // Generate verified server-side Razorpay Order ID to prevent gateway rejection
  let orderId = null;
  try {
    const orderRes = await fetch('/api/create-razorpay-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    if (orderRes.ok) {
      const orderData = await orderRes.json();
      orderId = orderData.order_id;
    }
  } catch (err) {
    console.warn('[Razorpay] Server order creation notice:', err);
  }

  // If live key is present and script loaded, launch official Razorpay
  if (isLoaded && keyId && window.Razorpay) {
    try {
      const rzpOptions = {
        key: keyId,
        amount: Math.round(amount * 100), // amount in paise
        currency: 'INR',
        name: "Cerebrexia '26 | IGIMS Patna",
        description,
        ...(orderId ? { order_id: orderId } : {}),
        image: typeof window !== 'undefined' ? `${window.location.origin}/logo.jpg` : '/logo.jpg',
        prefill: {
          name: prefill.name || '',
          email: prefill.email || '',
          contact: prefill.contact || '',
        },
        theme: {
          color: '#C0392B',
          backdrop_color: 'rgba(10, 5, 8, 0.92)',
        },
        modal: {
          ondismiss: () => {
            if (onDismiss) onDismiss();
          },
        },
        handler: (response) => {
          if (onSuccess) onSuccess(response);
        },
      };

      const rzp = new window.Razorpay(rzpOptions);
      rzp.on('payment.failed', function (resp) {
        console.error('[Razorpay] Payment Failed:', resp.error);
        alert(`Payment not completed: ${resp?.error?.description || 'Transaction cancelled or failed.'}`);
      });
      rzp.open();
      return;
    } catch (err) {
      console.warn('[Razorpay] Exception opening Razorpay modal:', err);
      alert('Could not launch payment gateway. Please check your connection and try again.');
      return;
    }
  }

  // Fallback if Razorpay SDK failed to initialize
  alert('Could not initialize Razorpay checkout. Please refresh the page and try again.');
}
