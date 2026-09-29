import React from 'react';
import directorPhoto from '../../assets/director_photo.jpg';
import { useIsNarrow } from '../../hooks/useIsNarrow';

export default function DirectorMessage() {
  const narrow = useIsNarrow(768);

  return (
    <section
      style={{
        padding: narrow ? '60px 20px 40px' : '70px 20px 50px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="section-container crx-director-grid"
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: narrow ? '1fr' : '0.8fr 1.2fr',
          gap: narrow ? 28 : 60,
          alignItems: 'center',
        }}
      >
        
        {/* Left Side: Photo */}
        <div style={{ position: 'relative', width: '100%', maxWidth: narrow ? 220 : 280, margin: '0 auto', justifySelf: 'center' }}>
          <div style={{ 
            position: 'absolute', 
            inset: '-8px', 
            border: '1px solid var(--crx-gold)', 
            borderRadius: 16,
            zIndex: 0 
          }} />
          <div style={{ 
            width: '100%', 
            aspectRatio: '3/4', 
            background: 'var(--crx-surface)', 
            borderRadius: 16, 
            overflow: 'hidden',
            position: 'relative',
            zIndex: 1,
            boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
          }}>
            <img
              src={directorPhoto}
              alt="Prof. (Dr.) Bindey Kumar, Director, IGIMS Patna"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
            />
          </div>
        </div>

        {/* Right Side: Text */}
        <div style={{ textAlign: narrow ? 'center' : 'left' }}>
          <p style={{ color: 'var(--crx-gold)', fontSize: 12, letterSpacing: '0.2em', fontWeight: 600, marginBottom: 12 }}>
            DIRECTOR'S MESSAGE
          </p>
          <h2
            className="crx-display"
            style={{
              fontSize: 'clamp(24px, 5vw, 42px)',
              color: '#fff',
              fontFamily: "'Anton', 'Impact', sans-serif",
              lineHeight: 1.25,
              letterSpacing: '0.5px',
              marginBottom: 20,
              textTransform: 'uppercase',
            }}
          >
            "A Platform Where Creativity Meets Intellect."
          </h2>
          <p style={{ color: 'var(--crx-text-muted)', fontSize: 'clamp(14px, 2vw, 15px)', lineHeight: 1.75, marginBottom: 28 }}>
            It is a matter of great pride and privilege to welcome you all to Cerebrexia '26. 
            Over the years, this festival has grown into a symbol of our vibrant campus life, 
            blending rigorous academics with extraordinary cultural and sports talents. 
            I invite every student to participate, explore their potential, and make memories 
            that will last a lifetime.
          </p>
          
          <div>
            <h4 style={{ color: '#fff', fontSize: 18, marginBottom: 4, fontFamily: 'var(--font-sans)', fontWeight: 700 }}>Prof. (Dr.) Bindey Kumar</h4>
            <p style={{ color: 'var(--crx-text-muted)', fontSize: 12.5, letterSpacing: '0.05em', margin: 0, textTransform: 'uppercase' }}>
              Director, IGIMS Patna
            </p>
          </div>
        </div>

      </div>
      <div className="section-divider" style={{ marginTop: 30 }} />
    </section>
  );
}
