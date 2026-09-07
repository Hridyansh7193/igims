import React from 'react';
import { REWIND_ARTISTS } from '../../constants/pronitesData';

export default function PronitesSection() {
  return (
    <section style={{ background: 'var(--crx-bg)', padding: '120px 20px', position: 'relative' }}>
      <div className="section-container">
        
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <p style={{ color: 'var(--crx-gold)', fontSize: 12, letterSpacing: '0.2em', fontWeight: 600, marginBottom: 16 }}>
            CEREBREXIA REWIND 2025
          </p>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#fff', fontFamily: 'var(--font-serif)', lineHeight: 1.1 }}>
            MORE NAMES IN THE STORY
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 120 }}>
          {REWIND_ARTISTS.map((artist, i) => {
            const isEven = i % 2 === 0;

            return (
              <div 
                key={artist.no} 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: 60, 
                  alignItems: 'center' 
                }}
              >
                {/* Image Side */}
                <div style={{ order: isEven ? 1 : 2, position: 'relative', height: 450, borderRadius: 16, overflow: 'hidden' }}>
                  <img 
                    src={`/${artist.img}.jpg`} 
                    alt={artist.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.3) contrast(1.1)' }} 
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.8), transparent)', pointerEvents: 'none' }} />
                </div>

                {/* Text Side */}
                <div style={{ order: isEven ? 2 : 1 }}>
                  <p style={{ color: 'var(--crx-gold)', fontSize: 12, letterSpacing: '0.1em', fontWeight: 600, marginBottom: 16, textTransform: 'uppercase' }}>
                    {artist.tag}
                  </p>
                  <h3 style={{ color: '#fff', fontSize: 'clamp(40px, 5vw, 64px)', fontFamily: 'var(--font-serif)', lineHeight: 1, marginBottom: 16 }}>
                    {artist.name}
                  </h3>
                  <p style={{ color: 'var(--crx-text-main)', fontSize: 14, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 24, textTransform: 'uppercase' }}>
                    {artist.role}
                  </p>
                  <p style={{ color: 'var(--crx-text-muted)', fontSize: 15, lineHeight: 1.8, maxWidth: 400 }}>
                    {artist.text}
                  </p>
                  <div style={{ marginTop: 40, fontSize: 100, color: 'rgba(255,255,255,0.05)', fontFamily: 'var(--font-serif)', lineHeight: 0.8, pointerEvents: 'none' }}>
                    {artist.no}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="section-divider" style={{ marginTop: 80 }} />
    </section>
  );
}
