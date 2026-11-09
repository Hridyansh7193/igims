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
          width: '100%',
          maxWidth: '100vw',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          paddingTop: 'clamp(80px, 15vh, 120px)',
          paddingBottom: 60,
          paddingLeft: 16,
          paddingRight: 16,
          position: 'relative',
          overflow: 'hidden',
          contain: 'paint',
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

        {/* Contained Video Background Layer to prevent Ken Burns scale from leaking overflow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            contain: 'paint',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
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
              opacity: 0.95,
              filter: 'contrast(1.05) saturate(1.15)',
              animation: 'kenburns 25s ease-in-out infinite alternate',
              zIndex: 0,
            }}
          >
            <source src="/events-bg.mp4" type="video/mp4" />
          </video>

          {/* Authentic Concert Atmosphere Vignette (Clean edge transitions, no artificial scanlines) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(ellipse at 50% 50%, rgba(12, 8, 10, 0.25) 0%, rgba(12, 8, 10, 0.7) 85%, #0C080A 100%),
                linear-gradient(180deg, rgba(8, 5, 6, 0.65) 0%, transparent 20%, transparent 75%, #0C080A 100%)
              `,
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Foreground Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: 1120,
            boxSizing: 'border-box',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Tagline Sticker Badge */}
          <Sticker
            tone="gold"
            rotate={0}
            style={{
              marginBottom: 18,
              fontSize: 'clamp(11px, 2.4vw, 13px)',
              letterSpacing: '1px',
              padding: '8px 20px',
              maxWidth: '92vw',
              lineHeight: 1.45,
              whiteSpace: 'normal',
              textAlign: 'center',
              boxSizing: 'border-box',
              display: 'inline-block',
            }}
          >
            India's Biggest Medical College <br className="crx-mobile-break" />Cultural &amp; Sports Festival
          </Sticker>

          {/* Giant Centerpiece Title */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 1200,
              boxSizing: 'border-box',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '8px auto 24px',
            }}
          >
            <div
              style={{
                padding: '6px 12px',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <h1 style={{ margin: '0 auto', lineHeight: 1, maxWidth: '100%', textAlign: 'center' }}>
                {titleSettled ? (
                  <span
                    style={{
                      color: 'var(--cream)',
                      fontFamily: "'Anton', 'Impact', sans-serif",
                      fontSize: 'clamp(46px, 13.5vw, 148px)',
                      fontWeight: 900,
                      lineHeight: 1,
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      textAlign: 'center',
                      display: 'inline-block',
                      textShadow: '0 4px 24px rgba(0, 0, 0, 0.95), 0 2px 8px rgba(0, 0, 0, 0.9)',
                    }}
                  >
                    CEREBREXIA'26
                  </span>
                ) : (
                  <GlitchText
                    text="CEREBREXIA'26"
                    start={revealTitle}
                    duration={900}
                    onDone={() => {
                      heroTitleRevealedOnce = true;
                      setTitleSettled(true);
                    }}
                    style={{
                      color: 'var(--cream)',
                      fontFamily: "'Anton', 'Impact', sans-serif",
                      fontSize: 'clamp(46px, 13.5vw, 148px)',
                      fontWeight: 900,
                      lineHeight: 1,
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      textAlign: 'center',
                      display: 'inline-block',
                      textShadow: '0 4px 24px rgba(0, 0, 0, 0.95), 0 2px 8px rgba(0, 0, 0, 0.9)',
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
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxWidth: 640,
              boxSizing: 'border-box',
              textAlign: 'center',
              margin: '0 auto 34px',
              padding: '0 16px',
            }}
          >
            <p
              style={{
                margin: '0 auto',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                fontSize: 'clamp(14px, 2vw, 17px)',
                lineHeight: 1.65,
                color: 'var(--paper)',
                fontWeight: 500,
                fontFamily: "'Space Grotesk', sans-serif",
                wordBreak: 'break-word',
                textAlign: 'center',
              }}
            >
              Four days. Hundreds of stages. One incredible story, and you're in it. The 51st edition returns louder than ever.
            </p>
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
