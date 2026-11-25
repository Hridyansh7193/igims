import { createClient } from '@supabase/supabase-js';
import {
  escapeHtml,
  sanitizeAlphaNumDash,
  timingSafeMatch,
  signToken,
  verifyToken,
  checkRateLimit,
  setSecureCorsHeaders,
  getCleanSupabaseKey,
  assertSafeDatabaseMutation,
} from './_security.js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const rawKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

const SUPABASE_KEY = getCleanSupabaseKey(rawKey);

const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || (ADMIN_PASSWORD ? `${ADMIN_PASSWORD}_secure_crx26_salt` : null);

function verifyCredentials(user, pass) {
  if (!user || !pass || typeof user !== 'string' || typeof pass !== 'string') return false;
  if (!ADMIN_PASSWORD) return false;
  const normalizedUser = user.trim().toLowerCase();

  const isUserValid = timingSafeMatch(normalizedUser, ADMIN_USERNAME) || timingSafeMatch(normalizedUser, 'cerebrexia');
  const isPassValid = timingSafeMatch(pass, ADMIN_PASSWORD);

  return isUserValid && isPassValid;
}

export default async function handler(req, res) {
  setSecureCorsHeaders(req, res, 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Database service is not configured on the server.' });
  }
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // 1. PUBLIC VALIDATION (Used by attendees at checkout)
  if (req.method === 'POST' && req.body?.action === 'validate') {
    // Rate limit: max 30 validations per minute per IP to prevent code enumeration
    const rate = checkRateLimit(clientIp, 'promo_validate', 30, 60000);
    if (!rate.allowed) {
      return res.status(429).json({ valid: false, message: 'Too many requests. Please wait a moment.' });
    }

    const rawCode = sanitizeAlphaNumDash(req.body?.code || '').toUpperCase();
    if (!rawCode || rawCode.length < 2 || rawCode.length > 30) {
      return res.status(400).json({ valid: false, message: 'Please enter a valid coupon code.' });
    }

    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('id, code, discount_percent, description, is_active, max_uses, times_used')
        .eq('code', rawCode)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('[admin-promo-codes] Validation error:', error.message);
        return res.status(500).json({ valid: false, message: 'Could not verify coupon. Try again.' });
      }

      if (!data) {
        return res.status(200).json({ valid: false, message: 'Invalid or inactive coupon code.' });
      }

      if (data.max_uses && data.times_used >= data.max_uses) {
        return res.status(200).json({ valid: false, message: 'This coupon code has reached its maximum usage limit.' });
      }

      return res.status(200).json({
        valid: true,
        promo: {
          code: data.code,
          type: 'percent',
          value: Number(data.discount_percent),
          label: `${data.discount_percent}% Discount`,
          description: escapeHtml(data.description) || `${data.discount_percent}% off on registration`,
        },
        message: `${data.discount_percent}% discount code applied successfully!`,
      });
    } catch (err) {
      console.error('[admin-promo-codes] Validation exception:', err);
      return res.status(500).json({ valid: false, message: 'Server error verifying coupon.' });
    }
  }

  // 2. ADMIN LOGIN
  if (req.method === 'POST' && req.body?.action === 'login') {
    // Rate limit: max 10 failed login attempts per 5 minutes per IP to prevent brute-force attacks
    const rate = checkRateLimit(clientIp, 'admin_login', 10, 300000);
    if (!rate.allowed) {
      return res.status(429).json({ success: false, message: 'Too many login attempts. Please wait 5 minutes.' });
    }

    const { username, password } = req.body;
    if (verifyCredentials(username, password)) {
      // 24-hour token expiry with HMAC-SHA256 signature
      const token = signToken(
        {
          user: String(username).trim().toLowerCase(),
          role: 'ADMIN',
          iat: Date.now(),
          exp: Date.now() + 24 * 60 * 60 * 1000,
        },
        ADMIN_JWT_SECRET
      );

      return res.status(200).json({
        success: true,
        token,
        username: String(username).trim().toLowerCase(),
        message: 'Admin authentication successful',
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid admin username or password' });
  }

  // 3. AUTHENTICATION GUARD FOR ADMIN OPERATIONS
  const token = req.headers['x-admin-token'] || req.body?.token;
  const decodedSession = verifyToken(token, ADMIN_JWT_SECRET);
  const isDirectAuthed = verifyCredentials(req.body?.admin_username, req.body?.admin_password);

  if (!decodedSession && !isDirectAuthed) {
    return res.status(401).json({ error: 'Unauthorized: Valid admin credentials or session required.' });
  }

  // 4. GET: List all promo codes (active and inactive)
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[admin-promo-codes] Fetch error:', error.message);
        return res.status(500).json({ error: 'Failed to fetch promo codes' });
      }
      return res.status(200).json({ promoCodes: data || [] });
    } catch (err) {
      console.error('[admin-promo-codes] Fetch exception:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // 5. POST: Admin mutations
  if (req.method === 'POST') {
    try {
      assertSafeDatabaseMutation(SUPABASE_URL);
    } catch (isolationErr) {
      return res.status(isolationErr.statusCode || 403).json({ error: isolationErr.message });
    }

    const { action } = req.body || {};

    // CREATE PROMO CODE
    if (action === 'create') {
      const rawCode = sanitizeAlphaNumDash(req.body.code || '').toUpperCase();
      const discountPercent = parseFloat(req.body.discount_percent);
      const description = escapeHtml(String(req.body.description || '').trim()).slice(0, 200);
      const maxUses = req.body.max_uses ? parseInt(req.body.max_uses, 10) : null;

      if (!rawCode || rawCode.length < 2 || rawCode.length > 30) {
        return res.status(400).json({ error: 'Promo code must be 2-30 alphanumeric characters.' });
      }
      if (isNaN(discountPercent) || discountPercent <= 0 || discountPercent > 100) {
        return res.status(400).json({ error: 'Discount percentage must be a number between 0.01% and 100%.' });
      }
      if (maxUses !== null && (isNaN(maxUses) || maxUses <= 0)) {
        return res.status(400).json({ error: 'Max uses must be a positive number if provided.' });
      }

      try {
        const { data, error } = await supabase
          .from('promo_codes')
          .insert([
            {
              code: rawCode,
              discount_percent: discountPercent,
              description,
              is_active: true,
              max_uses: maxUses,
              times_used: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            return res.status(400).json({ error: `Promo code "${rawCode}" already exists.` });
          }
          console.error('[admin-promo-codes] Insert error:', error.message);
          return res.status(500).json({ error: 'Database error creating promo code.' });
        }

        return res.status(201).json({ success: true, promoCode: data });
      } catch (err) {
        console.error('[admin-promo-codes] Insert exception:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    // DELETE PROMO CODE
    if (action === 'delete') {
      const id = sanitizeAlphaNumDash(req.body.id || '');
      if (!id) {
        return res.status(400).json({ error: 'Valid promo code ID is required.' });
      }

      try {
        const { error } = await supabase
          .from('promo_codes')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('[admin-promo-codes] Delete error:', error.message);
          return res.status(500).json({ error: 'Database error deleting promo code.' });
        }

        return res.status(200).json({ success: true, message: 'Promo code removed successfully.' });
      } catch (err) {
        console.error('[admin-promo-codes] Delete exception:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    // TOGGLE PROMO CODE (Active / Inactive)
    if (action === 'toggle') {
      const id = sanitizeAlphaNumDash(req.body.id || '');
      const isActive = Boolean(req.body.is_active);

      if (!id) {
        return res.status(400).json({ error: 'Valid promo code ID is required.' });
      }

      try {
        const { data, error } = await supabase
          .from('promo_codes')
          .update({ is_active: isActive, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('[admin-promo-codes] Toggle error:', error.message);
          return res.status(500).json({ error: 'Database error updating promo code.' });
        }

        return res.status(200).json({ success: true, promoCode: data });
      } catch (err) {
        console.error('[admin-promo-codes] Toggle exception:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    return res.status(400).json({ error: `Unknown action: ${action}` });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method Not Allowed' });
}
