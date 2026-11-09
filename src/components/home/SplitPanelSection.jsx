import React from 'react';
import { ArrowRight } from 'lucide-react';
import Reveal from '../common/Reveal';
import Sticker from '../common/Sticker';
import GhostText from '../common/GhostText';

export default function SplitPanelSection({ setPage }) {
  return (
    <section style={{ padding: '64px 24px 80px', position: 'relative', overflow: 'hidden', width: '100%', maxWidth: '100vw', contain: 'paint' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <Sticker tone="gold" rotate={0} style={{ marginBottom: 12 }}>
            Pick Your Arena
          </Sticker>
          <h2
            className="crx-display"
            style={{
              fontSize: 'clamp(28px, 5vw, 42px)',
              color: 'var(--crx-text-primary)',
              margin: '0 0 32px',
              fontWeight: 400,
              letterSpacing: '0.5px',
            }}
          >
            ONE FEST. SIX ARENAS.
          </h2>
        </Reveal>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 24,
            position: 'relative',
          }}
        >
          <Reveal>
            <button
              onClick={() => setPage('events')}
              className="crx-card"
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'block',
                width: '100%',
                height: 320,
                borderRadius: 16,
                position: 'relative',
                overflow: 'hidden',
                background: 'var(--crx-card)',
                border: '1px solid var(--crx-hairline-accent)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                boxSizing: 'border-box',
              }}
            >
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
                  opacity: 0.8,
                  zIndex: 0,
                }}
              >
                <source src="/events-section.mp4" type="video/mp4" />
              </video>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(0deg, rgba(12, 8, 10, 0.95) 0%, rgba(12, 8, 10, 0.3) 60%, rgba(12, 8, 10, 0.6) 100%)',
                  zIndex: 0,
                }}
              />
              <Sticker tone="gold" rotate={0} style={{ position: 'absolute', top: 20, left: 20, zIndex: 1 }}>
                70+ Events
              </Sticker>
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 24,
                  zIndex: 1,
                }}
              >
                <h3 className="crx-display" style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', color: 'var(--crx-text-primary)', margin: '0 0 6px', fontWeight: 400 }}>
                  COMPETITIVE ARENAS
                </h3>
                <p style={{ fontSize: 13, color: 'var(--crx-text-secondary)', margin: '0 0 12px', maxWidth: 360, lineHeight: 1.5 }}>
                  Sports, cultural, literary, music, dance and fine arts — view guidelines and register.
                </p>
                <span
                  style={{
                    color: 'var(--crx-gold)',
                    fontWeight: 600,
                    fontSize: 13,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  Enter The Arena <ArrowRight size={14} />
                </span>
              </div>
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
