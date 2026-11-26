import { supabase } from './supabaseClient';

const API_BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';
const ADMIN_STORAGE_KEY = 'crx_admin_session';
const LOCAL_PROMO_KEY = 'crx_custom_promo_codes';

// In-memory cache of active promo codes for instantaneous client-side calculations
let activePromoCodesCache = [];

export function getLocalPromoCodes() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_PROMO_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

export function saveLocalPromoCodes(list) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_PROMO_KEY, JSON.stringify(list));
  } catch (_) {}
}

/**
 * Log into Admin Portal (server-authenticated only)
 */
export async function adminLogin(username, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin-promo-codes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', username, password }),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success && data.token) {
      const session = {
        token: data.token,
        username: data.username || username,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
      return { success: true, session };
    }
    return { success: false, message: data.message || data.error || 'Invalid admin username or password.' };
  } catch (err) {
    console.warn('[promoService] API login error:', err);
    return { success: false, message: 'Could not connect to authentication service. Check network.' };
  }
}

/**
 * Sign out of Admin Portal
 */
export function adminLogout() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
  }
}

/**
 * Retrieve active Admin Session
 */
export function getAdminSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    // Check 24 hour expiry
    if (Date.now() - (session.timestamp || 0) > 24 * 60 * 60 * 1000) {
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
      return null;
    }
    return session;
  } catch (_) {
    return null;
  }
}

/**
 * Fetch all promo codes (for Admin Portal view)
 */
export async function fetchAllPromoCodes() {
  const session = getAdminSession();
  const token = session?.token || '';
  let fetchedList = [];

  // 1. Try API endpoint
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin-promo-codes`, {
      headers: {
        'x-admin-token': token,
      },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.promoCodes)) {
        fetchedList = data.promoCodes;
      }
    }
  } catch (err) {
    console.warn('[promoService] API fetch error, trying Supabase fallback:', err);
  }

  // 2. Direct Supabase fallback
  if (fetchedList.length === 0) {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        fetchedList = data;
      }
    } catch (err) {
      console.warn('[promoService] Supabase fetch error:', err);
    }
  }

  const localList = getLocalPromoCodes();

  // Deduplicate by code: DB > Local (only promo codes managed by admin)
  const codeMap = new Map();
  for (const item of localList) codeMap.set(item.code, item);
  for (const item of fetchedList) codeMap.set(item.code, item);

  const combined = Array.from(codeMap.values());
  activePromoCodesCache = combined.filter((p) => p.is_active);
  return combined;
}

/**
 * Add a new promo code
 */
export async function createPromoCode({ code, discountPercent, description = '', maxUses = null }) {
  const session = getAdminSession();
  const token = session?.token || '';
  const cleanCode = String(code || '').trim().toUpperCase();
  const percent = parseFloat(discountPercent);

  if (!cleanCode) throw new Error('Promo code is required.');
  if (isNaN(percent) || percent <= 0 || percent > 100) {
    throw new Error('Discount percentage must be between 0.01% and 100%.');
  }

  const newCodeObj = {
    id: `promo_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    code: cleanCode,
    discount_percent: percent,
    description,
    is_active: true,
    max_uses: maxUses ? parseInt(maxUses, 10) : null,
    times_used: 0,
    created_at: new Date().toISOString(),
  };

  // Always save locally so code works immediately regardless of DB state
  const locals = getLocalPromoCodes().filter((c) => c.code !== cleanCode);
  locals.unshift(newCodeObj);
  saveLocalPromoCodes(locals);

  // 1. Try API endpoint
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin-promo-codes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token,
      },
      body: JSON.stringify({
        action: 'create',
        code: cleanCode,
        discount_percent: percent,
        description,
        max_uses: maxUses ? parseInt(maxUses, 10) : null,
      }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return data.promoCode;
    }
  } catch (err) {
    console.warn('[promoService] API create failed, trying direct Supabase insert:', err.message);
  }

  // 2. Direct Supabase fallback
  try {
    const { data, error } = await supabase
      .from('promo_codes')
      .insert([
        {
          code: cleanCode,
          discount_percent: percent,
          description,
          is_active: true,
          max_uses: maxUses ? parseInt(maxUses, 10) : null,
          times_used: 0,
        },
      ])
      .select()
      .single();

    if (!error && data) {
      return data;
    }
  } catch (_) {}

  return newCodeObj;
}

/**
 * Delete a promo code permanently
 */
export async function deletePromoCode(id, code) {
  const session = getAdminSession();
  const token = session?.token || '';

  // Delete from local storage
  const locals = getLocalPromoCodes().filter((c) => c.id !== id && c.code !== code);
  saveLocalPromoCodes(locals);

  // 1. Try API endpoint
  try {
    await fetch(`${API_BASE_URL}/api/admin-promo-codes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token,
      },
      body: JSON.stringify({ action: 'delete', id }),
    });
  } catch (_) {}

  // 2. Direct Supabase fallback
  try {
    await supabase.from('promo_codes').delete().eq('id', id);
  } catch (_) {}

  return true;
}

/**
 * Toggle active / inactive state of a promo code
 */
export async function togglePromoCodeActive(id, isActive, code) {
  const session = getAdminSession();
  const token = session?.token || '';

  // Update local storage
  const locals = getLocalPromoCodes().map((c) => (c.id === id || c.code === code ? { ...c, is_active: isActive } : c));
  saveLocalPromoCodes(locals);

  // 1. Try API endpoint
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin-promo-codes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token,
      },
      body: JSON.stringify({ action: 'toggle', id, is_active: isActive }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return data.promoCode;
    }
  } catch (_) {}

  // 2. Direct Supabase fallback
  try {
    const { data } = await supabase
      .from('promo_codes')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (data) return data;
  } catch (_) {}

  return { id, is_active: isActive };
}

/**
 * Validate a promo code during user checkout
 */
export async function validatePromoCodeOnline(inputCode, { payableMembers = 1, payableSubtotal = 2000 } = {}) {
  const safeSubtotal = Number(payableSubtotal) > 0 ? Number(payableSubtotal) : 2000;
  const cleanCode = String(inputCode || '').trim().toUpperCase();
  if (!cleanCode) {
    return {
      valid: false,
      couponDiscount: 0,
      discountPerBR: 0,
      finalTotal: safeSubtotal,
      message: 'Please enter a coupon code.',
      promo: null,
    };
  }

  // 1. Check local admin codes created in Admin Portal
  const localMatched = getLocalPromoCodes().find((c) => c.code === cleanCode && c.is_active);
  if (localMatched) {
    const discountPercent = Number(localMatched.discount_percent || localMatched.value) || 0;
    const discountPerBR = Math.round((2000 * discountPercent) / 100);
    const couponDiscount = Math.round((safeSubtotal * discountPercent) / 100);
    const finalTotal = Math.max(0, safeSubtotal - couponDiscount);

    return {
      valid: true,
      couponDiscount,
      discountPerBR,
      finalTotal,
      message: `${discountPercent}% discount applied! Saved ₹${couponDiscount.toLocaleString('en-IN')}`,
      promo: {
        code: cleanCode,
        type: 'percent',
        value: discountPercent,
        label: `${discountPercent}% Off`,
        description: localMatched.description || `${discountPercent}% off on registration`,
      },
    };
  }

  // 2. Try API validation (checks Supabase promo_codes table via serverless backend)
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin-promo-codes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'validate', code: cleanCode }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.valid && data.promo) {
        const discountPercent = Number(data.promo.value) || 0;
        const discountPerBR = Math.round((2000 * discountPercent) / 100);
        const couponDiscount = Math.round((safeSubtotal * discountPercent) / 100);
        const finalTotal = Math.max(0, safeSubtotal - couponDiscount);

        return {
          valid: true,
          couponDiscount,
          discountPerBR,
          finalTotal,
          message: `${discountPercent}% discount applied! Saved ₹${couponDiscount.toLocaleString('en-IN')}`,
          promo: {
            code: cleanCode,
            type: 'percent',
            value: discountPercent,
            label: `${discountPercent}% Off`,
            description: data.promo.description,
          },
        };
      }
    }
  } catch (err) {
    console.warn('[promoService] API validate failed, trying Supabase direct check:', err);
  }

  // 4. Direct Supabase check
  try {
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .ilike('code', cleanCode)
      .eq('is_active', true)
      .maybeSingle();

    if (!error && data) {
      const discountPercent = Number(data.discount_percent) || 0;
      const discountPerBR = Math.round((2000 * discountPercent) / 100);
      const couponDiscount = Math.round((payableSubtotal * discountPercent) / 100);
      const finalTotal = Math.max(0, payableSubtotal - couponDiscount);

      return {
        valid: true,
        couponDiscount,
        discountPerBR,
        finalTotal,
        message: `${discountPercent}% discount applied! Saved ₹${couponDiscount.toLocaleString('en-IN')}`,
        promo: {
          code: data.code,
          type: 'percent',
          value: discountPercent,
          label: `${discountPercent}% Off`,
          description: data.description,
        },
      };
    }
  } catch (err) {
    console.warn('[promoService] Supabase direct check exception:', err);
  }

  return {
    valid: false,
    couponDiscount: 0,
    discountPerBR: 0,
    finalTotal: payableSubtotal,
    message: 'Invalid or inactive promo code.',
    promo: null,
  };
}
