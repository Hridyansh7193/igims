import { Capacitor } from '@capacitor/core';

const GATE_SESSION_KEY = 'crx_gate_scanner_session';
const GATE_SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const GATE_API_ENDPOINT = 'https://www.cerebrexiaigims.com/api/gate-checkin';
const GATE_API_KEY = import.meta.env.VITE_GATE_API_KEY || '';

function assertNativeApk() {
  return typeof window !== 'undefined' && Capacitor.isNativePlatform();
}

/**
 * Retrieves the persisted Gate Scanner session from localStorage if valid and unexpired
 */
export function getGateScannerSession() {
  if (!assertNativeApk()) return null;
  try {
    const raw = localStorage.getItem(GATE_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    const expired = session.expires_at
      ? Date.now() > session.expires_at
      : Date.now() - (session.timestamp || 0) > GATE_SESSION_MAX_AGE_MS;
    if (!session.token || expired) {
      localStorage.removeItem(GATE_SESSION_KEY);
      return null;
    }
    return session;
  } catch (_) {
    return null;
  }
}

/**
 * Logs out of the Gate Scanner
 */
export function logoutGateScanner() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(GATE_SESSION_KEY);
  }
}

/**
 * Authenticates gate staff against the gate-checkin serverless endpoint (APK only)
 */
export async function loginGateScanner(username, password) {
  if (!assertNativeApk()) {
    return { success: false, message: 'Gate Scanner is only available inside the mobile APK.' };
  }

  try {
    const headers = {
      'Content-Type': 'application/json',
      'x-gate-client': 'cerebrexia-android-apk',
    };
    if (GATE_API_KEY) headers['x-gate-api-key'] = GATE_API_KEY;

    const res = await fetch(GATE_API_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        action: 'login',
        username: String(username || '').trim(),
        password: String(password || ''),
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success && data.token) {
      const session = {
        token: data.token,
        username: data.username || String(username).trim().toLowerCase(),
        timestamp: Date.now(),
        expires_at: data.expires_at || Date.now() + GATE_SESSION_MAX_AGE_MS,
      };
      localStorage.setItem(GATE_SESSION_KEY, JSON.stringify(session));
      return { success: true, session };
    }

    return { success: false, message: data?.message || 'Invalid Gate ID or Password.' };
  } catch (err) {
    console.error('[gateScannerService] Gate login network error:', err);
    return { success: false, message: 'Network error connecting to authentication server.' };
  }
}

async function postGateCheckin(payload, gateToken) {
  if (!assertNativeApk()) {
    return { status: 'ERROR', message: 'Gate Scanner is only available inside the mobile APK.' };
  }

  try {
    const token = gateToken || getGateScannerSession()?.token || '';
    const headers = {
      'Content-Type': 'application/json',
      'x-gate-client': 'cerebrexia-android-apk',
      'x-gate-token': token,
    };
    if (GATE_API_KEY) headers['x-gate-api-key'] = GATE_API_KEY;

    const res = await fetch(GATE_API_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      return {
        status: 'UNAUTHORIZED',
        message: data?.message || 'Gate login session expired. Please log in again.',
      };
    }
    return data;
  } catch (err) {
    console.error('[gateScannerService] Gate checkin network error:', err);
    return {
      status: 'ERROR',
      message: 'Network error connecting to gate validation server.',
    };
  }
}

/**
 * Scans / Checks in a ticket against the gate API (APK only)
 */
export async function checkinTicketAtGate(qrToken, gateVolunteer = 'Gate Volunteer', dayOverride = null, gateToken = null) {
  return postGateCheckin(
    {
      action: 'scan',
      qr_token: qrToken,
      gate_volunteer: gateVolunteer,
      day_override: dayOverride,
    },
    gateToken
  );
}

/**
 * Assigns a permanent 4-digit unique code to a ticket and records today's check-in (APK only)
 */
export async function assignUniqueCodeAndCheckin(
  qrToken,
  uniqueCode,
  gateVolunteer = 'Gate Volunteer',
  dayOverride = null,
  gateToken = null
) {
  return postGateCheckin(
    {
      action: 'assign_and_checkin',
      qr_token: qrToken,
      unique_code: uniqueCode,
      gate_volunteer: gateVolunteer,
      day_override: dayOverride,
    },
    gateToken
  );
}
