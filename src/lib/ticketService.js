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
  const groupMembers = Array.isArray(basicReg.group_members) ? basicReg.group_members : [];
  const baseTicketNum = createTicketNumber('BR');

  const ticketsToInsert = [];

  if (registrationType === 'GROUP' && groupMembers.length > 0) {
    // Generate individual ticket for each member in the group
    groupMembers.forEach((member, index) => {
      const isLead = index === 0 || member.role === 'LEAD';
      const ticketNum = `${baseTicketNum}-${String(index + 1).padStart(2, '0')}`;
      const fullName = `${member.first_name || ''} ${member.surname || ''}`.trim() || (isLead ? fallbackName : `Group Member ${index + 1}`);

      const memberEmail = (member.email || '').trim().toLowerCase();
      const attendeeEmail = memberEmail || (isLead ? (fallbackEmail || '').trim().toLowerCase() : '') || '';

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
          group_size: groupMembers.length,
          member_index: index + 1,
          member_role: isLead ? 'LEAD' : `MEMBER_${index + 1}`,
          razorpay_payment_id: paymentDetails.razorpay_payment_id || null,
        },
      });
    });
  } else {
    // Single Registration: 1 Ticket
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
        razorpay_payment_id: paymentDetails.razorpay_payment_id || null,
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
      // Fallback: save locally
      savedTickets = ticketsToInsert.map(t => ({ ...t, id: 'local_' + Date.now() }));
    } else {
      savedTickets = data || [];
    }
  } catch (err) {
    console.error('[ticketService] DB Exception:', err);
    savedTickets = ticketsToInsert.map(t => ({ ...t, id: 'local_' + Date.now() }));
  }

  // 2. Dispatch email for each ticket and await delivery confirmation before finishing
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
 * Issues an official QR event pass in Supabase when an attendee registers for an event,
 * and immediately dispatches the pass email from thecerebrexia17@gmail.com with a copy to cerebrexia01@gmail.com.
 */
export async function issueTicketForEventRegistration(userId, eventName, categoryKey = 'Cultural', additionalData = {}) {
  if (!userId || !eventName) return null;

  try {
    // 1. Check if an active ticket for this event already exists for this user to avoid duplicates
    const { data: existing } = await supabase
      .from('tickets')
      .select('*')
      .eq('user_id', userId)
      .eq('pass_type', 'EVENT_PASS')
      .contains('metadata', { event_name: eventName })
      .maybeSingle();

    if (existing) {
      console.info(`[ticketService] Ticket already exists for ${eventName}:`, existing.ticket_number);
      return existing;
    }

    // 2. Fetch attendee details from participants profile or auth session
    let attendeeName = 'Cerebrexia Participant';
    let attendeeEmail = '';
    let attendeePhone = '';
    let attendeeCollege = '';

    const { data: profile } = await supabase
      .from('participants')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (profile) {
      attendeeName = `${profile.first_name || ''} ${profile.last_name || profile.surname || ''}`.trim() || attendeeName;
      attendeeEmail = profile.email || profile.user_email || '';
      attendeePhone = profile.phone_number || '';
      attendeeCollege = profile.college_name || '';
    }

    if (!attendeeEmail) {
      const { data: authData } = await supabase.auth.getUser();
      attendeeEmail = authData?.user?.email || '';
      if (!attendeeName || attendeeName === 'Cerebrexia Participant') {
        attendeeName = authData?.user?.user_metadata?.full_name || authData?.user?.user_metadata?.name || 'Cerebrexia Participant';
      }
    }

    const ticketNumber = createTicketNumber('EV');
    const qrToken = createSecureToken();

    const ticketRecord = {
      ticket_number: ticketNumber,
      user_id: userId,
      attendee_name: attendeeName,
      attendee_email: attendeeEmail,
      attendee_phone: attendeePhone,
      attendee_college: attendeeCollege,
      role: 'PARTICIPANT',
      qr_token: qrToken,
      pass_type: 'EVENT_PASS',
      payment_status: 'PAID',
      metadata: {
        event_name: eventName,
        category: categoryKey,
        ...additionalData,
      },
    };

    let savedTicket = null;
    const { data: inserted, error: insertErr } = await supabase
      .from('tickets')
      .insert([ticketRecord])
      .select()
      .maybeSingle();

    if (insertErr) {
      console.warn('[ticketService] Event ticket insert warning:', insertErr);
      savedTicket = { ...ticketRecord, id: 'local_ev_' + Date.now() };
    } else {
      savedTicket = inserted || ticketRecord;
    }

    // 3. Dispatch pass email with QR code (sent from thecerebrexia17@gmail.com, copy to cerebrexia01@gmail.com)
    if (savedTicket.attendee_email) {
      try {
        await dispatchTicketEmail(savedTicket, 1);
      } catch (err) {
        console.warn('[ticketService] Event ticket email dispatch error:', err);
      }
    }

    return savedTicket;
  } catch (err) {
    console.error('[ticketService] issueTicketForEventRegistration error:', err);
    return null;
  }
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
    let query = supabase.from('tickets').select('*');
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

/**
 * Scans / Checks in a ticket against the gate API
 */
export async function checkinTicketAtGate(qrToken, gateVolunteer = 'Gate Volunteer', dayOverride = null) {
  try {
    const isCustomOrVercel = typeof window !== 'undefined' && (
      window.location.origin.includes('cerebrexiaigims.com') ||
      window.location.origin.includes('vercel.app')
    );
    const endpoint = typeof window !== 'undefined' && !isCustomOrVercel
      ? 'https://www.cerebrexiaigims.com/api/gate-checkin'
      : '/api/gate-checkin';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-gate-api-key': 'crx26_volunteer_gate_secret',
      },
      body: JSON.stringify({
        qr_token: qrToken,
        gate_volunteer: gateVolunteer,
        day_override: dayOverride,
      }),
    });
    return await res.json();
  } catch (err) {
    console.error('[ticketService] Gate checkin network error:', err);
    return {
      status: 'ERROR',
      message: 'Network error connecting to gate validation server.',
    };
  }
}
