import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Reveal from '../common/Reveal';
import Sticker from '../common/Sticker';
import BasicRegistrationModal from '../common/BasicRegistrationModal';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Ticket, Trophy, ArrowRight } from 'lucide-react';

export default function RegistrationOptionsSection({ setPage }) {
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

  const handleBRSuccess = () => {
    setShowBRModal(false);
    setToast({
      title: 'Basic Registration Confirmed!',
      text: 'Concert & Pronites registration (BR) secured. You are registered under your single candidate ID.',
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
          padding: '60px 24px 80px',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '100vw',
          contain: 'paint',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <Sticker tone="cyan" rotate={-1} style={{ marginBottom: 16 }}>
                Official Registration
              </Sticker>
              <h2
                className="crx-display"
                style={{
                  fontSize: 'clamp(28px, 5.5vw, 48px)',
                  color: 'var(--cream)',
                  margin: '0 0 14px',
                  letterSpacing: 0.5,
                }}
              >
                CHOOSE YOUR ACCESS
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: 'var(--paper)',
                  lineHeight: 1.7,
                  maxWidth: 620,
                  margin: '0 auto',
                }}
              >
                Step into the arena to compete across 70+ sports and cultural events, or claim your exclusive star celebrity pronites entry with Basic Registration (BR).
              </p>
            </div>
          </Reveal>

          {/* Action Columns — Explore Events & Basic Registration (BR) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 22,
              width: '100%',
              maxWidth: 820,
              margin: '0 auto',
              boxSizing: 'border-box',
            }}
          >
            {/* Column 1: Explore Events */}
            <Reveal delay={0.05}>
              <div
                style={{
                  background: 'rgba(25, 7, 10, 0.85)',
                  border: '1px solid rgba(176, 141, 87, 0.4)',
                  borderRadius: 18,
                  padding: '24px',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 16,
                  textAlign: 'left',
                  height: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>
                      70+ COMPETITIONS
                    </span>
                    <span style={{ fontSize: 10, background: 'rgba(176,141,87,0.18)', color: 'var(--gold)', padding: '3px 10px', borderRadius: 10, fontWeight: 700 }}>
                      All Courts
                    </span>
                  </div>
                  <h3 className="crx-display" style={{ fontSize: 24, color: '#fff', margin: '0 0 8px' }}>
                    EXPLORE EVENTS
                  </h3>
                  <p style={{ margin: 0, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.55 }}>
                    Compete across Sports, Cultural, Dance, Music, Literary &amp; Fine Arts arenas.
                  </p>
                </div>
                <button
                  className="crx-btn gold"
                  onClick={() => setPage('events')}
                  style={{ width: '100%', justifyContent: 'center', padding: '12px 20px', fontSize: 13 }}
                >
                  EXPLORE EVENTS &rarr;
                </button>
              </div>
            </Reveal>

            {/* Column 2: Basic Registration (BR) */}
            <Reveal delay={0.1}>
              <div
                style={{
                  background: 'rgba(5, 15, 25, 0.85)',
                  border: '1px solid rgba(0, 240, 255, 0.4)',
                  borderRadius: 18,
                  padding: '24px',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.6), 0 0 28px rgba(0, 240, 255, 0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 16,
                  textAlign: 'left',
                  height: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: '#00F0FF', fontWeight: 700 }}>
                      CONCERT &amp; PRONITES ONLY
                    </span>
                    <span style={{ fontSize: 10, background: 'rgba(0, 240, 255, 0.18)', color: '#00F0FF', padding: '3px 10px', borderRadius: 10, fontWeight: 700 }}>
                      ₹2000 Fee
                    </span>
                  </div>
                  <h3 className="crx-display" style={{ fontSize: 24, color: '#fff', margin: '0 0 8px' }}>
                    BASIC REGISTRATION (BR)
                  </h3>
                  <p style={{ margin: 0, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.55 }}>
                    Concert &amp; pronites only. Pay &amp; register for pronites without entering any competitive event.
                  </p>
                </div>
                <button
                  className="crx-btn gold"
                  onClick={handleBRClick}
                  style={{ width: '100%', justifyContent: 'center', padding: '12px 20px', fontSize: 13 }}
                >
                  BASIC REGISTRATION (BR) &rarr;
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

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
    </>
  );
}

