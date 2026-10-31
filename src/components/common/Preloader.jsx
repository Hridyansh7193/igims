import React, { useEffect, useState, useRef } from 'react';
import DynamicBackground from './DynamicBackground';

/**
 * Preloader — Cinematic Unhurried Logo Transition:
 *
 * 1. (0.0s – 1.4s): Blue logo rests cleanly in the centre with gentle blue ambience.
 * 2. (1.4s – 3.0s): A gentle, unhurried little zoom (1x -> 1.28x) and soft blur (0 -> 10px).
 *                   Easy on the eye.
 * 3. (3.0s): Sudden, crisp cinematic cut into the new red logo! All blue is extinguished instantly.
 * 4. (3.1s – 5.9s): The red logo rests in the centre while a luminous 0 - 100% circular
 *                   loader smoothly traces around its perimeter with a digital counter.
 * 5. (5.9s – 6.3s): Holds at 100% complete, then triggers onDone() to open the website!
 */
export default function Preloader({ onDone }) {
  // 'blue-idle' -> 'blue-zoom' -> 'red-loading' -> 'done'
  const [phase, setPhase] = useState('blue-idle');
  const [progress, setProgress] = useState(0);
  const onDoneCalledRef = useRef(false);

  useEffect(() => {
    // 1. After 1.4s calm hold, begin the gentle little zoom and blur
    const t1 = setTimeout(() => {
      setPhase('blue-zoom');
    }, 1400);

    // 2. At 3.0s, sudden transition into the red logo
    const t2 = setTimeout(() => {
      setPhase('red-loading');
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // 0% -> 100% smooth circular animation during 'red-loading'
  useEffect(() => {
    if (phase !== 'red-loading') return;

    let startTime = performance.now();
    const duration = 2800; // 2.8 seconds: unhurried, graceful, easy on the eye
    let animId;

    const tick = (now) => {
      const elapsed = now - startTime;
      const p = Math.min(100, (elapsed / duration) * 100);
      setProgress(p);

      if (p < 100) {
        animId = requestAnimationFrame(tick);
      } else {
        // Hold for 400ms at 100% so the completion is felt, then open the website
        setTimeout(() => {
          if (!onDoneCalledRef.current) {
            onDoneCalledRef.current = true;
            if (onDone) onDone();
          }
        }, 400);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [phase, onDone]);

  // SVG Geometry
  const SVG_SIZE = 280;
  const RADIUS = 124;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~779.11
  const strokeOffset = CIRCUMFERENCE - (CIRCUMFERENCE * progress) / 100;

  // Leading laser point on the circle circumference
  const angle = (progress / 100) * 2 * Math.PI - Math.PI / 2;
  const tipX = 140 + RADIUS * Math.cos(angle);
  const tipY = 140 + RADIUS * Math.sin(angle);

  const isBluePhase = phase === 'blue-idle' || phase === 'blue-zoom';
  const isRedPhase = phase === 'red-loading';

  return (
    <>
      <style>
        {`
          /* Gentle little zoom and soft blur: 1.6s, very easy on the eyes */
          @keyframes crx-gentle-zoom-blur {
            0% {
              transform: translate(-50%, -50%) scale(1);
              filter: blur(0px);
              box-shadow: 0 0 35px rgba(59, 130, 246, 0.45);
            }
            100% {
              transform: translate(-50%, -50%) scale(1.28);
              filter: blur(10px);
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.15);
            }
          }

          /* Soft ambient blue glow during blue-idle */
          @keyframes crx-blue-glow-pulse {
            0%, 100% { opacity: 0.55; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
          }

          /* Sudden transition snap flash (120ms) */
          @keyframes crx-sudden-snap {
            0% { opacity: 0; }
            40% { opacity: 0.85; }
            100% { opacity: 0; }
          }

          /* Red logo gentle entrance */
          @keyframes crx-red-logo-enter {
            0% {
              transform: translate(-50%, -50%) scale(0.96);
              opacity: 0.7;
            }
            100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
          }
        `}
      </style>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at 50% 45%, #18060A 0%, #0C0508 55%, #050204 100%)',
          overflow: 'hidden',
          zIndex: 99999,
        }}
      >
        {/* Dynamic subtle background embers */}
        <DynamicBackground />

        {/* ── Sudden Transition Flash (triggers at 3.0s for 120ms) ── */}
        {isRedPhase && progress < 8 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.9) 0%, rgba(220,38,38,0.4) 50%, transparent 80%)',
              animation: 'crx-sudden-snap 0.14s ease-out forwards',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* ── Center Stage Container (280px x 280px) ── */}
        <div
          style={{
            position: 'relative',
            zIndex: 4,
            width: SVG_SIZE,
            height: SVG_SIZE,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* ═════════════════════════════════════════════════════════════ */}
          {/* 1. BLUE LOGO PHASE (0.0s – 3.0s)                             */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {isBluePhase && (
            <>
              {/* Soft ambient blue aura */}
              <div
                style={{
                  position: 'absolute',
                  width: 210,
                  height: 210,
                  borderRadius: '50%',
                  background: 'rgba(59, 130, 246, 0.45)',
                  filter: 'blur(45px)',
                  animation: phase === 'blue-idle' ? 'crx-blue-glow-pulse 2s ease-in-out infinite' : 'none',
                  opacity: phase === 'blue-zoom' ? 0.3 : 0.6,
                  transition: 'opacity 1.6s ease',
                  zIndex: 1,
                }}
              />

              {/* Blue Logo in the Centre */}
              <img
                src="/new-logo-blue.png"
                alt="Cerebrexia Blue Logo"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 210,
                  height: 210,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  transformOrigin: 'center center',
                  zIndex: 3,
                  ...(phase === 'blue-idle'
                    ? {
                        transform: 'translate(-50%, -50%) scale(1)',
                        filter: 'blur(0px)',
                        boxShadow: '0 0 35px rgba(59, 130, 246, 0.45)',
                      }
                    : {
                        animation: 'crx-gentle-zoom-blur 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                      }),
                }}
              />
            </>
          )}

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* 2. RED LOGO & 0-100% CIRCULAR LOADER PHASE (3.0s – 6.3s)     */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {isRedPhase && (
            <>
              {/* Rich red ambient aura */}
              <div
                style={{
                  position: 'absolute',
                  width: 210,
                  height: 210,
                  borderRadius: '50%',
                  background: 'rgba(220, 38, 38, 0.35)',
                  filter: 'blur(35px)',
                  zIndex: 1,
                }}
              />

              {/* Red Logo in the Centre */}
              <img
                src="/new-logo.jpg"
                alt="Cerebrexia Logo"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 210,
                  height: 210,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  boxShadow: '0 0 32px rgba(220, 38, 38, 0.65), 0 0 65px rgba(185, 28, 28, 0.3)',
                  animation: 'crx-red-logo-enter 0.25s ease-out forwards',
                  zIndex: 3,
                }}
              />

              {/* SVG 0 - 100% Circular Loader Around the Logo */}
              <svg
                width={SVG_SIZE}
                height={SVG_SIZE}
                viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 5,
                  pointerEvents: 'none',
                }}
              >
                <defs>
                  {/* Glowing gradient for progress stroke */}
                  <linearGradient id="crxProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="60%" stopColor="#DC2626" />
                    <stop offset="100%" stopColor="#B91C1C" />
                  </linearGradient>
                  <filter id="crxNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Subtle background track */}
                <circle
                  cx={140}
                  cy={140}
                  r={RADIUS}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="3.5"
                />

                {/* Animated progress circle (0 to 100%) */}
                <circle
                  cx={140}
                  cy={140}
                  r={RADIUS}
                  fill="none"
                  stroke="url(#crxProgressGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={strokeOffset}
                  transform="rotate(-90 140 140)"
                  filter="url(#crxNeonGlow)"
                  style={{
                    transition: 'stroke-dashoffset 0.04s linear',
                  }}
                />

                {/* Glowing laser tip leading the progress */}
                {progress > 1 && progress < 100 && (
                  <circle
                    cx={tipX}
                    cy={tipY}
                    r={4.5}
                    fill="#FFFFFF"
                    style={{
                      filter: 'drop-shadow(0 0 5px #DC2626) drop-shadow(0 0 8px #FFFFFF)',
                    }}
                  />
                )}
              </svg>
            </>
          )}
        </div>

        {/* ── Status Text & Percentage Counter ── */}
        <div
          style={{
            position: 'relative',
            zIndex: 6,
            textAlign: 'center',
            marginTop: 26,
            minHeight: 52,
          }}
        >
          {isRedPhase ? (
            <>
              {/* Digital 0 - 100% Counter */}
              <div
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  fontSize: 'clamp(20px, 3.5vw, 26px)',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: 2,
                  textShadow: '0 0 12px rgba(220, 38, 38, 0.75)',
                }}
              >
                {Math.round(progress)}%
              </div>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  color: progress >= 100 ? '#4ADE80' : 'rgba(255, 255, 255, 0.45)',
                  marginTop: 5,
                  transition: 'color 0.3s ease',
                }}
              >
                {progress >= 100 ? 'INITIALIZATION COMPLETE' : 'THE CROWNED DIAGNOSIS'}
              </div>
            </>
          ) : (
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 11.5,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.4)',
                marginTop: 10,
              }}
            >
              Initializing
            </div>
          )}
        </div>
      </div>
    </>
  );
}
