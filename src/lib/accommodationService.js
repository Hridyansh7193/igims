import { supabase } from './supabaseClient';
import { openRazorpayCheckout } from './razorpay';

const STORAGE_PREFIX = 'crx_acc_booking_';

/**
 * Generates a unique, official Accommodation Booking ID
 */
export function generateBookingId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 6; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CRX26-ACC-${rand}`;
}

/**
 * Fetches the user's confirmed accommodation booking
 */
export async function fetchUserAccommodation(userId) {
  if (!userId) return null;

  // 1. Try local cache first for instant UI response
  try {
    const cached = localStorage.getItem(STORAGE_PREFIX + userId);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.status === 'CONFIRMED') return parsed;
    }
  } catch (_) {}

  // 2. Fetch from Supabase
  try {
    const { data, error } = await supabase
      .from('accommodation_bookings')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'CONFIRMED')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      try {
        localStorage.setItem(STORAGE_PREFIX + userId, JSON.stringify(data));
      } catch (_) {}
      return data;
    }
  } catch (err) {
    console.warn('[accommodationService] fetch error:', err);
  }

  return null;
}

/**
 * Saves accommodation booking in Supabase and local cache
 */
export async function saveAccommodationBooking(userId, bookingData) {
  if (!userId) throw new Error('User must be authenticated.');

  const record = {
    booking_id: bookingData.booking_id || generateBookingId(),
    user_id: userId,
    full_name: bookingData.full_name || '',
    email: bookingData.email || '',
    phone: bookingData.phone || '',
    college: bookingData.college || '',
    gender: bookingData.gender || 'BOYS',
    selected_dates: bookingData.selected_dates || [],
    num_days: bookingData.num_days || (bookingData.selected_dates ? bookingData.selected_dates.length : 1),
    price_per_day: bookingData.price_per_day || 150.00,
    amount_inr: bookingData.amount_inr || 150.00,
    razorpay_order_id: bookingData.razorpay_order_id || null,
    razorpay_payment_id: bookingData.razorpay_payment_id || null,
    payment_status: 'PAID',
    status: 'CONFIRMED',
    metadata: bookingData.metadata || {},
    updated_at: new Date().toISOString(),
  };

  // Cache locally
  try {
    localStorage.setItem(STORAGE_PREFIX + userId, JSON.stringify(record));
  } catch (_) {}

  // Save to Supabase
  try {
    const { data, error } = await supabase
      .from('accommodation_bookings')
      .upsert(record, { onConflict: 'booking_id' })
      .select()
      .maybeSingle();

    if (error) {
      console.warn('[accommodationService] Supabase save notice:', error.message);
    }
    return data || record;
  } catch (err) {
    console.warn('[accommodationService] DB save exception:', err);
    return record;
  }
}

/**
 * Opens Razorpay gateway for accommodation and resolves on payment success
 */
export async function bookAccommodationWithRazorpay({
  user,
  profile,
  gender,
  selectedDates,
  onSuccess,
  onError,
}) {
  if (!user) throw new Error('Please sign in to book accommodation.');
  if (!selectedDates || selectedDates.length === 0) {
    throw new Error('Please select at least one date for your stay.');
  }

  const numDays = selectedDates.length;
  const totalAmount = numDays * 150;
  const bookingId = generateBookingId();
  const stayType = gender === 'GIRLS' ? 'Girls Lodgings' : 'Boys Hostel';
  const datesSummary = selectedDates.join(', ');

  const fullName = [profile?.first_name, profile?.last_name || profile?.surname]
    .filter(Boolean)
    .join(' ') ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    'Festival Delegate';

  const phone = profile?.phone_number || '';
  const email = user.email || '';
  const college = profile?.college_name || '';

  return new Promise((resolve, reject) => {
    openRazorpayCheckout({
      amount: totalAmount,
      description: `Cerebrexia '26 | Accommodation (${stayType} · ${numDays} Day${numDays > 1 ? 's' : ''}: ${datesSummary})`,
      prefill: {
        name: fullName,
        email,
        contact: phone,
      },
      onSuccess: async (rzpRes) => {
        try {
          const bookingRecord = await saveAccommodationBooking(user.id, {
            booking_id: bookingId,
            full_name: fullName,
            email,
            phone,
            college,
            gender: gender || 'BOYS',
            selected_dates: selectedDates,
            num_days: numDays,
            price_per_day: 150.00,
            amount_inr: totalAmount,
            razorpay_order_id: rzpRes.razorpay_order_id || null,
            razorpay_payment_id: rzpRes.razorpay_payment_id || `pay_acc_${Date.now()}`,
            metadata: {
              stay_type: stayType,
              dates_summary: datesSummary,
            },
          });

          if (onSuccess) onSuccess(bookingRecord);
          resolve(bookingRecord);
        } catch (err) {
          console.error('[accommodationService] post-payment error:', err);
          if (onError) onError(err);
          reject(err);
        }
      },
      onDismiss: () => {
        const err = new Error('Payment was cancelled.');
        err.cancelled = true;
        if (onError) onError(err);
        reject(err);
      },
    });
  });
}
