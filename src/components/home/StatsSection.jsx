import React from 'react';
import Reveal from '../common/Reveal';
import CountUp from '../common/CountUp';
import Sticker from '../common/Sticker';
import { STATS } from '../../constants/statsData';
import { useIsNarrow } from '../../hooks/useIsNarrow';

export default function StatsSection() {
  const narrow = useIsNarrow(700);

  return (
    <section style={{ padding: '64px 24px 80px', position: 'relative', overflow: 'hidden', width: '100%', maxWidth: '100vw', contain: 'paint' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>
        <Reveal>
          <Sticker tone="gold" rotate={0} style={{ marginBottom: 12 }}>
            Unleashing The Fire Within
          </Sticker>
          <h2
            className="crx-display"
            style={{
              fontSize: 'clamp(28px, 4.5vw, 40px)',
              color: 'var(--crx-text-primary)',
              margin: '0 0 36px',
              maxWidth: 580,
              lineHeight: 1.15,
              fontWeight: 400,
              letterSpacing: '0.5px',
            }}
          >
            ONE FESTIVAL. 70+ EVENTS. SIX COURTS.
          </h2>
        </Reveal>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: narrow ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: 24,
          }}
        >
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.05}>
              <div
                style={{
                  background: 'var(--crx-card)',
                  border: '1px solid var(--crx-hairline)',
                  borderRadius: 14,
                  padding: '20px 24px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                }}
              >
                <p
                  className="crx-display"
                  style={{
                    fontSize: 'clamp(40px, 6vw, 56px)',
                    color: 'var(--crx-text-primary)',
                    margin: '0 0 8px',
                    lineHeight: 1,
                    fontVariantNumeric: 'tabular-nums',
                    fontWeight: 400,
                  }}
                >
                  <CountUp to={s.value} suffix={s.suffix} />
                </p>
                <span className="crx-stat-badge">{s.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
