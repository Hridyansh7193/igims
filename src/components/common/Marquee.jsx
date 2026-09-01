import React from 'react';
import { Star } from 'lucide-react';

export default function Marquee({ items, tone = 'gold', rotate = -1.5 }) {
  const bg =
    tone === 'gold'
      ? 'linear-gradient(90deg,var(--gold),var(--gold-2))'
      : 'linear-gradient(90deg,var(--cyan),var(--cyan-2))';
  const color = tone === 'gold' ? 'var(--ink)' : '#fff';
  const doubled = [...items, ...items];

  return (
    <div
      style={{
        transform: `rotate(${rotate}deg)`,
        background: bg,
        padding: '10px 0',
        boxShadow: '0 4px 0 rgba(0,0,0,.3)',
      }}
    >
      <div className="crx-marquee">
        <div className="crx-marquee-track">
          {doubled.map((it, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 20,
                color,
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: 1,
                textTransform: 'uppercase',
                padding: '0 20px',
                fontFamily: "'Space Grotesk',sans-serif",
              }}
            >
              {it} <Star size={10} fill={color} color={color} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
