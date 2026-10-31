import React, { useEffect, useState, useRef } from 'react';
import DynamicBackground from './DynamicBackground';

/**
 * Preloader — Cinematic Logo Morph with Circular 0-100% Loader:
 *
 * Stage 0 (0.0s – 0.6s): Old blue logo holds with initial blue glow
 * Stage 1 (0.6s – 1.8s): Old logo zooms in deep (1x -> 8x) & blurs (0 -> 35px)
 *                        into the red core. Blue light completely fades to 0.
 * Stage 2 (1.8s – 2.0s): Flash burst transition. Zero blue remains.
 * Stage 3 (2.0s – 3.8s): New red logo materializes.
 *                        A circular progress ring animates around it (0% -> 100%)
 *                        with a digital percentage counter.
 * Stage 4 (3.8s – 4.1s): Progress hits 100% -> onDone() triggers -> site opens!
 */
export default function Preloader({ onDone }) {
  const [stage, setStage] = useState(0); // 0: blue hold, 1: zoom/blur, 2: flash, 3: new logo + ring
  const [progress, setProgress] = useState(0);
  const onDoneCalledRef = useRef(false);

  useEffect(() => {
    // Stage 1: Begin zoom & blur at 600ms
    const t1 = setTimeout(() => setStage(1), 600);

    // Stage 2: Flash & clear all blue at 1800ms
    const t2 = setTimeout(() => setStage(2), 1800);

    // Stage 3: New logo + 0-100% circle animation starts at 2000ms
    const t3 = setTimeout(() => setStage(3), 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // 0% -> 100% Progress Animation in Stage 3
  useEffect(() => {
    if (stage !== 3) return;

    let startTime = performance.now();
    const duration = 1800; // 1.8 seconds to trace 0 -> 100%
    let animId;

    const tick = (now) => {
      const elapsed = now - startTime;
      const p = Math.min(100, (elapsed / duration) * 100);
      setProgress(p);

      if (p < 100) {
        animId = requestAnimationFrame(tick);
      } else {
        // Finished 100% — hold momentarily then open the website
        setTimeout(() => {
          if (!onDoneCalledRef.current) {
            onDoneCalledRef.current = true;
            if (onDone) onDone();
          }
        }, 350);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [stage, onDone]);

  // SVG circular geometry
  const SVG_SIZE = 280;
  const RADIUS = 124;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~779.11
  const strokeOffset = CIRCUMFERENCE - (CIRCUMFERENCE * progress) / 100;

  // Position of glowing laser tip on the circle
  const angle = (progress / 100) * 2 * Math.PI - Math.PI / 2;
  const tipX = 140 + RADIUS * Math.cos(angle);
  const tipY = 140 + RADIUS * Math.sin(angle);

  return (
    <>
      <style>
        {`
          /* Old blue logo: Hold then Zoom (1 to 8x) + Blur (0 to 35px) */
          @keyframes crx-blue-dive {
            0% {
              transform: translate(-50%, -50%) scale(1);
              filter: blur(0px);
              opacity: 1;
            }
            80% {
              transform: translate(-50%, -50%) scale(7.5);
              filter: blur(32px);
              opacity: 0.7;
            }
            100% {
              transform: translate(-50%, -50%) scale(8.5);
              filter: blur(40px);
              opacity: 0;
            }
          }

          /* Blue aura: Fades out completely during zoom — NEVER persistent */
          @keyframes crx-blue-aura-fadeout {
            0% {
              opacity: 0.8;
              transform: scale(1);
            }
            40% {
              opacity: 0.3;
              transform: scale(1.4);
            }
            70%, 100% {
              opacity: 0;
              transform: scale(1.8);
            }
          }

          /* Crimson surge that overtakes the blue and enters the red crest */
          @keyframes crx-crimson-surge {
            0% {
              opacity: 0;
            }
            50% {
              opacity: 0.85;
            }
            100% {
              opacity: 0.4;
            }
          }

          /* Transition flash between blue and new red logo */
          @keyframes crx-flash-transition {
            0% {
              opacity: 0;
              transform: scale(0.6);
            }
            50% {
              opacity: 0.95;
              transform: scale(1.6);
            }
            100% {
              opacity: 0;
              transform: scale(2.4);
            }
          }

          /* New logo reveal: sharp fade-in from center */
          @keyframes crx-new-logo-in {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.85);
              filter: blur(10px);
            }
            100% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
              filter: blur(0px);
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

        {/* ── Crimson surge that builds as we zoom into the red core ── */}
        {stage >= 1 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.95) 0%, rgba(140, 18, 40, 0.75) 45%, rgba(10, 3, 5, 0.95) 100%)',
              animation: 'crx-crimson-surge 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* ── Central White Flash Transition (Stage 2) ── */}
        {stage === 2 && (
          <div
            style={{
              position: 'absolute',
              width: 'min(500px, 90vw)',
              height: 'min(500px, 90vw)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(254,202,202,0.6) 40%, transparent 70%)',
              animation: 'crx-flash-transition 0.4s ease-out forwards',
              zIndex: 6,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* ── Central Stage Container ── */}
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
          {/* 1. BLUE AURA: strictly visible only in stage 0 and fading out in stage 1 */}
          {stage < 2 && (
            <div
              style={{
                position: 'absolute',
                width: 210,
                height: 210,
                borderRadius: '50%',
                background: 'rgba(59, 130, 246, 0.55)',
                filter: 'blur(45px)',
                animation: stage === 1 ? 'crx-blue-aura-fadeout 1.2s ease-out forwards' : 'none',
                zIndex: 1,
              }}
            />
          )}

          {/* 2. OLD BLUE LOGO: Zooms in and blurs into red center (Stages 0 & 1 only) */}
          {stage < 2 && (
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
                boxShadow: stage === 0 ? '0 0 35px rgba(59, 130, 246, 0.65)' : 'none',
                transformOrigin: 'center center',
                animation: stage === 1 ? 'crx-blue-dive 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards' : 'translate(-50%, -50%) scale(1)',
                zIndex: 3,
              }}
            />
          )}

          {/* 3. NEW RED LOGO & CIRCULAR PROGRESS RING (Stage 3 & 4) */}
          {stage >= 3 && (
            <>
              {/* Red glow behind the new logo */}
              <div
                style={{
                  position: 'absolute',
                  width: 210,
                  height: 210,
                  borderRadius: '50%',
                  background: 'rgba(220, 38, 38, 0.45)',
                  filter: 'blur(35px)',
                  zIndex: 2,
                }}
              />

              {/* New Red Logo Image */}
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
                  boxShadow: '0 0 30px rgba(220, 38, 38, 0.7), 0 0 60px rgba(185, 28, 28, 0.35)',
                  animation: 'crx-new-logo-in 0.5s ease-out forwards',
                  zIndex: 4,
                }}
              />

              {/* SVG 0 - 100% Circular Progress Ring Around the Logo */}
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
                    <stop offset="50%" stopColor="#DC2626" />
                    <stop offset="100%" stopColor="#B91C1C" />
                  </linearGradient>
                  <filter id="crxGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Background track circle */}
                <circle
                  cx={140}
                  cy={140}
                  r={RADIUS}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="3.5"
                />

                {/* Animated active progress circle (0 to 100%) */}
                <circle
                  cx={140}
                  cy={140}
                  r={RADIUS}
                  fill="none"
                  stroke="url(#crxProgressGrad)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={strokeOffset}
                  transform="rotate(-90 140 140)"
                  filter="url(#crxGlow)"
                  style={{
                    transition: 'stroke-dashoffset 0.05s linear',
                  }}
                />

                {/* Glowing Laser Tip at leading edge */}
                {progress > 0 && progress < 100 && (
                  <circle
                    cx={tipX}
                    cy={tipY}
                    r={5}
                    fill="#FFFFFF"
                    style={{
                      filter: 'drop-shadow(0 0 6px #DC2626) drop-shadow(0 0 10px #FFFFFF)',
                    }}
                  />
                )}
              </svg>
            </>
          )}
        </div>

        {/* ── Percentage Counter & Status (Stage 3 & 4) ── */}
        {stage >= 3 && (
          <div
            style={{
              position: 'relative',
              zIndex: 7,
              textAlign: 'center',
              marginTop: 24,
            }}
          >
            {/* 0 - 100% Digital Counter */}
            <div
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                fontSize: 'clamp(22px, 4vw, 28px)',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: 2.5,
                textShadow: '0 0 14px rgba(220, 38, 38, 0.8), 0 0 28px rgba(220, 38, 38, 0.4)',
              }}
            >
              {Math.round(progress)}%
            </div>

            {/* Sub-label */}
            <div
              style={{
                fontSize: 11,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: progress >= 100 ? '#4ADE80' : 'rgba(255, 255, 255, 0.5)',
                marginTop: 6,
                transition: 'color 0.25s ease',
              }}
            >
              {progress >= 100 ? 'INITIALIZATION COMPLETE' : 'CALIBRATING CORE'}
            </div>
          </div>
        )}

        {/* ── Subtitle before Stage 3 ── */}
        {stage < 3 && (
          <div
            style={{
              position: 'absolute',
              bottom: 'max(35px, 6vh)',
              zIndex: 7,
              fontFamily: 'var(--font-sans)',
              fontSize: 11.5,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.4)',
            }}
          >
            Initializing
          </div>
        )}
      </div>
    </>
  );
}
