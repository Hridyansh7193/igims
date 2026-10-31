import React, { useEffect, useState, useRef } from 'react';
import DynamicBackground from './DynamicBackground';

// Only preload the two logos we need
const PRELOAD_SRCS = ['/new-logo-blue.png', '/new-logo.jpg'];

function preloadImages(srcs) {
  return Promise.all(
    srcs.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src;
        })
    )
  );
}

/**
 * Preloader — cinematic logo morph:
 *
 *  Stage 0: Old blue logo is displayed crisply (0.6s hold)
 *  Stage 1: Old logo zooms in + blurs simultaneously over ~1.8s
 *           (simulates "diving into" the red center of the crest)
 *  Stage 2: Screen is fully blurred red → flash white → new red logo
 *           fades/scales in from the blur (0.8s)
 *  Stage 3: New logo holds + slight pulse → onDone fires
 */
export default function Preloader({ onDone }) {
  const [stage, setStage] = useState(-1); // -1 = preloading images
  const [zoomProgress, setZoomProgress] = useState(0); // 0→1 during zoom
  const rafRef = useRef(null);
  const startRef = useRef(null);

  // Preload images then kick off the animation timeline
  useEffect(() => {
    let cancelled = false;
    let timers = [];

    preloadImages(PRELOAD_SRCS).then(() => {
      if (cancelled) return;

      setStage(0); // Show blue logo

      timers = [
        // After a short hold, begin the zoom+blur
        setTimeout(() => {
          if (!cancelled) setStage(1);
        }, 700),

        // After zoom completes, flash and reveal new logo
        setTimeout(() => {
          if (!cancelled) setStage(2);
        }, 2500),

        // Hold new logo, then finish
        setTimeout(() => {
          if (!cancelled) setStage(3);
        }, 3400),

        // Fire onDone
        setTimeout(() => {
          if (!cancelled && onDone) onDone();
        }, 4200),
      ];
    });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [onDone]);

  // Animate zoomProgress from 0→1 during stage 1
  useEffect(() => {
    if (stage !== 1) return;
    startRef.current = performance.now();
    const duration = 1800; // 1.8 seconds of zoom + blur

    const tick = (now) => {
      const elapsed = now - startRef.current;
      const t = Math.min(1, elapsed / duration);
      // Ease-in curve for accelerating zoom
      const eased = t * t * (3 - 2 * t); // smoothstep
      setZoomProgress(eased);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stage]);

  const effectiveStage = stage < 0 ? 0 : stage;

  // ── Derived animation values ──────────────────────────────────────────
  // Zoom: scale from 1 → 6 (deep zoom into the logo's red center)
  const zoomScale = 1 + zoomProgress * 5;
  // Blur: 0px → 30px
  const blurAmount = zoomProgress * 30;
  // Old logo opacity: fade out towards the end of zoom
  const oldLogoOpacity = effectiveStage >= 2 ? 0 : 1;
  // Red overlay that builds as we "enter" the red portion
  const redOverlayOpacity = effectiveStage >= 2 ? 1 : zoomProgress * 0.7;
  // White flash for the transition moment
  const flashOpacity = effectiveStage === 2 ? 1 : 0;
  // New logo: appears in stage 2+
  const newLogoOpacity = effectiveStage >= 2 ? 1 : 0;
  const newLogoScale = effectiveStage >= 3 ? 1.05 : effectiveStage >= 2 ? 1 : 0.7;

  return (
    <>
      <style>
        {`
          @keyframes crx-logo-pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.06); }
          }
          @keyframes crx-flash-in {
            0% { opacity: 0.85; }
            100% { opacity: 0; }
          }
        `}
      </style>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at 50% 40%, #1C0810 0%, #0C0508 55%, #060306 100%)',
          overflow: 'hidden',
          zIndex: 99999,
        }}
      >
        {/* Ambient background particles */}
        <DynamicBackground />

        {/* ── Red color overlay (builds during zoom to simulate entering the red crest) ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(192,57,43,0.9) 0%, rgba(140,20,40,0.7) 40%, rgba(12,5,8,0.95) 100%)',
            opacity: redOverlayOpacity,
            transition: effectiveStage >= 2 ? 'opacity 0.3s ease' : 'none',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        {/* ── White flash at the transition point ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#fff',
            opacity: 0,
            zIndex: 5,
            pointerEvents: 'none',
            ...(effectiveStage === 2
              ? { animation: 'crx-flash-in 0.5s ease-out forwards' }
              : {}),
          }}
        />

        {/* ── Logo container ── */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            width: 'min(320px, 80vw)',
            height: 'min(320px, 80vw)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Background glow behind the logo */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background:
                effectiveStage >= 2
                  ? 'rgba(192, 57, 43, 0.55)'
                  : 'rgba(59, 130, 246, 0.5)',
              filter: 'blur(50px)',
              transition: 'background 0.4s ease',
              borderRadius: '50%',
            }}
          />

          {/* ── OLD LOGO (blue) — zooms in and blurs ── */}
          <img
            src="/new-logo-blue.png"
            alt="Cerebrexia Old Logo"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 'min(250px, 65vw)',
              height: 'min(250px, 65vw)',
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 0 40px rgba(59,130,246,0.6)',
              transform: `translate(-50%, -50%) scale(${zoomScale})`,
              filter: `blur(${blurAmount}px)`,
              opacity: oldLogoOpacity,
              transition:
                effectiveStage >= 2
                  ? 'opacity 0.25s ease'
                  : 'none', // zoom+blur are driven by RAF, not transition
              zIndex: 1,
            }}
          />

          {/* ── NEW LOGO (red) — fades in after the zoom-blur completes ── */}
          <img
            src="/new-logo.jpg"
            alt="Cerebrexia Logo"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 'min(250px, 65vw)',
              height: 'min(250px, 65vw)',
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow:
                effectiveStage >= 2
                  ? '0 0 40px rgba(192,57,43,0.7), 0 0 80px rgba(192,24,90,0.3)'
                  : 'none',
              transform: `translate(-50%, -50%) scale(${newLogoScale})`,
              opacity: newLogoOpacity,
              transition: 'opacity 0.6s ease, transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.5s ease',
              zIndex: 2,
              ...(effectiveStage >= 3
                ? { animation: 'crx-logo-pulse 2s ease-in-out infinite' }
                : {}),
            }}
          />
        </div>

        {/* ── Tagline ── */}
        <div
          style={{
            position: 'absolute',
            bottom: 'max(30px, 5vh)',
            zIndex: 4,
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color:
              effectiveStage >= 2
                ? 'var(--crx-red, #DC2626)'
                : 'rgba(255,255,255,0.3)',
            transition: 'color 0.6s ease, opacity 0.6s ease',
            opacity: effectiveStage >= 3 ? 0 : 1,
          }}
        >
          {effectiveStage >= 2 ? 'The Crowned Diagnosis' : 'Initializing'}
        </div>
      </div>
    </>
  );
}
