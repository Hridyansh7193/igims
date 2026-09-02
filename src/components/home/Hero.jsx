import React from 'react';
import GlitchText from '../common/GlitchText';

export default function Hero({ setPage, revealTitle = true }) {
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
          background: '#0D0709',
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
            opacity: 0.5,
            filter: 'contrast(1.2) saturate(1.2) sepia(0.1)',
            animation: 'kenburns 25s ease-in-out infinite alternate',
            zIndex: 0,
          }}
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-crowd-in-front-of-a-stage-at-a-concert-14571-large.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Vignette Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse at 50% 50%, rgba(13, 7, 9, 0.4) 0%, rgba(13, 7, 9, 0.85) 65%, rgba(13, 7, 9, 0.98) 100%),
              linear-gradient(180deg, rgba(13, 7, 9, 0.75) 0%, rgba(13, 7, 9, 0.3) 25%, rgba(13, 7, 9, 0.3) 75%, rgba(13, 7, 9, 0.97) 100%)
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
            opacity: 0.4,
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
          {/* Diamond Tagline */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16,
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: 'clamp(11px, 1.5vw, 13px)',
              fontWeight: 800,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            <span style={{ color: '#FDC23E', fontSize: 14 }}>◆</span>
            <span>INDIA'S BIGGEST MEDICAL COLLEGE CULTURAL FESTIVAL</span>
          </div>

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
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(4px)',
                padding: '10px 24px',
                width: '100%',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.9)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <h1 style={{ margin: 0, lineHeight: 1 }}>
                <GlitchText
                  text="CEREBREXIA'26"
                  start={revealTitle}
                  duration={950}
                  style={{
                    color: '#FFFFFF',
                    fontFamily: "'Anton', 'Impact', sans-serif",
                    fontSize: 'clamp(52px, 11vw, 135px)',
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
                  }}
                />
              </h1>
            </div>
          </div>

          {/* Subtitle with Target Reticle */}
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
                color: 'rgba(255, 255, 255, 0.82)',
                fontWeight: 500,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Four days. Hundreds of stages. One incredible story, and you're in it. The 51st edition returns louder than ever.
            </p>
          </div>

          {/* Sticker-Style Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {/* EXPLORE EVENTS — Yellow */}
            <button
              onClick={() => setPage('events')}
              style={{
                background: '#FDC23E',
                color: '#181014',
                border: '2px solid #181014',
                borderRadius: 14,
                boxShadow: '4px 4px 0 #181014',
                padding: '14px 32px',
                fontSize: 13.5,
                fontWeight: 800,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(2px, 2px)';
                e.currentTarget.style.boxShadow = '2px 2px 0 #181014';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = '4px 4px 0 #181014';
              }}
            >
              EXPLORE EVENTS
            </button>

            {/* RIDE THE ROADTRIPS — Coral Red */}
            <button
              onClick={() => setPage('team')}
              style={{
                background: '#FF4B3A',
                color: '#FFFFFF',
                border: '2px solid #181014',
                borderRadius: 14,
                boxShadow: '4px 4px 0 #181014',
                padding: '14px 32px',
                fontSize: 13.5,
                fontWeight: 800,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(2px, 2px)';
                e.currentTarget.style.boxShadow = '2px 2px 0 #181014';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = '4px 4px 0 #181014';
              }}
            >
              RIDE THE ROADTRIPS
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
              color: 'rgba(255, 255, 255, 0.65)',
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
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, transparent 100%)',
            }}
          />
        </div>
      </section>
    </>
  );
}
