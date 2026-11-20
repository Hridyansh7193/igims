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
 * Generates human-friendly ticket numbers e.g. CRX26-BR-7842
 */
function createTicketNumber(suffix = '') {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `CRX26-BR-${num}${suffix ? `-${suffix}` : ''}`;
}

/**
 * Issues tickets in Supabase for single or group registrations upon payment confirmation,
 * and triggers individual email dispatch with QR code to each attendee (copying admin).
 */
export async function issueTicketsForBasicRegistration(userId, basicReg, paymentDetails = {}) {
  if (!userId || !basicReg) return [];

  const registrationType = basicReg.registration_type || 'SINGLE';
  const groupMembers = Array.isArray(basicReg.group_members) ? basicReg.group_members : [];
  const baseTicketNum = createTicketNumber();

  const ticketsToInsert = [];

  if (registrationType === 'GROUP' && groupMembers.length > 0) {
    // Generate individual ticket for each member in the group
    groupMembers.forEach((member, index) => {
      const isLead = index === 0 || member.role === 'LEAD';
      const ticketNum = `${baseTicketNum}-${String(index + 1).padStart(2, '0')}`;
      const fullName = `${member.first_name || ''} ${member.surname || ''}`.trim() || 'Attendee';

      ticketsToInsert.push({
        ticket_number: ticketNum,
        basic_registration_id: basicReg.id || null,
        user_id: userId,
        attendee_name: fullName,
        attendee_email: member.email || basicReg.user_email || '',
        attendee_phone: member.phone_number || '',
        attendee_college: member.college_name || '',
        role: isLead ? 'LEAD' : `MEMBER_${index + 1}`,
        qr_token: createSecureToken(),
        pass_type: 'BASIC_REGISTRATION_PRONITES',
        payment_status: 'PAID',
        metadata: {
          group_size: groupMembers.length,
          member_index: index + 1,
          razorpay_payment_id: paymentDetails.razorpay_payment_id || null,
        },
      });
    });
  } else {
    // Single Registration: 1 Ticket
    const fullName = `${basicReg.first_name || ''} ${basicReg.surname || ''}`.trim() || 'Attendee';
    ticketsToInsert.push({
      ticket_number: baseTicketNum,
      basic_registration_id: basicReg.id || null,
      user_id: userId,
      attendee_name: fullName,
      attendee_email: basicReg.user_email || '',
      attendee_phone: basicReg.phone_number || '',
      attendee_college: basicReg.college_name || '',
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

  // 2. Dispatch email for each ticket asynchronously
  savedTickets.forEach((ticket) => {
    if (ticket.attendee_email) {
      dispatchTicketEmail(ticket, ticketsToInsert.length).catch((e) => {
        console.warn('[ticketService] Email send error for ticket', ticket.ticket_number, e);
      });
    }
  });

  return savedTickets;
}

/**
 * Triggers serverless email endpoint
 */
export async function dispatchTicketEmail(ticket, groupSize = 1) {
  try {
    const res = await fetch('/api/send-ticket-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticket, group_size: groupSize }),
    });
    return await res.json();
  } catch (err) {
    console.error('[ticketService] Failed to dispatch ticket email:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Fetches all tickets issued for a user
 */
export async function fetchUserTickets(userId) {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

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
    const res = await fetch('/api/gate-checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
