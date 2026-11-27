// Shared server-side Basic Registration (BR) finalizer.
// Used by api/verify-event-payment.js (browser checkout & manual verification),
// api/razorpay-webhook.js (dropped tabs / UPI redirects / payment links),
// and api/portal-booking.js (one-click Razorpay recovery).
import crypto from 'crypto';
import { assertSafeDatabaseMutation } from './_security.js';
import { sendTicketEmailDirect } from './_ticketEmail.js';

function createSecureToken() {
  const rand = crypto.randomBytes(5).toString('hex');
  const time = Date.now().toString(36);
  return `CRX26_${time}_${rand}`.toUpperCase();
}

function createTicketNumber(prefix = 'BR', suffix = '') {
  const num = crypto.randomInt(100000, 1000000);
  return `CRX26-${prefix}-${num}${suffix ? `-${suffix}` : ''}`;
}

function splitName(fullName, email) {
  const raw = String(fullName || '').trim();
  if (raw) {
    const parts = raw.split(/\s+/);
    return {
      first_name: parts[0].slice(0, 100),
      last_name: (parts.slice(1).join(' ') || 'Delegate').slice(0, 100),
    };
  }
  const localPart = String(email || 'Delegate').split('@')[0] || 'Delegate';
  return {
    first_name: localPart.slice(0, 100),
    last_name: 'Delegate',
  };
}

/**
 * Pre-loads Supabase auth user IDs keyed by lowercase email once per batch so
 * bulk reconciliation doesn't call `auth.admin.listUsers` per attendee.
 */
export async function buildAuthUserEmailMap(db) {
  const emailMap = new Map();
  if (!db?.auth?.admin?.listUsers) return emailMap;
  try {
    let page = 1;
    while (page <= 5) {
      const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
      if (error || !data?.users?.length) break;
      for (const u of data.users) {
        const em = String(u?.email || '').trim().toLowerCase();
        if (em && u?.id) emailMap.set(em, u.id);
      }
      if (data.users.length < 200) break;
      page += 1;
    }
  } catch (_) {}
  return emailMap;
}

/**
 * Safely finds an existing Supabase auth user_id by email when notes lacked user_id.
 */
async function lookupAuthUserIdByEmail(db, email, authUserEmailMap = null) {
  if (!email) return null;
  const target = email.trim().toLowerCase();
  if (authUserEmailMap instanceof Map) {
    return authUserEmailMap.get(target) || null;
  }
  if (!db?.auth?.admin?.listUsers) return null;
  try {
    let page = 1;
    while (page <= 5) {
      const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
      if (error || !data?.users?.length) break;
      const found = data.users.find((u) => (u.email || '').trim().toLowerCase() === target);
      if (found?.id) return found.id;
      if (data.users.length < 200) break;
      page += 1;
    }
  } catch (_) {}
  return null;
}

/**
 * Idempotently records a paid Basic Registration in Supabase (`participants`,
 * `basic_registrations`, `tickets`, `payment_reconciliations`) and emails QR passes.
 *
 * @param {object} db - Supabase client (service role preferred; falls back to user token client)
 * @param {object} opts
 * @param {object} opts.payment - Razorpay payment object (id, order_id, amount, email, contact, notes)
 * @param {object} [opts.order] - Optional Razorpay order object
 * @param {string} [opts.userIdHint] - Authenticated user_id if known
 * @param {object} [opts.brPayload] - Optional pending registration payload (group_members, etc.)
 * @param {boolean} [opts.sendEmail=true] - Whether to dispatch QR pass emails for newly created tickets
 * @param {Map<string, string>} [opts.authUserEmailMap] - Optional preloaded lowercase email -> user_id map
 * @param {object} [opts.transporter] - Optional shared pooled Nodemailer transporter
 */
export async function finalizeBasicRegistration(
  db,
  { payment, order = null, userIdHint = null, brPayload = null, sendEmail = true, authUserEmailMap = null, transporter = null }
) {
  assertSafeDatabaseMutation(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL);

  const paymentId = String(payment?.id || '').trim();
  if (!paymentId) {
    throw new Error('Missing Razorpay payment ID');
  }
  const orderId = order?.id || payment?.order_id || null;
  const notes = {
    ...(payment?.notes && typeof payment.notes === 'object' ? payment.notes : {}),
    ...(order?.notes && typeof order.notes === 'object' ? order.notes : {}),
  };

  // 1. Check idempotency: have tickets already been issued for this exact Razorpay payment?
  try {
    const { data: existingByPay } = await db
      .from('tickets')
      .select('*')
      .contains('metadata', { razorpay_payment_id: paymentId });

    if (Array.isArray(existingByPay) && existingByPay.length > 0) {
      // Still ensure participant & basic_registration exist and are marked PAID
      const firstTicket = existingByPay[0];
      const fallbackEmail = String(firstTicket.attendee_email || notes.email || payment?.email || '').trim().toLowerCase();
      let linkedUid = firstTicket.user_id || userIdHint || notes.user_id || null;
      if (!linkedUid && fallbackEmail) {
        linkedUid = await lookupAuthUserIdByEmail(db, fallbackEmail, authUserEmailMap);
      }

      const repairIso = new Date().toISOString();
      if (linkedUid) {
        try {
          await db.from('participants').update({ payment_status: 'PAID', updated_at: repairIso }).eq('user_id', linkedUid);
        } catch (_) {}
        try {
          const amountInr = Number.isFinite(Number(payment?.amount)) ? Math.round(Number(payment.amount) / 100) : 2000;
          await db.from('basic_registrations').upsert(
            {
              user_id: linkedUid,
              pass_type: 'CONCERT_PRONITES',
              fee_amount: amountInr,
              final_amount: amountInr,
              payment_status: 'PAID',
              razorpay_payment_id: paymentId,
              ...(orderId ? { razorpay_order_id: orderId } : {}),
              updated_at: repairIso,
            },
            { onConflict: 'user_id' }
          );
        } catch (_) {}
      } else if (fallbackEmail) {
        try {
          await db.from('participants').update({ payment_status: 'PAID', updated_at: repairIso }).ilike('email', fallbackEmail);
        } catch (_) {}
      }
      return {
        alreadyRecorded: true,
        tickets: existingByPay,
        emailsSent: 0,
        userId: linkedUid,
        email: fallbackEmail,
        name: firstTicket.attendee_name || '',
      };
    }
  } catch (_) {}

  // 2. Resolve identity fields across notes, brPayload, Razorpay payment, and database
  let cleanEmail = String(
    brPayload?.email ||
    brPayload?.user_email ||
    notes.email ||
    payment?.email ||
    ''
  ).trim().toLowerCase();

  let userId = userIdHint || brPayload?.user_id || notes.user_id || null;

  // Look up existing participant by user_id or email
  let participant = null;
  if (userId) {
    const { data } = await db.from('participants').select('*').eq('user_id', userId).maybeSingle();
    participant = data || null;
  }
  if (!participant && cleanEmail) {
    const { data } = await db.from('participants').select('*').ilike('email', cleanEmail).limit(1).maybeSingle();
    if (data) {
      participant = data;
      if (!userId && data.user_id) userId = data.user_id;
    }
  }
  if (!userId && cleanEmail) {
    userId = await lookupAuthUserIdByEmail(db, cleanEmail, authUserEmailMap);
    if (userId && !participant) {
      const { data } = await db.from('participants').select('*').eq('user_id', userId).maybeSingle();
      participant = data || null;
    }
  }

  if (!cleanEmail && participant?.email) {
    cleanEmail = String(participant.email).trim().toLowerCase();
  }

  // Load any existing basic_registration row for this user
  let existingBr = null;
  if (userId) {
    const { data } = await db.from('basic_registrations').select('*').eq('user_id', userId).maybeSingle();
    existingBr = data || null;
  }

  const rawName =
    [participant?.first_name, participant?.last_name].filter(Boolean).join(' ').trim() ||
    [brPayload?.first_name, brPayload?.surname || brPayload?.last_name].filter(Boolean).join(' ').trim() ||
    notes.name ||
    payment?.description ||
    '';
  const nameParts = splitName(rawName, cleanEmail);
  const fullName = `${nameParts.first_name} ${nameParts.last_name}`.trim();

  const rawPhone = String(
    participant?.phone_number ||
    brPayload?.phone_number ||
    notes.phone ||
    payment?.contact ||
    ''
  ).replace(/[^\d+]/g, '').slice(0, 15) || '0000000000';

  const collegeName = String(
    participant?.college_name ||
    brPayload?.college_name ||
    notes.college ||
    'Cerebrexia Delegate'
  ).trim().slice(0, 200);

  const collegeCity = String(
    participant?.college_city ||
    brPayload?.college_city ||
    brPayload?.city_of_college ||
    'Patna'
  ).trim().slice(0, 100);

  const collegeState = String(
    participant?.college_state ||
    brPayload?.college_state ||
    brPayload?.state_of_college ||
    'Bihar'
  ).trim().slice(0, 100);

  const amountPaidInr = Number.isFinite(Number(payment?.amount))
    ? Math.round(Number(payment.amount) / 100)
    : Number(brPayload?.final_amount ?? existingBr?.final_amount ?? notes.final_amount ?? 2000);

  const promoCode = brPayload?.promo_code || existingBr?.promo_code || notes.promo_code || null;
  const discountAmount = Number(brPayload?.discount_amount ?? existingBr?.discount_amount ?? notes.discount_amount ?? 0) || 0;
  const groupMembers = Array.isArray(brPayload?.group_members) && brPayload.group_members.length > 0
    ? brPayload.group_members
    : (Array.isArray(existingBr?.group_members) ? existingBr.group_members : []);
  const registrationType = brPayload?.registration_type || existingBr?.registration_type || notes.registration_type || (groupMembers.length > 1 ? 'GROUP' : 'SINGLE');
  const groupSize = Math.max(1, Number(brPayload?.group_size || existingBr?.group_size || notes.group_size || (groupMembers.length > 0 ? groupMembers.length : 1)) || 1);

  const nowIso = new Date().toISOString();

  // 3. Ensure `participants` row exists and is marked PAID
  if (participant?.id) {
    const { data: updatedP } = await db
      .from('participants')
      .update({
        payment_status: 'PAID',
        updated_at: nowIso,
      })
      .eq('id', participant.id)
      .select()
      .maybeSingle();
    if (updatedP) participant = updatedP;
  } else {
    const insertPayload = {
      ...(userId ? { user_id: userId } : {}),
      email: cleanEmail || `delegate_${paymentId}@cerebrexiaigims.com`,
      first_name: nameParts.first_name,
      last_name: nameParts.last_name,
      phone_number: rawPhone,
      college_name: collegeName,
      college_city: collegeCity,
      college_state: collegeState,
      payment_status: 'PAID',
      reminder_sent_count: 0,
      updated_at: nowIso,
    };

    const upsertOpts = userId ? { onConflict: 'user_id' } : undefined;
    const query = upsertOpts
      ? db.from('participants').upsert(insertPayload, upsertOpts)
      : db.from('participants').insert(insertPayload);

    const { data: savedP, error: pErr } = await query.select().maybeSingle();
    if (pErr) {
      console.warn('[finalizeBR] participants save warning:', pErr.message);
    } else if (savedP) {
      participant = savedP;
    }
  }

  // 4. Upsert `basic_registrations` row if we have a user_id (user_id is NOT NULL FK on basic_registrations)
  let savedBr = existingBr;
  if (userId) {
    const brRecord = {
      user_id: userId,
      participant_id: participant?.id || existingBr?.participant_id || null,
      pass_type: 'CONCERT_PRONITES',
      fee_amount: amountPaidInr,
      payment_status: 'PAID',
      registration_type: registrationType,
      group_size: groupSize,
      group_members: groupMembers,
      promo_code: promoCode,
      discount_amount: discountAmount,
      final_amount: amountPaidInr,
      razorpay_payment_id: paymentId,
      ...(orderId ? { razorpay_order_id: orderId } : {}),
      updated_at: nowIso,
    };

    const { data: brData, error: brErr } = await db
      .from('basic_registrations')
      .upsert(brRecord, { onConflict: 'user_id' })
      .select()
      .maybeSingle();

    if (!brErr && brData) {
      savedBr = brData;
    } else if (brErr) {
      console.warn('[finalizeBR] Extended basic_registrations upsert warning:', brErr.message);
      const { data: coreBr } = await db
        .from('basic_registrations')
        .upsert({
          user_id: userId,
          participant_id: participant?.id || null,
          pass_type: 'CONCERT_PRONITES',
          fee_amount: amountPaidInr,
          payment_status: 'PAID',
          updated_at: nowIso,
        }, { onConflict: 'user_id' })
        .select()
        .maybeSingle();
      if (coreBr) savedBr = coreBr;
    }
  }

  // 5. Check if legacy/matching tickets already exist for this user_id + payment
  //    Never reuse tickets that belong to a DIFFERENT razorpay_payment_id (supports multiple BRs on one account)
  let existingTickets = [];
  if (userId) {
    const { data: uidTickets } = await db
      .from('tickets')
      .select('*')
      .eq('user_id', userId)
      .eq('pass_type', 'BASIC_REGISTRATION_PRONITES');
    if (Array.isArray(uidTickets) && uidTickets.length > 0) {
      const matchingOrLegacy = uidTickets.filter((t) => {
        const tPayId = t?.metadata?.razorpay_payment_id;
        return !tPayId || tPayId === paymentId;
      });
      if (matchingOrLegacy.length > 0) {
        existingTickets = matchingOrLegacy;
      }
    }
  }

  let savedTickets = existingTickets;
  let newlyCreated = false;

  if (savedTickets.length === 0) {
    const baseTicketNum = createTicketNumber('BR');
    const ticketsToInsert = [];

    if (registrationType === 'GROUP' && groupSize > 1) {
      const members = groupMembers.slice(0, groupSize);
      while (members.length < groupSize) {
        members.push({
          first_name: '',
          surname: '',
          phone_number: rawPhone,
          email: cleanEmail,
          college_name: collegeName,
        });
      }
      members.forEach((m, index) => {
        const isLead = index === 0 || m.role === 'LEAD';
        const mName = `${m.first_name || ''} ${m.surname || m.last_name || ''}`.trim() || (isLead ? fullName : `Group Member ${index + 1}`);
        const mEmail = (m.email || '').trim().toLowerCase() || cleanEmail;
        ticketsToInsert.push({
          ticket_number: `${baseTicketNum}-${String(index + 1).padStart(2, '0')}`,
          basic_registration_id: savedBr?.id || null,
          user_id: userId || null,
          attendee_name: mName,
          attendee_email: mEmail,
          attendee_phone: (m.phone_number || '').trim() || rawPhone,
          attendee_college: (m.college_name || '').trim() || collegeName,
          role: isLead ? 'LEAD' : `MEMBER_${index + 1}`,
          qr_token: createSecureToken(),
          pass_type: 'BASIC_REGISTRATION_PRONITES',
          payment_status: 'PAID',
          metadata: {
            group_size: groupSize,
            member_index: index + 1,
            member_role: isLead ? 'LEAD' : `MEMBER_${index + 1}`,
            razorpay_payment_id: paymentId,
            razorpay_order_id: orderId,
            promo_code: promoCode,
            source: 'SERVER_VERIFIED',
          },
        });
      });
    } else {
      ticketsToInsert.push({
        ticket_number: baseTicketNum,
        basic_registration_id: savedBr?.id || null,
        user_id: userId || null,
        attendee_name: fullName,
        attendee_email: cleanEmail,
        attendee_phone: rawPhone,
        attendee_college: collegeName,
        role: 'SINGLE',
        qr_token: createSecureToken(),
        pass_type: 'BASIC_REGISTRATION_PRONITES',
        payment_status: 'PAID',
        metadata: {
          group_size: 1,
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          promo_code: promoCode,
          source: 'SERVER_VERIFIED',
        },
      });
    }

    const { data: insertedTickets, error: tErr } = await db
      .from('tickets')
      .insert(ticketsToInsert)
      .select();

    if (tErr) {
      console.error('[finalizeBR] Ticket insert error:', tErr.message);
      throw new Error(`Failed to issue ticket: ${tErr.message}`);
    }
    savedTickets = insertedTickets || [];
    newlyCreated = true;
  }

  // 6. Sync payment_reconciliations
  try {
    await db.from('payment_reconciliations').upsert(
      {
        razorpay_payment_id: paymentId,
        razorpay_order_id: orderId,
        lead_name: fullName,
        lead_email: cleanEmail,
        lead_phone: rawPhone,
        lead_college: collegeName,
        ticket_count: savedTickets.length,
        ticket_numbers: savedTickets.map((t) => t.ticket_number),
        attendee_names: savedTickets.map((t) => t.attendee_name),
        attendee_emails: savedTickets.map((t) => t.attendee_email),
        amount_paid: amountPaidInr,
        promo_code: promoCode,
        payment_status: 'PAID',
        source: 'SERVER_VERIFIED',
        updated_at: nowIso,
      },
      { onConflict: 'razorpay_payment_id' }
    );
  } catch (recErr) {
    console.warn('[finalizeBR] reconciliation upsert warning:', recErr.message);
  }

  // 7. Dispatch QR pass email(s) directly via Gmail SMTP for newly created tickets
  let emailsSent = 0;
  if (sendEmail && newlyCreated && savedTickets.length > 0) {
    const results = await Promise.allSettled(
      savedTickets
        .filter((t) => t.attendee_email && t.attendee_email.includes('@'))
        .map((t) => sendTicketEmailDirect(t, savedTickets.length, { transporter }))
    );
    emailsSent = results.filter((r) => r.status === 'fulfilled' && r.value?.success && !r.value?.suppressed).length;
  }

  return {
    alreadyRecorded: false,
    userId,
    participantId: participant?.id || null,
    basicRegistrationId: savedBr?.id || null,
    tickets: savedTickets,
    emailsSent,
    email: cleanEmail,
    name: fullName,
  };
}
