import React from 'react';

export default function DirectorMessage() {
  return (
    <section style={{ background: 'var(--crx-bg)', padding: '120px 20px', position: 'relative' }}>
      <div className="section-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 60, alignItems: 'center' }}>
        
        {/* Left Side: Photo */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 400, justifySelf: 'center' }}>
          <div style={{ 
            position: 'absolute', 
            inset: '-10px', 
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
            zIndex: 1
          }}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222' }}>
               <span style={{ color: 'var(--crx-text-muted)', fontSize: 12, letterSpacing: '0.1em' }}>DIRECTOR PHOTO</span>
            </div>
          </div>
        </div>

        {/* Right Side: Text */}
        <div>
          <p style={{ color: 'var(--crx-gold)', fontSize: 12, letterSpacing: '0.2em', fontWeight: 600, marginBottom: 16 }}>
            DIRECTOR'S MESSAGE
          </p>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', color: '#fff', fontFamily: 'var(--font-serif)', lineHeight: 1.2, marginBottom: 32 }}>
            "A PLATFORM WHERE CREATIVITY MEETS INTELLECT."
          </h2>
          <p style={{ color: 'var(--crx-text-muted)', fontSize: 15, lineHeight: 1.8, marginBottom: 40 }}>
            It is a matter of great pride and privilege to welcome you all to Cerebrexia '26. 
            Over the years, this festival has grown into a symbol of our vibrant campus life, 
            blending rigorous academics with extraordinary cultural and sports talents. 
            I invite every student to participate, explore their potential, and make memories 
            that will last a lifetime.
          </p>
          
          <div>
            <h4 style={{ color: '#fff', fontSize: 18, marginBottom: 4, fontFamily: 'var(--font-sans)', fontWeight: 700 }}>Prof. (Dr.) Bindey Kumar</h4>
            <p style={{ color: 'var(--crx-text-muted)', fontSize: 13, letterSpacing: '0.05em', margin: 0, textTransform: 'uppercase' }}>
              Director, IGIMS Patna
            </p>
          </div>
        </div>

      </div>
      <div className="section-divider" style={{ marginTop: 80 }} />
    </section>
  );
}
