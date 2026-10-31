import React, { useEffect, useState, useRef } from 'react';
import DynamicBackground from './DynamicBackground';

/**
 * Preloader — Cinematic Logo Transition:
 *
 * 1. (0.0s – 0.6s): Blue logo holds calmly in the centre.
 * 2. (0.6s – 2.4s): Blue logo smoothly zooms to almost cover the screen (1x -> 4.8x)
 *                   and simultaneously blurs. Total blue time: ~2.4 seconds (not persistent).
 * 3. (2.4s): Sudden, crisp transition into the red logo. All blue is extinguished immediately.
 * 4. (2.5s – 5.5s): Red logo rests in the centre while an unhurried, easy-on-the-eye
 *                   0% - 100% circular loader traces around it with digital counter.
 * 5. (5.5s – 5.9s): Holds at 100% complete, then website opens smoothly!
 */
export default function Preloader({ onDone }) {
  // 'blue-phase' -> 'red-loading'
  const [phase, setPhase] = useState('blue-phase');
  const [progress, setProgress] = useState(0);
  const onDoneCalledRef = useRef(false);

  useEffect(() => {
    // Exactly 2.4 seconds total for the blue phase (within 2-3 sec requirement)
    const timer = setTimeout(() => {
      setPhase('red-loading');
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  // 0% -> 100% unhurried circular loader during 'red-loading' (3.0 seconds)
  useEffect(() => {
    if (phase !== 'red-loading') return;

    let startTime = performance.now();
    const duration = 3000; // 3.0 seconds: smooth, deliberate, easy on the eyes
    let animId;

    const tick = (now) => {
      const elapsed = now - startTime;
      const p = Math.min(100, (elapsed / duration) * 100);
      setProgress(p);

      if (p < 100) {
        animId = requestAnimationFrame(tick);
      } else {
        // Hold for 400ms at 100% so completion is felt, then open the website
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

  // SVG circular geometry
  const SVG_SIZE = 280;
  const RADIUS = 124;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~779.11
  const strokeOffset = CIRCUMFERENCE - (CIRCUMFERENCE * progress) / 100;

  // Leading laser point on the circle circumference
  const angle = (progress / 100) * 2 * Math.PI - Math.PI / 2;
  const tipX = 140 + RADIUS * Math.cos(angle);
  const tipY = 140 + RADIUS * Math.sin(angle);

  const isBluePhase = phase === 'blue-phase';
  const isRedPhase = phase === 'red-loading';

  return (
    <>
      <style>
        {`
          /* Blue logo: Hold 0.6s, then zoom to almost cover the screen (4.8x) & blur (22px) over 1.8s */
          @keyframes crx-blue-screen-zoom {
            0% {
              transform: translate(-50%, -50%) scale(1);
              filter: blur(0px);
              opacity: 1;
            }
            25% {
              transform: translate(-50%, -50%) scale(1);
              filter: blur(0px);
              opacity: 1;
            }
            82% {
              transform: translate(-50%, -50%) scale(4.4);
              filter: blur(18px);
              opacity: 0.85;
            }
            100% {
              transform: translate(-50%, -50%) scale(4.8);
              filter: blur(24px);
              opacity: 0;
            }
          }

          /* Blue glow: Expands with the zoom and fades out completely (never persistent) */
          @keyframes crx-blue-glow-fadeout {
            0%, 25% {
              opacity: 0.6;
              transform: scale(1);
            }
            75% {
              opacity: 0.25;
              transform: scale(2.8);
            }
            100% {
              opacity: 0;
              transform: scale(3.5);
            }
          }

          /* Sudden transition snap flash (120ms) */
          @keyframes crx-sudden-snap {
            0% { opacity: 0; }
            40% { opacity: 0.85; }
            100% { opacity: 0; }
          }

          /* Red logo clean entrance */
          @keyframes crx-red-logo-enter {
            0% {
              transform: translate(-50%, -50%) scale(0.95);
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
        {/* Dynamic ambient particles */}
        <DynamicBackground />

        {/* ── Sudden Transition Flash (triggers at 2.4s for 120ms) ── */}
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

        {/* ── Center Stage Container ── */}
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
          {/* 1. BLUE LOGO PHASE (0.0s – 2.4s) — NOT PERSISTENT            */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {isBluePhase && (
            <>
              {/* Blue ambient aura — expands and completely fades out */}
              <div
                style={{
                  position: 'absolute',
                  width: 210,
                  height: 210,
                  borderRadius: '50%',
                  background: 'rgba(59, 130, 246, 0.5)',
                  filter: 'blur(45px)',
                  animation: 'crx-blue-glow-fadeout 2.4s ease-out forwards',
                  zIndex: 1,
                }}
              />

              {/* Blue Logo: Zooms to almost cover the screen + blurs over 2.4s */}
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
                  boxShadow: '0 0 35px rgba(59, 130, 246, 0.45)',
                  animation: 'crx-blue-screen-zoom 2.4s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
                  zIndex: 3,
                }}
              />
            </>
          )}

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* 2. RED LOGO & 0-100% CIRCULAR LOADER PHASE (2.4s – 5.9s)     */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {isRedPhase && (
            <>
              {/* Red ambient aura */}
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
