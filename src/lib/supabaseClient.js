import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Missing env vars VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession    : true,          // survive page refresh
    autoRefreshToken  : true,          // silently refresh JWTs before expiry
    detectSessionInUrl: true,          // pick up OAuth callback tokens from URL hash
    storageKey        : 'crx_session', // namespace localStorage key
  },
  global: {
    headers: { 'x-client-info': 'cerebrexia-web' },
  },
});
