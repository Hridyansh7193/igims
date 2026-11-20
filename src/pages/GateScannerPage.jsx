import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Camera, CheckCircle2, XCircle, AlertTriangle, RefreshCw,
  Flashlight, SwitchCamera, Search, Users, ShieldCheck, ChevronRight
} from 'lucide-react';
import { checkinTicketAtGate } from '../lib/ticketService';

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
      // High cheerful double-beep
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1174, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } else {
      // Low buzz error tone
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
  const [activeDay, setActiveDay] = useState('DAY_1');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanCount, setScanCount] = useState(0);
  const [manualInput, setManualInput] = useState('');
  const [facingMode, setFacingMode] = useState('environment'); // environment = back camera
  const [recentEntries, setRecentEntries] = useState([]);
  const [torchOn, setTorchOn] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const scannerRef = useRef(null);
  const isProcessingRef = useRef(false);

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

  // Initialize and run HTML5 camera scanner
  useEffect(() => {
    const qrRegionId = 'crx-gate-camera-feed';
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
          { facingMode: facingMode },
          config,
          (decodedText) => {
            if (!isProcessingRef.current) {
              handleCodeScanned(decodedText);
            }
          },
          () => {} // silent frame failures
        );
        setScanning(true);
      } catch (err) {
        console.error('[Scanner] Camera init error:', err);
        setCameraError(err?.message || 'Could not access camera. Please allow camera permissions.');
        setScanning(false);
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {}).finally(() => {
          scannerRef.current.clear();
        });
      }
    };
  }, [facingMode]);

  // Handle scanned token
  const handleCodeScanned = async (token) => {
    if (!token || isProcessingRef.current) return;
    isProcessingRef.current = true;

    // Vibrate device if supported
    if (navigator.vibrate) navigator.vibrate(80);

    const res = await checkinTicketAtGate(token, 'Gate 1 Mobile Scanner', activeDay);

    if (res.status === 'ENTRY_GRANTED') {
      playAudioFeedback('SUCCESS');
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      setScanCount((c) => c + 1);
      setRecentEntries((prev) => [
        {
          name: res.attendee?.attendee_name || 'Attendee',
          college: res.attendee?.attendee_college,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          ticket: res.attendee?.ticket_number,
        },
        ...prev.slice(0, 9),
      ]);
    } else {
      playAudioFeedback('REJECT');
      if (navigator.vibrate) navigator.vibrate([250, 100, 250]);
    }

    setScanResult(res);

    // Auto resume after 2.5 seconds
    setTimeout(() => {
      setScanResult(null);
      isProcessingRef.current = false;
    }, 2800);
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

  const toggleTorch = async () => {
    try {
      if (scannerRef.current) {
        const track = scannerRef.current.getRunningTrackCapabilities();
        if (track && track.torch) {
          await scannerRef.current.applyVideoConstraints({
            advanced: [{ torch: !torchOn }],
          });
          setTorchOn(!torchOn);
        }
      }
    } catch (_) {}
  };

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <span style={{ fontSize: 10, letterSpacing: 1.5, color: 'var(--crx-gold, #D4AF37)', textTransform: 'uppercase', fontWeight: 700 }}>
            Cerebrexia '26 Gate Pass APK
          </span>
          <h1 className="crx-display" style={{ fontSize: 24, margin: '2px 0 0', color: '#fff' }}>
            GATE SCANNER
          </h1>
        </div>
        <div
          style={{
            background: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.35)',
            borderRadius: 12,
            padding: '6px 12px',
            textAlign: 'right',
          }}
        >
          <span style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', display: 'block' }}>Scanned Today</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#22c55e' }}>{scanCount}</span>
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

        {/* Scan Status Feedback Fullscreen Overlay */}
        {scanResult && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                scanResult.status === 'ENTRY_GRANTED'
                  ? 'rgba(16, 185, 129, 0.95)'
                  : scanResult.status === 'ALREADY_SCANNED'
                  ? 'rgba(220, 38, 38, 0.96)'
                  : 'rgba(234, 88, 12, 0.96)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              textAlign: 'center',
              zIndex: 30,
              animation: 'fadeIn 0.2s ease',
            }}
          >
            {scanResult.status === 'ENTRY_GRANTED' ? (
              <CheckCircle2 size={64} color="#fff" style={{ marginBottom: 12 }} />
            ) : scanResult.status === 'ALREADY_SCANNED' ? (
              <XCircle size={64} color="#fff" style={{ marginBottom: 12 }} />
            ) : (
              <AlertTriangle size={64} color="#fff" style={{ marginBottom: 12 }} />
            )}

            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: 1 }}>
              {scanResult.status === 'ENTRY_GRANTED'
                ? 'ENTRY GRANTED'
                : scanResult.status === 'ALREADY_SCANNED'
                ? 'ALREADY ENTERED TODAY'
                : 'ENTRY DENIED'}
            </h2>

            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', margin: '0 0 16px', fontWeight: 600 }}>
              {scanResult.message}
            </p>

            {scanResult.attendee && (
              <div
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: 12,
                  padding: '12px 16px',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', display: 'block' }}>
                  {scanResult.attendee.attendee_name}
                </span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', display: 'block', margin: '2px 0' }}>
                  {scanResult.attendee.attendee_college || 'Cerebrexia Delegate'}
                </span>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.7)', display: 'block', marginTop: 4 }}>
                  {scanResult.attendee.ticket_number}
                </span>
              </div>
            )}
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
                }}
              >
                <div>
                  <strong style={{ color: '#fff', display: 'block' }}>{item.name}</strong>
                  <span style={{ fontSize: 10, color: 'var(--muted)' }}>{item.ticket} &bull; {item.college}</span>
                </div>
                <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
