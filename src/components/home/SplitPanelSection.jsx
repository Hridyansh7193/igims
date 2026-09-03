import React from 'react';
import { ArrowRight } from 'lucide-react';
import Reveal from '../common/Reveal';
import Sticker from '../common/Sticker';
import GhostText from '../common/GhostText';
import { useIsNarrow } from '../../hooks/useIsNarrow';

export default function SplitPanelSection({ setPage }) {
  const narrow = useIsNarrow(760);

  return (
    <section style={{ padding: '30px 24px 90px', position: 'relative' }}>
      <GhostText>CHOOSE</GhostText>
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <Sticker tone="orange" rotate={-2} style={{ marginBottom: 16 }}>
            Pick Your Court
          </Sticker>
          <h2
            className="crx-display"
            style={{ fontSize: 'clamp(30px,5.5vw,54px)', color: 'var(--cream)', margin: '0 0 40px' }}
          >
            ONE FEST. SIX COURTS.
          </h2>
        </Reveal>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: narrow ? '1fr' : '1fr 1fr',
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
                height: 340,
                borderRadius: 20,
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(160deg, #0D204D 0%, #070C20 100%)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
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
                  opacity: 0.4,
                  zIndex: 0,
                }}
              >
                <source src="/events-bg.mp4" type="video/mp4" />
              </video>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(160deg, rgba(13,32,77,0.55) 0%, rgba(7,12,32,0.75) 100%)',
                  zIndex: 0,
                }}
              />
              <Sticker tone="gold" rotate={-3} style={{ position: 'absolute', top: 18, left: 18, zIndex: 1 }}>
                70+ Events
              </Sticker>
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '24px',
                  background: 'linear-gradient(0deg, rgba(5,8,20,0.92) 0%, transparent 100%)',
                  zIndex: 1,
                }}
              >
                <h3 className="crx-display" style={{ fontSize: 'clamp(30px,4vw,44px)', color: '#fff', margin: '0 0 8px' }}>
                  EVENTS
                </h3>
                <p style={{ fontSize: 13.5, color: '#E0F2FE', margin: '0 0 10px', maxWidth: 320 }}>
                  Academic, literary, cultural, art, sports and informal — the main arena awaits.
                </p>
                <span
                  style={{
                    color: 'var(--cyan)',
                    fontWeight: 700,
                    fontSize: 13,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  ENTER THE ARENA <ArrowRight size={14} />
                </span>
              </div>
            </button>
          </Reveal>
          <Reveal delay={0.1}>
            <button
              onClick={() => setPage('team')}
              className="crx-card"
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'block',
                width: '100%',
                height: 340,
                borderRadius: 20,
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(160deg, #1C1A4A 0%, #070C20 100%)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
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
                  opacity: 0.4,
                  zIndex: 0,
                }}
              >
                <source src="/team-bg.mp4" type="video/mp4" />
              </video>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(160deg, rgba(28,26,74,0.55) 0%, rgba(7,12,32,0.75) 100%)',
                  zIndex: 0,
                }}
              />
              <Sticker tone="cyan" rotate={3} style={{ position: 'absolute', top: 18, right: 18, zIndex: 1 }}>
                The Crew
              </Sticker>
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '24px',
                  background: 'linear-gradient(0deg, rgba(5,8,20,0.92) 0%, transparent 100%)',
                  zIndex: 1,
                }}
              >
                <h3 className="crx-display" style={{ fontSize: 'clamp(30px,4vw,44px)', color: '#fff', margin: '0 0 8px' }}>
                  TEAM
                </h3>
                <p style={{ fontSize: 13.5, color: '#E0F2FE', margin: '0 0 10px', maxWidth: 320 }}>
                  The organisers behind the crown — the crew running Cerebrexia this year.
                </p>
                <span
                  style={{
                    color: 'var(--gold)',
                    fontWeight: 700,
                    fontSize: 13,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  MEET THE CREW <ArrowRight size={14} />
                </span>
              </div>
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
