import {
  escapeHtml,
  sanitizeHeader,
  checkRateLimit,
  setSecureCorsHeaders,
  isEmailEnabled,
} from './_security.js';
import { getGmailConfig, createGmailTransporter } from './_email.js';

const TARGET_INBOX = process.env.CONTACT_INBOX_EMAIL || 'cerebrexia26igims@gmail.com';

export default async function handler(req, res) {
  setSecureCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting by client IP
  const clientIp = String(req.headers['x-forwarded-for'] || '').split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(clientIp, 'contact_query', 10, 60 * 1000).allowed) {
    return res.status(429).json({ error: 'Too many queries submitted. Please wait a minute and try again.' });
  }

  // Environment isolation: suppress email dispatch in Preview unless explicitly enabled
  if (!isEmailEnabled()) {
    console.log('[send-contact-query] Outgoing contact query email suppressed in Preview environment (EMAIL_ENABLED is not true).');
    return res.status(200).json({
      success: true,
      suppressed: true,
      message: 'Email dispatch is safely disabled on Preview deployments.',
    });
  }

  const gmail = getGmailConfig();
  if (!gmail.configured) {
    return res.status(500).json({ error: 'Gmail SMTP credentials (GMAIL_USER, GMAIL_APP_PASSWORD) are not configured on the server.' });
  }

  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are all required.' });
    }

    const cleanName = sanitizeHeader(String(name)).slice(0, 100);
    const cleanEmail = sanitizeHeader(String(email)).slice(0, 120);
    const cleanMessage = String(message).slice(0, 2000);

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Invalid email address provided.' });
    }

    const transporter = createGmailTransporter();

    const subject = sanitizeHeader(`[Cerebrexia '26 Query] from ${cleanName}`);

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Query from Cerebrexia '26 Portal</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0406; color: #f4ede4; margin: 0; padding: 20px; }
    .card { max-width: 600px; margin: 0 auto; background: #15080b; border: 1px solid #b3123a; border-radius: 14px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #40040e 0%, #170306 100%); padding: 20px; border-bottom: 2px solid #d4af37; text-align: center; }
    .title { color: #fdfbf7; font-size: 20px; font-weight: 800; margin: 0; letter-spacing: 1px; }
    .body { padding: 24px; }
    .field { margin-bottom: 16px; }
    .label { color: #d4af37; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin-bottom: 4px; }
    .value { font-size: 14px; color: #fff; }
    .msg-box { background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 14px; white-space: pre-wrap; font-size: 13.5px; line-height: 1.6; color: #e4d7cc; }
    .footer { text-align: center; font-size: 11px; color: #71717a; padding: 16px; border-top: 1px solid rgba(255,255,255,0.06); }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2 class="title">CEREBREXIA '26 INQUIRY</h2>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">Sender Name</div>
        <div class="value">${escapeHtml(cleanName)}</div>
      </div>
      <div class="field">
        <div class="label">Sender Email</div>
        <div class="value"><a href="mailto:${escapeHtml(cleanEmail)}" style="color: #d4af37;">${escapeHtml(cleanEmail)}</a></div>
      </div>
      <div class="field">
        <div class="label">Message</div>
        <div class="msg-box">${escapeHtml(cleanMessage)}</div>
      </div>
    </div>
    <div class="footer">
      This message was sent from the official Cerebrexia '26 Referral Desk form.
      <br>To reply, simply reply directly to this email.
    </div>
  </div>
</body>
</html>
    `;

    const plainText = `Cerebrexia '26 Query\n\nFrom: ${cleanName} (${cleanEmail})\n\nMessage:\n${cleanMessage}\n`;

    const mailOptions = {
      from: `"Cerebrexia '26 Portal" <${gmail.user}>`,
      to: TARGET_INBOX,
      replyTo: cleanEmail,
      subject: subject,
      text: plainText,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[send-contact-query] Sent query to', TARGET_INBOX, 'from', cleanEmail, 'MessageId:', info.messageId);

    return res.status(200).json({ success: true, provider: 'gmail_smtp', messageId: info.messageId });
  } catch (error) {
    console.error('[send-contact-query] Error sending contact email:', error);
    return res.status(500).json({ error: 'Failed to send query email. Please try mailto link.' });
  }
}
