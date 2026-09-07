import React from 'react';

export default function AboutSection() {
  return (
    <section style={{ background: 'var(--crx-bg)', padding: '100px 20px', position: 'relative' }}>
      <div className="section-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 800 }}>
        
        <p style={{ color: 'var(--crx-gold)', fontSize: 12, letterSpacing: '0.2em', fontWeight: 600, marginBottom: 24 }}>
          ABOUT CEREBREXIA
        </p>
        
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', color: '#fff', fontFamily: 'var(--font-serif)', lineHeight: 1.2, marginBottom: 40 }}>
          THE CROWNED DIAGNOSIS
        </h2>

        <p style={{ color: 'var(--crx-text-muted)', fontSize: 16, lineHeight: 1.8, marginBottom: 24, fontWeight: 400 }}>
          Once a year, IGIMS puts down its stethoscopes and picks up something louder. The wards go quiet, the mic checks begin, and a different kind of examination takes over — one measured in applause, not vitals.
        </p>

        <p style={{ color: 'var(--crx-text-muted)', fontSize: 16, lineHeight: 1.8, fontWeight: 400 }}>
          High above it all watches the <strong style={{ color: 'var(--crx-gold)' }}>Crowned Intellect</strong> — a mind crowned in gold and grief, weeping starlight over every raised hand in the crowd below. It does not reward the loudest symptom. It rewards the one that holds composure under the brightest lights.
        </p>

      </div>
      <div className="section-divider" style={{ marginTop: 80 }} />
    </section>
  );
}
