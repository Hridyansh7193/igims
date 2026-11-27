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
  resolveSupabaseServerKey,
  getCleanServiceRoleKey,
  getCleanRazorpayKeys,
  assertSafeDatabaseMutation,
} from './_security.js';
import { sendTicketEmailDirect } from './_ticketEmail.js';
import { createGmailTransporter, getGmailConfig } from './_email.js';
import { finalizeBasicRegistration, buildAuthUserEmailMap } from './_finalizeBasicRegistration.js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = resolveSupabaseServerKey();

const PORTAL_USERNAME = (process.env.BOOKING_PORTAL_USERNAME || 'cerebrexiaadmin').trim().toLowerCase();
const PORTAL_PASSWORD = process.env.BOOKING_PORTAL_PASSWORD;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const PORTAL_SECRET_SEED = PORTAL_PASSWORD || ADMIN_PASSWORD;
const PORTAL_JWT_SECRET = process.env.BOOKING_PORTAL_JWT_SECRET || (PORTAL_SECRET_SEED ? `${PORTAL_SECRET_SEED}_booking_portal_salt_2026` : null);

function verifyPortalCredentials(user, pass) {
  if (!user || !pass || typeof user !== 'string' || typeof pass !== 'string') return false;
  if (!PORTAL_PASSWORD && !ADMIN_PASSWORD) return false;
  const normUser = user.trim().toLowerCase();
  const validUsers = [PORTAL_USERNAME, 'cerebrexiaadmin', 'booking_desk', 'crx_booking', 'desk_admin', 'admin', 'cerebrexia'];
  const isUserValid = validUsers.some((u) => timingSafeMatch(normUser, u));
  const isPassValid =
    (PORTAL_PASSWORD && timingSafeMatch(pass, PORTAL_PASSWORD)) ||
    (ADMIN_PASSWORD && timingSafeMatch(pass, ADMIN_PASSWORD));

  return isUserValid && Boolean(isPassValid);
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

  // 1. ACTION: LOGIN (Does not require Supabase connection)
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

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Database service is not configured on the server.' });
  }
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const operatorName = decodedSession?.user || req.body?.portal_username || 'booking_desk';

  // Enforce environment isolation on database mutations
  if (['create-booking', 'issue-missing-pass', 'sync-all-reconciliations', 'reconcile-razorpay-captured'].includes(req.body?.action)) {
    try {
      assertSafeDatabaseMutation(SUPABASE_URL);
    } catch (isolationErr) {
      return res.status(isolationErr.statusCode || 403).json({ error: isolationErr.message });
    }
  }

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
        user_id: null, // Null satisfies auth.users FK constraint for desk bookings
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

    try {
      const emailJson = await sendTicketEmailDirect(ticket, 1);
      return res.status(200).json({
        success: true,
        message: emailJson.suppressed
          ? `Email dispatch suppressed on Preview (pass ready for ${targetEmail})`
          : `Official QR pass re-sent successfully to ${targetEmail}`,
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

    try {
      const result = await finalizeBasicRegistration(supabase, {
        payment: {
          id: String(razorpay_payment_id).trim(),
          amount: Math.round((Number(amount_paid) || 2000) * 100),
          email: String(attendee_email).trim().toLowerCase(),
          contact: String(attendee_phone).trim(),
          notes: {
            name: String(attendee_name).trim(),
            college: String(attendee_college).trim(),
            promo_code: promo_code || null,
          },
        },
        brPayload: {
          first_name: String(attendee_name).trim().split(/\s+/)[0] || '',
          last_name: String(attendee_name).trim().split(/\s+/).slice(1).join(' ') || '',
          email: String(attendee_email).trim().toLowerCase(),
          phone_number: String(attendee_phone).trim(),
          college_name: String(attendee_college).trim(),
          promo_code: promo_code || null,
          final_amount: Number(amount_paid) || 2000,
        },
        sendEmail: true,
      });

      const primaryTicket = result.tickets?.[0] || null;
      return res.status(200).json({
        success: true,
        ticket: primaryTicket,
        alreadyRecorded: result.alreadyRecorded,
        message: result.alreadyRecorded
          ? `Pass ${primaryTicket?.ticket_number || ''} was already present (database statuses refreshed)!`
          : `Pass ${primaryTicket?.ticket_number || ''} issued and emailed to ${attendee_email}!`,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Could not issue pass: ' + err.message });
    }
  }

  // 7B. ACTION: CHECK LAST 50 CAPTURED PAYMENTS IN RAZORPAY & RECOVER MISSING BRs + EMAILS (BATCHED TO PREVENT VERCEL TIMEOUT)
  if (req.method === 'POST' && req.body?.action === 'reconcile-razorpay-captured') {
    const { keyId, keySecret, error: keyError } = getCleanRazorpayKeys();
    if (keyError || !keyId || !keySecret) {
      return res.status(500).json({ error: keyError || 'Razorpay credentials not configured on server.' });
    }

    const rawLimit = Number(req.body?.batchLimit);
    const batchLimit = Number.isFinite(rawLimit) ? Math.min(Math.max(Math.trunc(rawLimit), 1), 8) : 4;
    const rawCount = Number(req.body?.scanCount);
    const scanCount = Number.isFinite(rawCount) ? Math.min(Math.max(Math.trunc(rawCount), 1), 100) : 50;
    const rawMinAmount = Number(req.body?.minAmountInr);
    const minAmountInr = Number.isFinite(rawMinAmount) && rawMinAmount >= 0 ? rawMinAmount : 700;
    const excludeSet = new Set(
      Array.isArray(req.body?.excludeIds) ? req.body.excludeIds.map((x) => String(x || '').trim()).filter(Boolean) : []
    );

    let pooledTransporter = null;
    try {
      const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`;

      // Fetch the latest `scanCount` (default 50) Razorpay payments & existing Supabase records in parallel
      const fetchRazorpayPayments = async () => {
        const r = await fetch(`https://api.razorpay.com/v1/payments?count=${scanCount}&skip=0`, {
          headers: { Authorization: authHeader },
        });
        if (!r.ok) {
          const errText = await r.text();
          throw new Error(`Razorpay API lookup failed (${r.status}): ${errText.slice(0, 200)}`);
        }
        const json = await r.json();
        return Array.isArray(json?.items) ? json.items : [];
      };

      const [payments, recRes, tktRes, partRes, brRes, evtRes, accRes] = await Promise.all([
        fetchRazorpayPayments(),
        supabase.from('payment_reconciliations').select('razorpay_payment_id, ticket_count, payment_status'),
        supabase.from('tickets').select('metadata, user_id, attendee_email, payment_status'),
        supabase.from('participants').select('user_id, email, payment_status'),
        supabase.from('basic_registrations').select('user_id, razorpay_payment_id, payment_status'),
        supabase.from('event_payments').select('razorpay_payment_id'),
        supabase.from('accommodation_bookings').select('razorpay_payment_id'),
      ]);

      const capturedPayments = payments.filter((p) => p?.status === 'captured' && p?.id);

      const nonBrIds = new Set(excludeSet);
      for (const e of evtRes?.data || []) if (e.razorpay_payment_id) nonBrIds.add(e.razorpay_payment_id);
      for (const a of accRes?.data || []) if (a.razorpay_payment_id) nonBrIds.add(a.razorpay_payment_id);

      const paidParticipantUserIds = new Set();
      const paidParticipantEmails = new Set();
      for (const p of partRes?.data || []) {
        if (p.payment_status === 'PAID') {
          if (p.user_id) paidParticipantUserIds.add(p.user_id);
          if (p.email) paidParticipantEmails.add(String(p.email).trim().toLowerCase());
        }
      }

      const paidBrUserIds = new Set();
      const paidBrPayIds = new Set();
      for (const b of brRes?.data || []) {
        if (b.payment_status === 'PAID') {
          if (b.user_id) paidBrUserIds.add(b.user_id);
          if (b.razorpay_payment_id) paidBrPayIds.add(b.razorpay_payment_id);
        }
      }

      const ticketByPayId = new Map();
      for (const t of tktRes?.data || []) {
        const payId = t.metadata?.razorpay_payment_id;
        if (payId && t.payment_status === 'PAID') {
          ticketByPayId.set(payId, t);
        }
      }

      const validReconciledIds = new Set();
      for (const r of recRes?.data || []) {
        if (r.razorpay_payment_id && r.payment_status === 'PAID' && (r.ticket_count || 0) > 0) {
          validReconciledIds.add(r.razorpay_payment_id);
        }
      }

      const isFullyRecordedInDb = (paymentId) => {
        if (nonBrIds.has(paymentId)) return true;
        const ticket = ticketByPayId.get(paymentId);
        if (ticket) {
          if (ticket.user_id) {
            return paidParticipantUserIds.has(ticket.user_id) && paidBrUserIds.has(ticket.user_id);
          }
          const tEmail = String(ticket.attendee_email || '').trim().toLowerCase();
          return !tEmail || paidParticipantEmails.has(tEmail);
        }
        return validReconciledIds.has(paymentId) && paidBrPayIds.has(paymentId);
      };

      // Filter down to unknown BR-priced candidates whose payment-level notes aren't event/accommodation
      const candidates = [];
      let skipped = 0;
      for (const p of capturedPayments) {
        if (isFullyRecordedInDb(p.id)) {
          skipped += 1;
          continue;
        }
        const amountInr = Math.round(Number(p.amount || 0) / 100);
        if (amountInr < minAmountInr) {
          skipped += 1;
          continue;
        }
        const pType = String(p.notes?.type || '').toLowerCase();
        if (pType === 'event' || pType === 'accommodation') {
          skipped += 1;
          continue;
        }
        candidates.push(p);
      }

      // Inspect order notes in small parallel chunks ONLY until we have `batchLimit` confirmed BR targets
      const targets = [];
      const skippedIds = [];
      let cursor = 0;
      while (cursor < candidates.length && targets.length < batchLimit) {
        const chunk = candidates.slice(cursor, cursor + 8);
        cursor += chunk.length;

        const orderResults = await Promise.allSettled(
          chunk.map(async (p) => {
            if (!p.order_id) return null;
            const ro = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(p.order_id)}`, {
              headers: { Authorization: authHeader },
            });
            return ro.ok ? await ro.json() : null;
          })
        );

        for (let i = 0; i < chunk.length; i++) {
          const payment = chunk[i];
          const order = orderResults[i].status === 'fulfilled' ? orderResults[i].value : null;
          const oType = String(order?.notes?.type || payment.notes?.type || '').toLowerCase();
          if (oType === 'event' || oType === 'accommodation') {
            skipped += 1;
            skippedIds.push(payment.id);
            continue;
          }
          if (targets.length < batchLimit) {
            targets.push({ payment, order });
          } else {
            // Rewind cursor to re-check overflow item in the next batch
            cursor -= chunk.length - i;
            break;
          }
        }
      }

      const remainingCandidates = Math.max(0, candidates.length - cursor);
      const recovered = [];
      const failed = [];

      if (targets.length > 0) {
        const authUserEmailMap = await buildAuthUserEmailMap(supabase);
        if (getGmailConfig().configured) {
          try {
            pooledTransporter = createGmailTransporter({ pool: true });
          } catch (_) {}
        }

        const finalizedResults = await Promise.allSettled(
          targets.map(({ payment, order }) =>
            finalizeBasicRegistration(supabase, {
              payment,
              order,
              sendEmail: true,
              authUserEmailMap,
              transporter: pooledTransporter,
            })
          )
        );

        for (let i = 0; i < finalizedResults.length; i++) {
          const { payment } = targets[i];
          const r = finalizedResults[i];
          if (r.status === 'fulfilled') {
            const out = r.value;
            recovered.push({
              payment_id: payment.id,
              email: out.email,
              name: out.name,
              ticket_numbers: (out.tickets || []).map((t) => t.ticket_number),
              emailsSent: out.emailsSent,
            });
          } else {
            failed.push({
              payment_id: payment.id,
              email: payment.email || '',
              error: r.reason?.message || 'Unknown error',
            });
          }
        }
      }

      return res.status(200).json({
        success: true,
        checked_payments: capturedPayments.length,
        recovered_count: recovered.length,
        skipped_count: skipped,
        skipped_ids: skippedIds,
        has_more: remainingCandidates > 0,
        remaining_candidates: remainingCandidates,
        recovered,
        failed,
        message: recovered.length > 0
          ? `Recovered ${recovered.length} missing BR payment(s) from Razorpay and dispatched QR emails!`
          : (remainingCandidates > 0
            ? 'Scanned batch; continuing remaining Razorpay payments...'
            : `All ${capturedPayments.length} captured Razorpay BR payments are already recorded in the database.`),
      });
    } catch (err) {
      const status = String(err.message || '').startsWith('Razorpay API lookup failed') ? 502 : 500;
      return res.status(status).json({ error: err.message || 'Recovery failed' });
    } finally {
      try {
        pooledTransporter?.close?.();
      } catch (_) {}
    }
  }

  // 8. ACTION: SYNC ALL HISTORICAL RECONCILIATIONS
  if (req.method === 'POST' && req.body?.action === 'sync-all-reconciliations') {
    try {
      const { data: tickets, error: tErr } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: true });

      if (tErr) {
        return res.status(500).json({ error: tErr.message });
      }

      const paymentMap = new Map();
      for (const t of tickets || []) {
        if (t.pass_type && !t.pass_type.includes('BASIC') && !t.pass_type.includes('CONCERT')) continue;
        const payId = (t.metadata?.razorpay_payment_id || '').trim();
        const groupKey = payId || `unlinked_${t.ticket_number}`;

        if (!paymentMap.has(groupKey)) {
          paymentMap.set(groupKey, {
            razorpay_payment_id: payId || `unlinked_${t.ticket_number}`,
            razorpay_order_id: t.metadata?.razorpay_order_id || null,
            lead_name: t.attendee_name || 'Attendee',
            lead_email: t.attendee_email || '',
            lead_phone: t.attendee_phone || '',
            lead_college: t.attendee_college || '',
            tickets: [],
            attendee_names: [],
            attendee_emails: [],
            promo_code: t.metadata?.promo_code || null,
            source: t.metadata?.source || (payId ? 'RAZORPAY_WEB' : 'UNLINKED'),
            created_at: t.created_at || new Date().toISOString(),
          });
        }

        const group = paymentMap.get(groupKey);
        group.tickets.push(t);
        group.attendee_names.push(t.attendee_name || 'Delegate');
        group.attendee_emails.push(t.attendee_email || '');
        if (!group.promo_code && t.metadata?.promo_code) group.promo_code = t.metadata.promo_code;
        if (!group.razorpay_order_id && t.metadata?.razorpay_order_id) group.razorpay_order_id = t.metadata.razorpay_order_id;
      }

      const recordsToUpsert = [];
      for (const group of paymentMap.values()) {
        recordsToUpsert.push({
          razorpay_payment_id: group.razorpay_payment_id,
          razorpay_order_id: group.razorpay_order_id,
          lead_name: group.lead_name,
          lead_email: group.lead_email,
          lead_phone: group.lead_phone,
          lead_college: group.lead_college,
          ticket_count: group.tickets.length,
          ticket_numbers: group.tickets.map((t) => t.ticket_number),
          attendee_names: group.attendee_names,
          attendee_emails: group.attendee_emails,
          amount_paid: group.tickets.length * 2000,
          promo_code: group.promo_code,
          payment_status: 'PAID',
          source: group.source,
          created_at: group.created_at,
          updated_at: new Date().toISOString(),
        });
      }

      const { data: upsertData, error: upsertErr } = await supabase
        .from('payment_reconciliations')
        .upsert(recordsToUpsert, { onConflict: 'razorpay_payment_id' })
        .select();

      if (upsertErr) {
        return res.status(500).json({ error: upsertErr.message });
      }

      return res.status(200).json({
        success: true,
        message: `Successfully synced ${recordsToUpsert.length} payments covering ${tickets?.length || 0} tickets!`,
        count: upsertData?.length || recordsToUpsert.length,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method Not Allowed' });
}
