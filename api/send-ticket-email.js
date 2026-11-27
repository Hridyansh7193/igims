import {
  checkRateLimit,
  setSecureCorsHeaders,
  isEmailEnabled,
} from './_security.js';
import { getGmailConfig } from './_email.js';
import { sendTicketEmailDirect } from './_ticketEmail.js';

/**
 * API handler: Dispatches QR Pass email to attendee via Gmail SMTP.
 */
export default async function handler(req, res) {
  setSecureCorsHeaders(req, res, 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

  // Rate limit: max 30 email dispatches per minute per IP to support group registrations (OWASP A04)
  const rate = checkRateLimit(clientIp, 'send_ticket_email', 30, 60000);
  if (!rate.allowed) {
    return res.status(429).json({ error: 'Too many email requests. Please wait a minute.' });
  }

  // Environment isolation: suppress ticket emails in Preview unless explicitly enabled
  if (!isEmailEnabled()) {
    console.log('[send-ticket-email] Ticket email dispatch suppressed in Preview environment (EMAIL_ENABLED is not true).');
    return res.status(200).json({
      success: true,
      suppressed: true,
      message: 'Ticket email dispatch is safely suppressed on Preview deployments.',
    });
  }

  const gmail = getGmailConfig();
  if (!gmail.configured) {
    return res.status(500).json({ error: 'Gmail SMTP credentials (GMAIL_USER, GMAIL_APP_PASSWORD) are not configured on the server.' });
  }

  const { ticket, group_size } = req.body || {};

  if (!ticket || !ticket.attendee_email || !ticket.qr_token) {
    return res.status(400).json({ error: 'Missing required ticket details' });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const cleanEmail = String(ticket.attendee_email).trim().toLowerCase();
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({ error: 'Invalid recipient email format' });
  }

  const result = await sendTicketEmailDirect(ticket, group_size || 1);
  if (result.success) {
    return res.status(200).json(result);
  }

  return res.status(500).json({
    success: false,
    error: 'Failed to dispatch ticket email via Gmail SMTP',
    details: result.error || 'Email delivery service unavailable',
  });
}
