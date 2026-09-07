import React from 'react';

const WORLDS = [
  {
    id: 1,
    title: 'CULTURAL',
    desc: 'The stage where art breathes. Dance, music, and drama converge into a spectacle of human expression.',
    image: '/dance.jpg',
  },
  {
    id: 2,
    title: 'ACADEMIC',
    desc: 'Where intellect takes the spotlight. Debates, quizzes, and literary battles that challenge the mind.',
    image: '/concert.jpg',
  },
  {
    id: 3,
    title: 'SPORTS',
    desc: 'The arena of sweat and glory. Intense competition, unwavering spirit, and the pursuit of victory.',
    image: '/sports.jpg',
  },
];

export default function WorldsSection() {
  return (
    <section style={{ background: 'var(--crx-bg)', padding: '120px 20px', position: 'relative' }}>
      <div className="section-container">
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{ color: 'var(--crx-gold)', fontSize: 12, letterSpacing: '0.2em', fontWeight: 600, marginBottom: 16 }}>
            THREE DAYS, SIX WORLDS
          </p>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#fff', maxWidth: 800, margin: '0 auto', lineHeight: 1.1 }}>
            DISCOVER THE WORLDS OF CEREBREXIA
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 30,
          }}
        >
          {WORLDS.map((world) => (
            <div
              key={world.id}
              className="crx-card"
              style={{
                position: 'relative',
                height: 450,
                borderRadius: 16,
                overflow: 'hidden',
                border: '1px solid var(--crx-border)',
                background: '#111',
                display: 'flex',
                alignItems: 'flex-end',
                padding: 32,
              }}
            >
              {/* Background Image */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url('${world.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.4,
                  transition: 'opacity 0.3s ease, transform 0.5s ease',
                  zIndex: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = 0.6;
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = 0.4;
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />

              {/* Gradient overlay for text readability */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.4) 50%, transparent 100%)',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />

              {/* Content */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h3 style={{ fontSize: 28, color: '#fff', marginBottom: 12, letterSpacing: '0.05em' }}>
                  {world.title}
                </h3>
                <p style={{ color: 'var(--crx-text-muted)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  {world.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
}
