import React, { useState, useEffect } from 'react';
import { Film } from 'lucide-react';

const REEL_SCENES = [
  { img: '/events/concert.jpg', title: 'PRONITES & EDM', tag: 'ARENA 01' },
  { img: '/events/dance.jpg', title: 'CHOREO BATTLE', tag: 'ARENA 02' },
  { img: '/events/bands.jpg', title: 'ROCK OF AGES', tag: 'ARENA 03' },
  { img: '/events/sports.jpg', title: 'CHAMPIONS TROPHY', tag: 'ARENA 04' },
];

export default function CameraRollVideo({ variant = 'background', style = {} }) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % REEL_SCENES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const sprockets = Array.from({ length: 28 });

  return (
    <div
      className="crx-camera-roll-bg"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
        ...style,
      }}
    >
      {/* Analog Camera Roll Film Strip Top Sprockets */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 28,
          background: 'rgba(5, 8, 20, 0.95)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.28)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 4,
          overflow: 'hidden',
          padding: '0 8px',
        }}
      >
        {sprockets.map((_, i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 10,
              borderRadius: 2,
              background: 'rgba(56, 189, 248, 0.22)',
              border: '1px solid rgba(251, 191, 36, 0.35)',
              display: 'inline-block',
              margin: '0 4px',
            }}
          />
        ))}
        <span
          style={{
            position: 'absolute',
            right: 18,
            fontSize: 9.5,
            fontFamily: 'monospace',
            color: 'var(--gold)',
            letterSpacing: 2,
            fontWeight: 700,
          }}
        >
          CEREBREXIA '26 &middot; 35MM ROLL 01
        </span>
      </div>

      {/* Giant Background Stroked Watermark: CEREBREXIA */}
      <div
        style={{
          position: 'absolute',
          top: '46%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          fontFamily: "'Anton', sans-serif",
          fontSize: 'clamp(80px, 20vw, 220px)',
          letterSpacing: '0.04em',
          color: 'transparent',
          WebkitTextStroke: '1.5px rgba(56, 189, 248, 0.16)',
          textTransform: 'uppercase',
          userSelect: 'none',
        }}
      >
        CEREBREXIA
      </div>

      {/* Rolling Festival Scenes (Ken Burns zoom + crossfade) */}
      {REEL_SCENES.map((scene, idx) => (
        <div
          key={scene.title}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${scene.img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: activeIdx === idx ? 0.36 : 0,
            transition: 'opacity 1.8s ease-in-out',
            transform: activeIdx === idx ? 'scale(1.08)' : 'scale(1)',
            transitionProperty: 'opacity, transform',
            transitionDuration: '1.8s, 6s',
            transitionTimingFunction: 'ease-in-out, ease-out',
            filter: 'contrast(1.15) saturate(1.2) hue-rotate(-5deg)',
          }}
        />
      ))}

      {/* Cosmic Gradient Film Overlay (Cosmic cyan and gold starlight blend) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 50% 30%, rgba(56, 189, 248, 0.18), transparent 65%),
            radial-gradient(ellipse at 80% 80%, rgba(245, 158, 11, 0.14), transparent 55%),
            linear-gradient(180deg, rgba(5,8,20,0.65) 0%, rgba(7,12,32,0.85) 60%, rgba(5,8,20,0.98) 100%)
          `,
          zIndex: 2,
        }}
      />

      {/* Subtle Analog Camera Roll Film Scanlines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)',
          opacity: 0.4,
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />

      {/* Camera Roll Frame Counter Badge in corner */}
      <div
        style={{
          position: 'absolute',
          bottom: 38,
          right: 24,
          zIndex: 4,
          background: 'rgba(5, 8, 20, 0.8)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          padding: '4px 10px',
          borderRadius: 6,
          fontSize: 9.5,
          fontFamily: 'monospace',
          color: 'var(--paper)',
          display: 'flex',
          gap: 8,
        }}
      >
        <span style={{ color: 'var(--gold)', fontWeight: 700 }}>● LIVE ROLL</span>
        <span>FRAME {String(activeIdx + 1).padStart(2, '0')}/04</span>
        <span style={{ color: 'var(--cyan)' }}>{REEL_SCENES[activeIdx].tag}</span>
      </div>

      {/* Analog Film Strip Bottom Sprockets */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 28,
          background: 'rgba(5, 8, 20, 0.95)',
          borderTop: '1px solid rgba(56, 189, 248, 0.28)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 4,
          overflow: 'hidden',
          padding: '0 8px',
        }}
      >
        {sprockets.map((_, i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 10,
              borderRadius: 2,
              background: 'rgba(56, 189, 248, 0.22)',
              border: '1px solid rgba(251, 191, 36, 0.35)',
              display: 'inline-block',
              margin: '0 4px',
            }}
          />
        ))}
        <span
          style={{
            position: 'absolute',
            left: 18,
            fontSize: 9.5,
            fontFamily: 'monospace',
            color: 'var(--cyan)',
            letterSpacing: 2,
            fontWeight: 700,
          }}
        >
          ROLL 01 &middot; EXP 26 &middot; IGIMS PATNA
        </span>
      </div>
    </div>
  );
}
