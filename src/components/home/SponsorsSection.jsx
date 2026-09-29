import React from 'react';
import Reveal from '../common/Reveal';
import Sticker from '../common/Sticker';
import { useIsNarrow } from '../../hooks/useIsNarrow';
import sponsorDiarchGo from '../../assets/sponsor-diarchgo.png';

const SPONSORS = [
  { name: 'Diarch Go', img: sponsorDiarchGo },
];

export default function SponsorsSection() {
  const narrow = useIsNarrow(700);

  return (
    <section style={{ padding: '30px 24px 100px', position: 'relative', overflow: 'hidden', width: '100%', maxWidth: '100vw', contain: 'paint' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
        <Reveal>
          <div
            style={{
              display: 'flex',
              flexDirection: narrow ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: narrow ? 20 : 28,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: narrow ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: narrow ? 12 : 18,
              }}
            >
              <Sticker tone="gold" rotate={0} style={{ margin: 0 }}>
                Powered By
              </Sticker>
              <h2
                className="crx-display"
                style={{ fontSize: 'clamp(28px,4.5vw,42px)', color: 'var(--cream)', margin: 0, whiteSpace: 'nowrap' }}
              >
                OUR SPONSORS
              </h2>
            </div>

            {SPONSORS.map((s) => (
              <div
                key={s.name}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--crx-border)',
                  borderRadius: 16,
                  padding: 14,
                  width: 130,
                  height: 130,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <img
                  src={s.img}
                  alt={s.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: 8,
                  }}
                />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
