import React from 'react';
import CountUp from '../common/CountUp';
import { TOTAL_EVENTS } from '../../constants/eventsData';

const STATS = [
  { value: 5, suffix: '', label: 'Days of Festival' },
  { value: TOTAL_EVENTS, suffix: '+', label: 'Unique Events' },
  { value: 40, suffix: '+', label: 'Colleges' },
  { value: 4, suffix: '', label: 'Pro-Nites' },
];

export default function CommunityStats() {
  return (
    <section style={{ background: 'var(--crx-bg)', padding: '100px 20px', position: 'relative' }}>
      <div className="section-container" style={{ padding: '0 20px' }}>
        <p style={{ color: 'var(--crx-gold)', fontSize: 12, letterSpacing: '0.2em', fontWeight: 600, marginBottom: 40, textAlign: 'center' }}>
          THE CEREBREXIA COMMUNITY
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 40,
          textAlign: 'center'
        }}>
          {STATS.map((stat, i) => (
            <div key={i}>
              <h3 style={{ 
                fontSize: 'clamp(64px, 8vw, 100px)', 
                color: 'var(--crx-red)', 
                fontFamily: 'var(--font-serif)',
                marginBottom: 8,
                lineHeight: 1
              }}>
                <CountUp to={stat.value} suffix={stat.suffix} />
              </h3>
              <p style={{ 
                color: 'var(--crx-text-main)', 
                fontSize: 14, 
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 600,
                margin: 0
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
