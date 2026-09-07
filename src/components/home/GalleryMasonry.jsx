import React from 'react';

const GALLERY_IMAGES = [
  '/dance.jpg',
  '/concert.jpg',
  '/sports.jpg',
  '/hero_bg.jpg',
  '/dance.jpg',
];

export default function GalleryMasonry() {
  return (
    <section style={{ background: 'var(--crx-bg)', padding: '120px 20px', position: 'relative' }}>
      <div className="section-container" style={{ maxWidth: 1400 }}>
        
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <p style={{ color: 'var(--crx-gold)', fontSize: 12, letterSpacing: '0.2em', fontWeight: 600, marginBottom: 16 }}>
            GALLERY
          </p>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#fff', fontFamily: 'var(--font-serif)', lineHeight: 1.1 }}>
            THE ENERGY BEYOND ONE STAGE
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gridAutoRows: '250px',
          gap: 16,
        }}>
          {GALLERY_IMAGES.map((src, i) => {
            const isLarge = i === 0 || i === 3;
            return (
              <div 
                key={i} 
                style={{
                  gridColumn: isLarge ? 'span 2' : 'span 1',
                  gridRow: isLarge ? 'span 2' : 'span 1',
                  borderRadius: 12,
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <img 
                  src={src} 
                  alt="Gallery" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.2)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.filter = 'grayscale(0)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.filter = 'grayscale(0.2)';
                  }}
                />
              </div>
            );
          })}
        </div>

      </div>
      <div className="section-divider" style={{ marginTop: 80 }} />
    </section>
  );
}
