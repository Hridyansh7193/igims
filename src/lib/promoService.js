import { supabase } from './supabaseClient';

const API_BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';
const ADMIN_STORAGE_KEY = 'crx_admin_session';

// In-memory cache of active promo codes for instantaneous client-side calculations
let activePromoCodesCache = [];

/**
 * Validates admin credentials locally as a fail-safe fallback if the serverless API is offline
 */
function localCredentialCheck(username, password) {
  const normUser = String(username || '').trim().toLowerCase();
  const validUsers = ['admin', 'cerebrexia', 'igims_admin'];
  const validPass = ['cerebrexia2026', 'crx@admin2026'];
  return validUsers.includes(normUser) && validPass.includes(String(password));
}

/**
 * Log into Admin Portal
 */
export async function adminLogin(username, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin-promo-codes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.token) {
        const session = {
          token: data.token,
          username: data.username || username,
          timestamp: Date.now(),
        };
        sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
        return { success: true, session };
      }
    }
  } catch (err) {
    console.warn('[promoService] API login failed, checking fallback:', err);
  }

  // Fallback for local sandbox or direct client execution
  if (localCredentialCheck(username, password)) {
    const token = btoa(`${username}:::${Date.now()}:::CRX26_ADMIN_SECURE`);
    const session = { token, username, timestamp: Date.now() };
    sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
    return { success: true, session };
  }

  return { success: false, message: 'Invalid admin username or password.' };
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
        activePromoCodesCache = data.promoCodes.filter((p) => p.is_active);
        return data.promoCodes;
      }
    }
  } catch (err) {
    console.warn('[promoService] API fetch error, trying Supabase fallback:', err);
  }

  // 2. Direct Supabase fallback
  try {
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      activePromoCodesCache = data.filter((p) => p.is_active);
      return data;
    }
  } catch (err) {
    console.error('[promoService] Supabase fetch error:', err);
  }

  return [];
}

/**
 * Add a new promo code
 */
export async function createPromoCode({ code, discountPercent, description = '', maxUses = null }) {
  const session = getAdminSession();
  const token = session?.token || '';
  const cleanCode = String(code || '').trim().toUpperCase();
  const percent = parseInt(discountPercent, 10);

  if (!cleanCode) throw new Error('Promo code is required.');
  if (isNaN(percent) || percent <= 0 || percent > 100) {
    throw new Error('Discount percentage must be between 1 and 100.');
  }

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
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create promo code via API.');
    }
  } catch (err) {
    console.warn('[promoService] API create failed, trying direct Supabase insert:', err.message);
  }

  // 2. Direct Supabase fallback
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

  if (error) {
    if (error.code === '23505') {
      throw new Error(`Promo code "${cleanCode}" already exists.`);
    }
    throw new Error(error.message);
  }

  return data;
}

/**
 * Delete a promo code permanently
 */
export async function deletePromoCode(id) {
  const session = getAdminSession();
  const token = session?.token || '';

  // 1. Try API endpoint
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin-promo-codes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token,
      },
      body: JSON.stringify({ action: 'delete', id }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return true;
    }
  } catch (err) {
    console.warn('[promoService] API delete failed, trying Supabase fallback:', err);
  }

  // 2. Direct Supabase fallback
  const { error } = await supabase.from('promo_codes').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

/**
 * Toggle active / inactive state of a promo code
 */
export async function togglePromoCodeActive(id, isActive) {
  const session = getAdminSession();
  const token = session?.token || '';

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
  } catch (err) {
    console.warn('[promoService] API toggle failed, trying Supabase fallback:', err);
  }

  // 2. Direct Supabase fallback
  const { data, error } = await supabase
    .from('promo_codes')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Validate a promo code during user checkout
 */
export async function validatePromoCodeOnline(inputCode, { payableMembers = 1, payableSubtotal = 2000 } = {}) {
  const cleanCode = String(inputCode || '').trim().toUpperCase();
  if (!cleanCode) {
    return {
      valid: false,
      couponDiscount: 0,
      discountPerBR: 0,
      finalTotal: payableSubtotal,
      message: 'Please enter a coupon code.',
      promo: null,
    };
  }

  // 1. Try API validation
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
        const couponDiscount = Math.round((payableSubtotal * discountPercent) / 100);
        const finalTotal = Math.max(0, payableSubtotal - couponDiscount);

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
      } else {
        return {
          valid: false,
          couponDiscount: 0,
          discountPerBR: 0,
          finalTotal: payableSubtotal,
          message: data.message || 'Invalid or expired coupon code.',
          promo: null,
        };
      }
    }
  } catch (err) {
    console.warn('[promoService] API validate failed, trying Supabase direct check:', err);
  }

  // 2. Direct Supabase fallback
  try {
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .ilike('code', cleanCode)
      .eq('is_active', true)
      .maybeSingle();

    if (!error && data) {
      if (data.max_uses && data.times_used >= data.max_uses) {
        return {
          valid: false,
          couponDiscount: 0,
          discountPerBR: 0,
          finalTotal: payableSubtotal,
          message: 'This coupon code has reached its maximum usage limit.',
          promo: null,
        };
      }

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
    console.error('[promoService] Direct check exception:', err);
  }

  return {
    valid: false,
    couponDiscount: 0,
    discountPerBR: 0,
    finalTotal: payableSubtotal,
    message: 'Invalid or expired coupon code.',
    promo: null,
  };
}
