import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://dgkubrwfrwcfpkgjoxmu.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_v_CcCDqlYXXvx1emJ9U7Cw_2KCpskhS';

/**
 * Determines the festival event day based on IST date or staff override
 */
function getEventDay(override) {
  if (override && ['DAY_1', 'DAY_2', 'DAY_3', 'DAY_4'].includes(override)) {
    return override;
  }

  // Get current date in IST (UTC+5:30)
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

  // If outside festival dates (e.g. testing phase), use date string
  return `DAY_TEST_${istDate.getUTCFullYear()}-${month}-${day}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { qr_token, gate_volunteer = 'Gate 1 Staff', day_override } = req.body || {};

  if (!qr_token || typeof qr_token !== 'string') {
    return res.status(400).json({ status: 'ERROR', message: 'QR token is required' });
  }

  // Clean token if it was passed as a full URL
  const cleanToken = qr_token.includes('token=')
    ? new URL(qr_token).searchParams.get('token')
    : qr_token.replace(/^CRX26:/, '').trim();

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const activeDay = getEventDay(day_override);

  try {
    // 1. Find ticket in Supabase
    const { data: ticket, error: ticketErr } = await supabase
      .from('tickets')
      .select('*')
      .or(`qr_token.eq.${cleanToken},ticket_number.eq.${cleanToken}`)
      .maybeSingle();

    if (ticketErr) {
      console.error('[gate-checkin] Ticket query error:', ticketErr);
      return res.status(500).json({ status: 'ERROR', message: 'Database error searching ticket' });
    }

    if (!ticket) {
      return res.status(200).json({
        status: 'INVALID',
        message: 'Invalid QR Code. No ticket matches this record.',
      });
    }

    if (ticket.payment_status !== 'PAID') {
      return res.status(200).json({
        status: 'UNPAID',
        message: `Ticket payment is ${ticket.payment_status || 'PENDING'}. Not eligible for entry.`,
        attendee: ticket,
      });
    }

    // 2. Check if already scanned today
    const { data: existingCheckin, error: checkinErr } = await supabase
      .from('ticket_checkins')
      .select('*')
      .eq('ticket_id', ticket.id)
      .eq('event_day', activeDay)
      .maybeSingle();

    if (checkinErr && checkinErr.code !== 'PGRST116') {
      console.error('[gate-checkin] Checkin query error:', checkinErr);
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
        attendee: ticket,
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
        scanned_by: gate_volunteer,
        gate_location: 'Gate 1 Main',
      })
      .select()
      .single();

    if (insertErr) {
      // Check if duplicate entry constraint violation
      if (insertErr.code === '23505') {
        return res.status(200).json({
          status: 'ALREADY_SCANNED',
          message: 'ALREADY ENTERED TODAY (Concurrent scan prevented)!',
          attendee: ticket,
          event_day: activeDay,
        });
      }
      console.error('[gate-checkin] Insert error:', insertErr);
      return res.status(500).json({ status: 'ERROR', message: 'Failed to record gate scan' });
    }

    // 4. Return success
    return res.status(200).json({
      status: 'ENTRY_GRANTED',
      message: 'VALID ENTRY GRANTED!',
      attendee: ticket,
      event_day: activeDay,
      scanned_at: newCheckin.scanned_at,
    });
  } catch (err) {
    console.error('[gate-checkin] Unexpected error:', err);
    return res.status(500).json({ status: 'ERROR', message: err?.message || 'Server error during checkin' });
  }
}
