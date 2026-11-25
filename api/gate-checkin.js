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
  assertSafeDatabaseMutation,
} from './_security.js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const rawKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

const SUPABASE_KEY = getCleanSupabaseKey(rawKey);

const GATE_SECRET_KEY = process.env.GATE_SECRET_KEY;
const GATE_PASSWORD = process.env.GATE_SCANNER_PASSWORD || process.env.ADMIN_PASSWORD;
const GATE_JWT_SECRET = process.env.GATE_SCANNER_JWT_SECRET || (GATE_PASSWORD ? `${GATE_PASSWORD}_gate_scanner_salt_2026` : null);

const GATE_ACCOUNTS = [
  {
    id: (process.env.GATE_SCANNER_USERNAME_1 || process.env.GATE_SCANNER_USERNAME || 'gate1').trim().toLowerCase(),
    password: process.env.GATE_SCANNER_PASSWORD_1 || GATE_PASSWORD,
  },
  {
    id: (process.env.GATE_SCANNER_USERNAME_2 || 'gate2').trim().toLowerCase(),
    password: process.env.GATE_SCANNER_PASSWORD_2 || GATE_PASSWORD,
  },
];

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Verifies Gate Scanner volunteer ID and password using timing-safe comparison (strictly 2 accounts)
 */
function verifyGateCredentials(user, pass) {
  if (!user || !pass || typeof user !== 'string' || typeof pass !== 'string') return false;
  const normUser = user.trim().toLowerCase();
  return GATE_ACCOUNTS.some((acc) => acc.password && timingSafeMatch(normUser, acc.id) && timingSafeMatch(pass, acc.password));
}

/**
 * Determines the festival event day based on IST date or staff override
 */
function getEventDay(override) {
  if (override && ['DAY_1', 'DAY_2', 'DAY_3', 'DAY_4'].includes(override)) {
    return override;
  }

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
 * Extracts validated 4-digit unique code from either column or metadata JSONB
 */
function extractUniqueCode(ticket) {
  if (!ticket) return null;
  const candidate = ticket.unique_code ?? ticket.metadata?.unique_code ?? null;
  if (candidate === null || candidate === undefined) return null;
  const clean = String(candidate).trim();
  return /^\d{4}$/.test(clean) ? clean : null;
}

/**
 * Strips sensitive PII and returns only essential attendee info for gate staff
 */
function sanitizeAttendeeOutput(ticket, overrideCode = null) {
  if (!ticket) return null;
  return {
    attendee_name: escapeHtml(ticket.attendee_name || ''),
    attendee_college: escapeHtml(ticket.attendee_college || 'Cerebrexia Delegate'),
    ticket_number: ticket.ticket_number,
    role: ticket.role || 'DELEGATE',
    pass_type: ticket.pass_type || 'CONCERT_PRONITES',
    unique_code: overrideCode || extractUniqueCode(ticket),
  };
}

/**
 * Runs a Supabase query safely
 */
async function queryWithFallback(primarySb, runFn) {
  return runFn(primarySb);
}

function isMissingColumnError(err) {
  if (!err) return false;
  const msg = String(err.message || '').toLowerCase();
  return err.code === '42703' || err.code === 'PGRST204' || msg.includes('unique_code');
}

/**
 * Parses and cleans QR token safely (handles URL links, CRX26: prefix, or ticket number)
 */
function parseQrToken(qrToken) {
  let rawToken = qrToken;
  if (qrToken.includes('token=')) {
    try {
      rawToken = new URL(qrToken).searchParams.get('token') || qrToken;
    } catch (_) {
      const m = qrToken.match(/[?&]token=([^&]+)/);
      rawToken = m ? m[1] : qrToken;
    }
  } else {
    rawToken = qrToken.replace(/^CRX26:/, '').trim();
  }
  return sanitizeAlphaNumDash(rawToken);
}

/**
 * Checks whether another ticket already owns this 4-digit code
 */
async function findConflictingTicket(primarySb, cleanCode, excludeTicketId) {
  const colRes = await queryWithFallback(primarySb, (sb) =>
    sb
      .from('tickets')
      .select('id, attendee_name, ticket_number, unique_code')
      .eq('unique_code', cleanCode)
      .neq('id', excludeTicketId)
      .limit(1)
  );

  if (!colRes.error && Array.isArray(colRes.data) && colRes.data.length > 0) {
    return colRes.data[0];
  }

  const metaRes = await queryWithFallback(primarySb, (sb) =>
    sb
      .from('tickets')
      .select('id, attendee_name, ticket_number, metadata')
      .contains('metadata', { unique_code: cleanCode })
      .neq('id', excludeTicketId)
      .limit(1)
  );

  if (!metaRes.error && Array.isArray(metaRes.data) && metaRes.data.length > 0) {
    return metaRes.data[0];
  }

  return null;
}

/**
 * Persists unique 4-digit code onto the ticket row (column + metadata JSONB with pre-migration fallback)
 */
async function saveTicketUniqueCode(primarySb, ticket, cleanCode, assignedBy) {
  assertSafeDatabaseMutation(SUPABASE_URL);
  const nowIso = new Date().toISOString();
  const baseMeta = ticket.metadata && typeof ticket.metadata === 'object' ? ticket.metadata : {};
  const nextMetadata = {
    ...baseMeta,
    unique_code: cleanCode,
    unique_code_assigned_at: nowIso,
    unique_code_assigned_by: assignedBy,
  };

  let res = await queryWithFallback(primarySb, (sb) =>
    sb
      .from('tickets')
      .update({
        unique_code: cleanCode,
        unique_code_assigned_at: nowIso,
        unique_code_assigned_by: assignedBy,
        metadata: nextMetadata,
        updated_at: nowIso,
      })
      .eq('id', ticket.id)
      .select()
      .maybeSingle()
  );

  if (res.error?.code === '23505') {
    return { conflict: true };
  }

  // Fallback if SQL migration adding unique_code column hasn't been executed yet
  if (isMissingColumnError(res.error)) {
    res = await queryWithFallback(primarySb, (sb) =>
      sb
        .from('tickets')
        .update({
          metadata: nextMetadata,
          updated_at: nowIso,
        })
        .eq('id', ticket.id)
        .select()
        .maybeSingle()
    );
  }

  if (res.error) {
    return { error: res.error };
  }

  return { ticket: res.data || { ...ticket, unique_code: cleanCode, metadata: nextMetadata } };
}

/**
 * Records a daily entry into ticket_checkins with concurrent-scan idempotency
 */
async function recordDailyCheckin(primarySb, ticketId, activeDay, volunteerName) {
  assertSafeDatabaseMutation(SUPABASE_URL);
  const insertRes = await queryWithFallback(primarySb, (sb) =>
    sb
      .from('ticket_checkins')
      .insert({
        ticket_id: ticketId,
        event_day: activeDay,
        scanned_by: volunteerName,
        gate_location: 'Gate 1 Main',
      })
      .select('id, scanned_at')
      .single()
  );

  if (insertRes.error?.code === '23505') {
    return { alreadyScanned: true };
  }

  if (insertRes.error) {
    return { error: insertRes.error };
  }

  return { checkin: insertRes.data };
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

  // Restrict scanner API strictly to the mobile APK (block website browser origins & non-APK clients)
  const requestOrigin = String(req.headers.origin || '').toLowerCase();
  if (
    requestOrigin.includes('cerebrexiaigims.com') ||
    requestOrigin.includes('vercel.app') ||
    requestOrigin.includes('cerebrexia.in')
  ) {
    return res.status(403).json({
      status: 'ERROR',
      message: 'Gate scanner is disabled on the website. Please use the mobile APK.',
    });
  }

  if (req.headers['x-gate-client'] !== 'cerebrexia-android-apk') {
    return res.status(403).json({
      status: 'ERROR',
      message: 'Gate scanner is restricted to the official Cerebrexia mobile APK.',
    });
  }

  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const body = req.body || {};

  // 1. ACTION: GATE SCANNER LOGIN
  if (body.action === 'login') {
    const loginRate = checkRateLimit(clientIp, 'gate_login', 20, 300000);
    if (!loginRate.allowed) {
      return res.status(429).json({
        success: false,
        message: 'Too many login attempts. Please wait 5 minutes.',
      });
    }

    const { username, password } = body;
    if (verifyGateCredentials(username, password)) {
      const cleanUser = String(username).trim().toLowerCase();
      const exp = Date.now() + SEVEN_DAYS_MS;
      const token = signToken(
        {
          user: cleanUser,
          role: 'GATE_STAFF',
          iat: Date.now(),
          exp,
        },
        GATE_JWT_SECRET
      );

      return res.status(200).json({
        success: true,
        token,
        username: cleanUser,
        expires_at: exp,
        message: 'Gate Scanner login successful.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid Gate ID or Password.',
    });
  }

  // Rate limit: 60 scans per minute per IP
  const rate = checkRateLimit(clientIp, 'gate_checkin', 60, 60000);
  if (!rate.allowed) {
    return res.status(429).json({ status: 'ERROR', message: 'Rate limit exceeded. Please wait a moment.' });
  }

  // Optional terminal API key guard
  const providedGateKey = req.headers['x-gate-api-key'];
  if (providedGateKey && !timingSafeMatch(providedGateKey, GATE_SECRET_KEY)) {
    return res.status(401).json({ status: 'UNAUTHORIZED', message: 'Unauthorized gate scanner terminal.' });
  }

  // Gate staff session token guard (required after login)
  const gateToken =
    req.headers['x-gate-token'] ||
    req.headers['authorization']?.replace(/^Bearer\s+/i, '') ||
    body.gate_token ||
    body.token;

  const decodedSession = verifyToken(gateToken, GATE_JWT_SECRET);
  if (!decodedSession || decodedSession.role !== 'GATE_STAFF') {
    return res.status(401).json({
      status: 'UNAUTHORIZED',
      message: 'Gate login required or session expired. Please sign in again.',
    });
  }

  const { action = 'scan', qr_token, unique_code, gate_volunteer, day_override } = body;

  if (!qr_token || typeof qr_token !== 'string') {
    return res.status(400).json({ status: 'ERROR', message: 'QR token is required' });
  }

  const cleanToken = parseQrToken(qr_token);
  if (!cleanToken || cleanToken.length < 3 || cleanToken.length > 80) {
    return res.status(400).json({ status: 'ERROR', message: 'Malformed QR token' });
  }

  const operatorName = decodedSession.user || gate_volunteer || 'Gate 1 Staff';
  const safeVolunteerName = escapeHtml(String(operatorName).slice(0, 50));
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const activeDay = getEventDay(day_override);

  try {
    // 2. Find ticket in Supabase
    const ticketRes = await queryWithFallback(supabase, (sb) =>
      sb
        .from('tickets')
        .select('*')
        .or(`qr_token.eq.${cleanToken},ticket_number.eq.${cleanToken}`)
        .maybeSingle()
    );

    if (ticketRes.error) {
      console.error('[gate-checkin] Database error:', ticketRes.error.message);
      return res.status(500).json({ status: 'ERROR', message: `Database error searching ticket: ${ticketRes.error.message}` });
    }

    const ticket = ticketRes.data;
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

    const existingUniqueCode = extractUniqueCode(ticket);

    // 3. Check if already scanned today
    const checkinQueryRes = await queryWithFallback(supabase, (sb) =>
      sb
        .from('ticket_checkins')
        .select('id, scanned_at, event_day')
        .eq('ticket_id', ticket.id)
        .eq('event_day', activeDay)
        .maybeSingle()
    );

    if (checkinQueryRes.error && checkinQueryRes.error.code !== 'PGRST116') {
      console.error('[gate-checkin] Checkin query error:', checkinQueryRes.error.message);
    }

    const existingCheckin = checkinQueryRes.data;
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
        attendee: sanitizeAttendeeOutput(ticket, existingUniqueCode),
        event_day: activeDay,
        scanned_at: existingCheckin.scanned_at,
      });
    }

    // 4. Branch based on whether this person ALREADY has a permanent 4-digit number
    if (existingUniqueCode) {
      // Returning attendee (e.g., Day 2 / Day 3 / Day 4): never prompt for or change the number
      const checkinRes = await recordDailyCheckin(supabase, ticket.id, activeDay, safeVolunteerName);
      if (checkinRes.alreadyScanned) {
        return res.status(200).json({
          status: 'ALREADY_SCANNED',
          message: 'ALREADY ENTERED TODAY (Concurrent scan prevented)!',
          attendee: sanitizeAttendeeOutput(ticket, existingUniqueCode),
          event_day: activeDay,
        });
      }
      if (checkinRes.error) {
        console.error('[gate-checkin] Insert error:', checkinRes.error.message);
        return res.status(500).json({ status: 'ERROR', message: 'Failed to record gate scan' });
      }

      return res.status(200).json({
        status: 'ENTRY_GRANTED',
        message: 'VALID ENTRY GRANTED!',
        attendee: sanitizeAttendeeOutput(ticket, existingUniqueCode),
        event_day: activeDay,
        scanned_at: checkinRes.checkin.scanned_at,
        is_new_code: false,
      });
    }

    // 5. Person does NOT have a unique 4-digit number yet
    if (action !== 'assign_and_checkin' && !unique_code) {
      return res.status(200).json({
        status: 'NEEDS_UNIQUE_CODE',
        message: 'Valid BR pass! Assign a unique 4-digit number for this person.',
        attendee: sanitizeAttendeeOutput(ticket, null),
        event_day: activeDay,
        qr_token: cleanToken,
      });
    }

    // Validate the submitted 4-digit number
    const cleanUniqueCode = String(unique_code || '').trim();
    if (!/^\d{4}$/.test(cleanUniqueCode)) {
      return res.status(400).json({
        status: 'INVALID_CODE',
        message: 'Please enter an exact 4-digit number (0000 - 9999).',
        attendee: sanitizeAttendeeOutput(ticket, null),
      });
    }

    // Verify no other person already owns this 4-digit number
    const conflictingOwner = await findConflictingTicket(supabase, cleanUniqueCode, ticket.id);
    if (conflictingOwner) {
      return res.status(409).json({
        status: 'CODE_ALREADY_TAKEN',
        message: `Number ${cleanUniqueCode} is already assigned to ${escapeHtml(conflictingOwner.attendee_name || 'another attendee')} (${conflictingOwner.ticket_number}). Enter a different 4-digit number.`,
        attendee: sanitizeAttendeeOutput(ticket, null),
      });
    }

    // Save the permanent 4-digit number on this ticket
    const saveRes = await saveTicketUniqueCode(supabase, ticket, cleanUniqueCode, safeVolunteerName);
    if (saveRes.conflict) {
      return res.status(409).json({
        status: 'CODE_ALREADY_TAKEN',
        message: `Number ${cleanUniqueCode} was just assigned to another attendee. Please enter a different 4-digit number.`,
        attendee: sanitizeAttendeeOutput(ticket, null),
      });
    }
    if (saveRes.error) {
      console.error('[gate-checkin] Failed saving unique code:', saveRes.error.message);
      return res.status(500).json({ status: 'ERROR', message: 'Could not save unique 4-digit number. Please try again.' });
    }

    // Check for concurrent duplicate assignment without column-level unique constraint
    const postCheckConflict = await findConflictingTicket(supabase, cleanUniqueCode, ticket.id);
    if (postCheckConflict) {
      // Revert our write cleanly if a concurrent request wrote the same code into metadata
      await queryWithFallback(supabase, (sb) =>
        sb.from('tickets').update({ metadata: ticket.metadata || {} }).eq('id', ticket.id)
      ).catch(() => {});
      return res.status(409).json({
        status: 'CODE_ALREADY_TAKEN',
        message: `Number ${cleanUniqueCode} is already in use (${postCheckConflict.ticket_number}). Please enter a different 4-digit number.`,
        attendee: sanitizeAttendeeOutput(ticket, null),
      });
    }

    // Record daily check-in now that unique code is bound
    const checkinRes = await recordDailyCheckin(supabase, ticket.id, activeDay, safeVolunteerName);
    if (checkinRes.alreadyScanned) {
      return res.status(200).json({
        status: 'ALREADY_SCANNED',
        message: 'ALREADY ENTERED TODAY (Concurrent scan prevented)!',
        attendee: sanitizeAttendeeOutput(ticket, cleanUniqueCode),
        event_day: activeDay,
      });
    }
    if (checkinRes.error) {
      console.error('[gate-checkin] Insert error:', checkinRes.error.message);
      return res.status(500).json({ status: 'ERROR', message: 'Failed to record gate scan' });
    }

    return res.status(200).json({
      status: 'ENTRY_GRANTED',
      message: `VALID ENTRY GRANTED! Assigned #${cleanUniqueCode}`,
      attendee: sanitizeAttendeeOutput(ticket, cleanUniqueCode),
      event_day: activeDay,
      scanned_at: checkinRes.checkin.scanned_at,
      is_new_code: true,
    });
  } catch (err) {
    console.error('[gate-checkin] Unexpected exception:', err);
    return res.status(500).json({ status: 'ERROR', message: 'Server error during checkin' });
  }
}
