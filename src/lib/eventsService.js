import { supabase } from './supabaseClient';

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
  };
}

/**
 * Fetch participant profile from Supabase 'participants' table.
 */
export async function fetchParticipantProfile(userId) {
  if (!userId) return null;
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('[eventsService] fetchParticipantProfile error:', error);
    throw error;
  }
  return normalizeProfile(data);
}

/**
 * Inserts or updates participant record in Supabase with correct column names:
 * (first_name, last_name, college_name, phone_number, college_city, college_state).
 */
export async function saveParticipantProfile(userId, email, formData) {
  const payload = {
    user_id     : userId,
    email       : email,
    first_name  : (formData.first_name || '').trim(),
    last_name   : (formData.last_name || formData.surname || '').trim(),
    college_name: (formData.college_name || '').trim(),
    phone_number: (formData.phone_number || '').trim(),
    college_city: (formData.college_city || formData.city_of_college || '').trim(),
    college_state: (formData.college_state || formData.state_of_college || '').trim(),
    payment_status: 'PENDING',
  };

  // Check if profile already exists for this user
  const { data: existing, error: checkErr } = await supabase
    .from('participants')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (checkErr) {
    console.warn('[eventsService] check existing profile error:', checkErr);
  }

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
      })
      .eq('id', existing.id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return normalizeProfile(data || { ...payload, id: existing.id });
  } else {
    const { data, error } = await supabase
      .from('participants')
      .insert(payload)
      .select()
      .maybeSingle();

    if (error) throw error;
    return normalizeProfile(data || payload);
  }
}

/**
 * Gets registered event names for a user, combining Supabase user_metadata and localStorage.
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
 * Registers user for an event, updating user_metadata in Supabase and local cache.
 */
export async function addRegisteredEvent(userId, eventName, userMetadata) {
  if (!userId || !eventName) return [];
  const current = getRegisteredEvents(userId, userMetadata);
  if (current.includes(eventName)) return current;

  const updated = [...current, eventName];

  try {
    localStorage.setItem('crx_events_' + userId, JSON.stringify(updated));
  } catch (_) {}

  try {
    await supabase.auth.updateUser({
      data: { registered_events: updated },
    });
  } catch (err) {
    console.warn('[eventsService] Supabase updateUser metadata error:', err);
  }

  // Dispatch custom window event so open pages can immediately update their UI
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('crx_events_updated', { detail: { events: updated } }));
  }

  return updated;
}
