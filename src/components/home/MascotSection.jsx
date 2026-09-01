import React from 'react';
import Reveal from '../common/Reveal';
import Sticker from '../common/Sticker';
import { LOGO_SRC } from '../../constants/logo';
import { TOTAL_EVENTS } from '../../constants/eventsData';
import { useIsNarrow } from '../../hooks/useIsNarrow';

export default function MascotSection() {
  const narrow = useIsNarrow(820);

  return (
    <section style={{ padding: '30px 24px 90px' }}>
      <div
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: narrow ? '1fr' : '0.8fr 1.2fr',
          gap: 50,
          alignItems: 'center',
        }}
      >
        <Reveal>
          <div style={{ position: 'relative', width: '100%', maxWidth: 340, margin: '0 auto' }}>
            {/* Multi-layered celestial halo aura */}
            <div
              style={{
                position: 'absolute',
                inset: -14,
                background: 'radial-gradient(circle, rgba(0,163,255,0.4) 0%, rgba(245,158,11,0.3) 50%, transparent 75%)',
                borderRadius: 30,
                transform: 'rotate(3deg)',
                filter: 'blur(10px)',
                animation: 'crx-pulse-glow 3s infinite',
              }}
            />
            <img
              src={LOGO_SRC}
              alt="The Crowned Intellect"
              style={{
                width: '100%',
                borderRadius: 22,
                border: '2px solid rgba(251, 191, 36, 0.8)',
                boxShadow: '0 0 30px rgba(56, 189, 248, 0.4), 0 0 15px rgba(245, 158, 11, 0.3)',
                display: 'block',
                position: 'relative',
                zIndex: 1,
              }}
            />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <Sticker tone="gold" rotate={-2} style={{ marginBottom: 14 }}>
            The Presiding Figure
          </Sticker>
          <h3
            className="crx-display"
            style={{ fontSize: 'clamp(28px,4.5vw,44px)', color: 'var(--cream)', margin: '0 0 16px' }}
          >
            THE CROWNED INTELLECT
          </h3>
          <p style={{ fontSize: 15.5, color: '#EADFD4', lineHeight: 1.85, margin: 0 }}>
            Part diagnosis, part decree. The Crowned Intellect presides over Cerebrexia the way a senior clinician reads a chart — missing nothing, rushing nothing. Every category, from the debate floor to the football pitch, passes under its watch. Step into any of the {TOTAL_EVENTS}+ events and you step into its court.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
