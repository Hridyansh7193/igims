import React, { useState, useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Camera,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  SwitchCamera,
  Lock,
  User,
  LogOut,
  Eye,
  EyeOff,
  ShieldCheck,
  Key,
} from 'lucide-react';
import {
  getGateScannerSession,
  loginGateScanner,
  logoutGateScanner,
  checkinTicketAtGate,
  assignUniqueCodeAndCheckin,
} from '../lib/gateScannerService';

const EVENT_DAYS = [
  { id: 'DAY_1', label: 'Day 1', dateStr: '17 Dec' },
  { id: 'DAY_2', label: 'Day 2', dateStr: '18 Dec' },
  { id: 'DAY_3', label: 'Day 3', dateStr: '19 Dec' },
  { id: 'DAY_4', label: 'Day 4', dateStr: '20 Dec' },
];

/**
 * Audio feedback tones using Web Audio API (no external asset dependencies)
 */
function playAudioFeedback(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'SUCCESS') {
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1174, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'PROMPT') {
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(160, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (_) {}
}

export default function GateScannerPage() {
  const isNativeApk = typeof window !== 'undefined' && Capacitor.isNativePlatform();

  // Authentication State
  const [session, setSession] = useState(getGateScannerSession);
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Scanner State
  const [activeDay, setActiveDay] = useState('DAY_1');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanCount, setScanCount] = useState(0);
  const [manualInput, setManualInput] = useState('');
  const [facingMode, setFacingMode] = useState('environment');
  const [recentEntries, setRecentEntries] = useState([]);
  const [cameraError, setCameraError] = useState(null);

  // 4-Digit Unique Number Assignment State (shown ONLY on first-ever scan for a person)
  const [pendingAssignment, setPendingAssignment] = useState(null);
  const [uniqueCodeInput, setUniqueCodeInput] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState(null);

  const scannerRef = useRef(null);
  const isProcessingRef = useRef(false);
  const resumeTimerRef = useRef(null);
  const codeInputRef = useRef(null);
  const sessionRef = useRef(session);
  const activeDayRef = useRef(activeDay);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    activeDayRef.current = activeDay;
  }, [activeDay]);

  // Auto-detect festival day on load
  useEffect(() => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + istOffset);
    const m = istDate.getUTCMonth() + 1;
    const d = istDate.getUTCDate();
    if (m === 12) {
      if (d === 17) setActiveDay('DAY_1');
      else if (d === 18) setActiveDay('DAY_2');
      else if (d === 19) setActiveDay('DAY_3');
      else if (d === 20) setActiveDay('DAY_4');
    }
  }, []);

  // Focus 4-digit input when assignment card opens
  useEffect(() => {
    if (pendingAssignment && codeInputRef.current) {
      setTimeout(() => {
        codeInputRef.current?.focus();
      }, 80);
    }
  }, [pendingAssignment]);

  const clearResumeTimer = () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  };

  const resumeScanningImmediately = () => {
    clearResumeTimer();
    setScanResult(null);
    setPendingAssignment(null);
    setUniqueCodeInput('');
    setAssignError(null);
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 350);
  };

  const scheduleAutoResume = () => {
    clearResumeTimer();
    resumeTimerRef.current = setTimeout(() => {
      setScanResult(null);
      isProcessingRef.current = false;
    }, 2800);
  };

  const forceLogoutWithNotice = (msg) => {
    clearResumeTimer();
    logoutGateScanner();
    setSession(null);
    setPendingAssignment(null);
    setScanResult(null);
    setUniqueCodeInput('');
    setAssignError(null);
    isProcessingRef.current = false;
    setLoginError(msg || 'Session expired. Please log in again.');
  };

  // Initialize and run HTML5 camera scanner ONLY when authenticated
  useEffect(() => {
    if (!session) return undefined;

    const qrRegionId = 'crx-gate-camera-feed';
    let cancelled = false;
    let html5QrCode = null;

    const startScanner = async () => {
      try {
        setCameraError(null);
        html5QrCode = new Html5Qrcode(qrRegionId);
        scannerRef.current = html5QrCode;

        const config = {
          fps: 15,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };

        await html5QrCode.start(
          { facingMode },
          config,
          (decodedText) => {
            if (!isProcessingRef.current && !cancelled) {
              handleCodeScanned(decodedText);
            }
          },
          () => {}
        );
        if (!cancelled) {
          setScanning(true);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[Scanner] Camera init error:', err);
          setCameraError(err?.message || 'Could not access camera. Please allow camera permissions.');
          setScanning(false);
        }
      }
    };

    startScanner();

    return () => {
      cancelled = true;
      setScanning(false);
      clearResumeTimer();
      if (scannerRef.current) {
        const currentScanner = scannerRef.current;
        scannerRef.current = null;
        if (currentScanner.isScanning) {
          currentScanner.stop().catch(() => {}).finally(() => {
            try {
              currentScanner.clear();
            } catch (_) {}
          });
        } else {
          try {
            currentScanner.clear();
          } catch (_) {}
        }
      }
    };
  }, [session, facingMode]);

  const handleGrantedEntry = (res) => {
    playAudioFeedback('SUCCESS');
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    setScanCount((c) => c + 1);
    setRecentEntries((prev) => [
      {
        name: res.attendee?.attendee_name || 'Attendee',
        college: res.attendee?.attendee_college,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        ticket: res.attendee?.ticket_number,
        uniqueCode: res.attendee?.unique_code || null,
      },
      ...prev.slice(0, 9),
    ]);
    setScanResult(res);
    scheduleAutoResume();
  };

  // Handle scanned QR token or manual ticket entry
  const handleCodeScanned = async (token) => {
    const activeSession = sessionRef.current;
    if (!token || isProcessingRef.current || !activeSession?.token) return;

    isProcessingRef.current = true;
    clearResumeTimer();

    if (navigator.vibrate) navigator.vibrate(80);

    const res = await checkinTicketAtGate(
      token,
      activeSession.username || 'Gate 1 Mobile Scanner',
      activeDayRef.current,
      activeSession.token
    );

    if (res.status === 'UNAUTHORIZED') {
      playAudioFeedback('REJECT');
      forceLogoutWithNotice(res.message);
      return;
    }

    if (res.status === 'NEEDS_UNIQUE_CODE') {
      // First-time person: keep scanner paused until staff enters a unique 4-digit code or cancels
      playAudioFeedback('PROMPT');
      setPendingAssignment({
        qr_token: res.qr_token || token,
        attendee: res.attendee,
        event_day: res.event_day || activeDayRef.current,
      });
      setUniqueCodeInput('');
      setAssignError(null);
      return;
    }

    if (res.status === 'ENTRY_GRANTED') {
      // Returning person already has permanent unique code -> no prompt shown
      handleGrantedEntry(res);
      return;
    }

    // ALREADY_SCANNED, INVALID, UNPAID, ERROR
    playAudioFeedback('REJECT');
    if (navigator.vibrate) navigator.vibrate([250, 100, 250]);
    setScanResult(res);
    scheduleAutoResume();
  };

  // Confirm and save unique 4-digit number for a new attendee
  const handleConfirmUniqueCode = async (e) => {
    e.preventDefault();
    if (!pendingAssignment || assignLoading) return;

    const cleanCode = uniqueCodeInput.replace(/\D/g, '').slice(0, 4);
    if (!/^\d{4}$/.test(cleanCode)) {
      setAssignError('Please enter a valid 4-digit number (e.g. 0421).');
      playAudioFeedback('REJECT');
      return;
    }

    const activeSession = sessionRef.current;
    if (!activeSession?.token) {
      forceLogoutWithNotice('Please log in to continue.');
      return;
    }

    setAssignLoading(true);
    setAssignError(null);

    const res = await assignUniqueCodeAndCheckin(
      pendingAssignment.qr_token,
      cleanCode,
      activeSession.username || 'Gate 1 Mobile Scanner',
      activeDayRef.current,
      activeSession.token
    );

    setAssignLoading(false);

    if (res.status === 'UNAUTHORIZED') {
      playAudioFeedback('REJECT');
      forceLogoutWithNotice(res.message);
      return;
    }

    if (res.status === 'CODE_ALREADY_TAKEN' || res.status === 'INVALID_CODE') {
      playAudioFeedback('REJECT');
      if (navigator.vibrate) navigator.vibrate([200, 80, 200]);
      setAssignError(res.message || 'This 4-digit number is already assigned to another person.');
      codeInputRef.current?.focus();
      return;
    }

    setPendingAssignment(null);
    setUniqueCodeInput('');
    setAssignError(null);

    if (res.status === 'ENTRY_GRANTED') {
      handleGrantedEntry(res);
    } else {
      playAudioFeedback('REJECT');
      if (navigator.vibrate) navigator.vibrate([250, 100, 250]);
      setScanResult(res);
      scheduleAutoResume();
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleCodeScanned(manualInput.trim());
    setManualInput('');
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginId.trim() || !loginPassword) {
      setLoginError('Please enter both Gate ID and Password.');
      return;
    }

    setLoginLoading(true);
    setLoginError(null);

    const res = await loginGateScanner(loginId, loginPassword);
    setLoginLoading(false);

    if (res.success && res.session) {
      setSession(res.session);
      setLoginPassword('');
      setLoginError(null);
    } else {
      setLoginError(res.message || 'Invalid Gate ID or Password.');
    }
  };

  const handleLogout = () => {
    clearResumeTimer();
    logoutGateScanner();
    setSession(null);
    setPendingAssignment(null);
    setScanResult(null);
    setUniqueCodeInput('');
    setAssignError(null);
    setLoginError(null);
    isProcessingRef.current = false;
  };

  // Block any non-APK / web browser render completely
  if (!isNativeApk) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#070204',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          textAlign: 'center',
          fontFamily: "'Space Grotesk', -apple-system, sans-serif",
        }}
      >
        <p style={{ color: '#fca5a5', fontSize: 14, fontWeight: 600 }}>
          Gate Scanner is only available inside the official Cerebrexia Android APK.
        </p>
      </div>
    );
  }

  // RENDER: GATE STAFF LOGIN SCREEN
  if (!session) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#070204',
          color: '#fff',
          fontFamily: "'Space Grotesk', -apple-system, sans-serif",
          padding: '32px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 420,
            background: 'rgba(18, 8, 12, 0.96)',
            border: '1px solid rgba(179, 18, 58, 0.45)',
            borderRadius: 20,
            padding: '28px 22px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 40px rgba(179, 18, 58, 0.15)',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                margin: '0 auto 14px',
                background: 'rgba(179, 18, 58, 0.16)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={28} color="#D4AF37" />
            </div>
            <span
              style={{
                fontSize: 10,
                letterSpacing: 1.8,
                color: 'var(--crx-gold, #D4AF37)',
                textTransform: 'uppercase',
                fontWeight: 700,
                display: 'block',
              }}
            >
              Cerebrexia '26 &bull; Security Terminal
            </span>
            <h1 className="crx-display" style={{ fontSize: 24, margin: '6px 0 4px', color: '#fff' }}>
              GATE SCANNER LOGIN
            </h1>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
              Sign in with your authorized Gate Staff ID & Password
            </p>
          </div>

          {loginError && (
            <div
              style={{
                background: 'rgba(220, 38, 38, 0.16)',
                border: '1px solid rgba(220, 38, 38, 0.5)',
                borderRadius: 10,
                padding: '10px 12px',
                fontSize: 12,
                color: '#fca5a5',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>
                Gate Staff ID
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="rgba(255,255,255,0.45)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  placeholder="e.g. gate1 or gate2"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.16)',
                    borderRadius: 10,
                    padding: '12px 14px 12px 38px',
                    color: '#fff',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="rgba(255,255,255,0.45)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Gate Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.16)',
                    borderRadius: 10,
                    padding: '12px 42px 12px 38px',
                    color: '#fff',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.55)',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="crx-btn gold"
              style={{
                width: '100%',
                padding: '13px 16px',
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 1,
                textTransform: 'uppercase',
                marginTop: 6,
                opacity: loginLoading ? 0.7 : 1,
                cursor: loginLoading ? 'wait' : 'pointer',
              }}
            >
              {loginLoading ? 'Verifying...' : 'Unlock Gate Scanner'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // RENDER: AUTHENTICATED GATE SCANNER VIEW
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#070204',
        color: '#fff',
        fontFamily: "'Space Grotesk', -apple-system, sans-serif",
        padding: '20px 16px 80px',
        maxWidth: 520,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Gate App Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 8 }}>
        <div>
          <span style={{ fontSize: 10, letterSpacing: 1.5, color: 'var(--crx-gold, #D4AF37)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
            Cerebrexia '26 &bull; {String(session.username || 'GATE').toUpperCase()}
          </span>
          <h1 className="crx-display" style={{ fontSize: 22, margin: '2px 0 0', color: '#fff' }}>
            GATE SCANNER
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.35)',
              borderRadius: 12,
              padding: '6px 10px',
              textAlign: 'right',
            }}
          >
            <span style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', display: 'block' }}>Scanned</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#22c55e' }}>{scanCount}</span>
          </div>

          <button
            onClick={handleLogout}
            title="Logout Gate Scanner"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.16)',
              borderRadius: 12,
              padding: '10px',
              color: '#fca5a5',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Festival Day Selector */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 6,
          background: 'rgba(255,255,255,0.04)',
          padding: 4,
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: 16,
        }}
      >
        {EVENT_DAYS.map((d) => {
          const active = activeDay === d.id;
          return (
            <button
              key={d.id}
              onClick={() => setActiveDay(d.id)}
              style={{
                background: active ? '#b3123a' : 'transparent',
                border: 'none',
                borderRadius: 8,
                padding: '8px 4px',
                color: active ? '#fff' : 'var(--muted)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ display: 'block', fontSize: 11, fontWeight: 800 }}>{d.label}</span>
              <span style={{ display: 'block', fontSize: 9, opacity: 0.8 }}>{d.dateStr}</span>
            </button>
          );
        })}
      </div>

      {/* Camera Viewfinder Box */}
      <div
        style={{
          position: 'relative',
          borderRadius: 20,
          overflow: 'hidden',
          background: '#000',
          border: '2px solid rgba(179, 18, 58, 0.4)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.8), 0 0 40px rgba(179, 18, 58, 0.15)',
          aspectRatio: '1 / 1',
          marginBottom: 16,
        }}
      >
        <div id="crx-gate-camera-feed" style={{ width: '100%', height: '100%' }} />

        {/* Camera Overlay Controls */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            display: 'flex',
            gap: 8,
            zIndex: 10,
          }}
        >
          <button
            onClick={toggleCamera}
            aria-label="Switch Camera"
            style={{
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8,
              width: 36,
              height: 36,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <SwitchCamera size={18} />
          </button>
        </div>

        {/* Camera error message if blocked */}
        {cameraError && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.9)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              textAlign: 'center',
            }}
          >
            <Camera size={36} color="#DC2626" style={{ marginBottom: 12 }} />
            <p style={{ color: '#fff', fontSize: 13, margin: '0 0 12px' }}>{cameraError}</p>
            <p style={{ color: 'var(--muted)', fontSize: 11, margin: 0 }}>
              Use manual ticket search below if camera is unavailable on this device.
            </p>
          </div>
        )}

        {/* First-Scan Unique 4-Digit Code Assignment Overlay */}
        {pendingAssignment && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(10, 4, 8, 0.96)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 18,
              textAlign: 'center',
              zIndex: 35,
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(212, 175, 55, 0.16)',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                color: '#D4AF37',
                borderRadius: 999,
                padding: '4px 12px',
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              <Key size={12} />
              New Attendee &bull; Assign Unique 4-Digit ID
            </div>

            {pendingAssignment.attendee && (
              <div
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  width: '100%',
                  boxSizing: 'border-box',
                  marginBottom: 14,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', display: 'block' }}>
                  {pendingAssignment.attendee.attendee_name}
                </span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', display: 'block', marginTop: 2 }}>
                  {pendingAssignment.attendee.attendee_college || 'Cerebrexia Delegate'} &bull;{' '}
                  <span style={{ fontFamily: 'monospace' }}>{pendingAssignment.attendee.ticket_number}</span>
                </span>
              </div>
            )}

            <form onSubmit={handleConfirmUniqueCode} style={{ width: '100%', maxWidth: 300 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.85)',
                  marginBottom: 8,
                }}
              >
                Enter Permanent 4-Digit Number
              </label>

              <input
                ref={codeInputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                placeholder="0000"
                value={uniqueCodeInput}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setUniqueCodeInput(digits);
                  if (assignError) setAssignError(null);
                }}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.08)',
                  border: assignError ? '2px solid #ef4444' : '2px solid rgba(212, 175, 55, 0.7)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  color: '#fff',
                  fontSize: 28,
                  fontWeight: 900,
                  letterSpacing: 10,
                  textAlign: 'center',
                  fontFamily: 'monospace',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />

              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', margin: '8px 0 10px' }}>
                This 4-digit number stays permanently linked to this person on all event days.
              </p>

              {assignError && (
                <div
                  style={{
                    background: 'rgba(220, 38, 38, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.6)',
                    borderRadius: 8,
                    padding: '8px 10px',
                    fontSize: 11,
                    color: '#fecaca',
                    marginBottom: 10,
                    fontWeight: 600,
                  }}
                >
                  {assignError}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={resumeScanningImmediately}
                  disabled={assignLoading}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 10,
                    padding: '11px 10px',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assignLoading || uniqueCodeInput.length !== 4}
                  className="crx-btn gold"
                  style={{
                    flex: 2,
                    padding: '11px 12px',
                    fontSize: 12,
                    fontWeight: 800,
                    opacity: assignLoading || uniqueCodeInput.length !== 4 ? 0.5 : 1,
                    cursor: assignLoading || uniqueCodeInput.length !== 4 ? 'not-allowed' : 'pointer',
                  }}
                >
                  {assignLoading ? 'Saving...' : 'Save & Grant Entry'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Scan Status Feedback Fullscreen Overlay */}
        {scanResult && !pendingAssignment && (
          <div
            onClick={resumeScanningImmediately}
            style={{
              position: 'absolute',
              inset: 0,
              background:
                scanResult.status === 'ENTRY_GRANTED'
                  ? 'rgba(16, 185, 129, 0.96)'
                  : scanResult.status === 'ALREADY_SCANNED'
                  ? 'rgba(220, 38, 38, 0.96)'
                  : 'rgba(234, 88, 12, 0.96)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              textAlign: 'center',
              zIndex: 30,
              animation: 'fadeIn 0.2s ease',
              cursor: 'pointer',
            }}
          >
            {scanResult.status === 'ENTRY_GRANTED' ? (
              <CheckCircle2 size={56} color="#fff" style={{ marginBottom: 10 }} />
            ) : scanResult.status === 'ALREADY_SCANNED' ? (
              <XCircle size={56} color="#fff" style={{ marginBottom: 10 }} />
            ) : (
              <AlertTriangle size={56} color="#fff" style={{ marginBottom: 10 }} />
            )}

            <h2 style={{ fontSize: 21, fontWeight: 900, color: '#fff', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: 1 }}>
              {scanResult.status === 'ENTRY_GRANTED'
                ? 'ENTRY GRANTED'
                : scanResult.status === 'ALREADY_SCANNED'
                ? 'ALREADY ENTERED TODAY'
                : 'ENTRY DENIED'}
            </h2>

            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.92)', margin: '0 0 12px', fontWeight: 600 }}>
              {scanResult.message}
            </p>

            {scanResult.attendee?.unique_code && (
              <div
                style={{
                  background: '#000',
                  border: '2px solid #D4AF37',
                  borderRadius: 12,
                  padding: '8px 18px',
                  marginBottom: 12,
                }}
              >
                <span style={{ fontSize: 9, color: '#D4AF37', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>
                  Permanent Unique ID
                </span>
                <span style={{ fontSize: 24, fontWeight: 900, fontFamily: 'monospace', color: '#fff', letterSpacing: 4 }}>
                  #{scanResult.attendee.unique_code}
                </span>
              </div>
            )}

            {scanResult.attendee && (
              <div
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', display: 'block' }}>
                  {scanResult.attendee.attendee_name}
                </span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', display: 'block', margin: '2px 0' }}>
                  {scanResult.attendee.attendee_college || 'Cerebrexia Delegate'}
                </span>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.7)', display: 'block', marginTop: 2 }}>
                  {scanResult.attendee.ticket_number}
                </span>
              </div>
            )}

            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', marginTop: 10, fontWeight: 600 }}>
              Tap anywhere to scan next pass
            </span>
          </div>
        )}
      </div>

      {/* Manual Ticket Entry fallback */}
      <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Manual Ticket / QR Token..."
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          disabled={Boolean(pendingAssignment)}
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 10,
            padding: '10px 14px',
            color: '#fff',
            fontSize: 13,
            outline: 'none',
          }}
        />
        <button
          type="submit"
          className="crx-btn gold"
          disabled={Boolean(pendingAssignment)}
          style={{ padding: '0 16px', fontSize: 12, flexShrink: 0 }}
        >
          Verify
        </button>
      </form>

      {/* Recent Gate Entries list */}
      {recentEntries.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--muted)' }}>
            Recent Gate Passes ({recentEntries.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentEntries.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: 'rgba(0,0,0,0.3)',
                  fontSize: 12,
                  gap: 8,
                }}
              >
                <div>
                  <strong style={{ color: '#fff', display: 'block' }}>{item.name}</strong>
                  <span style={{ fontSize: 10, color: 'var(--muted)' }}>{item.ticket} &bull; {item.college}</span>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {item.uniqueCode && (
                    <span
                      style={{
                        display: 'inline-block',
                        background: 'rgba(212, 175, 55, 0.16)',
                        border: '1px solid rgba(212, 175, 55, 0.4)',
                        color: '#D4AF37',
                        fontFamily: 'monospace',
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: 6,
                        marginBottom: 2,
                      }}
                    >
                      #{item.uniqueCode}
                    </span>
                  )}
                  <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 700, display: 'block' }}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
