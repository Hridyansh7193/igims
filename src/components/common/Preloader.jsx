import React, { useEffect, useRef, useState } from 'react';
import { LOGO_SRC } from '../../constants/logo';

/**
 * Preloader — counts 0 → 100%, drawing a glowing ring around the logo
 * as it goes, then calls onDone (the parent handles the exit transition).
 */
export default function Preloader({ onDone, duration = 1800 }) {
  const [percent, setPercent] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const firedRef = useRef(false);

  useEffect(() => {
    const reduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setPercent(100);
      onDone && onDone();
      return;
    }

    startRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 2);
      setPercent(Math.round(eased * 100));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else if (!firedRef.current) {
        firedRef.current = true;
        setTimeout(() => onDone && onDone(), 200);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [duration, onDone]);

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percent / 100);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(ellipse at 50% 40%, #172554 0%, #070C20 55%, #050814 100%)',
      }}
    >
      {/* faint scanlines for texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(0deg, rgba(56,189,248,0.05) 0px, rgba(56,189,248,0.05) 1px, transparent 1px, transparent 3px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          width: 148,
          height: 148,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="148"
          height="148"
          style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
        >
          <circle cx="74" cy="74" r={radius} stroke="rgba(56,189,248,0.15)" strokeWidth="2" fill="none" />
          <circle
            cx="74"
            cy="74"
            r={radius}
            stroke="url(#crx-preloader-grad)"
            strokeWidth="2.5"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0 0 6px rgba(56,189,248,0.7))',
              transition: 'stroke-dashoffset .08s linear',
            }}
          />
          <defs>
            <linearGradient id="crx-preloader-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
          </defs>
        </svg>

        <img
          src={LOGO_SRC}
          alt=""
          style={{
            width: 98,
            height: 98,
            borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '0 0 26px rgba(56,189,248,0.4)',
            animation: 'crx-pulse-glow 2.4s ease-in-out infinite',
          }}
        />
      </div>

      <div
        className="crx-display"
        style={{
          marginTop: 22,
          fontSize: 36,
          letterSpacing: 2,
          color: '#F0F8FF',
          textShadow: '0 0 18px rgba(56,189,248,0.5)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {percent}%
      </div>
      <div
        style={{
          marginTop: 6,
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 11,
          letterSpacing: 4,
          textTransform: 'uppercase',
          color: 'rgba(240,248,255,0.5)',
        }}
      >
        Loading Cerebrexia
      </div>
    </div>
  );
}
