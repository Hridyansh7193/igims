import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import crypto from 'crypto';

// ── Environment ──────────────────────────────────────────────────────────────
const CRON_SECRET          = process.env.CRON_SECRET;
const SUPABASE_URL         = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY       = process.env.RESEND_API_KEY;
const FROM_ADDRESS         = process.env.REMINDER_FROM || 'Cerebrexia <noreply@cerebrexia.in>';

// HTML entity escaper to eliminate HTML/email injection vulnerabilities
function escapeHtml(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Timing-safe bearer token verification to mitigate timing attacks
function isAuthorized(authHeader, secret) {
  if (!secret || typeof secret !== 'string' || secret.trim().length < 8) return false;
  if (!authHeader || typeof authHeader !== 'string') return false;

  const expected = `Bearer ${secret.trim()}`;
  const headerBuf = Buffer.from(authHeader);
  const expectedBuf = Buffer.from(expected);

  if (headerBuf.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(headerBuf, expectedBuf);
}

// ── Vercel Serverless Handler ────────────────────────────────────────────────
export default async function handler(req, res) {
  // 1. Method restriction (only allow GET or POST triggers)
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Auth guard — verify CRON_SECRET with timing-safe comparison
  if (!CRON_SECRET) {
    console.error('[send-reminders] CRON_SECRET is not configured in environment');
    return res.status(500).json({ error: 'Server misconfiguration: CRON_SECRET is required' });
  }

  const auth = req.headers['authorization'];
  if (!isAuthorized(auth, CRON_SECRET)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 3. Validate runtime environment
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: 'Missing Supabase environment variables' });
  }
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'Missing RESEND_API_KEY environment variable' });
  }

  try {
    // 4. Init clients — service role bypasses RLS
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const resend   = new Resend(RESEND_API_KEY);

    // 5. Fetch unpaid participants: includes both NULL and < 3 reminder counts
    const { data: users, error: fetchErr } = await supabase
      .from('participants')
      .select('id, first_name, email, reminder_sent_count')
      .eq('payment_status', 'PENDING')
      .or('reminder_sent_count.is.null,reminder_sent_count.lt.3')
      .limit(100);

    if (fetchErr) {
      console.error('[send-reminders] Supabase query error:', fetchErr);
      return res.status(500).json({ error: 'Database query failed', details: fetchErr.message });
    }

    if (!users || users.length === 0) {
      return res.status(200).json({ message: 'No pending users to remind', sent: 0 });
    }

    // 6. Build batch email payload with strict HTML escaping
    const emails = users
      .filter((u) => u.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.email))
      .map((u) => {
        const safeName = escapeHtml(u.first_name) || 'Participant';
        return {
          from:    FROM_ADDRESS,
          to:      [u.email.trim().toLowerCase()],
          subject: `⏰ Cerebrexia '26 — Complete Your Registration, ${safeName}!`,
          html: `
            <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;background:#0A0505;color:#f5f0e8;border:1px solid rgba(220,38,38,0.3);border-radius:16px;padding:32px;text-align:center;">
              <img src="https://igims-sand.vercel.app/logo.jpg" alt="Cerebrexia" style="width:80px;border-radius:12px;margin-bottom:16px;" />
              <h1 style="font-size:22px;color:#f5f0e8;margin:0 0 8px;">Hey ${safeName}! 👋</h1>
              <p style="font-size:14px;color:#b0a898;line-height:1.6;margin:0 0 20px;">
                You registered for <strong style="color:#f5f0e8;">Cerebrexia '26</strong> at IGIMS — but your <strong style="color:#DC2626;">₹800 registration fee</strong> is still pending.
              </p>
              <p style="font-size:14px;color:#b0a898;line-height:1.6;margin:0 0 24px;">
                Complete your payment to lock in your spot for all events, pronites, and exclusive festival perks.
              </p>
              <a href="https://igims-sand.vercel.app/" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#DC2626,#991b1b);color:#fff;text-decoration:none;border-radius:10px;font-weight:700;font-size:14px;letter-spacing:0.5px;">
                LOG IN &amp; PAY NOW &rarr;
              </a>
              <p style="font-size:11px;color:#666;margin:24px 0 0;line-height:1.5;">
                If you have already paid, please disregard this email.<br/>
                Questions? Reply to this email or contact the organising committee.
              </p>
            </div>
          `,
        };
      });

    if (emails.length === 0) {
      return res.status(200).json({ message: 'No valid recipient email addresses found', sent: 0 });
    }

    // 7. Send via Resend batch API (single HTTP call for up to 100 emails)
    const { data: batchResult, error: sendErr } = await resend.batch.send(emails);

    if (sendErr) {
      console.error('[send-reminders] Resend batch error:', sendErr);
      return res.status(500).json({ error: 'Email dispatch failed', details: sendErr.message });
    }

    // 8. Increment reminder_sent_count for each notified user
    const updatePromises = users.map((u) =>
      supabase
        .from('participants')
        .update({ reminder_sent_count: (u.reminder_sent_count || 0) + 1 })
        .eq('id', u.id)
    );
    const updateResults = await Promise.allSettled(updatePromises);

    const failedUpdates = updateResults.filter((r) => r.status === 'rejected').length;
    if (failedUpdates > 0) {
      console.warn(`[send-reminders] ${failedUpdates}/${users.length} counter updates failed`);
    }

    return res.status(200).json({
      message: 'Reminders sent successfully',
      sent: emails.length,
      batchId: batchResult?.data?.[0]?.id || null,
      counterUpdateFailures: failedUpdates,
    });
  } catch (err) {
    console.error('[send-reminders] Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
