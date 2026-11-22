import crypto from 'crypto';

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://www.cerebrexiaigims.com',
  'https://cerebrexiaigims.com',
  'https://igims-sand.vercel.app',
  'https://cerebrexia.in',
  'https://www.cerebrexia.in',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'capacitor://localhost',
  'http://localhost',
];

/**
 * Escapes HTML characters to prevent XSS and HTML injection in emails/responses
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Sanitizes headers/subjects by removing CRLF characters to prevent header injection
 */
export function sanitizeHeader(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[\r\n]+/g, ' ').trim();
}

/**
 * Sanitizes input to alphanumeric plus underscore and hyphen (for IDs, tokens, codes)
 */
export function sanitizeAlphaNumDash(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[^a-zA-Z0-9_-]/g, '').trim();
}

/**
 * Timing-safe string comparison to protect against timing attacks
 */
export function timingSafeMatch(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Generates an HMAC-SHA256 signature for payload
 */
export function signToken(payload, secret) {
  const secretKey = secret || process.env.ADMIN_JWT_SECRET || process.env.ADMIN_PASSWORD || 'crx_prod_sec_2026_igims';
  const data = typeof payload === 'object' ? JSON.stringify(payload) : String(payload);
  const dataB64 = Buffer.from(data).toString('base64url');
  const hmac = crypto.createHmac('sha256', secretKey).update(dataB64).digest('base64url');
  return `${dataB64}.${hmac}`;
}

/**
 * Verifies an HMAC-SHA256 signed token
 */
export function verifyToken(token, secret) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [dataB64, providedHmac] = parts;
  const secretKey = secret || process.env.ADMIN_JWT_SECRET || process.env.ADMIN_PASSWORD || 'crx_prod_sec_2026_igims';

  const expectedHmac = crypto.createHmac('sha256', secretKey).update(dataB64).digest('base64url');
  if (!timingSafeMatch(providedHmac, expectedHmac)) {
    return null;
  }

  try {
    const raw = Buffer.from(dataB64, 'base64url').toString('utf8');
    const parsed = JSON.parse(raw);
    // Check expiry if timestamp provided (default 24h)
    if (parsed.exp && Date.now() > parsed.exp) {
      return null;
    }
    return parsed;
  } catch (_) {
    return null;
  }
}

/**
 * In-memory IP rate limiter for serverless endpoints
 */
const rateLimitMap = new Map();

export function checkRateLimit(ip, key, limit = 10, windowMs = 60000) {
  const identifier = `${ip || 'unknown'}:${key}`;
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: entry.resetTime - now };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}

/**
 * Periodically purge stale entries from rate limit map to avoid memory leak
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitMap.entries()) {
    if (now > val.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 300000); // every 5 minutes

/**
 * Returns safe CORS headers based on origin
 */
export function setSecureCorsHeaders(req, res, allowedMethods = 'GET, POST, OPTIONS') {
  const origin = req.headers.origin;

  // Dynamically allow trusted origins: any secure HTTPS origin, custom domains, or local dev
  if (origin) {
    const isHttps = origin.startsWith('https://');
    const isLocal =
      origin.startsWith('http://localhost') ||
      origin.startsWith('http://127.0.0.1') ||
      origin.startsWith('capacitor://');

    if (isHttps || isLocal || ALLOWED_ORIGINS.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      res.setHeader('Access-Control-Allow-Origin', 'https://igims-sand.vercel.app');
    }
  } else {
    // Same-origin / server-to-server request
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', allowedMethods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token, x-gate-api-key');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

/**
 * Validates and cleans a Supabase API key, falling back to public anon key if placeholder/invalid
 */
export function getCleanSupabaseKey(preferredKey) {
  const clean = (k) => (typeof k === 'string' ? k.trim().replace(/^["']|["']$/g, '') : '');
  const p = clean(preferredKey);
  if (
    p &&
    !p.toLowerCase().includes('your_') &&
    !p.toLowerCase().includes('placeholder') &&
    (p.startsWith('sb_secret_') || p.startsWith('sb_publishable_') || p.startsWith('ey'))
  ) {
    return p;
  }
  return 'sb_publishable_v_CcCDqlYXXvx1emJ9U7Cw_2KCpskhS';
}

/**
 * Validates and cleans a service role key specifically, returning null if placeholder/invalid
 */
export function getCleanServiceRoleKey(key) {
  const clean = (k) => (typeof k === 'string' ? k.trim().replace(/^["']|["']$/g, '') : '');
  const s = clean(key);
  if (
    s &&
    !s.toLowerCase().includes('your_') &&
    !s.toLowerCase().includes('placeholder') &&
    (s.startsWith('sb_secret_') || s.startsWith('ey'))
  ) {
    return s;
  }
  return null;
}

/**
 * Validates, cleans, and returns active Razorpay Key ID and Secret with safe defaults
 */
export function getCleanRazorpayKeys() {
  const DEFAULT_KEY_ID = 'rzp_live_TyVhU8uhXCiEMj';
  const DEFAULT_KEY_SECRET = 'ToAZvgHo0GlOkbdkfV4WcU51';

  const clean = (k) => (typeof k === 'string' ? k.trim().replace(/^["']|["']$/g, '') : '');

  let keyId = clean(process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || DEFAULT_KEY_ID);
  let keySecret = clean(process.env.RAZORPAY_KEY_SECRET || process.env.VITE_RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET || DEFAULT_KEY_SECRET);

  if (!keyId || keyId.toLowerCase().includes('your_') || keyId.toLowerCase().includes('placeholder') || keyId.length < 8) {
    keyId = DEFAULT_KEY_ID;
  }
  if (!keySecret || keySecret.toLowerCase().includes('your_') || keySecret.toLowerCase().includes('placeholder') || keySecret.length < 8) {
    keySecret = DEFAULT_KEY_SECRET;
  }

  return { keyId, keySecret, DEFAULT_KEY_ID, DEFAULT_KEY_SECRET };
}
