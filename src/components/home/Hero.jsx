import React, { useState } from 'react';
import GlitchText from '../common/GlitchText';
import Sticker from '../common/Sticker';

// Persists across Hero remounts (e.g. switching tabs and back to Home) so the
// glitch reveal only ever plays once, instead of re-triggering (and sometimes
// failing to resolve) every time the Home page mounts again.
let heroTitleRevealedOnce = false;

export default function Hero({ setPage, revealTitle = true }) {
  const [titleSettled, setTitleSettled] = useState(heroTitleRevealedOnce);
  return (
    <>
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '120px 20px 60px',
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--navy-void)',
        }}
      >
        {/* CSS for Ken Burns Effect */}
        <style>
          {`
            @keyframes kenburns {
              0% { transform: scale(1.05); }
              100% { transform: scale(1.2); }
            }
          `}
        </style>
        {/* Full-screen video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.75,
            filter: 'contrast(1.1) saturate(1.2)',
            animation: 'kenburns 25s ease-in-out infinite alternate',
            zIndex: 0,
          }}
        >
          <source src="/events-bg.mp4" type="video/mp4" />
        </video>

        {/* Cosmic Vignette Overlay — matches the navy/cyan/gold theme used site-wide */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse at 50% 0%, rgba(56, 189, 248, 0.10), transparent 55%),
              radial-gradient(ellipse at 100% 100%, rgba(251, 191, 36, 0.08), transparent 55%),
              radial-gradient(ellipse at 50% 50%, rgba(5, 8, 20, 0.25) 0%, rgba(5, 8, 20, 0.6) 65%, rgba(5, 8, 20, 0.92) 100%),
              linear-gradient(180deg, rgba(5, 8, 20, 0.55) 0%, rgba(5, 8, 20, 0.15) 25%, rgba(5, 8, 20, 0.15) 75%, rgba(5, 8, 20, 0.9) 100%)
            `,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Subtle Film Grain / Scanline Texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px)',
            opacity: 0.35,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        {/* Foreground Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: 1180,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Tagline Sticker Badge — same component used across the rest of the site */}
          <Sticker tone="gold" rotate={-2} style={{ marginBottom: 22, fontSize: 11.5 }}>
            India's Biggest Medical College Cultural Festival
          </Sticker>

          {/* Giant Centerpiece Title */}
          <div
            style={{
              position: 'relative',
              width: '100vw',
              maxWidth: 1100,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '10px 0 24px',
            }}
          >
            <div
              style={{
                padding: '10px 24px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <h1 style={{ margin: 0, lineHeight: 1 }}>
                {titleSettled ? (
                  <span
                    style={{
                      color: '#FFFFFF',
                      fontFamily: "'Anton', 'Impact', sans-serif",
                      fontSize: 'clamp(52px, 11vw, 135px)',
                      fontWeight: 900,
                      lineHeight: 1,
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      textShadow: '0 4px 20px rgba(0, 0, 0, 0.9), 0 2px 8px rgba(0, 0, 0, 0.9)',
                    }}
                  >
                    CEREBREXIA'26
                  </span>
                ) : (
                  <GlitchText
                    text="CEREBREXIA'26"
                    start={revealTitle}
                    duration={950}
                    onDone={() => {
                      heroTitleRevealedOnce = true;
                      setTitleSettled(true);
                    }}
                    style={{
                      color: '#FFFFFF',
                      fontFamily: "'Anton', 'Impact', sans-serif",
                      fontSize: 'clamp(52px, 11vw, 135px)',
                      fontWeight: 900,
                      lineHeight: 1,
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      textShadow: '0 4px 20px rgba(0, 0, 0, 0.9), 0 2px 8px rgba(0, 0, 0, 0.9)',
                    }}
                  />
                )}
              </h1>
            </div>
          </div>

          {/* Subtitle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              maxWidth: 600,
              textAlign: 'center',
              margin: '0 auto 34px',
              padding: '0 16px',
              justifyContent: 'center',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 'clamp(13px, 1.8vw, 15.5px)',
                lineHeight: 1.65,
                color: 'var(--paper)',
                fontWeight: 500,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Four days. Hundreds of stages. One incredible story, and you're in it. The 51st edition returns louder than ever.
            </p>
          </div>

          {/* Action Buttons — primary (gold) + secondary (cyan), same classes used everywhere else */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button className="crx-btn gold" onClick={() => setPage('events')}>
              Explore Events
            </button>

            <button className="crx-btn cyan" onClick={() => setPage('team')}>
              Ride The Roadtrips
            </button>
          </div>
        </div>

        {/* Bottom "S C R O L L" Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            opacity: 0.7,
          }}
        >
          <span
            style={{
              fontSize: 10,
              letterSpacing: '5px',
              color: 'var(--muted)',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
              fontWeight: 600,
              paddingLeft: '5px',
            }}
          >
            SCROLL
          </span>
          <div
            style={{
              width: 1,
              height: 22,
              background: 'linear-gradient(180deg, rgba(148, 163, 184, 0.6) 0%, transparent 100%)',
            }}
          />
        </div>
      </section>
    </>
  );
}
