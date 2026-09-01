import React, { useState, useEffect, useRef, useCallback } from 'react';
import Preloader from './Preloader';

/**
 * IntroAnimation — two-stage cinematic open:
 *  1) Preloader counts 0 -> 100% (logo + progress ring)
 *  2) A rectangular frame wipes open from the center, revealing the page
 *
 * onWipeStart fires the instant stage 2 begins, so page content
 * (e.g. the hero title) can time its own reveal animation to it.
 * onComplete fires once the wipe has fully finished.
 */
export default function IntroAnimation({ onComplete, onWipeStart }) {
  const [stage, setStage] = useState('loading'); // 'loading' -> 'wiping'
  const [frameScale, setFrameScale] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  const handleLoaderDone = useCallback(() => {
    setStage('wiping');
    onWipeStart && onWipeStart();
  }, [onWipeStart]);

  useEffect(() => {
    if (stage !== 'wiping') return;
    startTimeRef.current = performance.now();
    const duration = 1600;

    const tick = (now) => {
      const elapsed = now - startTimeRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setFrameScale(eased);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          onComplete && onComplete();
        }, 100);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stage, onComplete]);

  const insetX = 50 - frameScale * 50;
  const insetY = 50 - frameScale * 50;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {stage === 'loading' ? (
        <Preloader onDone={handleLoaderDone} />
      ) : (
        <>
          {/* Four-panel curtain that shrinks outward, opening a hole in the
              middle. (A single self-intersecting clip-path polygon was tried
              here first but doesn't reliably cancel out its inner hole across
              browsers, so plain rectangles are used instead — simpler and
              guaranteed correct.) */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: `${insetY}%`, background: '#050814' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: `${insetY}%`, background: '#050814' }} />
          <div style={{ position: 'absolute', left: 0, top: `${insetY}%`, bottom: `${insetY}%`, width: `${insetX}%`, background: '#050814' }} />
          <div style={{ position: 'absolute', right: 0, top: `${insetY}%`, bottom: `${insetY}%`, width: `${insetX}%`, background: '#050814' }} />

          {/* Animated glowing border around the transparent hole */}
          <div
            style={{
              position: 'absolute',
              left: `${insetX}%`,
              top: `${insetY}%`,
              right: `${insetX}%`,
              bottom: `${insetY}%`,
              border: `2px solid rgba(56, 189, 248, ${0.8 - frameScale * 0.6})`,
              boxShadow: `0 0 ${20 + frameScale * 30}px rgba(56, 189, 248, ${0.4 - frameScale * 0.3}), inset 0 0 ${10 + frameScale * 20}px rgba(251, 191, 36, ${0.15 - frameScale * 0.1})`,
            }}
          />
        </>
      )}
    </div>
  );
}
