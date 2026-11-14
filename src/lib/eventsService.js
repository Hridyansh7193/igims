import { supabase } from './supabaseClient.js';

/**
 * Normalizes participant profile to ensure backward and forward compatibility
 * between UI field names (surname, city_of_college) and PostgreSQL columns (last_name, college_city).
 */
export function normalizeProfile(raw) {
  if (!raw) return null;
  const lastName = raw.last_name || raw.surname || '';
  const city = raw.college_city || raw.city_of_college || '';
  const state = raw.college_state || raw.state_of_college || '';

  return {
    ...raw,
    id              : raw.id || null,
    user_id         : raw.user_id || null,
    first_name      : raw.first_name || '',
    last_name       : lastName,
    surname         : lastName,
    college_name    : raw.college_name || '',
    phone_number    : raw.phone_number || '',
    college_city    : city,
    city_of_college : city,
    college_state   : state,
    state_of_college: state,
    payment_status  : raw.payment_status || 'PENDING',
    reminder_sent_count: raw.reminder_sent_count ?? 0,
  };
}

/**
 * Fetch participant profile from Supabase 'participants' table with fallbacks.
 * Guaranteed to return single identity entry.
 */
export async function fetchParticipantProfile(userId, userMetadata = null) {
  if (!userId) return null;

  // 1. Try Supabase 'participants' table
  try {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && data) {
      return normalizeProfile(data);
    }
    if (error) {
      console.warn('[eventsService] fetchParticipantProfile db notice:', error);
    }
  } catch (err) {
    console.warn('[eventsService] fetchParticipantProfile db exception:', err);
  }

  // 2. Fallback to Supabase user_metadata if available
  if (userMetadata?.candidate_profile) {
    return normalizeProfile(userMetadata.candidate_profile);
  }

  // 3. Fallback to localStorage cache
  try {
    const local = localStorage.getItem('crx_profile_' + userId);
    if (local) return normalizeProfile(JSON.parse(local));
  } catch (_) {}

  return null;
}

/**
 * Inserts or updates participant record in Supabase with correct column names,
 * ENSURING a single participant ID entry is maintained for this user.
 */
export async function saveParticipantProfile(userId, email, formData) {
  const cleanFirst = (formData.first_name || '').trim().slice(0, 100);
  const cleanLast  = (formData.last_name || formData.surname || '').trim().slice(0, 100);
  const cleanColl  = (formData.college_name || '').trim().slice(0, 200);
  const cleanPhone = (formData.phone_number || '').trim().replace(/[^\d+]/g, '').slice(0, 15);
  const cleanCity  = (formData.college_city || formData.city_of_college || '').trim().slice(0, 100);
  const cleanState = (formData.college_state || formData.state_of_college || '').trim().slice(0, 100);

  const payload = {
    user_id     : userId,
    email       : (email || '').trim().toLowerCase().slice(0, 255),
    first_name  : cleanFirst,
    last_name   : cleanLast,
    college_name: cleanColl,
    phone_number: cleanPhone,
    college_city: cleanCity,
    college_state: cleanState,
    payment_status: 'PENDING',
    reminder_sent_count: 0,
  };

  // Immediate local cache
  try {
    localStorage.setItem('crx_profile_' + userId, JSON.stringify(payload));
  } catch (_) {}

  // Save to Supabase auth user_metadata
  try {
    await supabase.auth.updateUser({
      data: { candidate_profile: payload },
    });
  } catch (metaErr) {
    console.warn('[eventsService] updateUser metadata notice:', metaErr);
  }

  // Save to Supabase 'participants' table (Single row guarantee)
  try {
    const { data: existing } = await supabase
      .from('participants')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (existing?.id) {
      const { data, error } = await supabase
        .from('participants')
        .update({
          first_name   : payload.first_name,
          last_name    : payload.last_name,
          college_name : payload.college_name,
          phone_number : payload.phone_number,
          college_city : payload.college_city,
          college_state: payload.college_state,
          updated_at   : new Date().toISOString(),
        })
        .eq('id', existing.id)
        .eq('user_id', userId)
        .select()
        .maybeSingle();

      if (!error && data) return normalizeProfile(data);
    } else {
      const { data, error } = await supabase
        .from('participants')
        .insert(payload)
        .select()
        .maybeSingle();

      if (!error && data) return normalizeProfile(data);
    }
  } catch (dbErr) {
    console.warn('[eventsService] participants table db notice:', dbErr);
  }

  return normalizeProfile(payload);
}

/**
 * Fetch Basic Registration (BR) for a user.
 */
export async function fetchBasicRegistration(userId) {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from('basic_registrations')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.warn('[eventsService] fetchBasicRegistration err:', err);
  }

  // Fallback to local storage
  try {
    const local = localStorage.getItem('crx_basic_reg_' + userId);
    if (local) return JSON.parse(local);
  } catch (_) {}

  return null;
}

/**
 * Register user for Basic Registration (BR - Pronites only).
 * Supports Single & Group Registrations, Promo Codes, and Razorpay Checkout Metadata.
 * Ensures single participant record in `participants` and creates an entry in `basic_registrations`.
 */
export async function saveBasicRegistration(userId, email, formData, checkoutMeta = {}) {
  if (!userId) throw new Error('User authentication required.');

  // 1. First ensure single candidate profile in `participants` table
  const profile = await saveParticipantProfile(userId, email, formData);
  const participantId = profile?.id || null;

  const registrationType  = checkoutMeta.registration_type || 'SINGLE';
  const groupSize         = Number(checkoutMeta.group_size) || (registrationType === 'GROUP' ? (checkoutMeta.group_members?.length || 2) : 1);
  const groupMembers      = checkoutMeta.group_members || [];
  const promoCode         = checkoutMeta.promo_code || null;
  const discountAmount    = Number(checkoutMeta.discount_amount) || 0;
  const calculatedSubtotal= groupSize * 2000;
  const finalAmount       = typeof checkoutMeta.final_amount === 'number'
    ? checkoutMeta.final_amount
    : Math.max(0, calculatedSubtotal - discountAmount);
  const paymentStatus     = checkoutMeta.payment_status || 'PENDING';
  const razorpayPaymentId = checkoutMeta.razorpay_payment_id || null;
  const razorpayOrderId   = checkoutMeta.razorpay_order_id || null;

  const brRecord = {
    user_id            : userId,
    participant_id     : participantId,
    pass_type          : 'CONCERT_PRONITES',
    fee_amount         : finalAmount,
    payment_status     : paymentStatus,
    registration_type  : registrationType,
    group_size         : groupSize,
    group_members      : groupMembers,
    promo_code         : promoCode,
    discount_amount    : discountAmount,
    final_amount       : finalAmount,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_order_id  : razorpayOrderId,
    updated_at         : new Date().toISOString(),
  };

  // Local storage cache
  try {
    localStorage.setItem('crx_basic_reg_' + userId, JSON.stringify(brRecord));
  } catch (_) {}

  // Update user_metadata with rich registration record
  try {
    await supabase.auth.updateUser({
      data: { basic_registration: brRecord },
    });
  } catch (err) {
    console.warn('[eventsService] updateUser basic_registration error:', err);
  }

  // Insert or update in `basic_registrations` table
  try {
    // Attempt upsert with extended columns
    const { data, error } = await supabase
      .from('basic_registrations')
      .upsert(brRecord, { onConflict: 'user_id' })
      .select()
      .maybeSingle();

    if (!error && data) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('crx_registrations_updated', { detail: { basic: data } }));
      }
      return { profile, basicRegistration: data };
    }

    if (error) {
      console.warn('[eventsService] Extended columns upsert notice, trying core columns fallback:', error.message);
      // Fallback for database schema with core columns only
      const coreRecord = {
        user_id       : userId,
        participant_id: participantId,
        pass_type     : 'CONCERT_PRONITES',
        fee_amount    : finalAmount,
        payment_status: paymentStatus,
        updated_at    : new Date().toISOString(),
      };
      const { data: coreData } = await supabase
        .from('basic_registrations')
        .upsert(coreRecord, { onConflict: 'user_id' })
        .select()
        .maybeSingle();

      if (coreData) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('crx_registrations_updated', { detail: { basic: { ...brRecord, ...coreData } } }));
        }
        return { profile, basicRegistration: { ...brRecord, ...coreData } };
      }
    }
  } catch (err) {
    console.warn('[eventsService] saveBasicRegistration db error:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('crx_registrations_updated', { detail: { basic: brRecord } }));
  }

  return { profile, basicRegistration: brRecord };
}

/**
 * Updates payment status to PAID for Basic Registration after successful checkout
 */
export async function markBasicRegistrationPaid(userId, paymentDetails = {}) {
  if (!userId) return null;
  const paymentId = paymentDetails.razorpay_payment_id || `pay_${Date.now()}`;
  const orderId = paymentDetails.razorpay_order_id || null;

  try {
    const local = localStorage.getItem('crx_basic_reg_' + userId);
    if (local) {
      const parsed = JSON.parse(local);
      parsed.payment_status = 'PAID';
      parsed.razorpay_payment_id = paymentId;
      if (orderId) parsed.razorpay_order_id = orderId;
      localStorage.setItem('crx_basic_reg_' + userId, JSON.stringify(parsed));
    }
  } catch (_) {}

  try {
    await supabase.from('basic_registrations')
      .update({
        payment_status: 'PAID',
        razorpay_payment_id: paymentId,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);
  } catch (err) {
    console.warn('[eventsService] markBasicRegistrationPaid db notice:', err);
  }

  try {
    await supabase.from('participants')
      .update({ payment_status: 'PAID', updated_at: new Date().toISOString() })
      .eq('user_id', userId);
  } catch (_) {}

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('crx_registrations_updated', { detail: { paid: true, paymentId } }));
  }
}

/**
 * Fetch all registrations across Sports and Cultural tables for a user.
 */
export async function fetchCategorizedRegistrations(userId) {
  if (!userId) return { sports: [], cultural: [], basic: null };

  const [sportsRes, culturalRes, basicRes] = await Promise.allSettled([
    supabase.from('sports_registrations').select('*').eq('user_id', userId),
    supabase.from('cultural_registrations').select('*').eq('user_id', userId),
    supabase.from('basic_registrations').select('*').eq('user_id', userId).maybeSingle(),
  ]);

  const sports = sportsRes.status === 'fulfilled' && !sportsRes.value.error ? sportsRes.value.data || [] : [];
  const cultural = culturalRes.status === 'fulfilled' && !culturalRes.value.error ? culturalRes.value.data || [] : [];
  const basic = basicRes.status === 'fulfilled' && !basicRes.value.error ? basicRes.value.data : null;

  return { sports, cultural, basic };
}

/**
 * Gets registered event names for a user, combining Supabase user_metadata, localStorage,
 * and database registrations from sports_registrations and cultural_registrations.
 */
export function getRegisteredEvents(userId, userMetadata) {
  if (!userId) return [];
  let localEvents = [];
  try {
    localEvents = JSON.parse(localStorage.getItem('crx_events_' + userId) || '[]');
  } catch (_) {}

  const metaEvents = userMetadata?.registered_events || [];
  return Array.from(new Set([...metaEvents, ...localEvents]));
}

/**
 * Registers user for an event, dispatching to either `sports_registrations`
 * or `cultural_registrations` while linking to the single participant record.
 */
export async function addRegisteredEvent(userId, eventName, userMetadata, categoryKey = 'cultural') {
  if (!userId || !eventName) return [];
  const current = getRegisteredEvents(userId, userMetadata);
  const isAlreadyInLocal = current.includes(eventName);
  const updated = isAlreadyInLocal ? current : [...current, eventName];

  // Update local storage
  try {
    localStorage.setItem('crx_events_' + userId, JSON.stringify(updated));
  } catch (_) {}

  // Update user_metadata
  try {
    await supabase.auth.updateUser({
      data: { registered_events: updated },
    });
  } catch (err) {
    console.warn('[eventsService] Supabase updateUser metadata error:', err);
  }

  // Route to the appropriate database table: sports_registrations vs cultural_registrations
  try {
    // Lookup participant ID
    const { data: part } = await supabase
      .from('participants')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    const participantId = part?.id || null;
    const isSport = categoryKey?.toLowerCase() === 'sports' ||
      ['cricket', 'football', 'volleyball', 'badminton', 'kabaddi', 'tug of war', 'chess', 'table tennis', 'carrom', 'athletics', 'kho kho', 'bgmi', 'rubik'].some(s => eventName.toLowerCase().includes(s));

    if (isSport) {
      await supabase.from('sports_registrations').upsert({
        user_id       : userId,
        participant_id: participantId,
        event_name    : eventName,
        category      : 'Sports',
      }, { onConflict: 'user_id,event_name' });
    } else {
      await supabase.from('cultural_registrations').upsert({
        user_id       : userId,
        participant_id: participantId,
        event_name    : eventName,
        category      : categoryKey || 'Cultural',
      }, { onConflict: 'user_id,event_name' });
    }
  } catch (dbErr) {
    console.warn('[eventsService] categorized table insert notice:', dbErr);
  }

  // Dispatch custom window event so open pages can immediately update their UI
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('crx_events_updated', { detail: { events: updated } }));
    window.dispatchEvent(new CustomEvent('crx_registrations_updated', { detail: { eventName, categoryKey } }));
  }

  return updated;
}

/**
 * Saves the answers of an event-specific registration form (Google-Form style)
 * into `event_form_responses`. Throws on failure so the caller does NOT mark the
 * user as registered when their answers were not stored.
 * Table SQL: supabase/event_form_responses.sql
 */
export async function saveEventFormResponse(userId, { eventName, categoryKey, formSlug, formLabel, formTitle, answers }) {
  if (!userId || !eventName) throw new Error('User authentication required.');

  let participantId = null;
  try {
    const { data: part } = await supabase
      .from('participants')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    participantId = part?.id != null ? String(part.id) : null;
  } catch (_) {}

  const { error } = await supabase.from('event_form_responses').upsert(
    {
      user_id       : userId,
      participant_id: participantId,
      event_name    : eventName,
      category      : categoryKey || null,
      form_slug     : formSlug,
      form_label    : formLabel || null,
      form_title    : formTitle || null,
      answers       : answers || [],
      updated_at    : new Date().toISOString(),
    },
    { onConflict: 'user_id,event_name' }
  );
  if (error) throw error;
  return true;
}

/** All form responses of a user (for dashboard / debugging). */
export async function fetchEventFormResponses(userId) {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('event_form_responses')
    .select('*')
    .eq('user_id', userId);
  return error ? [] : data || [];
}

/**
 * Uploads a participant file (ID proof / payment screenshot) to the private
 * Supabase Storage bucket `event-uploads` and returns its storage path.
 * Bucket SQL: supabase/event_uploads_storage.sql
 */
export async function uploadEventFile(userId, eventName, file) {
  if (!userId) throw new Error('User authentication required.');
  const safe = (t) => String(t || '').toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, '');
  const path = `${userId}/${safe(eventName)}/${Date.now()}_${safe(file.name) || 'file'}`;
  const { error } = await supabase.storage.from('event-uploads').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  return path;
}
