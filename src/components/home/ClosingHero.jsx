import React from 'react';
import Sticker from '../common/Sticker';

export default function ClosingHero({ setPage }) {
  return (
    <section
      style={{
        position: 'relative',
        padding: '110px 24px',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(179, 18, 58, 0.15) 0%, transparent 70%), linear-gradient(160deg, #240C0C 0%, #020101 100%)',
        borderTop: '1px solid var(--hair)',
        borderBottom: '1px solid var(--hair)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, boxSizing: 'border-box', padding: '0 16px' }}>
        <Sticker tone="gold" rotate={-2} style={{ marginBottom: 20 }}>
          IGIMS's Biggest Annual Fest
        </Sticker>
        <h2
          className="crx-display"
          style={{
            fontSize: 'clamp(28px, 9vw, 110px)',
            color: '#fff',
            lineHeight: 0.95,
            margin: '0 0 20px',
            wordBreak: 'break-word',
          }}
        >
          CEREBREXIA'26
        </h2>
        <p
          style={{
            fontSize: 15.5,
            color: 'var(--paper)',
            lineHeight: 1.8,
            maxWidth: 560,
            margin: '0 auto 30px',
          }}
        >
          Four days. Six courts of competition. One crowned verdict — and you're in it. Register, compete, and write yourself into the story.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setPage('events')} className="crx-btn gold">
            Explore Events
          </button>
          <button onClick={() => setPage('contact')} className="crx-btn orange">
            Get In Touch
          </button>
        </div>
      </div>
    </section>
  );
}
