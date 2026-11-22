import { createClient } from '@supabase/supabase-js';
import {
  escapeHtml,
  sanitizeAlphaNumDash,
  timingSafeMatch,
  checkRateLimit,
  setSecureCorsHeaders,
} from './_security.js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://dgkubrwfrwcfpkgjoxmu.supabase.co';
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'sb_publishable_v_CcCDqlYXXvx1emJ9U7Cw_2KCpskhS';

const GATE_SECRET_KEY = process.env.GATE_SECRET_KEY || 'crx26_volunteer_gate_secret';

/**
 * Determines the festival event day based on IST date or staff override
 */
function getEventDay(override) {
  if (override && ['DAY_1', 'DAY_2', 'DAY_3', 'DAY_4'].includes(override)) {
    return override;
  }

  // Current date in IST (UTC+5:30)
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);

  const month = istDate.getUTCMonth() + 1; // Dec = 12
  const day = istDate.getUTCDate();

  if (month === 12) {
    if (day === 17) return 'DAY_1';
    if (day === 18) return 'DAY_2';
    if (day === 19) return 'DAY_3';
    if (day === 20) return 'DAY_4';
  }

  return `DAY_TEST_${istDate.getUTCFullYear()}-${month}-${day}`;
}

/**
 * Strips sensitive PII and returns only essential attendee info for gate staff
 */
function sanitizeAttendeeOutput(ticket) {
  if (!ticket) return null;
  return {
    attendee_name: escapeHtml(ticket.attendee_name || ''),
    attendee_college: escapeHtml(ticket.attendee_college || 'Cerebrexia Delegate'),
    ticket_number: ticket.ticket_number,
    role: ticket.role || 'DELEGATE',
    pass_type: ticket.pass_type || 'CONCERT_PRONITES',
  };
}

export default async function handler(req, res) {
  setSecureCorsHeaders(req, res, 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ status: 'ERROR', message: 'Method Not Allowed' });
  }

  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

  // Rate limit: 60 scans per minute per IP
  const rate = checkRateLimit(clientIp, 'gate_checkin', 60, 60000);
  if (!rate.allowed) {
    return res.status(429).json({ status: 'ERROR', message: 'Rate limit exceeded. Please wait a moment.' });
  }

  // Gate volunteer authorization guard (from dedicated volunteer scanner app)
  const providedGateKey = req.headers['x-gate-api-key'] || req.headers['authorization']?.replace(/^Bearer\s+/i, '') || req.body?.gate_key;
  if (providedGateKey && !timingSafeMatch(providedGateKey, GATE_SECRET_KEY)) {
    return res.status(401).json({ status: 'ERROR', message: 'Unauthorized gate scanner terminal.' });
  }

  const { qr_token, gate_volunteer = 'Gate 1 Staff', day_override } = req.body || {};

  if (!qr_token || typeof qr_token !== 'string') {
    return res.status(400).json({ status: 'ERROR', message: 'QR token is required' });
  }

  // Clean and sanitize token against PostgREST injection
  let rawToken = qr_token.includes('token=')
    ? new URL(qr_token).searchParams.get('token')
    : qr_token.replace(/^CRX26:/, '').trim();

  const cleanToken = sanitizeAlphaNumDash(rawToken);

  if (!cleanToken || cleanToken.length < 3 || cleanToken.length > 80) {
    return res.status(400).json({ status: 'ERROR', message: 'Malformed QR token' });
  }

  const safeVolunteerName = escapeHtml(String(gate_volunteer).slice(0, 50));
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const activeDay = getEventDay(day_override);

  try {
    // 1. Find ticket in Supabase (Parameterized / sanitised)
    const { data: ticket, error: ticketErr } = await supabase
      .from('tickets')
      .select('*')
      .or(`qr_token.eq.${cleanToken},ticket_number.eq.${cleanToken}`)
      .maybeSingle();

    if (ticketErr) {
      console.error('[gate-checkin] Database error:', ticketErr.message);
      return res.status(500).json({ status: 'ERROR', message: 'Database error searching ticket' });
    }

    if (!ticket) {
      return res.status(200).json({
        status: 'INVALID',
        message: 'Invalid QR Code. No ticket matches this record.',
      });
    }

    if (!['PAID', 'CONFIRMED'].includes(ticket.payment_status)) {
      return res.status(200).json({
        status: 'UNPAID',
        message: `Ticket payment status is ${ticket.payment_status || 'PENDING'}. Not eligible for entry.`,
        attendee: sanitizeAttendeeOutput(ticket),
      });
    }

    // 2. Check if already scanned today
    const { data: existingCheckin, error: checkinErr } = await supabase
      .from('ticket_checkins')
      .select('id, scanned_at, event_day')
      .eq('ticket_id', ticket.id)
      .eq('event_day', activeDay)
      .maybeSingle();

    if (checkinErr && checkinErr.code !== 'PGRST116') {
      console.error('[gate-checkin] Checkin query error:', checkinErr.message);
    }

    if (existingCheckin) {
      const scanTime = new Date(existingCheckin.scanned_at).toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      return res.status(200).json({
        status: 'ALREADY_SCANNED',
        message: `ALREADY ENTERED TODAY at ${scanTime}!`,
        attendee: sanitizeAttendeeOutput(ticket),
        event_day: activeDay,
        scanned_at: existingCheckin.scanned_at,
      });
    }

    // 3. Record new entry in ticket_checkins
    const { data: newCheckin, error: insertErr } = await supabase
      .from('ticket_checkins')
      .insert({
        ticket_id: ticket.id,
        event_day: activeDay,
        scanned_by: safeVolunteerName,
        gate_location: 'Gate 1 Main',
      })
      .select('id, scanned_at')
      .single();

    if (insertErr) {
      if (insertErr.code === '23505') {
        return res.status(200).json({
          status: 'ALREADY_SCANNED',
          message: 'ALREADY ENTERED TODAY (Concurrent scan prevented)!',
          attendee: sanitizeAttendeeOutput(ticket),
          event_day: activeDay,
        });
      }
      console.error('[gate-checkin] Insert error:', insertErr.message);
      return res.status(500).json({ status: 'ERROR', message: 'Failed to record gate scan' });
    }

    // 4. Return sanitized success response
    return res.status(200).json({
      status: 'ENTRY_GRANTED',
      message: 'VALID ENTRY GRANTED!',
      attendee: sanitizeAttendeeOutput(ticket),
      event_day: activeDay,
      scanned_at: newCheckin.scanned_at,
    });
  } catch (err) {
    console.error('[gate-checkin] Unexpected exception:', err);
    return res.status(500).json({ status: 'ERROR', message: 'Server error during checkin' });
  }
}
