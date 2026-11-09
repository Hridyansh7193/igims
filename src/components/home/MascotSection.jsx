import React from 'react';
import Reveal from '../common/Reveal';
import Sticker from '../common/Sticker';
import { LOGO_SRC } from '../../constants/logo';
import { TOTAL_EVENTS } from '../../constants/eventsData';
import { useIsNarrow } from '../../hooks/useIsNarrow';

export default function MascotSection() {
  const narrow = useIsNarrow(820);

  return (
    <section style={{ padding: '64px 24px 80px', position: 'relative', overflow: 'hidden', width: '100%', maxWidth: '100vw', contain: 'paint' }}>
      <div
        style={{
          maxWidth: 1040,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: narrow ? '1fr' : '0.8fr 1.2fr',
          gap: 48,
          alignItems: 'center',
        }}
      >
        <Reveal style={{ overflow: 'hidden', maxWidth: '100%' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: narrow ? 240 : 320, margin: '0 auto', aspectRatio: '1 / 1' }}>
            <img
              src={LOGO_SRC}
              alt="The Crowned Intellect"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 16,
                border: '1px solid var(--crx-hairline-accent)',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.55)',
                display: 'block',
                position: 'relative',
                zIndex: 1,
              }}
            />
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div style={{ textAlign: narrow ? 'center' : 'left' }}>
            <Sticker tone="gold" rotate={0} style={{ marginBottom: 12 }}>
              The Presiding Figure
            </Sticker>
            <h3
              className="crx-display"
              style={{
                fontSize: 'clamp(28px, 4.5vw, 42px)',
                color: 'var(--crx-text-primary)',
                margin: '0 0 16px',
                fontWeight: 400,
                textAlign: narrow ? 'center' : 'left',
                letterSpacing: '0.5px',
              }}
            >
              THE CROWNED INTELLECT
            </h3>
            <p style={{ fontSize: 'clamp(14px, 1.8vw, 15px)', color: 'var(--crx-text-secondary)', lineHeight: 1.75, margin: 0 }}>
              Part diagnosis, part decree. The Crowned Intellect presides over Cerebrexia the way a senior clinician reads a chart — missing nothing, rushing nothing. Every arena, from the debate floor to the football pitch, passes under its watch. Step into any of the {TOTAL_EVENTS}+ events and you step into its court.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
