import React, { useEffect } from 'react';
import DynamicBackground from './DynamicBackground';

/**
 * Preloader — Cinematic Logo Morph:
 *
 * 1. (0.0s – 0.7s): Crisp old blue logo displayed with blue aura
 * 2. (0.7s – 2.5s): Old logo simultaneously zooms in (scale 1 -> 7.5) and blurs (0 -> 35px)
 *                   diving deep into the red center crest, while a rich crimson-red
 *                   atmosphere engulfs the screen
 * 3. (2.5s – 2.9s): High-energy radiant flash transition
 * 4. (2.7s – 3.8s): New red Cerebrexia logo materializes crisply from the center
 * 5. (3.8s): onDone() fires -> curtain wipe reveals the portal
 */
export default function Preloader({ onDone }) {
  useEffect(() => {
    // Exact timestamp when intro completes and site reveals
    const timer = setTimeout(() => {
      if (onDone) onDone();
    }, 3900);

    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <>
      <style>
        {`
          /* Old blue logo: Hold -> Zoom in (1 to 7.5x) + Blur (0 to 35px) simultaneously */
          @keyframes crx-old-logo-dive {
            0% {
              transform: translate(-50%, -50%) scale(1);
              filter: blur(0px);
              opacity: 1;
            }
            15% {
              transform: translate(-50%, -50%) scale(1);
              filter: blur(0px);
              opacity: 1;
            }
            55% {
              transform: translate(-50%, -50%) scale(7.5);
              filter: blur(32px);
              opacity: 0.95;
            }
            62% {
              transform: translate(-50%, -50%) scale(9);
              filter: blur(40px);
              opacity: 0;
            }
            100% {
              transform: translate(-50%, -50%) scale(9);
              filter: blur(40px);
              opacity: 0;
            }
          }

          /* Ambient blue aura that transitions into red */
          @keyframes crx-ambient-aura {
            0%, 15% {
              background: rgba(59, 130, 246, 0.55);
              filter: blur(50px);
              transform: scale(1);
            }
            45% {
              background: rgba(220, 38, 38, 0.85);
              filter: blur(60px);
              transform: scale(2.2);
            }
            60%, 100% {
              background: rgba(220, 38, 38, 0.5);
              filter: blur(45px);
              transform: scale(1);
            }
          }

          /* Crimson surge: builds up as we dive into the red part of the logo */
          @keyframes crx-red-surge {
            0%, 15% {
              opacity: 0;
            }
            45% {
              opacity: 0.9;
            }
            58% {
              opacity: 0.95;
            }
            70% {
              opacity: 0.35;
            }
            100% {
              opacity: 0.2;
            }
          }

          /* High-intensity radiant flash at the transition moment */
          @keyframes crx-flash-burst {
            0%, 53% {
              opacity: 0;
              transform: scale(0.6);
            }
            58% {
              opacity: 0.9;
              transform: scale(1.5);
            }
            68% {
              opacity: 0;
              transform: scale(2.5);
            }
            100% {
              opacity: 0;
            }
          }

          /* New red logo: emerges from the crimson flash */
          @keyframes crx-new-logo-reveal {
            0%, 55% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.75);
              filter: blur(16px);
            }
            65% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1.05);
              filter: blur(0px);
            }
            75% {
              transform: translate(-50%, -50%) scale(1);
            }
            90% {
              transform: translate(-50%, -50%) scale(1.03);
            }
            100% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
              filter: blur(0px);
            }
          }

          /* Subtitle text transition */
          @keyframes crx-subtitle-fade {
            0%, 15% {
              opacity: 1;
              color: rgba(255, 255, 255, 0.4);
            }
            45% {
              opacity: 0;
            }
            65% {
              opacity: 0;
            }
            72%, 100% {
              opacity: 1;
              color: #DC2626;
            }
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
          background: 'radial-gradient(ellipse at 50% 45%, #18060A 0%, #0C0508 55%, #050204 100%)',
          overflow: 'hidden',
          zIndex: 99999,
        }}
      >
        {/* Dynamic ambient particles */}
        <DynamicBackground />

        {/* Full-screen crimson surge that engulfs the view during the zoom */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.95) 0%, rgba(140, 18, 40, 0.8) 45%, rgba(10, 3, 5, 0.95) 100%)',
            animation: 'crx-red-surge 3.9s cubic-bezier(0.25, 1, 0.5, 1) forwards',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        {/* Central radiant white/gold transition flash */}
        <div
          style={{
            position: 'absolute',
            width: 'min(500px, 90vw)',
            height: 'min(500px, 90vw)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(254,202,202,0.6) 40%, transparent 70%)',
            animation: 'crx-flash-burst 3.9s ease-out forwards',
            zIndex: 6,
            pointerEvents: 'none',
          }}
        />

        {/* Logo Container */}
        <div
          style={{
            position: 'relative',
            zIndex: 4,
            width: 'min(300px, 75vw)',
            height: 'min(300px, 75vw)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Glowing Aura behind the logos */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              animation: 'crx-ambient-aura 3.9s ease-in-out forwards',
            }}
          />

          {/* ── 1. OLD LOGO (BLUE): Zooms in + blurs into the red center ── */}
          <img
            src="/new-logo-blue.png"
            alt="Cerebrexia Blue Logo"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 'min(240px, 62vw)',
              height: 'min(240px, 62vw)',
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 0 35px rgba(59, 130, 246, 0.65)',
              transformOrigin: 'center center',
              animation: 'crx-old-logo-dive 3.9s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
              zIndex: 3,
            }}
          />

          {/* ── 2. NEW LOGO (RED): Emerges cleanly from the red glow ── */}
          <img
            src="/new-logo.jpg"
            alt="Cerebrexia Red Logo"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 'min(240px, 62vw)',
              height: 'min(240px, 62vw)',
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 0 45px rgba(220, 38, 38, 0.8), 0 0 90px rgba(185, 28, 28, 0.4)',
              transformOrigin: 'center center',
              animation: 'crx-new-logo-reveal 3.9s cubic-bezier(0.22, 1, 0.36, 1) forwards',
              zIndex: 5,
            }}
          />
        </div>

        {/* Tagline */}
        <div
          style={{
            position: 'absolute',
            bottom: 'max(35px, 6vh)',
            zIndex: 7,
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            fontWeight: 600,
            animation: 'crx-subtitle-fade 3.9s ease-in-out forwards',
          }}
        >
          The Crowned Diagnosis
        </div>
      </div>
    </>
  );
}
