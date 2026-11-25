import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import { Resend } from 'resend';
import {
  escapeHtml,
  sanitizeHeader,
  checkRateLimit,
  setSecureCorsHeaders,
  isEmailEnabled,
} from './_security.js';

const GMAIL_USER = process.env.GMAIL_USER || process.env.SMTP_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Cerebrexia '26 <onboarding@resend.dev>";

const COPY_EMAIL = process.env.GMAIL_COPY_EMAIL;
const ARCHIVE_EMAIL = process.env.GMAIL_ARCHIVE_EMAIL;

/**
 * Generates high-resolution QR code image as PNG Buffer (for inline attachment)
 */
async function generateQRBuffer(token) {
  try {
    return await QRCode.toBuffer(token, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 450,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('[QR] Buffer generation error:', err);
    return null;
  }
}

/**
 * Generates high-resolution QR code image as base64 Data URL (fallback)
 */
async function generateQRDataURL(token) {
  try {
    return await QRCode.toDataURL(token, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 450,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('[QR] Data URL generation error:', err);
    return null;
  }
}

/**
 * Generates styled HTML email with escaped attendee inputs (OWASP A03: Injection mitigation)
 */
function buildTicketEmailHTML({
  attendee_name,
  attendee_college,
  ticket_number,
  qr_src,
  role,
  group_size,
  pass_type,
  event_name,
  category,
}) {
  const safeName = escapeHtml(attendee_name);
  const safeCollege = escapeHtml(attendee_college || 'Cerebrexia Delegate');
  const safeTicket = escapeHtml(ticket_number);
  const safeEvent = escapeHtml(event_name);
  const safeCategory = escapeHtml(category);

  const isEvent = pass_type === 'EVENT_PASS' || !!event_name;
  const festivalTitle = "Cerebrexia '26";
  const badgeLabel = isEvent
    ? `Official Event Pass &bull; ${safeEvent}`
    : (group_size && group_size > 1 ? `Group Registration (${group_size} Passes)` : `Verified Delegate Pass`);

  const greetingLead = isEvent
    ? `Your registration for <strong>${safeEvent}</strong> (${safeCategory || 'Competitive Event'}) at <strong>${festivalTitle}</strong> is confirmed. Below is your official QR credential for campus access and event reporting.`
    : `Your Basic Registration (BR) for <strong>${festivalTitle}</strong> is confirmed! Below is your official entry pass with scannable QR code valid across all 4 festival days (17, 18, 19, and 20 December 2026).`;

  const accessLevel = isEvent
    ? `${safeEvent} Participation &amp; Campus Access`
    : `Full Pronites &amp; Star Celebrity Nights (All 4 Days: 17, 18, 19, 20 Dec)`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${festivalTitle} Entry Pass — ${safeTicket}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0b0406; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4ede4; }
    .container { max-width: 600px; margin: 30px auto; background: #13070b; border: 1px solid #b3123a; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #40040e 0%, #170306 100%); padding: 30px 24px; text-align: center; border-bottom: 2px solid #d4af37; }
    .title { color: #fdfbf7; font-size: 26px; font-weight: 800; letter-spacing: 2px; margin: 0 0 6px; text-transform: uppercase; }
    .subtitle { color: #d4af37; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; margin: 0; font-weight: 600; }
    .content { padding: 32px 28px; }
    .badge { display: inline-block; background: rgba(212, 175, 55, 0.15); border: 1px solid #d4af37; color: #d4af37; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px; }
    .greeting { font-size: 18px; color: #fff; margin: 0 0 10px; font-weight: 700; }
    .qr-card { background: #ffffff; border-radius: 14px; padding: 24px; text-align: center; margin: 24px 0; border: 3px solid #d4af37; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .qr-img { width: 220px; height: 220px; margin: 0 auto; display: block; }
    .ticket-id { font-family: monospace; font-size: 16px; font-weight: 800; color: #111; letter-spacing: 1px; margin-top: 12px; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .info-table td { padding: 8px 0; font-size: 13.5px; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .info-label { color: #a1a1aa; width: 35%; text-transform: uppercase; font-size: 11px; letter-spacing: 0.8px; }
    .info-value { color: #fff; font-weight: 600; }
    .instructions { background: rgba(179, 18, 58, 0.1); border-left: 4px solid #b3123a; padding: 14px 16px; border-radius: 0 8px 8px 0; margin-top: 24px; }
    .instructions h4 { margin: 0 0 6px; color: #ff8f8f; font-size: 12.5px; text-transform: uppercase; letter-spacing: 1px; }
    .instructions ul { margin: 0; padding-left: 18px; font-size: 12.5px; color: #e4d7cc; line-height: 1.6; }
    .footer { text-align: center; padding: 20px 24px; font-size: 11.5px; color: #71717a; border-top: 1px solid rgba(255,255,255,0.06); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">CEREBREXIA '26</h1>
      <p class="subtitle">The Crowned Diagnosis &bull; IGIMS Patna</p>
    </div>

    <div class="content">
      <div class="badge">${badgeLabel}</div>
      <h2 class="greeting">Hello, ${safeName}!</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #d4c5b9; margin: 0 0 16px;">
        ${greetingLead}
      </p>

      <!-- QR Card -->
      <div class="qr-card">
        <img class="qr-img" src="${qr_src}" alt="Pass QR Code" />
        <div class="ticket-id">${safeTicket}</div>
        <p style="font-size: 11px; color: #555; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 0.8px;">
          ${isEvent ? 'Gate &amp; Event Verification QR' : 'Scannable once per day &bull; 17, 18, 19, 20 Dec 2026'}
        </p>
      </div>

      <!-- Pass Details Table -->
      <table class="info-table">
        <tr>
          <td class="info-label">Pass Holder</td>
          <td class="info-value">${safeName}</td>
        </tr>
        <tr>
          <td class="info-label">College</td>
          <td class="info-value">${safeCollege}</td>
        </tr>
        <tr>
          <td class="info-label">Access Level</td>
          <td class="info-value">${accessLevel}</td>
        </tr>
        ${isEvent ? `
        <tr>
          <td class="info-label">Registered Event</td>
          <td class="info-value">${safeEvent} ${safeCategory ? `(${safeCategory})` : ''}</td>
        </tr>
        ` : `
        <tr>
          <td class="info-label">Registration</td>
          <td class="info-value">${group_size && group_size > 1 ? `Group Registration (${group_size} Passes)` : 'Single Pass'}</td>
        </tr>
        `}
        <tr>
          <td class="info-label">Festival Dates</td>
          <td class="info-value">17, 18, 19, and 20 December 2026</td>
        </tr>
      </table>

      <!-- Gate Guidelines -->
      <div class="instructions">
        <h4>Gate Entry Guidelines</h4>
        <ul>
          <li><strong>Single Entry Per Day:</strong> This QR code permits entry once on each of the 4 festival days (17, 18, 19, and 20 December). Once scanned on any day, it cannot be reused until the next day.</li>
          <li><strong>Identity Verification:</strong> You must present your valid physical College Identity Card matching the name on this pass at the gate.</li>
          <li><strong>Do Not Share:</strong> Duplicate scans or screenshots shared with others will be rejected by the gate scanner.</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px;">Indira Gandhi Institute of Medical Sciences &bull; Sheikhpura, Patna &ndash; 800014</p>
      <p style="margin: 0;">For queries or support: thecerebrexia17@gmail.com &bull; Official Fest Portal: www.cerebrexiaigims.com</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * API handler: Dispatches QR Pass email to attendee and copies cerebrexia01@gmail.com
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

  if (!RESEND_API_KEY && (!GMAIL_USER || !GMAIL_APP_PASSWORD)) {
    return res.status(500).json({ error: 'Email service credentials are not configured on the server.' });
  }

  const { ticket, group_size } = req.body || {};

  if (!ticket || !ticket.attendee_email || !ticket.qr_token) {
    return res.status(400).json({ error: 'Missing required ticket details' });
  }

  // Strict email format validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const cleanEmail = String(ticket.attendee_email).trim().toLowerCase();
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({ error: 'Invalid recipient email format' });
  }

  const isEvent = ticket.pass_type === 'EVENT_PASS' || !!(ticket.metadata && ticket.metadata.event_name);
  const eventName = ticket.metadata?.event_name || '';
  const category = ticket.metadata?.category || '';

  const qrBuffer = await generateQRBuffer(ticket.qr_token);
  const qrDataUrl = await generateQRDataURL(ticket.qr_token);

  if (!qrBuffer && !qrDataUrl) {
    return res.status(500).json({ error: 'Failed to generate QR Code' });
  }

  const emailHtmlCid = buildTicketEmailHTML({
    attendee_name: ticket.attendee_name,
    attendee_college: ticket.attendee_college,
    ticket_number: ticket.ticket_number,
    qr_src: 'cid:gate_pass_qr',
    role: ticket.role,
    group_size: group_size || 1,
    pass_type: ticket.pass_type,
    event_name: eventName,
    category: category,
  });

  const emailHtmlDataUrl = buildTicketEmailHTML({
    attendee_name: ticket.attendee_name,
    attendee_college: ticket.attendee_college,
    ticket_number: ticket.ticket_number,
    qr_src: qrDataUrl,
    role: ticket.role,
    group_size: group_size || 1,
    pass_type: ticket.pass_type,
    event_name: eventName,
    category: category,
  });

  // Sanitize subject line to eliminate CRLF header injection (OWASP A03)
  const rawSubject = isEvent
    ? `Cerebrexia '26 Event Pass: ${eventName} — ${ticket.ticket_number} (${ticket.attendee_name})`
    : `Cerebrexia '26 Entry Pass & QR Code — ${ticket.ticket_number} (${ticket.attendee_name})`;
  const emailSubject = sanitizeHeader(rawSubject);

  const plainText = [
    `Hello ${ticket.attendee_name || 'Attendee'},`,
    '',
    `Your official entry pass for Cerebrexia '26 (${ticket.ticket_number}) is confirmed!`,
    `Pass: ${ticket.pass_type || 'Basic Registration'}`,
    `Access: ${isEvent ? eventName : 'Full Pronites & Star Celebrity Nights (17, 18, 19, 20 Dec 2026)'}`,
    `College: ${ticket.attendee_college || 'Cerebrexia Delegate'}`,
    '',
    `Your official entry QR pass is attached to this email as Pass-${sanitizeHeader(ticket.ticket_number)}.png.`,
    'You can also view and download your QR pass anytime on your dashboard: https://www.cerebrexiaigims.com/#dashboard',
    '',
    'Gate Entry Guidelines:',
    '- 1 scan permitted per day across all 4 festival days (17, 18, 19, and 20 December 2026).',
    '- Please present your physical college ID card matching the name on this pass at the gate.',
    '- Duplicate scans or shared passes will be rejected by the gate scanners.',
    '',
    'Indira Gandhi Institute of Medical Sciences (IGIMS), Sheikhpura, Patna - 800014',
    'Official Festival Portal: www.cerebrexiaigims.com',
  ].join('\n');

  const gmailUser = GMAIL_USER || '';
  const gmailPass = (GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
  const resendKey = RESEND_API_KEY || '';
  const resendFrom = RESEND_FROM_EMAIL || "Cerebrexia '26 <onboarding@resend.dev>";
  const copyEmail = COPY_EMAIL || '';
  const archiveEmail = ARCHIVE_EMAIL || '';

  const bccRecipients = Array.from(new Set([copyEmail, archiveEmail])).filter(Boolean);
  let lastError = null;

  // Method 1: Gmail SMTP (Direct port 465 SSL)
  if (gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

      const mailOptions = {
        from: `"Cerebrexia '26 IGIMS" <${gmailUser}>`,
        to: cleanEmail,
        bcc: bccRecipients,
        subject: emailSubject,
        text: plainText,
        html: emailHtmlCid,
        attachments: qrBuffer ? [
          {
            filename: `Pass-${sanitizeHeader(ticket.ticket_number)}.png`,
            content: qrBuffer,
            cid: 'gate_pass_qr',
          },
        ] : [],
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('[send-ticket-email] Sent via Gmail SMTP to', cleanEmail, 'MessageId:', info.messageId);
      return res.status(200).json({ success: true, provider: 'gmail_smtp', messageId: info.messageId });
    } catch (smtpErr) {
      console.error('[send-ticket-email] Gmail SMTP error:', smtpErr.message);
      lastError = smtpErr.message;
    }
  }

  // Method 2: Resend
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      const resendPayload = {
        from: resendFrom,
        to: [cleanEmail],
        bcc: bccRecipients,
        reply_to: gmailUser,
        subject: emailSubject,
        text: plainText,
        html: emailHtmlDataUrl,
        attachments: qrBuffer ? [
          {
            filename: `Pass-${sanitizeHeader(ticket.ticket_number)}.png`,
            content: qrBuffer.toString('base64'),
          },
        ] : [],
      };

      const resendRes = await resend.emails.send(resendPayload);
      return res.status(200).json({ success: true, provider: 'resend', data: resendRes });
    } catch (resendErr) {
      console.error('[send-ticket-email] Resend error:', resendErr.message);
      lastError = resendErr.message;
    }
  }

  return res.status(500).json({
    success: false,
    error: 'Failed to dispatch ticket email via mail server',
    details: lastError || 'Email delivery service unavailable',
  });
}
