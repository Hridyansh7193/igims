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
 * Environment isolation detection
 */
export function isPreviewDeployment() {
  return process.env.VERCEL_ENV === 'preview';
}

export function isProductionDeployment() {
  return process.env.VERCEL_ENV === 'production';
}

/**
 * Checks if the configured Supabase URL matches the known production project.
 */
export function isProductionSupabaseUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return url.toLowerCase().includes('dgkubrwfrwcfpkgjoxmu');
}

/**
 * Asserts that a database mutation is safe to perform in the current deployment environment.
 * If running in a Preview deployment against the production Supabase database, fails closed.
 */
export function assertSafeDatabaseMutation(supabaseUrl) {
  if (isPreviewDeployment() && isProductionSupabaseUrl(supabaseUrl)) {
    const err = new Error(
      'Security Isolation Violation: Database mutation blocked on Preview deployment targeting production database (dgkubrwfrwcfpkgjoxmu). Please configure a separate staging Supabase project for Preview.'
    );
    err.statusCode = 403;
    throw err;
  }
}

/**
 * Checks if email sending is permitted in the current deployment.
 * Preview requires explicit EMAIL_ENABLED=true.
 */
export function isEmailEnabled() {
  if (isPreviewDeployment()) {
    return process.env.EMAIL_ENABLED === 'true';
  }
  return process.env.EMAIL_ENABLED !== 'false';
}

/**
 * Checks if Google Sheets synchronization is permitted in the current deployment.
 * Preview requires explicit GOOGLE_SHEETS_SYNC_ENABLED=true.
 */
export function isSheetsSyncEnabled() {
  if (isPreviewDeployment()) {
    return process.env.GOOGLE_SHEETS_SYNC_ENABLED === 'true';
  }
  return process.env.GOOGLE_SHEETS_SYNC_ENABLED !== 'false';
}

/**
 * Checks if payment processing is permitted in the current deployment.
 * Preview requires explicit PAYMENTS_ENABLED=true.
 */
export function isPaymentsEnabled() {
  if (isPreviewDeployment()) {
    return process.env.PAYMENTS_ENABLED === 'true';
  }
  return process.env.PAYMENTS_ENABLED !== 'false';
}

/**
 * Generates an HMAC-SHA256 signature for payload
 */
export function signToken(payload, secret) {
  const secretKey = secret || process.env.ADMIN_JWT_SECRET || process.env.ADMIN_PASSWORD;
  if (!secretKey) {
    throw new Error('Authentication signing failed: ADMIN_JWT_SECRET or ADMIN_PASSWORD must be configured in environment');
  }
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
  const secretKey = secret || process.env.ADMIN_JWT_SECRET || process.env.ADMIN_PASSWORD;
  if (!secretKey) return null;

  const expectedHmac = crypto.createHmac('sha256', secretKey).update(dataB64).digest('base64url');
  if (!timingSafeMatch(providedHmac, expectedHmac)) {
    return null;
  }

  try {
    const raw = Buffer.from(dataB64, 'base64url').toString('utf8');
    const parsed = JSON.parse(raw);
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
const rateLimitPurgeTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitMap.entries()) {
    if (now > val.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 300000); // every 5 minutes
if (rateLimitPurgeTimer.unref) rateLimitPurgeTimer.unref();

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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token, x-portal-token, x-gate-api-key, x-gate-token, x-gate-client');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

/**
 * Validates and cleans a Supabase API key.
 * Never falls back to hardcoded production keys.
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
  return null;
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
 * Resolves the first valid Supabase API key across server/anon env vars,
 * skipping malformed or placeholder values instead of failing early.
 */
export function resolveSupabaseServerKey() {
  const candidates = [
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.SUPABASE_SERVICE_KEY,
    process.env.SERVICE_ROLE_KEY,
    process.env.SUPABASE_ANON_KEY,
    process.env.VITE_SUPABASE_ANON_KEY,
  ];
  for (const candidate of candidates) {
    const valid = getCleanSupabaseKey(candidate);
    if (valid) return valid;
  }
  return null;
}

/**
 * Validates, cleans, and returns active Razorpay Key ID and Secret.
 * Enforces strict environment isolation:
 * - In Preview: rejects live keys (rzp_live_*), requires test keys (rzp_test_*), or fails closed.
 * - In Production: rejects test keys (rzp_test_*).
 * - Never returns hardcoded fallback keys.
 */
export function getCleanRazorpayKeys() {
  const clean = (k) => (typeof k === 'string' ? k.trim().replace(/^["']|["']$/g, '') : '');

  const keyId = clean(process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID);
  const keySecret = clean(process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET);

  const isPreview = isPreviewDeployment();
  const isProd = isProductionDeployment();

  let error = null;

  if (!keyId || !keySecret) {
    error = 'Razorpay credentials (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET) are not configured in environment.';
  } else if (isPreview && !keyId.startsWith('rzp_test_')) {
    error = 'Security Isolation Violation: Preview deployment accepts only Razorpay test keys (rzp_test_*). Live or non-test key detected.';
  } else if (isProd && keyId.startsWith('rzp_test_')) {
    error = 'Configuration Error: Test Razorpay key (rzp_test_*) detected in Production deployment. Production requires live keys (rzp_live_*).';
  }

  return {
    keyId: error ? null : keyId,
    keySecret: error ? null : keySecret,
    error,
  };
}
