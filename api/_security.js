import crypto from 'crypto';

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
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
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    // Same-origin / server-to-server request
    res.setHeader('Access-Control-Allow-Origin', 'https://igims-sand.vercel.app');
  } else {
    // Unknown origin - default to production site
    res.setHeader('Access-Control-Allow-Origin', 'https://igims-sand.vercel.app');
  }

  res.setHeader('Access-Control-Allow-Methods', allowedMethods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token, x-gate-api-key');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}
