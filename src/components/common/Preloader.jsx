import React, { useEffect, useState, useRef } from 'react';
import DynamicBackground from './DynamicBackground';

/**
 * Preloader — Cinematic Inverted Zoom Morph:
 *
 * 1. (0.0s – 2.0s): Blue logo starts in centre, then zooms up (1x -> 4.8x) & blurs (0 -> 24px)
 *                   to almost cover the screen. Total blue time: ~2.0 seconds.
 * 2. (2.0s – 3.2s): Red logo starts zoomed in and blurred (4.8x, 24px blur) and smoothly
 *                   shrinks / focuses down into the crisp red logo in the centre (1x, 0px blur).
 * 3. (3.2s – 6.0s): The red logo rests in the centre while an unhurried 0% - 100% circular
 *                   loader traces around its perimeter with synchronized digital percentage.
 * 4. (6.0s – 6.4s): Holds at 100% complete, then the website starts!
 */
export default function Preloader({ onDone }) {
  // 'blue' -> 'red-shrink' -> 'red-loading'
  const [phase, setPhase] = useState('blue');
  const [progress, setProgress] = useState(0);
  const onDoneCalledRef = useRef(false);

  useEffect(() => {
    // 1. At 2.0s, switch from blue zoom to red shrink
    const t1 = setTimeout(() => {
      setPhase('red-shrink');
    }, 2000);

    // 2. At 3.2s, red logo has settled in the centre -> start circular 0-100% loader
    const t2 = setTimeout(() => {
      setPhase('red-loading');
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // 0% -> 100% unhurried circular loader during 'red-loading'
  useEffect(() => {
    if (phase !== 'red-loading') return;

    let startTime = performance.now();
    const duration = 2800; // 2.8 seconds: smooth, deliberate, easy on the eyes
    let animId;

    const tick = (now) => {
      const elapsed = now - startTime;
      const p = Math.min(100, (elapsed / duration) * 100);
      setProgress(p);

      if (p < 100) {
        animId = requestAnimationFrame(tick);
      } else {
        // Hold for 380ms at 100% so completion is felt, then open the website
        setTimeout(() => {
          if (!onDoneCalledRef.current) {
            onDoneCalledRef.current = true;
            if (onDone) onDone();
          }
        }, 380);
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

  const isBlue = phase === 'blue';
  const isRed = phase === 'red-shrink' || phase === 'red-loading';

  return (
    <>
      <style>
        {`
          /* ── 1. Blue Logo: Hold 0.5s then zoom up (1x -> 4.8x) & blur (0 -> 24px) ── */
          @keyframes crx-blue-zoom-blur {
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
            85% {
              transform: translate(-50%, -50%) scale(4.4);
              filter: blur(20px);
              opacity: 0.85;
            }
            100% {
              transform: translate(-50%, -50%) scale(4.8);
              filter: blur(24px);
              opacity: 0;
            }
          }

          /* Blue glow: Expands with the zoom and fades out completely */
          @keyframes crx-blue-glow-fadeout {
            0%, 25% {
              opacity: 0.6;
              transform: scale(1);
            }
            80% {
              opacity: 0.2;
              transform: scale(2.8);
            }
            100% {
              opacity: 0;
              transform: scale(3.5);
            }
          }

          /* ── 2. Red Logo: Starts zoomed & blurred (4.8x, 24px) and shrinks into centre (1x, 0px) ── */
          @keyframes crx-red-shrink-focus {
            0% {
              transform: translate(-50%, -50%) scale(4.8);
              filter: blur(24px);
              opacity: 0.6;
            }
            20% {
              opacity: 0.95;
            }
            100% {
              transform: translate(-50%, -50%) scale(1);
              filter: blur(0px);
              opacity: 1;
            }
          }

          /* Red aura: shrinks and concentrates around the resting red logo */
          @keyframes crx-red-aura-settle {
            0% {
              opacity: 0.3;
              transform: scale(3.2);
            }
            100% {
              opacity: 0.65;
              transform: scale(1);
            }
          }

          /* Subtle breathing glow for red logo once settled */
          @keyframes crx-red-settled-pulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.04); }
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
          {/* 1. BLUE LOGO PHASE (0.0s – 2.0s): Zoom & Blur Outward        */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {isBlue && (
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
                  animation: 'crx-blue-glow-fadeout 2.0s ease-out forwards',
                  zIndex: 1,
                }}
              />

              {/* Blue Logo: Zooms to almost cover screen + blurs over 2.0s */}
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
                  animation: 'crx-blue-zoom-blur 2.0s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
                  zIndex: 3,
                }}
              />
            </>
          )}

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* 2. RED LOGO PHASE (2.0s+): Shrinks & Focuses Inward          */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {isRed && (
            <>
              {/* Red ambient aura */}
              <div
                style={{
                  position: 'absolute',
                  width: 210,
                  height: 210,
                  borderRadius: '50%',
                  background: 'rgba(220, 38, 38, 0.45)',
                  filter: 'blur(35px)',
                  animation:
                    phase === 'red-shrink'
                      ? 'crx-red-aura-settle 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards'
                      : 'crx-red-settled-pulse 2.5s ease-in-out infinite',
                  zIndex: 1,
                }}
              />

              {/* Red Logo: Starts zoomed & blurred (4.8x, 24px) -> shrinks into centre (1x, 0px) */}
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
                  transformOrigin: 'center center',
                  boxShadow: '0 0 32px rgba(220, 38, 38, 0.7), 0 0 65px rgba(185, 28, 28, 0.35)',
                  animation:
                    phase === 'red-shrink'
                      ? 'crx-red-shrink-focus 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards'
                      : 'translate(-50%, -50%) scale(1)',
                  zIndex: 3,
                }}
              />

              {/* ═════════════════════════════════════════════════════════ */}
              {/* 3. CIRCULAR 0% – 100% PROGRESS RING (Once settled)        */}
              {/* ═════════════════════════════════════════════════════════ */}
              {phase === 'red-loading' && (
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
              )}
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
          {phase === 'red-loading' ? (
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
