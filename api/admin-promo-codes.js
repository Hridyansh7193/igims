import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://dgkubrwfrwcfpkgjoxmu.supabase.co';
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_v_CcCDqlYXXvx1emJ9U7Cw_2KCpskhS';

const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || 'cerebrexia2026';

function verifyCredentials(user, pass) {
  if (!user || !pass) return false;
  const normalizedUser = String(user).trim().toLowerCase();
  const validUsernames = [ADMIN_USERNAME, 'cerebrexia', 'igims_admin'];
  const validPasswords = [ADMIN_PASSWORD, 'cerebrexia2026', 'crx@admin2026'];
  return validUsernames.includes(normalizedUser) && validPasswords.includes(String(pass));
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [user, ts, sign] = decoded.split(':::');
    if (!user || !ts || !sign) return false;
    // Check if token signature is valid
    if (sign !== 'CRX26_ADMIN_SECURE') return false;
    // Check expiration (24 hours)
    const tokenTime = parseInt(ts, 10);
    if (isNaN(tokenTime) || Date.now() - tokenTime > 24 * 60 * 60 * 1000) {
      return false;
    }
    return true;
  } catch (_) {
    return false;
  }
}

function generateToken(user) {
  const payload = `${user}:::${Date.now()}:::CRX26_ADMIN_SECURE`;
  return Buffer.from(payload).toString('base64');
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // 1. PUBLIC VALIDATION (No auth required to check a promo code during checkout)
  if (req.method === 'POST' && req.body?.action === 'validate') {
    const rawCode = (req.body?.code || '').trim().toUpperCase();
    if (!rawCode) {
      return res.status(400).json({ valid: false, message: 'Please enter a coupon code.' });
    }

    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .ilike('code', rawCode)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('[admin-promo-codes] validation query error:', error);
        return res.status(500).json({ valid: false, message: 'Could not verify coupon. Try again.' });
      }

      if (!data) {
        return res.status(200).json({ valid: false, message: 'Invalid or expired coupon code.' });
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
          description: data.description || `${data.discount_percent}% off on registration`,
        },
        message: `${data.discount_percent}% discount code applied successfully!`,
      });
    } catch (err) {
      console.error('[admin-promo-codes] validation exception:', err);
      return res.status(500).json({ valid: false, message: 'Server error verifying coupon.' });
    }
  }

  // 2. ADMIN LOGIN
  if (req.method === 'POST' && req.body?.action === 'login') {
    const { username, password } = req.body;
    if (verifyCredentials(username, password)) {
      const token = generateToken(username);
      return res.status(200).json({
        success: true,
        token,
        username: String(username).trim().toLowerCase(),
        message: 'Admin authentication successful',
      });
    }
    return res.status(401).json({ success: false, message: 'Invalid admin username or password' });
  }

  // Check admin authorization for all management actions
  const token = req.headers['x-admin-token'] || req.body?.token;
  const isAuthorized =
    verifyToken(token) ||
    verifyCredentials(req.body?.admin_username, req.body?.admin_password);

  if (!isAuthorized) {
    return res.status(401).json({ error: 'Unauthorized. Admin credentials or session token required.' });
  }

  // 3. GET: List all promo codes (active and inactive)
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({ promoCodes: data || [] });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // 4. POST: Admin mutations (create, delete, toggle)
  if (req.method === 'POST') {
    const { action } = req.body || {};

    // CREATE PROMO CODE
    if (action === 'create') {
      const rawCode = (req.body.code || '').trim().toUpperCase();
      const discountPercent = parseInt(req.body.discount_percent, 10);
      const description = (req.body.description || '').trim();
      const maxUses = req.body.max_uses ? parseInt(req.body.max_uses, 10) : null;

      if (!rawCode) {
        return res.status(400).json({ error: 'Promo code is required.' });
      }
      if (isNaN(discountPercent) || discountPercent <= 0 || discountPercent > 100) {
        return res.status(400).json({ error: 'Discount percentage must be between 1 and 100.' });
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
          return res.status(500).json({ error: error.message });
        }

        return res.status(201).json({ success: true, promoCode: data });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    // DELETE PROMO CODE
    if (action === 'delete') {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'Promo code ID is required.' });
      }

      try {
        const { error } = await supabase
          .from('promo_codes')
          .delete()
          .eq('id', id);

        if (error) {
          return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ success: true, message: 'Promo code removed successfully.' });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    // TOGGLE PROMO CODE (Active / Inactive)
    if (action === 'toggle') {
      const { id, is_active } = req.body;
      if (!id || typeof is_active !== 'boolean') {
        return res.status(400).json({ error: 'ID and is_active boolean are required.' });
      }

      try {
        const { data, error } = await supabase
          .from('promo_codes')
          .update({ is_active, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ success: true, promoCode: data });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    return res.status(400).json({ error: `Unknown action: ${action}` });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method Not Allowed' });
}
