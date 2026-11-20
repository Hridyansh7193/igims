import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import { Resend } from 'resend';

const GMAIL_USER = process.env.GMAIL_USER || 'thecerebrexia17@gmail.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = 'thecerebrexia17@gmail.com';

/**
 * Generates high-resolution QR code image as base64 Data URL
 */
async function generateQRDataURL(token) {
  try {
    return await QRCode.toDataURL(token, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 400,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('[QR] Generation error:', err);
    return null;
  }
}

/**
 * Generates styled HTML email for attendee pass
 */
function buildTicketEmailHTML({ attendee_name, attendee_college, ticket_number, qr_data_url, role, group_size }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Cerebrexia '26 Official Entry Pass</title>
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
      <div class="badge">Official Verified Gate Pass</div>
      <h2 class="greeting">Hello, ${attendee_name}!</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #d4c5b9; margin: 0 0 16px;">
        Your Basic Registration (BR) for <strong>Cerebrexia '26</strong> is confirmed. Below is your official entry pass with QR code valid for all 4 festival days (17, 18, 19, and 20 December 2026).
      </p>

      <!-- QR Card -->
      <div class="qr-card">
        <img class="qr-img" src="${qr_data_url}" alt="Gate Pass QR Code" />
        <div class="ticket-id">${ticket_number}</div>
        <p style="font-size: 11px; color: #555; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 0.8px;">
          Scannable once per day &bull; Dec 17&ndash;20, 2026
        </p>
      </div>

      <!-- Attendee Details -->
      <table class="info-table">
        <tr>
          <td class="info-label">Pass Holder</td>
          <td class="info-value">${attendee_name}</td>
        </tr>
        <tr>
          <td class="info-label">College</td>
          <td class="info-value">${attendee_college || 'Not specified'}</td>
        </tr>
        <tr>
          <td class="info-label">Access Level</td>
          <td class="info-value">Pronites &amp; Star Nights (4 Days)</td>
        </tr>
        <tr>
          <td class="info-label">Registration</td>
          <td class="info-value">${group_size && group_size > 1 ? `Group Registration (${group_size} Passes)` : 'Single Pass'}</td>
        </tr>
      </table>

      <!-- Gate Rules -->
      <div class="instructions">
        <h4>Gate Entry Guidelines</h4>
        <ul>
          <li><strong>Single Entry Per Day:</strong> This QR code permits entry once on each of the 4 days (17, 18, 19, and 20 December). Once scanned on any day, it cannot be reused until the next day.</li>
          <li><strong>Identity Verification:</strong> You must present your valid physical College Identity Card matching the name on this pass at the gate.</li>
          <li><strong>Do Not Share:</strong> Duplicate scans or screenshots shared with others will be rejected by the scanner system.</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px;">Indira Gandhi Institute of Medical Sciences &bull; Sheikhpura, Patna &ndash; 800014</p>
      <p style="margin: 0;">For queries or support: thecerebrexia17@gmail.com</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * API handler: Dispatches QR Pass email to attendee and copies to admin
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { ticket, group_size } = req.body || {};

  if (!ticket || !ticket.attendee_email || !ticket.qr_token) {
    return res.status(400).json({ error: 'Missing required ticket details' });
  }

  const qrDataUrl = await generateQRDataURL(ticket.qr_token);
  if (!qrDataUrl) {
    return res.status(500).json({ error: 'Failed to generate QR Code' });
  }

  const emailHtml = buildTicketEmailHTML({
    attendee_name: ticket.attendee_name,
    attendee_college: ticket.attendee_college,
    ticket_number: ticket.ticket_number,
    qr_data_url: qrDataUrl,
    role: ticket.role,
    group_size: group_size || 1,
  });

  const emailSubject = `Cerebrexia '26 Entry Pass & QR Code — ${ticket.ticket_number} (${ticket.attendee_name})`;

  // Method 1: Try Gmail SMTP if credentials provided
  if (GMAIL_APP_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: GMAIL_USER,
          pass: GMAIL_APP_PASSWORD,
        },
      });

      // Send to Attendee and BCC admin copy
      const info = await transporter.sendMail({
        from: `"Cerebrexia '26 IGIMS" <${GMAIL_USER}>`,
        to: ticket.attendee_email,
        bcc: ADMIN_EMAIL, // copy sent to thecerebrexia17@gmail.com
        subject: emailSubject,
        html: emailHtml,
      });

      console.log('[send-ticket-email] Sent via Gmail SMTP:', info.messageId);
      return res.status(200).json({ success: true, provider: 'gmail_smtp', messageId: info.messageId });
    } catch (smtpErr) {
      console.error('[send-ticket-email] Gmail SMTP error:', smtpErr);
      // Fallback to Resend if available
    }
  }

  // Method 2: Fallback to Resend if configured
  if (RESEND_API_KEY) {
    try {
      const resend = new Resend(RESEND_API_KEY);
      const resendRes = await resend.emails.send({
        from: 'Cerebrexia <noreply@cerebrexia.in>',
        to: [ticket.attendee_email],
        bcc: [ADMIN_EMAIL],
        subject: emailSubject,
        html: emailHtml,
      });

      console.log('[send-ticket-email] Sent via Resend:', resendRes);
      return res.status(200).json({ success: true, provider: 'resend', data: resendRes });
    } catch (resendErr) {
      console.error('[send-ticket-email] Resend error:', resendErr);
    }
  }

  // If neither provider is authenticated yet, return graceful status with QR data
  return res.status(200).json({
    success: true,
    provider: 'unconfigured_mock',
    message: 'QR generated successfully. To dispatch live emails, add GMAIL_APP_PASSWORD to environment variables.',
    qr_data_url: qrDataUrl,
  });
}
