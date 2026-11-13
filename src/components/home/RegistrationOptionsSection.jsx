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

  const handleBRSuccess = (profile, basicReg) => {
    setShowBRModal(false);
    const isGroup = basicReg?.registration_type === 'GROUP';
    const count = basicReg?.group_size || 1;
    setToast({
      title: 'Registration Confirmed!',
      text: isGroup
        ? `Group Basic Registration (BR) for ${count} members secured. All members registered.`
        : 'Pronites Basic Registration (BR) secured successfully.',
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
          padding: '64px 24px 80px',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '100vw',
          contain: 'paint',
        }}
      >
        <div style={{ maxWidth: 1040, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <Sticker tone="gold" rotate={0} style={{ marginBottom: 12 }}>
                Official Registration
              </Sticker>
              <h2
                className="crx-display"
                style={{
                  fontSize: 'clamp(28px, 5vw, 44px)',
                  color: 'var(--crx-text-primary)',
                  margin: '0 0 12px',
                  letterSpacing: '0.5px',
                  fontWeight: 400,
                }}
              >
                CHOOSE YOUR ACCESS
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: 'var(--crx-text-secondary)',
                  lineHeight: 1.6,
                  maxWidth: 580,
                  margin: '0 auto',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Compete across 70+ sports and cultural events, or secure access to star pronites with Basic Registration (BR).
              </p>
            </div>
          </Reveal>

          {/* Action Columns — Explore Events & Basic Registration (BR) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
              width: '100%',
              maxWidth: 780,
              margin: '0 auto',
              boxSizing: 'border-box',
            }}
          >
            {/* Column 1: Explore Events */}
            <Reveal delay={0.04}>
              <div
                className="crx-card"
                style={{
                  background: 'var(--crx-card)',
                  border: '1px solid var(--crx-hairline-accent)',
                  borderRadius: 16,
                  padding: 24,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--crx-gold)', fontWeight: 600 }}>
                      70+ Competitions
                    </span>
                    <span style={{ fontSize: 11, background: 'rgba(212,175,106,0.1)', color: 'var(--crx-gold)', padding: '2px 8px', borderRadius: 6, fontWeight: 500 }}>
                      All courts
                    </span>
                  </div>
                  <h3 className="crx-display" style={{ fontSize: 24, color: 'var(--crx-text-primary)', margin: '0 0 8px', fontWeight: 400 }}>
                    EXPLORE EVENTS
                  </h3>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--crx-text-secondary)', lineHeight: 1.55 }}>
                    Compete across Sports, Cultural, Dance, Music, Literary and Fine Arts arenas.
                  </p>
                </div>
                <button
                  className="crx-btn gold"
                  onClick={() => setPage('events')}
                  style={{ width: '100%', justifyContent: 'center', minHeight: 44 }}
                >
                  Explore Events &rarr;
                </button>
              </div>
            </Reveal>

            {/* Column 2: Basic Registration (BR) */}
            <Reveal delay={0.08}>
              <div
                className="crx-card"
                style={{
                  background: 'var(--crx-card)',
                  border: '1px solid var(--crx-hairline-accent)',
                  borderRadius: 16,
                  padding: 24,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--crx-gold)', fontWeight: 600 }}>
                      Pronites Only
                    </span>
                    <span style={{ fontSize: 11, background: 'rgba(212,175,106,0.12)', color: 'var(--crx-gold)', padding: '2px 8px', borderRadius: 6, fontWeight: 600, border: '1px solid rgba(212,175,106,0.25)' }}>
                      Single &amp; Group Basic Registration (BR)
                    </span>
                  </div>
                  <h3 className="crx-display" style={{ fontSize: 24, color: 'var(--crx-text-primary)', margin: '0 0 8px', fontWeight: 400 }}>
                    BASIC REGISTRATION (BR)
                  </h3>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--crx-text-secondary)', lineHeight: 1.55 }}>
                    Pronites only. Register individually or as a group with default 9+1 group savings (1 free per 10 people) at checkout.
                  </p>
                </div>
                <button
                  className="crx-btn gold"
                  onClick={handleBRClick}
                  style={{ width: '100%', justifyContent: 'center', minHeight: 44 }}
                >
                  Basic Registration (BR) &rarr;
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
            bottom: 24,
            right: 24,
            zIndex: 999999,
            maxWidth: 360,
            background: 'var(--crx-card)',
            border: '1px solid var(--crx-hairline-accent)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
            borderRadius: 12,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'rgba(212, 175, 106, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={15} color="var(--crx-gold)" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 600, color: 'var(--crx-text-primary)' }}>
              {toast.title}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--crx-text-secondary)', lineHeight: 1.4 }}>
              {toast.text}
            </p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

