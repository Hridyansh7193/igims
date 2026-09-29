import React, { useEffect, useState, useMemo, useRef } from 'react';
import DynamicBackground from './DynamicBackground';

const BATS_COUNT = typeof window !== 'undefined' && window.innerWidth < 768 ? 120 : 300;

// All images that must load before the animation stages begin
const PRELOAD_SRCS = ['/new-logo-blue.png', '/new-logo-red2.png', '/bat1.png', '/bat2.png', '/bat3.png'];

function preloadImages(srcs) {
  return Promise.all(
    srcs.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve; // don't block if an image is missing
          img.src = src;
        })
    )
  );
}

export default function Preloader({ onDone }) {
  const [stage, setStage] = useState(-1); // -1 = preloading images
  const timersRef = useRef([]);

  // Preload, then start animation stages
  useEffect(() => {
    let cancelled = false;

    preloadImages(PRELOAD_SRCS).then(() => {
      if (cancelled) return;
      setStage(0);
    });

    return () => { cancelled = true; };
  }, []);

  // Stage timers — only start once stage becomes 0 (images loaded)
  useEffect(() => {
    if (stage !== 0) return;

    // Stage 0: Blue logo visible (0 - 500ms)
    // Stage 1: Bats slowly swarm from all sides (500ms - 2500ms)
    // Stage 2: Logo swaps to red while engulfed (2500ms - 3000ms)
    // Stage 3: Bats disperse quickly (3000ms - 4000ms)
    // Stage 4: Trigger onDone (5500ms)

    timersRef.current = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 2500),
      setTimeout(() => setStage(3), 3000),
      setTimeout(() => { if (onDone) onDone(); }, 5500),
    ];

    return () => timersRef.current.forEach(clearTimeout);
  }, [stage, onDone]);

  const bats = useMemo(() => {
    return Array.from({ length: BATS_COUNT }).map((_, i) => {
      const angle = (i / BATS_COUNT) * 2 * Math.PI + Math.random();
      // Start far outside the screen
      const startRadius = 600 + Math.random() * 400;
      const startX = Math.cos(angle) * startRadius;
      const startY = Math.sin(angle) * startRadius;

      // End up covering the center logo
      const endRadius = Math.random() * 125;
      const endAngle = Math.random() * 2 * Math.PI;
      const endX = Math.cos(endAngle) * endRadius;
      const endY = Math.sin(endAngle) * endRadius;

      // Disperse out of bounds
      const outX = Math.cos(angle) * (800 + Math.random() * 200);
      const outY = Math.sin(angle) * (800 + Math.random() * 200);

      // Random delay to make them come in organically
      const delay = Math.random() * 0.8;
      // Random sizes
      const size = 20 + Math.random() * 60;
      
      // Cycle through bat1, bat2, bat3
      const batImg = `/bat${(i % 3) + 1}.png`; 

      const flutterDur = 0.15 + Math.random() * 0.2;

      return { id: i, startX, startY, endX, endY, outX, outY, delay, size, batImg, flutterDur };
    });
  }, []);

  // While preloading, show an empty black screen (the DynamicBackground provides ambiance)
  const effectiveStage = stage < 0 ? 0 : stage;

  return (
    <>
      <style>
        {`
          @keyframes crx-bat-flutter {
            0% { transform: translate(-3px, -3px) rotate(-15deg); }
            33% { transform: translate(3px, -2px) rotate(10deg); }
            66% { transform: translate(-2px, 3px) rotate(-5deg); }
            100% { transform: translate(2px, 2px) rotate(15deg); }
          }
        `}
      </style>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at 50% 40%, #1a0a0a 0%, #0a0505 55%, #050303 100%)',
          overflow: 'hidden',
          zIndex: 99999,
        }}
      >
        {/* Same ambient red particle/glow background used across the main site */}
        <DynamicBackground />
        <div style={{
          position: 'relative',
          zIndex: 1,
          width: 'min(320px, 80vw)',
          height: 'min(320px, 80vw)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          
          {/* Background Glow */}
          <div 
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: effectiveStage >= 2 ? 'rgba(220, 38, 38, 0.5)' : 'rgba(59, 130, 246, 0.5)',
              filter: 'blur(50px)',
              transition: 'background 0.5s ease',
              borderRadius: '50%',
            }}
          />

          {/* Logo */}
          <img
            src={effectiveStage >= 2 ? '/new-logo-red2.png' : '/new-logo-blue.png'}
            alt="Cerebrexia Logo"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 'min(250px, 65vw)',
              height: 'min(250px, 65vw)',
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: effectiveStage >= 2 ? '0 0 40px rgba(220,38,38,0.6)' : '0 0 40px rgba(59,130,246,0.6)',
              transition: 'box-shadow 0.5s ease, transform 1s ease',
              transform: effectiveStage >= 3 ? 'translate(-50%, -50%) scale(1.15)' : 'translate(-50%, -50%) scale(1)',
            }}
          />

          {/* Bat Swarm */}
          {bats.map((bat) => {
            let x = bat.startX;
            let y = bat.startY;
            let scale = 0.5;
            let opacity = 0;

            if (effectiveStage === 1 || effectiveStage === 2) {
              x = bat.endX;
              y = bat.endY;
              scale = 1;
              opacity = 1;
            } else if (effectiveStage === 3) {
              x = bat.outX;
              y = bat.outY;
              scale = 1.5;
              opacity = 0;
            }

            return (
              <div
                key={bat.id}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
                  opacity: effectiveStage === 0 ? 0 : opacity,
                  // The overall movement of the bat from off-screen -> logo -> off-screen
                  transition: `transform ${1.5 + Math.random() * 0.5}s cubic-bezier(0.25, 0.1, 0.25, 1) ${bat.delay}s, opacity ${1.5}s ease ${bat.delay}s`,
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              >
                {/* The individual flutter jitter of the bat */}
                <img 
                  src={bat.batImg} 
                  alt="" 
                  style={{
                    width: bat.size,
                    height: 'auto',
                    animation: `crx-bat-flutter ${bat.flutterDur}s infinite alternate ease-in-out`,
                  }} 
                />
              </div>
            );
          })}
        </div>
        
        {/* Tagline */}
        <div
          style={{
            position: 'absolute',
            bottom: 'max(30px, 5vh)',
            zIndex: 1,
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: effectiveStage >= 2 ? 'var(--crx-red)' : 'rgba(255,255,255,0.3)',
            transition: 'color 1s ease',
            opacity: effectiveStage >= 3 ? 0 : 1,
          }}
        >
          Initializing
        </div>
      </div>
    </>
  );
}
