import React from 'react';
import Sticker from '../common/Sticker';

export default function ClosingHero() {
  return (
    <section
      style={{
        position: 'relative',
        padding: '96px 24px',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100vw',
        contain: 'paint',
        background: 'var(--crx-bg-deep)',
        borderTop: '1px solid var(--crx-hairline)',
        borderBottom: '1px solid var(--crx-hairline)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 840, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, boxSizing: 'border-box', padding: '0 16px' }}>
        <Sticker tone="gold" rotate={0} style={{ marginBottom: 16 }}>
          IGIMS Annual Festival
        </Sticker>
        <h2
          className="crx-display"
          style={{
            fontSize: 'clamp(32px, 8vw, 96px)',
            color: 'var(--crx-text-primary)',
            lineHeight: 1,
            margin: '0 0 16px',
            wordBreak: 'break-word',
            fontWeight: 400,
            letterSpacing: '1px',
          }}
        >
          CEREBREXIA'26
        </h2>
        <p
          style={{
            fontSize: 15,
            color: 'var(--crx-text-secondary)',
            lineHeight: 1.7,
            maxWidth: 540,
            margin: '0 auto',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Four days. Six competition arenas. December 18–20, 2026 at Indira Gandhi Institute of Medical Sciences, Patna.
        </p>
      </div>
    </section>
  );
}
