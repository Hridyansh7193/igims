import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

// ── Human-readable Supabase error messages ───────────────────────────────────
function mapAuthError(err) {
  const msg = (err?.message || '').toLowerCase();
  const code = err?.status ?? err?.code ?? 0;

  if (code === 429 || msg.includes('rate limit') || msg.includes('too many'))
    return { message: 'Too many attempts. Please wait a moment and try again.', isRateLimit: true };
  if (msg.includes('invalid login') || msg.includes('invalid credentials') || msg.includes('wrong'))
    return { message: 'Incorrect email or password.', isRateLimit: false };
  if (msg.includes('email not confirmed') || msg.includes('not confirmed'))
    return { message: 'Please confirm your email before signing in.', isRateLimit: false };
  if (msg.includes('user already registered') || msg.includes('already registered'))
    return { message: 'An account with this email already exists. Try signing in.', isRateLimit: false };
  if (msg.includes('password should be'))
    return { message: 'Password must be at least 6 characters.', isRateLimit: false };
  if (msg.includes('unable to validate') || msg.includes('email address'))
    return { message: 'Please enter a valid email address.', isRateLimit: false };
  if (msg.includes('network') || msg.includes('fetch'))
    return { message: 'Network error. Check your connection and try again.', isRateLimit: false };
  return { message: err?.message || 'Something went wrong. Please try again.', isRateLimit: false };
}

// ── Retry with exponential backoff (handles 429 rate limits) ─────────────────
async function withRetry(fn, maxAttempts = 3) {
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const code = err?.status ?? err?.code ?? 0;
      const isRateLimit = code === 429 || (err?.message || '').toLowerCase().includes('rate limit');
      if (!isRateLimit || attempt === maxAttempts) throw err;
      // Wait 2^attempt seconds before retry (2s, 4s, 8s)
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }
  throw lastErr;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore existing session (from localStorage via persistSession:true)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(err => {
      console.error('[Auth] getSession error:', err);
      setLoading(false);
    });

    // Keep user state in sync with Supabase token refreshes and OAuth callbacks
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      // SIGNED_OUT clears local state immediately
      if (event === 'SIGNED_OUT') setUser(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Auth Methods ───────────────────────────────────────────────────────────

  const signUpWithEmail = useCallback(async (email, password) => {
    const { data, error } = await withRetry(() =>
      supabase.auth.signUp({ email: email.trim().toLowerCase(), password })
    );
    if (error) {
      const mapped = mapAuthError(error);
      const e = new Error(mapped.message);
      e.isRateLimit = mapped.isRateLimit;
      throw e;
    }
    return data;
  }, []);

  const signInWithEmail = useCallback(async (email, password) => {
    const { data, error } = await withRetry(() =>
      supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
    );
    if (error) {
      const mapped = mapAuthError(error);
      const e = new Error(mapped.message);
      e.isRateLimit = mapped.isRateLimit;
      throw e;
    }
    return data;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: { prompt: 'select_account' }, // always show account picker
      },
    });
    if (error) throw new Error(mapAuthError(error).message);
    return data;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(mapAuthError(error).message);
  }, []);

  const value = {
    user,
    loading,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
