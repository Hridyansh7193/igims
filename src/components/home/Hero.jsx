import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero({ setPage }) {
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    // Trigger the rectangular frame reveal animation on mount
    setTimeout(() => {
      setReveal(true);
    }, 100);
  }, []);

  return (
    <section
      style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--crx-bg)',
        overflow: 'hidden',
        padding: '120px 20px',
      }}
    >
      {/* Video Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          width: '100%',
          height: '100%',
          clipPath: reveal ? 'inset(0% 0% 0% 0%)' : 'inset(40% 30% 40% 30%)',
          transition: 'clip-path 1.5s cubic-bezier(0.85, 0, 0.15, 1)',
          transitionDelay: '0.2s',
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.6,
            filter: 'contrast(1.1) saturate(1.2)',
          }}
        >
          <source src="/events-bg.mp4" type="video/mp4" />
        </video>
        {/* Red Tint Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.8), rgba(220, 38, 38, 0.2), rgba(10,10,10,0.9))',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Hero Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          opacity: reveal ? 1 : 0,
          transform: reveal ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 1.5s ease, transform 1.5s ease',
          transitionDelay: '0.8s',
          maxWidth: 900,
        }}
      >
        <p
          style={{
            color: 'var(--crx-gold)',
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          YOUR THREE-DAY STORY
        </p>

        <h1
          style={{
            color: '#ffffff',
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(48px, 8vw, 110px)',
            fontWeight: 500,
            fontStyle: 'italic',
            lineHeight: 1.1,
            margin: '0 0 24px',
            textShadow: '0 10px 40px rgba(0,0,0,0.8)',
            background: 'linear-gradient(to right, #fff, #fbbf24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          CEREBREXIA
        </h1>

        <h2
          style={{
            color: '#ffffff',
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(24px, 4vw, 42px)',
            fontWeight: 400,
            lineHeight: 1.2,
            margin: '0 0 32px',
            maxWidth: 700,
          }}
        >
          BUILD THE EXPERIENCE THAT FEELS LIKE YOURS.
        </h2>

        <p
          style={{
            color: 'var(--crx-text-muted)',
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            lineHeight: 1.6,
            maxWidth: 500,
            margin: '0 0 40px',
          }}
        >
          Three days of ideas, competition, culture, and unforgettable nights await. Choose a Delegate Pass, individual events, or combine both into one personal experience.
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            className="crx-btn-primary"
            onClick={() => setPage('register')}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            BUILD MY CEREBREXIA EXPERIENCE <ArrowRight size={16} />
          </button>
          <button
            className="crx-btn-outline"
            onClick={() => setPage('events')}
          >
            EXPLORE EVENTS
          </button>
        </div>
      </div>
    </section>
  );
}
