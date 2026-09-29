import React from 'react';
import Reveal from '../common/Reveal';
import Sticker from '../common/Sticker';
import { LOGO_SRC } from '../../constants/logo';
import { TOTAL_EVENTS } from '../../constants/eventsData';
import { useIsNarrow } from '../../hooks/useIsNarrow';

export default function MascotSection() {
  const narrow = useIsNarrow(820);

  return (
    <section style={{ padding: '30px 24px 90px', position: 'relative', overflow: 'hidden' }}>
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
          <div style={{ position: 'relative', width: '100%', maxWidth: 340, margin: '0 auto', aspectRatio: '1 / 1' }}>
            {/* Spinning conic light rays burst */}
            <div
              className="crx-mascot-rays"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '220%',
                height: '220%',
                background:
                  'conic-gradient(from 0deg, transparent 0deg, rgba(230,57,80,0.28) 4deg, transparent 14deg, transparent 40deg, rgba(212,175,106,0.22) 44deg, transparent 54deg, transparent 90deg, rgba(230,57,80,0.24) 94deg, transparent 104deg, transparent 140deg, rgba(212,175,106,0.2) 144deg, transparent 154deg, transparent 190deg, rgba(230,57,80,0.26) 194deg, transparent 204deg, transparent 240deg, rgba(212,175,106,0.2) 244deg, transparent 254deg, transparent 290deg, rgba(230,57,80,0.24) 294deg, transparent 304deg, transparent 340deg, rgba(212,175,106,0.22) 344deg, transparent 354deg)',
                maskImage: 'radial-gradient(circle, black 0%, black 30%, transparent 68%)',
                WebkitMaskImage: 'radial-gradient(circle, black 0%, black 30%, transparent 68%)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            {/* Soft breathing halo glow behind everything */}
            <div
              className="crx-mascot-halo"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '150%',
                height: '150%',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(230,57,80,0.30) 0%, rgba(212,175,106,0.14) 45%, transparent 72%)',
                filter: 'blur(14px)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            {/* Slow-spinning dashed ring orbit */}
            <div
              className="crx-mascot-ring"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '128%',
                height: '128%',
                borderRadius: '50%',
                border: '1px dashed rgba(212, 175, 106, 0.45)',
                boxShadow: '0 0 18px rgba(230,57,80,0.15) inset',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            {/* Vertical pulsing light beam shooting up through the crown */}
            <div
              className="crx-mascot-beam"
              style={{
                position: 'absolute',
                top: '-18%',
                left: '50%',
                width: 10,
                height: '55%',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(230,57,80,0.5) 55%, transparent 100%)',
                filter: 'blur(4px)',
                borderRadius: 10,
                pointerEvents: 'none',
                zIndex: 0,
                transformOrigin: 'top center',
              }}
            />

            <img
              src={LOGO_SRC}
              alt="The Crowned Intellect"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 22,
                border: '2px solid rgba(212, 175, 106, 0.8)',
                boxShadow: '0 0 30px rgba(179, 18, 58, 0.4), 0 0 15px rgba(176, 141, 87, 0.3)',
                display: 'block',
                position: 'relative',
                zIndex: 1,
              }}
            />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div>
            <Sticker tone="gold" rotate={-2} style={{ marginBottom: 14 }}>
              The Presiding Figure
            </Sticker>
            <h3
              className="crx-display"
              style={{ fontSize: 'clamp(28px,4.5vw,44px)', color: 'var(--cream)', margin: '0 0 16px', textAlign: 'center' }}
            >
              THE CROWNED INTELLECT
            </h3>
            <p style={{ fontSize: 15.5, color: 'var(--paper)', lineHeight: 1.85, margin: 0 }}>
              Part diagnosis, part decree. The Crowned Intellect presides over Cerebrexia the way a senior clinician reads a chart — missing nothing, rushing nothing. Every category, from the debate floor to the football pitch, passes under its watch. Step into any of the {TOTAL_EVENTS}+ events and you step into its court.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
