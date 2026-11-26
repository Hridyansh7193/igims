import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  '';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_ANON_KEY ||
  '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Warning: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment.'
  );
}

// Fallback to non-routable placeholder if unconfigured, preventing crashes during build
// while guaranteeing no silent connections to production data when unconfigured
const rawClient = createClient(
  supabaseUrl || 'https://placeholder-unconfigured.supabase.co',
  supabaseAnonKey || 'placeholder-unconfigured-anon-key',
  {
    auth: {
      persistSession: true, // survive page refresh
      autoRefreshToken: true, // silently refresh JWTs before expiry
      detectSessionInUrl: true, // pick up OAuth callback tokens from URL hash
      storageKey: 'crx_session', // namespace localStorage key
    },
    global: {
      headers: { 'x-client-info': 'cerebrexia-web' },
    },
  }
);

function isProductionDomain() {
  if (typeof window === 'undefined') return false;
  const host = (window.location.hostname || '').toLowerCase();
  return (
    host === 'www.cerebrexiaigims.com' ||
    host === 'cerebrexiaigims.com' ||
    host === 'www.cerebrexia.in' ||
    host === 'cerebrexia.in'
  );
}

function isProductionDatabaseUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return url.toLowerCase().includes('dgkubrwfrwcfpkgjoxmu');
}

/**
 * Creates a chainable stub that fails closed when a direct browser write is attempted
 * against the production Supabase database from a non-production domain (e.g. Vercel Preview).
 */
function createBlockedMutationResult(table, operation) {
  const host = typeof window !== 'undefined' ? window.location.hostname : 'non-browser';
  const errorMessage = `Security Isolation Violation: Direct browser mutation (${operation}) on table "${table}" targeting the production Supabase database is blocked on non-production origin (${host}). Please configure a separate staging Supabase project for Preview.`;
  console.error('[Supabase Isolation]', errorMessage);

  const blockedResponse = {
    data: null,
    error: {
      message: errorMessage,
      details: 'Direct browser writes to production from Preview deployments are strictly disallowed.',
      hint: 'Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to point to your staging Supabase project.',
      code: 'SEC_PREVIEW_ISOLATION_BLOCKED',
    },
  };

  const chainable = {
    eq: () => chainable,
    neq: () => chainable,
    gt: () => chainable,
    gte: () => chainable,
    lt: () => chainable,
    lte: () => chainable,
    like: () => chainable,
    ilike: () => chainable,
    is: () => chainable,
    in: () => chainable,
    contains: () => chainable,
    containedBy: () => chainable,
    match: () => chainable,
    not: () => chainable,
    or: () => chainable,
    filter: () => chainable,
    select: () => chainable,
    order: () => chainable,
    limit: () => chainable,
    range: () => chainable,
    single: () => Promise.resolve(blockedResponse),
    maybeSingle: () => Promise.resolve(blockedResponse),
    then: (resolve, reject) => Promise.resolve(blockedResponse).then(resolve, reject),
    catch: (reject) => Promise.resolve(blockedResponse).catch(reject),
  };
  return chainable;
}

const shouldBlockDirectMutations =
  isProductionDatabaseUrl(supabaseUrl) &&
  typeof window !== 'undefined' &&
  !isProductionDomain();

if (shouldBlockDirectMutations) {
  console.warn(
    '[Supabase Isolation] Client-side mutation guard ACTIVE: Direct browser writes to production database blocked on domain:',
    typeof window !== 'undefined' ? window.location.hostname : 'unknown'
  );
}

const originalFrom = rawClient.from.bind(rawClient);
rawClient.from = function guardedFrom(table) {
  const qb = originalFrom(table);
  if (!shouldBlockDirectMutations) {
    return qb;
  }
  return new Proxy(qb, {
    get(target, prop, receiver) {
      if (prop === 'insert' || prop === 'upsert' || prop === 'update' || prop === 'delete') {
        return function blockedMutation() {
          return createBlockedMutationResult(table, prop);
        };
      }
      const val = Reflect.get(target, prop, receiver);
      return typeof val === 'function' ? val.bind(target) : val;
    },
  });
};

export const supabase = rawClient;
