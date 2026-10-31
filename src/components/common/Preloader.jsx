import React, { useEffect, useState, useRef } from 'react';
import DynamicBackground from './DynamicBackground';

/**
 * Preloader — Cinematic Organic Morph:
 *
 * 1. (0.0s – 0.6s): Blue logo rests centered and sharp.
 * 2. (0.6s – 2.2s): Blue logo smoothly zooms up (1x -> 4.8x) & blurs (0 -> 24px).
 * 3. (2.2s – 3.2s): DELAYED TRANSITION (No sudden cut):
 *                   Screen breathes in a soft atmospheric blur as the blue fades out
 *                   and the blurred red logo (4.8x, 24px blur) fades in organically.
 * 4. (3.2s – 4.8s): Red logo smoothly zooms out / shrinks (4.8x -> 1.0x) and clarifies
 *                   (24px -> 0px) into its crisp resting place in the centre.
 * 5. (4.8s – 7.6s): Red logo sits in the centre while an unhurried 0% - 100% circular
 *                   loader traces around its perimeter with digital counter.
 * 6. (7.6s – 8.0s): Holds at 100% complete, then website opens smoothly!
 */
export default function Preloader({ onDone }) {
  // 'morphing' (0.0s - 4.8s) -> 'red-loading' (4.8s - 7.6s) -> 'done'
  const [phase, setPhase] = useState('morphing');
  const [progress, setProgress] = useState(0);
  const onDoneCalledRef = useRef(false);

  useEffect(() => {
    // Morph completes at 4.8s (after the red logo finishes zooming out & clarifying)
    const timer = setTimeout(() => {
      setPhase('red-loading');
    }, 4800);

    return () => clearTimeout(timer);
  }, []);

  // 0% -> 100% unhurried circular loader during 'red-loading' (2.8 seconds)
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

  const isMorphing = phase === 'morphing';
  const isLoading = phase === 'red-loading';

  return (
    <>
      <style>
        {`
          /* ── 1. Blue Logo: Hold (0.6s) -> Zoom/Blur (1.6s) -> Gentle Dissolve (0.8s) ── */
          @keyframes crx-blue-morph {
            0%, 12% {
              transform: translate(-50%, -50%) scale(1);
              filter: blur(0px);
              opacity: 1;
            }
            45% {
              transform: translate(-50%, -50%) scale(4.8);
              filter: blur(24px);
              opacity: 1;
            }
            64%, 100% {
              transform: translate(-50%, -50%) scale(4.8);
              filter: blur(28px);
              opacity: 0;
            }
          }

          /* Blue Aura: Expands and gently dissolves out */
          @keyframes crx-blue-aura-morph {
            0%, 12% {
              opacity: 0.55;
              transform: scale(1);
            }
            45% {
              opacity: 0.3;
              transform: scale(3);
            }
            64%, 100% {
              opacity: 0;
              transform: scale(3.5);
            }
          }

          /* ── 2. Red Logo: Delayed cross-fade in at 4.8x/24px blur, then Zoom-Out & Clarify to 1.0x/0px blur ── */
          @keyframes crx-red-morph {
            0%, 45% {
              transform: translate(-50%, -50%) scale(4.8);
              filter: blur(24px);
              opacity: 0;
            }
            66% {
              transform: translate(-50%, -50%) scale(4.8);
              filter: blur(24px);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(1);
              filter: blur(0px);
              opacity: 1;
            }
          }

          /* Red Aura: Cross-fades in during delayed window, then contracts to resting logo */
          @keyframes crx-red-aura-morph {
            0%, 45% {
              opacity: 0;
              transform: scale(3.5);
            }
            66% {
              opacity: 0.45;
              transform: scale(3.5);
            }
            100% {
              opacity: 0.65;
              transform: scale(1);
            }
          }

          /* Subtle breathing pulse once red logo is fully settled */
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
          {/* BLUE LOGO & AURA (Active during morphing phase, dissolves out)*/}
          {/* ═════════════════════════════════════════════════════════════ */}
          {isMorphing && (
            <>
              {/* Blue ambient aura */}
              <div
                style={{
                  position: 'absolute',
                  width: 210,
                  height: 210,
                  borderRadius: '50%',
                  background: 'rgba(59, 130, 246, 0.5)',
                  filter: 'blur(45px)',
                  animation: 'crx-blue-aura-morph 4.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
                  zIndex: 1,
                }}
              />

              {/* Blue Logo: Zooms in and blurs, then gently dissolves during delayed transition */}
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
                  animation: 'crx-blue-morph 4.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
                  zIndex: 2,
                }}
              />
            </>
          )}

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* RED LOGO & AURA (Cross-fades in, then zooms out & unblurs)    */}
          {/* ═════════════════════════════════════════════════════════════ */}
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
                animation: isMorphing
                  ? 'crx-red-aura-morph 4.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                  : 'crx-red-settled-pulse 2.5s ease-in-out infinite',
                zIndex: 1,
              }}
            />

            {/* Red Logo: Fades in blurred at 4.8x, then shrinks down to 1.0x & unblurs */}
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
                animation: isMorphing
                  ? 'crx-red-morph 4.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                  : 'translate(-50%, -50%) scale(1)',
                zIndex: 3,
              }}
            />
          </>

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* CIRCULAR 0% – 100% LOADER (Runs once red logo has settled)    */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {isLoading && (
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
          {isLoading ? (
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
