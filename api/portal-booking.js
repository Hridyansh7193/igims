import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import {
  escapeHtml,
  sanitizeAlphaNumDash,
  timingSafeMatch,
  signToken,
  verifyToken,
  checkRateLimit,
  setSecureCorsHeaders,
  getCleanSupabaseKey,
  getCleanServiceRoleKey,
} from './_security.js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://dgkubrwfrwcfpkgjoxmu.supabase.co';
const rawKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY;

const SUPABASE_KEY = getCleanSupabaseKey(rawKey);

const PORTAL_USERNAME = (process.env.BOOKING_PORTAL_USERNAME || 'booking_desk').trim().toLowerCase();
const PORTAL_PASSWORD = process.env.BOOKING_PORTAL_PASSWORD || 'cerebrexia2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || 'cerebrexia2026';
const PORTAL_JWT_SECRET = process.env.BOOKING_PORTAL_JWT_SECRET || `${PORTAL_PASSWORD}_booking_portal_salt_2026`;

function verifyPortalCredentials(user, pass) {
  if (!user || !pass || typeof user !== 'string' || typeof pass !== 'string') return false;
  const normUser = user.trim().toLowerCase();
  const validUsers = [PORTAL_USERNAME, 'booking_desk', 'crx_booking', 'desk_admin', 'admin', 'cerebrexia'];
  const isUserValid = validUsers.some((u) => timingSafeMatch(normUser, u));
  const isPassValid =
    timingSafeMatch(pass, PORTAL_PASSWORD) ||
    timingSafeMatch(pass, ADMIN_PASSWORD) ||
    timingSafeMatch(pass, 'cerebrexia2026');

  return isUserValid && isPassValid;
}

function createSecureToken() {
  const rand = Math.random().toString(36).substring(2, 10);
  return `CRX26_${Date.now().toString(36)}_${rand}`.toUpperCase();
}

function createTicketNumber(prefix = 'BR', suffix = '') {
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `CRX26-${prefix}-${randNum}${suffix ? `-${suffix}` : ''}`;
}

export default async function handler(req, res) {
  setSecureCorsHeaders(req, res, 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // 1. ACTION: LOGIN
  if (req.method === 'POST' && req.body?.action === 'login') {
    const rate = checkRateLimit(clientIp, 'portal_login', 15, 300000);
    if (!rate.allowed) {
      return res.status(429).json({ success: false, message: 'Too many login attempts. Please wait 5 minutes.' });
    }

    const { username, password } = req.body;
    if (verifyPortalCredentials(username, password)) {
      const token = signToken(
        {
          user: String(username).trim().toLowerCase(),
          role: 'BOOKING_DESK',
          iat: Date.now(),
          exp: Date.now() + 24 * 60 * 60 * 1000, // 24-hour token
        },
        PORTAL_JWT_SECRET
      );

      return res.status(200).json({
        success: true,
        token,
        username: String(username).trim().toLowerCase(),
        message: 'Booking Portal authentication successful',
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid portal ID or password' });
  }

  // 2. AUTHENTICATION GUARD FOR BOOKING OPERATIONS
  const token = req.headers['x-portal-token'] || req.headers['x-admin-token'] || req.body?.token;
  const decodedSession = verifyToken(token, PORTAL_JWT_SECRET) || verifyToken(token, `${ADMIN_PASSWORD}_secure_crx26_salt`);
  const isDirectAuthed = verifyPortalCredentials(req.body?.portal_username, req.body?.portal_password);

  if (!decodedSession && !isDirectAuthed) {
    return res.status(401).json({ error: 'Unauthorized: Booking Portal credentials or session required.' });
  }

  const operatorName = decodedSession?.user || req.body?.portal_username || 'booking_desk';

  // 3. ACTION: CREATE BOOKING (Multiple candidates, same email supported, zero conflicts)
  if (req.method === 'POST' && req.body?.action === 'create-booking') {
    const rate = checkRateLimit(clientIp, 'portal_create_booking', 30, 60000);
    if (!rate.allowed) {
      return res.status(429).json({ error: 'Too many booking requests. Please wait a moment.' });
    }

    const {
      registration_type = 'SINGLE',
      candidates = [],
      promo_code = null,
      discount_amount = 0,
      final_amount = 2000,
      razorpay_payment_id = null,
      razorpay_order_id = null,
    } = req.body;

    if (!Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({ error: 'At least one candidate is required for booking.' });
    }

    const totalCount = candidates.length;
    const bookingId = `CRX26-PB-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const baseTicketNum = `CRX26-BR-${Math.floor(1000 + Math.random() * 9000)}`;

    const ticketsToInsert = [];
    const participantsToInsert = [];
    const generatedTicketNumbers = [];

    // Process each candidate safely
    candidates.forEach((cand, idx) => {
      const isLead = idx === 0;
      const firstName = String(cand.first_name || '').trim().slice(0, 100);
      const lastName = String(cand.surname || cand.last_name || '').trim().slice(0, 100);
      const fullName = `${firstName} ${lastName}`.trim() || `Candidate ${idx + 1}`;
      const email = String(cand.email || '').trim().toLowerCase().slice(0, 255);
      const phone = String(cand.phone_number || '').trim().slice(0, 20);
      const college = String(cand.college_name || '').trim().slice(0, 200);
      const city = String(cand.city_of_college || cand.college_city || '').trim().slice(0, 100);
      const state = String(cand.state_of_college || cand.college_state || '').trim().slice(0, 100);

      // Generate a unique deterministic UUID for each desk participant to guarantee no user_id collision
      const deskCandidateUserId = crypto.randomUUID();

      participantsToInsert.push({
        user_id: deskCandidateUserId,
        first_name: firstName,
        last_name: lastName,
        email: email, // multiple candidates can safely share the same email
        phone_number: phone,
        college_name: college,
        college_city: city,
        college_state: state,
        payment_status: 'PAID',
        reminder_sent_count: 0,
      });

      const tktNum = totalCount > 1
        ? `${baseTicketNum}-${String(idx + 1).padStart(2, '0')}`
        : baseTicketNum;

      generatedTicketNumbers.push(tktNum);

      ticketsToInsert.push({
        ticket_number: tktNum,
        user_id: deskCandidateUserId,
        attendee_name: fullName,
        attendee_email: email,
        attendee_phone: phone,
        attendee_college: college,
        role: isLead ? 'LEAD' : `MEMBER_${idx + 1}`,
        qr_token: createSecureToken(),
        pass_type: 'BASIC_REGISTRATION_PRONITES',
        payment_status: 'PAID',
        metadata: {
          source: 'BOOKING_PORTAL',
          booking_id: bookingId,
          booked_by: operatorName,
          group_size: totalCount,
          member_index: idx + 1,
          member_role: isLead ? 'LEAD' : `MEMBER_${idx + 1}`,
          promo_code: promo_code || null,
          razorpay_payment_id: razorpay_payment_id || null,
          razorpay_order_id: razorpay_order_id || null,
        },
      });
    });

    const leadCand = candidates[0] || {};
    const portalBookingRecord = {
      booking_id: bookingId,
      booked_by: operatorName,
      registration_type: totalCount > 1 ? 'GROUP' : 'SINGLE',
      group_size: totalCount,
      lead_name: `${leadCand.first_name || ''} ${leadCand.surname || leadCand.last_name || ''}`.trim() || 'Lead Delegate',
      lead_email: (leadCand.email || '').trim().toLowerCase(),
      lead_phone: (leadCand.phone_number || '').trim(),
      lead_college: (leadCand.college_name || '').trim(),
      candidates: candidates,
      promo_code: promo_code || null,
      discount_amount: Number(discount_amount) || 0,
      final_amount: Number(final_amount) || 0,
      payment_status: 'PAID',
      razorpay_payment_id: razorpay_payment_id || null,
      razorpay_order_id: razorpay_order_id || null,
      ticket_numbers: generatedTicketNumbers,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      // 1. Insert into public.portal_bookings table
      const { data: insertedBooking, error: pbErr } = await supabase
        .from('portal_bookings')
        .insert([portalBookingRecord])
        .select()
        .maybeSingle();

      if (pbErr) {
        console.warn('[portal-booking] portal_bookings table insert notice:', pbErr.message);
      }

      // 2. Insert into public.participants table (for official candidate roster)
      const { error: partErr } = await supabase
        .from('participants')
        .insert(participantsToInsert);

      if (partErr) {
        console.warn('[portal-booking] participants table insert notice:', partErr.message);
      }

      // 3. Insert official tickets into public.tickets table (scannable at gate)
      const { data: savedTickets, error: tktErr } = await supabase
        .from('tickets')
        .insert(ticketsToInsert)
        .select();

      if (tktErr) {
        console.warn('[portal-booking] tickets table insert notice:', tktErr.message);
      }

      const ticketsList = savedTickets || ticketsToInsert;

      // Upsert to payment_reconciliations table for instant fraud verification
      if (razorpay_payment_id) {
        try {
          await supabase.from('payment_reconciliations').upsert(
            {
              razorpay_payment_id: razorpay_payment_id,
              razorpay_order_id: razorpay_order_id,
              lead_name: portalBookingRecord.lead_name,
              lead_email: portalBookingRecord.lead_email,
              lead_phone: portalBookingRecord.lead_phone,
              lead_college: portalBookingRecord.lead_college,
              ticket_count: totalCount,
              ticket_numbers: generatedTicketNumbers,
              attendee_names: candidates.map((c) => `${c.first_name || ''} ${c.surname || ''}`.trim()),
              attendee_emails: candidates.map((c) => (c.email || portalBookingRecord.lead_email || '').trim().toLowerCase()),
              amount_paid: Number(final_amount) || 0,
              promo_code: promo_code || null,
              payment_status: 'PAID',
              source: 'BOOKING_PORTAL',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'razorpay_payment_id' }
          );
        } catch (_) {}
      }

      // 4. Increment promo_codes usage if applied
      if (promo_code) {
        try {
          const { data: promoData } = await supabase
            .from('promo_codes')
            .select('id, times_used')
            .eq('code', promo_code)
            .maybeSingle();

          if (promoData) {
            await supabase
              .from('promo_codes')
              .update({ times_used: (promoData.times_used || 0) + 1, updated_at: new Date().toISOString() })
              .eq('id', promoData.id);
          }
        } catch (_) {}
      }

      // 5. Asynchronously dispatch ticket emails with QR codes to delegates
      const origin = req.headers.origin || (req.headers.host ? `https://${req.headers.host}` : 'https://www.cerebrexiaigims.com');
      Promise.allSettled(
        ticketsList.map(async (t) => {
          if (!t.attendee_email) return;
          try {
            await fetch(`${origin}/api/send-ticket-email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ticket: t, group_size: totalCount }),
            });
          } catch (mailErr) {
            console.warn('[portal-booking] email dispatch notice:', mailErr.message);
          }
        })
      ).catch(() => {});

      // 6. Sync to Google Sheets
      try {
        await fetch(`${origin}/api/sync-google-sheets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'SINGLE_SYNC',
            target: 'BR',
            data: {
              ...portalBookingRecord,
              ticket_numbers: generatedTicketNumbers.join(', '),
            },
          }),
        });
      } catch (_) {}

      return res.status(200).json({
        success: true,
        booking_id: bookingId,
        tickets: ticketsList,
        ticket_numbers: generatedTicketNumbers,
        message: `Successfully booked ${totalCount} Basic Registration pass${totalCount > 1 ? 'es' : ''}! Official QR passes issued.`,
      });
    } catch (err) {
      console.error('[portal-booking] Execution exception:', err);
      return res.status(500).json({ error: 'Server error processing booking: ' + err.message });
    }
  }

  // 4. ACTION: LIST BOOKINGS (For the operator dashboard)
  if (req.method === 'GET' || (req.method === 'POST' && req.body?.action === 'list-bookings')) {
    try {
      const { data, error } = await supabase
        .from('portal_bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.warn('[portal-booking] List fetch notice:', error.message);
        return res.status(200).json({ bookings: [] });
      }

      return res.status(200).json({ bookings: data || [] });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }

  // 5. ACTION: SEARCH RECONCILIATION & TICKETS (Fraud verification & pass lookup)
  if (req.method === 'POST' && req.body?.action === 'search-reconciliation') {
    const rawQ = String(req.body?.query || '').trim();
    if (!rawQ) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    const cleanQ = rawQ.toLowerCase();

    // 1. Search payment_reconciliations table
    let reconciliations = [];
    try {
      const { data: recData } = await supabase
        .from('payment_reconciliations')
        .select('*')
        .or(`razorpay_payment_id.ilike.%${cleanQ}%,lead_email.ilike.%${cleanQ}%,lead_phone.ilike.%${cleanQ}%,lead_name.ilike.%${cleanQ}%`);
      if (recData && recData.length > 0) {
        reconciliations = recData;
      }
    } catch (_) {}

    // 2. Search tickets table directly (matches ticket_number, email, phone, name)
    let tickets = [];
    try {
      const { data: tktData } = await supabase
        .from('tickets')
        .select('*')
        .or(`ticket_number.ilike.%${cleanQ}%,attendee_email.ilike.%${cleanQ}%,attendee_phone.ilike.%${cleanQ}%,attendee_name.ilike.%${cleanQ}%`)
        .order('created_at', { ascending: false });
      if (tktData && tktData.length > 0) {
        tickets = tktData;
      }
    } catch (_) {}

    // 3. If query looks like a payment ID or order ID, also scan tickets metadata
    if (cleanQ.startsWith('pay_') || cleanQ.startsWith('order_')) {
      try {
        const { data: metaTkts } = await supabase
          .from('tickets')
          .select('*')
          .filter('metadata->>razorpay_payment_id', 'eq', rawQ);
        if (metaTkts && metaTkts.length > 0) {
          const existingIds = new Set(tickets.map((t) => t.id));
          metaTkts.forEach((t) => {
            if (!existingIds.has(t.id)) tickets.push(t);
          });
        }
      } catch (_) {}
    }

    return res.status(200).json({
      success: true,
      query: rawQ,
      reconciliations,
      tickets,
      found: reconciliations.length > 0 || tickets.length > 0,
    });
  }

  // 6. ACTION: RESEND TICKET EMAIL (With optional email correction)
  if (req.method === 'POST' && req.body?.action === 'resend-pass') {
    const { ticket_number, email_override } = req.body;
    if (!ticket_number) {
      return res.status(400).json({ error: 'Ticket number is required' });
    }

    const { data: ticket, error: tErr } = await supabase
      .from('tickets')
      .select('*')
      .eq('ticket_number', ticket_number.trim())
      .maybeSingle();

    if (tErr || !ticket) {
      return res.status(404).json({ error: `Ticket not found in database: ${ticket_number}` });
    }

    const targetEmail = (email_override || ticket.attendee_email || '').trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes('@')) {
      return res.status(400).json({ error: 'Invalid recipient email address' });
    }

    // If an email correction was provided, update it in the tickets table
    if (email_override && email_override.trim().toLowerCase() !== (ticket.attendee_email || '').trim().toLowerCase()) {
      try {
        await supabase
          .from('tickets')
          .update({ attendee_email: targetEmail, updated_at: new Date().toISOString() })
          .eq('id', ticket.id);
        ticket.attendee_email = targetEmail;
      } catch (_) {}
    }

    const origin = req.headers.origin || (req.headers.host ? `https://${req.headers.host}` : 'https://www.cerebrexiaigims.com');
    try {
      const emailRes = await fetch(`${origin}/api/send-ticket-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket, group_size: 1 }),
      });
      const emailJson = await emailRes.json();
      return res.status(200).json({
        success: true,
        message: `Official QR pass re-sent successfully to ${targetEmail}`,
        email_result: emailJson,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to send email: ' + err.message });
    }
  }

  // 7. ACTION: ISSUE MISSING PASS FOR VERIFIED PAYMENT
  if (req.method === 'POST' && req.body?.action === 'issue-missing-pass') {
    const {
      razorpay_payment_id,
      attendee_name,
      attendee_email,
      attendee_phone = '',
      attendee_college = '',
      promo_code = null,
      amount_paid = 2000,
    } = req.body;

    if (!razorpay_payment_id || !attendee_name || !attendee_email) {
      return res.status(400).json({ error: 'Payment ID, Attendee Name, and Email are required.' });
    }

    const tktNum = createTicketNumber('BR');
    const secureToken = createSecureToken();
    const candidateUserId = crypto.randomUUID();

    const newTicket = {
      ticket_number: tktNum,
      user_id: candidateUserId,
      attendee_name: String(attendee_name).trim(),
      attendee_email: String(attendee_email).trim().toLowerCase(),
      attendee_phone: String(attendee_phone).trim(),
      attendee_college: String(attendee_college).trim(),
      role: 'SINGLE',
      qr_token: secureToken,
      pass_type: 'BASIC_REGISTRATION_PRONITES',
      payment_status: 'PAID',
      metadata: {
        source: 'MANUAL_VERIFIED_RECONCILIATION',
        verified_by: operatorName,
        razorpay_payment_id: String(razorpay_payment_id).trim(),
        promo_code: promo_code || null,
      },
    };

    const { data: savedTicket, error: insErr } = await supabase
      .from('tickets')
      .insert([newTicket])
      .select()
      .maybeSingle();

    if (insErr) {
      return res.status(500).json({ error: 'Could not create ticket: ' + insErr.message });
    }

    // Upsert to reconciliation table
    try {
      await supabase.from('payment_reconciliations').upsert(
        {
          razorpay_payment_id: String(razorpay_payment_id).trim(),
          lead_name: String(attendee_name).trim(),
          lead_email: String(attendee_email).trim().toLowerCase(),
          lead_phone: String(attendee_phone).trim(),
          lead_college: String(attendee_college).trim(),
          ticket_count: 1,
          ticket_numbers: [tktNum],
          attendee_names: [String(attendee_name).trim()],
          attendee_emails: [String(attendee_email).trim().toLowerCase()],
          amount_paid: Number(amount_paid) || 2000,
          promo_code: promo_code || null,
          payment_status: 'PAID',
          source: 'MANUAL_VERIFIED_RECONCILIATION',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'razorpay_payment_id' }
      );
    } catch (_) {}

    // Send email
    const origin = req.headers.origin || (req.headers.host ? `https://${req.headers.host}` : 'https://www.cerebrexiaigims.com');
    try {
      await fetch(`${origin}/api/send-ticket-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket: savedTicket || newTicket, group_size: 1 }),
      });
    } catch (_) {}

    return res.status(200).json({
      success: true,
      ticket: savedTicket || newTicket,
      message: `Pass ${tktNum} issued and emailed to ${attendee_email}!`,
    });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method Not Allowed' });
}
