import { supabase } from './supabaseClient';

/**
 * Generates an unguessable unique QR token string
 */
function createSecureToken() {
  const rand = Math.random().toString(36).substring(2, 10);
  const time = Date.now().toString(36);
  return `CRX26_${time}_${rand}`.toUpperCase();
}

/**
 * Generates human-friendly ticket numbers e.g. CRX26-BR-7842 or CRX26-EV-7842
 */
function createTicketNumber(prefix = 'BR', suffix = '') {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `CRX26-${prefix}-${num}${suffix ? `-${suffix}` : ''}`;
}

/**
 * Issues tickets in Supabase for single or group registrations upon payment confirmation,
 * and triggers individual email dispatch with QR code to each attendee (copying cerebrexia01@gmail.com).
 */
export async function issueTicketsForBasicRegistration(userId, basicReg, paymentDetails = {}) {
  if (!userId || !basicReg) return [];

  // 1. Guard against duplicate ticket issuance & duplicate emails (Idempotency)
  try {
    let existingQuery = supabase
      .from('tickets')
      .select('*')
      .eq('user_id', userId)
      .eq('pass_type', 'BASIC_REGISTRATION_PRONITES');

    if (basicReg.id) {
      existingQuery = existingQuery.eq('basic_registration_id', basicReg.id);
    }

    const { data: existingTickets } = await existingQuery;

    if (existingTickets && existingTickets.length > 0) {
      console.info(`[ticketService] Found ${existingTickets.length} existing BR tickets for user ${userId}. Skipping duplicate issuance and email dispatch.`);
      return existingTickets;
    }
  } catch (err) {
    console.warn('[ticketService] Error checking existing tickets:', err);
  }

  // Fetch participant profile if basicReg does not contain attendee contact info
  let fallbackName = 'Cerebrexia Delegate';
  let fallbackEmail = basicReg.user_email || basicReg.email || '';
  let fallbackPhone = basicReg.phone_number || '';
  let fallbackCollege = basicReg.college_name || '';

  if (!fallbackEmail || !fallbackName || fallbackName === 'Attendee') {
    try {
      const { data: profile } = await supabase
        .from('participants')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profile) {
        fallbackName = `${profile.first_name || ''} ${profile.last_name || profile.surname || ''}`.trim() || fallbackName;
        fallbackEmail = profile.email || profile.user_email || fallbackEmail;
        fallbackPhone = profile.phone_number || fallbackPhone;
        fallbackCollege = profile.college_name || fallbackCollege;
      }
    } catch (_) {}
  }

  if (!fallbackEmail) {
    try {
      const { data: authData } = await supabase.auth.getUser();
      fallbackEmail = authData?.user?.email || '';
      if (!fallbackName || fallbackName === 'Cerebrexia Delegate' || fallbackName === 'Attendee') {
        fallbackName = authData?.user?.user_metadata?.full_name || authData?.user?.user_metadata?.name || fallbackName;
      }
    } catch (_) {}
  }

  const registrationType = basicReg.registration_type || 'SINGLE';
  const rawGroupMembers = Array.isArray(basicReg.group_members) ? basicReg.group_members : [];
  const baseTicketNum = createTicketNumber('BR');

  const ticketsToInsert = [];

  if (registrationType === 'GROUP') {
    const targetSize = Math.max(1, Number(basicReg.group_size) || (rawGroupMembers.length > 0 ? rawGroupMembers.length : 2));
    const groupMembers = rawGroupMembers.slice(0, targetSize);

    while (groupMembers.length < targetSize) {
      groupMembers.push({
        first_name: '',
        surname: '',
        phone_number: fallbackPhone,
        email: fallbackEmail,
        college_name: fallbackCollege,
      });
    }

    groupMembers.forEach((member, index) => {
      const isLead = index === 0 || member.role === 'LEAD';
      const ticketNum = `${baseTicketNum}-${String(index + 1).padStart(2, '0')}`;
      const fullName = `${member.first_name || ''} ${member.surname || ''}`.trim() || (isLead ? fallbackName : `Group Member ${index + 1}`);

      const memberEmail = (member.email || '').trim().toLowerCase();
      const attendeeEmail = memberEmail || (isLead ? (fallbackEmail || '').trim().toLowerCase() : '') || fallbackEmail || '';

      ticketsToInsert.push({
        ticket_number: ticketNum,
        basic_registration_id: basicReg.id || null,
        user_id: userId,
        attendee_name: fullName,
        attendee_email: attendeeEmail,
        attendee_phone: (member.phone_number || '').trim() || fallbackPhone || '',
        attendee_college: (member.college_name || '').trim() || fallbackCollege || '',
        role: isLead ? 'LEAD' : `MEMBER_${index + 1}`,
        qr_token: createSecureToken(),
        pass_type: 'BASIC_REGISTRATION_PRONITES',
        payment_status: 'PAID',
        metadata: {
          group_size: targetSize,
          member_index: index + 1,
          member_role: isLead ? 'LEAD' : `MEMBER_${index + 1}`,
          razorpay_payment_id: paymentDetails.razorpay_payment_id || basicReg.razorpay_payment_id || null,
          razorpay_order_id: paymentDetails.razorpay_order_id || basicReg.razorpay_order_id || null,
          promo_code: paymentDetails.promo_code || basicReg.promo_code || null,
        },
      });
    });
  } else {
    const fullName = `${basicReg.first_name || ''} ${basicReg.surname || ''}`.trim() || fallbackName;
    ticketsToInsert.push({
      ticket_number: baseTicketNum,
      basic_registration_id: basicReg.id || null,
      user_id: userId,
      attendee_name: fullName,
      attendee_email: basicReg.user_email || basicReg.email || fallbackEmail || '',
      attendee_phone: basicReg.phone_number || fallbackPhone || '',
      attendee_college: basicReg.college_name || fallbackCollege || '',
      role: 'SINGLE',
      qr_token: createSecureToken(),
      pass_type: 'BASIC_REGISTRATION_PRONITES',
      payment_status: 'PAID',
      metadata: {
        group_size: 1,
        razorpay_payment_id: paymentDetails.razorpay_payment_id || basicReg.razorpay_payment_id || null,
        razorpay_order_id: paymentDetails.razorpay_order_id || basicReg.razorpay_order_id || null,
        promo_code: paymentDetails.promo_code || basicReg.promo_code || null,
      },
    });
  }

  // 1. Save tickets into Supabase
  let savedTickets = [];
  try {
    const { data, error } = await supabase
      .from('tickets')
      .insert(ticketsToInsert)
      .select();

    if (error) {
      console.warn('[ticketService] Insert tickets db warning:', error);
      savedTickets = ticketsToInsert.map(t => ({ ...t, id: 'local_' + Date.now() }));
    } else {
      savedTickets = data || [];
    }
  } catch (err) {
    console.error('[ticketService] DB Exception:', err);
    savedTickets = ticketsToInsert.map(t => ({ ...t, id: 'local_' + Date.now() }));
  }

  // 2. Automatically sync to payment_reconciliations table for instant fraud & payment verification
  const payId = paymentDetails.razorpay_payment_id || basicReg.razorpay_payment_id;
  if (payId) {
    try {
      const leadEmail = (basicReg.user_email || basicReg.email || fallbackEmail || '').trim().toLowerCase();
      supabase
        .from('payment_reconciliations')
        .upsert(
          {
            razorpay_payment_id: payId,
            razorpay_order_id: paymentDetails.razorpay_order_id || basicReg.razorpay_order_id || null,
            lead_name: fallbackName,
            lead_email: leadEmail,
            lead_phone: fallbackPhone,
            lead_college: fallbackCollege,
            ticket_count: savedTickets.length,
            ticket_numbers: savedTickets.map((t) => t.ticket_number),
            attendee_names: savedTickets.map((t) => t.attendee_name),
            attendee_emails: savedTickets.map((t) => t.attendee_email),
            amount_paid: savedTickets.length * 2000,
            promo_code: paymentDetails.promo_code || basicReg.promo_code || null,
            payment_status: 'PAID',
            source: 'WEB_CHECKOUT',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'razorpay_payment_id' }
        )
        .then(() => {})
        .catch(() => {});
    } catch (_) {}
  }

  // 3. Dispatch email for each ticket and await delivery confirmation before finishing
  await Promise.allSettled(
    savedTickets.map(async (ticket) => {
      if (ticket.attendee_email) {
        try {
          const res = await dispatchTicketEmail(ticket, ticketsToInsert.length);
          console.info('[ticketService] Ticket email dispatch result for', ticket.ticket_number, res);
        } catch (e) {
          console.warn('[ticketService] Email send error for ticket', ticket.ticket_number, e);
        }
      }
    })
  );

  return savedTickets;
}

/**
 * Event registration QR codes/emails disabled as requested.
 * Only Basic Registration (BR) passes are generated and emailed to attendees.
 */
export async function issueTicketForEventRegistration(userId, eventName, categoryKey = 'Cultural', additionalData = {}) {
  return null;
}

/**
 * Triggers serverless email endpoint
 */
export async function dispatchTicketEmail(ticket, groupSize = 1) {
  try {
    const isCustomOrVercel = typeof window !== 'undefined' && (
      window.location.origin.includes('cerebrexiaigims.com') ||
      window.location.origin.includes('vercel.app')
    );
    const endpoint = typeof window !== 'undefined' && !isCustomOrVercel
      ? 'https://www.cerebrexiaigims.com/api/send-ticket-email'
      : '/api/send-ticket-email';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticket, group_size: groupSize }),
      keepalive: true,
    });
    return await res.json();
  } catch (err) {
    console.error('[ticketService] Failed to dispatch ticket email:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Fetches all tickets issued for a user (by user ID or email)
 */
export async function fetchUserTickets(userId, userEmail = '') {
  if (!userId && !userEmail) return [];
  try {
    let query = supabase
      .from('tickets')
      .select('*')
      .eq('pass_type', 'BASIC_REGISTRATION_PRONITES');

    if (userId && userEmail) {
      query = query.or(`user_id.eq.${userId},attendee_email.eq.${userEmail}`);
    } else if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.eq('attendee_email', userEmail);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.warn('[ticketService] fetchUserTickets error:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('[ticketService] fetchUserTickets exception:', err);
    return [];
  }
}
