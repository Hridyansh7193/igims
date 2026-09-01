import React, { useState, useEffect, useRef } from 'react';

export default function IntroAnimation({ onComplete }) {
  const [frameScale, setFrameScale] = useState(0); // 0 → 1 (tiny → fullscreen)
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  // Rectangular frame expansion
  useEffect(() => {
    startTimeRef.current = performance.now();
    const duration = 1600; // 1.6s for frame to expand

    const tick = (now) => {
      const elapsed = now - startTimeRef.current;
      const t = Math.min(1, elapsed / duration);
      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - t, 3);
      setFrameScale(eased);
      
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Done — remove overlay
        setTimeout(() => {
          onComplete();
        }, 100);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onComplete]);

  // Calculate inset for the growing transparent hole
  // inset goes from 50% (nothing visible) → 0% (everything visible)
  const insetX = 50 - frameScale * 50;
  const insetY = 50 - frameScale * 50;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none', // Allow clicks to pass through just in case, though it's brief
      }}
    >
      {/* Dark overlay with rectangular cutout that grows */}
      {/* The background is solid dark, but the clip-path cuts a transparent hole in it */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#050814', // Solid background covering everything
          // The polygon covers the full screen but cuts a hole in the middle defined by insetX and insetY
          clipPath: `polygon(
            0% 0%, 100% 0%, 100% 100%, 0% 100%,
            0% ${insetY}%,
            ${insetX}% ${insetY}%,
            ${insetX}% ${100 - insetY}%,
            0% ${100 - insetY}%,
            0% 0%,
            100% 0%,
            100% ${100 - insetY}%,
            ${100 - insetX}% ${100 - insetY}%,
            ${100 - insetX}% ${insetY}%,
            100% ${insetY}%,
            100% 0%
          )`,
        }}
      />

      {/* Animated glowing border around the transparent hole */}
      <div
        style={{
          position: 'absolute',
          left: `${insetX}%`,
          top: `${insetY}%`,
          right: `${insetX}%`,
          bottom: `${insetY}%`,
          border: `2px solid rgba(253, 194, 62, ${0.8 - frameScale * 0.6})`,
          boxShadow: `0 0 ${20 + frameScale * 30}px rgba(253, 194, 62, ${0.4 - frameScale * 0.3}), inset 0 0 ${10 + frameScale * 20}px rgba(253, 194, 62, ${0.15 - frameScale * 0.1})`,
        }}
      />
    </div>
  );
}
