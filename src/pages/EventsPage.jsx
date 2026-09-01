import React, { useState } from 'react';
import Reveal from '../components/common/Reveal';
import Sticker from '../components/common/Sticker';
import { CATEGORIES, TOTAL_EVENTS } from '../constants/eventsData';
import { useIsNarrow } from '../hooks/useIsNarrow';

export default function EventsPage() {
  const [activeCat, setActiveCat] = useState('all');
  const narrow = useIsNarrow(700);

  const cards =
    activeCat === 'all'
      ? CATEGORIES.flatMap((c) => c.events.map((e) => ({ name: e, cat: c.label, key: c.key })))
      : (CATEGORIES.find((c) => c.key === activeCat)?.events || []).map((e) => ({
          name: e,
          cat: CATEGORIES.find((c) => c.key === activeCat).label,
          key: activeCat,
        }));

  // Cosmic color themes matching the gems in the crown of the logo
  const cardGradients = [
    'linear-gradient(160deg, #0C235A 0%, #050B1E 100%)', // Sapphire Azure
    'linear-gradient(160deg, #2E2207 0%, #080D22 100%)', // Crown Topaz Amber
    'linear-gradient(160deg, #072C42 0%, #050E1E 100%)', // Celestial Cyan
    'linear-gradient(160deg, #1B1446 0%, #07091C 100%)', // Mystic Violet
    'linear-gradient(160deg, #092636 0%, #040918 100%)', // Deep Teal
    'linear-gradient(160deg, #141E47 0%, #060B1E 100%)', // Royal Midnight
  ];

  return (
    <section style={{ padding: '150px 24px 100px', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <Sticker tone="cyan" rotate={-2} style={{ marginBottom: 16 }}>
            {TOTAL_EVENTS}+ Events on File
          </Sticker>
          <h1
            className="crx-display"
            style={{ fontSize: 'clamp(36px,7vw,72px)', color: 'var(--cream)', margin: '0 0 30px' }}
          >
            CHOOSE YOUR CASE
          </h1>
        </Reveal>
        <div
          className="crx-scrollbar"
          style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, marginBottom: 34 }}
        >
          <button
            onClick={() => setActiveCat('all')}
            className="crx-btn"
            style={{
              background: activeCat === 'all' ? 'linear-gradient(135deg, var(--cyan), var(--cyan-dark))' : 'rgba(56, 189, 248, 0.08)',
              border: activeCat === 'all' ? '1px solid var(--cyan)' : '1px solid rgba(56, 189, 248, 0.2)',
              color: activeCat === 'all' ? '#fff' : 'var(--paper)',
              padding: '9px 18px',
              fontSize: 11.5,
              boxShadow: activeCat === 'all' ? '0 0 15px rgba(56, 189, 248, 0.4)' : 'none',
            }}
          >
            All Cases
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCat(c.key)}
              className="crx-btn"
              style={{
                background: activeCat === c.key ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))' : 'rgba(56, 189, 248, 0.08)',
                border: activeCat === c.key ? '1px solid var(--gold)' : '1px solid rgba(56, 189, 248, 0.2)',
                color: activeCat === c.key ? '#050814' : 'var(--paper)',
                padding: '9px 18px',
                fontSize: 11.5,
                boxShadow: activeCat === c.key ? '0 0 15px rgba(245, 158, 11, 0.4)' : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: narrow ? 'repeat(2,1fr)' : 'repeat(auto-fill,minmax(200px,1fr))',
            gap: 16,
          }}
        >
          {cards.map((ev, i) => (
            <Reveal key={ev.name} delay={Math.min(i * 0.02, 0.3)}>
              <div
                className="crx-card"
                style={{
                  position: 'relative',
                  height: 240,
                  borderRadius: 14,
                  overflow: 'hidden',
                  background: cardGradients[i % cardGradients.length],
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    fontSize: 9,
                    color: 'var(--muted)',
                    fontFamily: 'monospace',
                    letterSpacing: 1,
                  }}
                >
                  N&ordm; {String(i + 1).padStart(2, '0')}/{cards.length}
                </span>
                <Sticker
                  tone={i % 2 === 0 ? 'gold' : 'cyan'}
                  rotate={i % 2 === 0 ? -3 : 3}
                  style={{ position: 'absolute', top: 8, right: 8, fontSize: 9, padding: '4px 8px' }}
                >
                  {ev.cat}
                </Sticker>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '14px',
                    background: 'linear-gradient(0deg, rgba(5,8,20,0.95) 0%, rgba(5,8,20,0.6) 60%, transparent 100%)',
                  }}
                >
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
                    {ev.name}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
