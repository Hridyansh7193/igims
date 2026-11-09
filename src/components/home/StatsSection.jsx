import React from 'react';
import Reveal from '../common/Reveal';
import CountUp from '../common/CountUp';
import Sticker from '../common/Sticker';
import { STATS } from '../../constants/statsData';
import { useIsNarrow } from '../../hooks/useIsNarrow';

export default function StatsSection() {
  const narrow = useIsNarrow(700);

  return (
    <section style={{ padding: '30px 24px 100px', position: 'relative', overflow: 'hidden', width: '100%', maxWidth: '100vw', contain: 'paint' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <Reveal>
          <Sticker
            tone="gold"
            rotate={-2}
            style={{
              marginBottom: 20,
              fontSize: 'clamp(12px, 2.2vw, 14.5px)',
              padding: '8px 20px',
              letterSpacing: '1.2px',
            }}
          >
            Unleashing The Fire Within
          </Sticker>
          <h2
            className="crx-black"
            style={{
              fontSize: 'clamp(32px, 5.5vw, 52px)',
              color: 'var(--cream)',
              margin: '0 0 44px',
              maxWidth: 640,
              lineHeight: 1.15,
            }}
          >
            One edition. Endless goosebumps.
          </h2>
        </Reveal>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: narrow ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: 28,
          }}
        >
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div style={{ textAlign: 'left' }}>
                <p
                  className="crx-display"
                  style={{
                    fontSize: 'clamp(54px, 8.5vw, 86px)',
                    color: s.color || '#FFFFFF',
                    margin: '0 0 8px',
                    lineHeight: 1,
                    textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                  }}
                >
                  <CountUp to={s.value} suffix={s.suffix} duration={1600} />
                </p>
                <span
                  className="crx-stat-badge"
                  style={{
                    fontSize: '0.82rem',
                    padding: '7px 16px',
                    letterSpacing: '0.06em',
                  }}
                >
                  {s.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
