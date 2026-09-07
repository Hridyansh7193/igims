import React, { useEffect, useState, useMemo } from 'react';
import DynamicBackground from './DynamicBackground';

const BATS_COUNT = 300;

export default function Preloader({ onDone }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 0: Blue logo visible (0 - 500ms)
    // Stage 1: Bats slowly swarm from all sides (500ms - 2500ms)
    // Stage 2: Logo swaps to red while engulfed (2500ms - 3000ms)
    // Stage 3: Bats disperse quickly (3000ms - 4000ms)
    // Stage 4: Trigger onDone (4200ms)

    const t1 = setTimeout(() => setStage(1), 500);
    const t2 = setTimeout(() => setStage(2), 2500);
    const t3 = setTimeout(() => setStage(3), 3000);
    const t4 = setTimeout(() => {
      if (onDone) onDone();
    }, 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onDone]);

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
        <div style={{ position: 'relative', zIndex: 1, width: 320, height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Background Glow */}
          <div 
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: stage >= 2 ? 'rgba(220, 38, 38, 0.5)' : 'rgba(59, 130, 246, 0.5)',
              filter: 'blur(50px)',
              transition: 'background 0.5s ease',
              borderRadius: '50%',
            }}
          />

          {/* Logo */}
          <img
            src={stage >= 2 ? '/new-logo-red2.png' : '/new-logo-blue.png'}
            alt="Cerebrexia Logo"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 250,
              height: 250,
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: stage >= 2 ? '0 0 40px rgba(220,38,38,0.6)' : '0 0 40px rgba(59,130,246,0.6)',
              transition: 'box-shadow 0.5s ease, transform 1s ease',
              transform: stage >= 3 ? 'translate(-50%, -50%) scale(1.15)' : 'translate(-50%, -50%) scale(1)',
            }}
          />

          {/* Bat Swarm */}
          {bats.map((bat) => {
            let x = bat.startX;
            let y = bat.startY;
            let scale = 0.5;
            let opacity = 0;

            if (stage === 1 || stage === 2) {
              x = bat.endX;
              y = bat.endY;
              scale = 1;
              opacity = 1;
            } else if (stage === 3) {
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
                  opacity: stage === 0 ? 0 : opacity,
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
            bottom: 60,
            zIndex: 1,
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: stage >= 2 ? 'var(--crx-red)' : 'rgba(255,255,255,0.3)',
            transition: 'color 1s ease',
            opacity: stage >= 3 ? 0 : 1,
          }}
        >
          Initializing
        </div>
      </div>
    </>
  );
}
