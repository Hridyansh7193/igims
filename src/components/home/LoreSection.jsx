import React from 'react';
import Reveal from '../common/Reveal';
import Sticker from '../common/Sticker';

export default function LoreSection() {
  return (
    <section style={{ padding: '70px 24px', position: 'relative' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <Sticker tone="cyan" rotate={-2} style={{ marginBottom: 20 }}>
            The Lore
          </Sticker>
          <h2
            className="crx-display"
            style={{
              fontSize: 'clamp(32px, 5.5vw, 56px)',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #E0F2FE 60%, #FBBF24 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              margin: '0 0 22px',
              filter: 'drop-shadow(0 0 20px rgba(56, 189, 248, 0.25))',
            }}
          >
            THE CROWNED DIAGNOSIS
          </h2>
          <p style={{ fontSize: 16.5, color: 'var(--paper)', lineHeight: 1.85, margin: '0 0 16px' }}>
            Once a year, IGIMS puts down its stethoscopes and picks up something louder. The wards go quiet, the mic checks begin, and a different kind of examination takes over — one measured in applause, not vitals.
          </p>
          <p style={{ fontSize: 16.5, color: 'var(--paper)', lineHeight: 1.85, margin: 0 }}>
            High above it all watches the <span style={{ color: 'var(--gold)', fontWeight: 700 }}>Crowned Intellect</span> — a mind crowned in gold and grief, weeping starlight over every raised hand in the crowd below. It does not reward the loudest symptom. It rewards the one that holds composure under the brightest lights.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
