import React from 'react';
import Reveal from '../common/Reveal';
import CountUp from '../common/CountUp';
import Sticker from '../common/Sticker';
import { STATS } from '../../constants/statsData';
import { useIsNarrow } from '../../hooks/useIsNarrow';

export default function StatsSection() {
  const narrow = useIsNarrow(700);

  return (
    <section style={{ padding: '20px 24px 90px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Reveal>
          <Sticker tone="gold" rotate={-2} style={{ marginBottom: 20 }}>
            Unleashing The Fire Within
          </Sticker>
          <h2
            className="crx-black"
            style={{
              fontSize: 'clamp(28px,4.5vw,42px)',
              color: 'var(--cream)',
              margin: '0 0 40px',
              maxWidth: 560,
              lineHeight: 1.2,
            }}
          >
            One edition. Endless goosebumps.
          </h2>
        </Reveal>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: narrow ? '1fr 1fr' : 'repeat(4,1fr)',
            gap: 28,
          }}
        >
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div>
                <p
                  className="crx-display"
                  style={{
                    fontSize: 'clamp(44px,7vw,68px)',
                    color: s.color,
                    margin: '0 0 8px',
                    lineHeight: 1,
                  }}
                >
                  <CountUp to={s.value} suffix={s.suffix} />
                </p>
                <Sticker tone={i % 2 === 0 ? 'orange' : 'gold'} rotate={i % 2 === 0 ? -2 : 2}>
                  {s.label}
                </Sticker>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
