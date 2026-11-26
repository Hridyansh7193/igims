import nodemailer from 'nodemailer';

/**
 * Resolves Gmail SMTP credentials from environment variables.
 * Strips whitespace from Gmail App Passwords (users often paste 16-char passwords with spaces).
 */
export function getGmailConfig() {
  const user = (process.env.GMAIL_USER || process.env.SMTP_USER || '').trim();
  const pass = (process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || '').replace(/\s+/g, '');
  return {
    user,
    pass,
    configured: Boolean(user && pass),
  };
}

let testTransportFactory = null;

/**
 * Allows automated tests to intercept SMTP transport without sending live emails.
 */
export function setTestTransportFactory(factory) {
  testTransportFactory = typeof factory === 'function' ? factory : null;
}

/**
 * Creates a configured Nodemailer Gmail SMTP SSL transporter (port 465).
 * @param {{ pool?: boolean }} options
 */
export function createGmailTransporter({ pool = false } = {}) {
  const { user, pass, configured } = getGmailConfig();
  if (!configured) {
    throw new Error('Gmail SMTP credentials (GMAIL_USER, GMAIL_APP_PASSWORD) are not configured.');
  }

  const transportConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    ...(pool
      ? {
          pool: true,
          maxConnections: 3,
          rateDelta: 1000,
          rateLimit: 5,
        }
      : {}),
    auth: {
      user,
      pass,
    },
  };

  if (testTransportFactory) {
    return testTransportFactory(transportConfig);
  }

  return nodemailer.createTransport(transportConfig);
}
