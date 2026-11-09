import React from 'react';
import Reveal from '../common/Reveal';
import Sticker from '../common/Sticker';

export default function LoreSection() {
  return (
    <section style={{ padding: '80px 24px', position: 'relative', overflow: 'hidden', width: '100%', maxWidth: '100vw', contain: 'paint' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <Sticker tone="gold" rotate={0} style={{ marginBottom: 16 }}>
            The Lore
          </Sticker>
          <h2
            className="crx-display"
            style={{
              fontSize: 'clamp(28px, 5.5vw, 48px)',
              color: 'var(--crx-text-primary)',
              margin: '0 0 20px',
              fontWeight: 400,
              letterSpacing: '0.5px',
            }}
          >
            THE CROWNED DIAGNOSIS
          </h2>
          <p style={{ fontSize: 'clamp(14px, 1.8vw, 16px)', color: 'var(--crx-text-secondary)', lineHeight: 1.75, margin: '0 0 16px' }}>
            Once a year, IGIMS puts down its stethoscopes and picks up something louder. The wards go quiet, the mic checks begin, and a different kind of examination takes over — one measured in applause, not vitals.
          </p>
          <p style={{ fontSize: 'clamp(14px, 1.8vw, 16px)', color: 'var(--crx-text-secondary)', lineHeight: 1.75, margin: 0 }}>
            High above it all watches the <span style={{ color: 'var(--crx-gold)', fontWeight: 600 }}>Crowned Intellect</span> — a festival diadem commemorating resilience and creative craft under the brightest lights.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
