import React, { useState } from 'react';
import GlitchText from '../common/GlitchText';
import Sticker from '../common/Sticker';
import BasicRegistrationModal from '../common/BasicRegistrationModal';
import { useAuth } from '../../context/AuthContext';
import { Ticket, ArrowRight, CheckCircle2 } from 'lucide-react';
import { createPortal } from 'react-dom';

// Persists across Hero remounts (e.g. switching tabs and back to Home) so the
// glitch reveal only ever plays once, instead of re-triggering (and sometimes
// failing to resolve) every time the Home page mounts again.
let heroTitleRevealedOnce = false;

export default function Hero({ setPage, revealTitle = true }) {
  const [titleSettled, setTitleSettled] = useState(heroTitleRevealedOnce);
  const [showBRModal, setShowBRModal] = useState(false);
  const [toast, setToast] = useState(null);
  const { user } = useAuth();

  const handleBRClick = () => {
    if (!user) {
      if (setPage) setPage('dashboard');
      return;
    }
    setShowBRModal(true);
  };

  const handleBRSuccess = (savedProfile, brRecord) => {
    setShowBRModal(false);
    setToast({
      title: 'Basic Registration Confirmed!',
      text: 'Concert & Pronites pass secured. You are registered under your single candidate ID.',
    });
    setTimeout(() => setToast(null), 4500);
    if (setPage) {
      setTimeout(() => setPage('dashboard'), 1200);
    }
  };
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

          {/* Red Color-Tint Layer */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(190, 20, 35, 0.12)',
              mixBlendMode: 'color',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />

          {/* Light multiply pass */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(20, 4, 6, 0.1)',
              mixBlendMode: 'multiply',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />

          {/* Cosmic Vignette Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(ellipse at 50% 0%, rgba(179, 18, 58, 0.1), transparent 55%),
                radial-gradient(ellipse at 50% 50%, rgba(10, 5, 5, 0.2) 0%, rgba(10, 5, 5, 0.42) 65%, rgba(10, 5, 5, 0.72) 100%),
                linear-gradient(180deg, rgba(10, 5, 5, 0.45) 0%, rgba(10, 5, 5, 0.1) 25%, rgba(10, 5, 5, 0.1) 75%, rgba(10, 5, 5, 0.78) 100%)
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
        </div>

        {/* Foreground Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: 1180,
            boxSizing: 'border-box',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Tagline Sticker Badge — same component used across the rest of the site */}
          <Sticker
            tone="gold"
            rotate={0}
            style={{
              marginBottom: 22,
              fontSize: 'clamp(9.5px, 2.6vw, 11.5px)',
              letterSpacing: '1px',
              maxWidth: '92vw',
              lineHeight: 1.45,
              whiteSpace: 'normal',
              textAlign: 'center',
              boxSizing: 'border-box',
              display: 'inline-block',
            }}
          >
            India's Biggest Medical College <br className="crx-mobile-break" />Cultural Festival
          </Sticker>

          {/* Giant Centerpiece Title */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 1100,
              boxSizing: 'border-box',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '10px auto 24px',
            }}
          >
            <div
              style={{
                padding: '10px 14px',
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
                      fontSize: 'clamp(28px, 9.5vw, 120px)',
                      fontWeight: 900,
                      lineHeight: 1,
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      textAlign: 'center',
                      display: 'inline-block',
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
                      color: 'var(--cream)',
                      fontFamily: "'Anton', 'Impact', sans-serif",
                      fontSize: 'clamp(28px, 9.5vw, 120px)',
                      fontWeight: 900,
                      lineHeight: 1,
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      textAlign: 'center',
                      display: 'inline-block',
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
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxWidth: 600,
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
                fontSize: 'clamp(13px, 1.8vw, 15.5px)',
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

          {/* Action Columns — Explore Events & Basic Registration (BR) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16,
              width: '100%',
              maxWidth: 680,
              margin: '0 auto',
              boxSizing: 'border-box',
            }}
          >
            {/* Column 1: Explore Events */}
            <div
              style={{
                background: 'rgba(25, 7, 10, 0.75)',
                border: '1px solid rgba(176, 141, 87, 0.4)',
                borderRadius: 16,
                padding: '20px',
                backdropFilter: 'blur(14px)',
                boxShadow: '0 10px 32px rgba(0,0,0,0.6)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 12,
                textAlign: 'left',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 9.5, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>
                    70+ COMPETITIONS
                  </span>
                  <span style={{ fontSize: 9.5, background: 'rgba(176,141,87,0.18)', color: 'var(--gold)', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>
                    All Courts
                  </span>
                </div>
                <h3 className="crx-display" style={{ fontSize: 20, color: '#fff', margin: '0 0 5px' }}>
                  EXPLORE EVENTS
                </h3>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
                  Compete across Sports, Cultural, Dance, Music, Literary &amp; Fine Arts arenas.
                </p>
              </div>
              <button
                className="crx-btn gold"
                onClick={() => setPage('events')}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Explore Events &rarr;
              </button>
            </div>

            {/* Column 2: Basic Registration (BR) */}
            <div
              style={{
                background: 'rgba(5, 15, 25, 0.75)',
                border: '1px solid rgba(0, 240, 255, 0.4)',
                borderRadius: 16,
                padding: '20px',
                backdropFilter: 'blur(14px)',
                boxShadow: '0 10px 32px rgba(0,0,0,0.6), 0 0 25px rgba(0, 240, 255, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 12,
                textAlign: 'left',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 9.5, letterSpacing: 1.2, textTransform: 'uppercase', color: '#00F0FF', fontWeight: 700 }}>
                    CONCERT PASS ONLY
                  </span>
                  <span style={{ fontSize: 9.5, background: 'rgba(0, 240, 255, 0.18)', color: '#00F0FF', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>
                    ₹800 Fee
                  </span>
                </div>
                <h3 className="crx-display" style={{ fontSize: 20, color: '#fff', margin: '0 0 5px' }}>
                  BASIC REGISTRATION (BR)
                </h3>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
                  Concert pass only. Pay &amp; register for pronites without entering any competitive event.
                </p>
              </div>
              <button
                className="crx-btn cyan"
                onClick={handleBRClick}
                style={{ width: '100%', justifyContent: 'center', boxShadow: '0 0 16px rgba(0, 240, 255, 0.25)' }}
              >
                Basic Registration (BR) &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Basic Registration Modal */}
        {showBRModal && (
          <BasicRegistrationModal
            onClose={() => setShowBRModal(false)}
            onSuccess={handleBRSuccess}
          />
        )}

        {/* Toast Notification */}
        {toast && typeof document !== 'undefined' && createPortal(
          <div
            style={{
              position: 'fixed',
              bottom: 28,
              right: 28,
              zIndex: 999999,
              maxWidth: 380,
              background: 'linear-gradient(135deg, #09171C 0%, #050E12 100%)',
              border: '1px solid #00F0FF',
              boxShadow: '0 16px 40px rgba(0,0,0,0.8), 0 0 30px rgba(0, 240, 255, 0.25)',
              borderRadius: 14,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              animation: 'fadeInUp 0.3s ease-out',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'rgba(0, 240, 255, 0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CheckCircle2 size={16} color="#00F0FF" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 3px', fontSize: 13, fontWeight: 700, color: '#fff' }}>
                {toast.title}
              </p>
              <p style={{ margin: 0, fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.4 }}>
                {toast.text}
              </p>
            </div>
          </div>,
          document.body
        )}

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
