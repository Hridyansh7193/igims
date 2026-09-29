import React from 'react';
import Reveal from '../common/Reveal';
import Sticker from '../common/Sticker';

// All gallery images (imported so Vite bundles them correctly)
import g01 from '../../assets/gallery/g01.jpg';
import g02 from '../../assets/gallery/g02.jpg';
import g03 from '../../assets/gallery/g03.jpg';
import g04 from '../../assets/gallery/g04.jpg';
import g05 from '../../assets/gallery/g05.jpg';
import g06 from '../../assets/gallery/g06.jpg';
import g07 from '../../assets/gallery/g07.jpg';
import g08 from '../../assets/gallery/g08.jpg';
import g09 from '../../assets/gallery/g09.jpg';
import g10 from '../../assets/gallery/g10.jpg';
import g11 from '../../assets/gallery/g11.jpg';
import g12 from '../../assets/gallery/g12.jpg';
import g13 from '../../assets/gallery/g13.jpg';
import g14 from '../../assets/gallery/g14.jpg';
import g15 from '../../assets/gallery/g15.jpg';
import g16 from '../../assets/gallery/g16.jpg';
import g17 from '../../assets/gallery/g17.jpg';
import g18 from '../../assets/gallery/g18.jpg';
import g19 from '../../assets/gallery/g19.jpg';
import g20 from '../../assets/gallery/g20.jpg';
import g21 from '../../assets/gallery/g21.jpg';
import g22 from '../../assets/gallery/g22.jpg';
import g23 from '../../assets/gallery/g23.jpg';
import g24 from '../../assets/gallery/g24.jpg';
import g25 from '../../assets/gallery/g25.jpg';
import g26 from '../../assets/gallery/g26.jpg';
import g27 from '../../assets/gallery/g27.jpg';
import g28 from '../../assets/gallery/g28.jpg';
import g29 from '../../assets/gallery/g29.jpg';
import g30 from '../../assets/gallery/g30.jpg';
import g31 from '../../assets/gallery/g31.jpg';
import g32 from '../../assets/gallery/g32.jpg';
import g33 from '../../assets/gallery/g33.jpg';

const ALL = [
  g01, g02, g03, g04, g05, g06, g07, g08, g09, g10, g11,
  g12, g13, g14, g15, g16, g17, g18, g19, g20, g21, g22,
  g23, g24, g25, g26, g27, g28, g29, g30, g31, g32, g33,
];

// Split into two rows, each row duplicated once so the CSS marquee loop is seamless
const mid = Math.ceil(ALL.length / 2);
const ROW1 = [...ALL.slice(0, mid), ...ALL.slice(0, mid)];
const ROW2 = [...ALL.slice(mid), ...ALL.slice(mid)];

function MarqueeRow({ images, reverse, duration }) {
  return (
    <div style={{ overflow: 'hidden', position: 'relative', width: '100%', maxWidth: '100vw', contain: 'paint' }}>
      <div
        style={{
          display: 'flex',
          gap: 16,
          width: 'max-content',
          animation: `crx-gallery-scroll ${duration}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            style={{
              width: 260,
              height: 170,
              borderRadius: 14,
              overflow: 'hidden',
              flexShrink: 0,
              border: '1px solid var(--crx-border)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
            }}
          >
            <img
              src={src}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GallerySection() {
  return (
    <section style={{ padding: '30px 0 100px', position: 'relative', overflow: 'hidden', width: '100%', maxWidth: '100vw', contain: 'paint' }}>
      <style>
        {`
          @keyframes crx-gallery-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
      <div style={{ maxWidth: 1100, margin: '0 auto 40px', textAlign: 'center', padding: '0 24px' }}>
        <Reveal>
          <Sticker tone="gold" rotate={0} style={{ marginBottom: 16 }}>
            Moments Worth Reliving
          </Sticker>
          <h2
            className="crx-display"
            style={{ fontSize: 'clamp(28px,4.5vw,42px)', color: 'var(--cream)', margin: 0 }}
          >
            GALLERY
          </h2>
        </Reveal>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <MarqueeRow images={ROW1} duration={55} />
        <MarqueeRow images={ROW2} duration={65} reverse />
      </div>
    </section>
  );
}
