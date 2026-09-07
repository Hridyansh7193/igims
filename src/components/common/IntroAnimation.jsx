import React, { useState, useEffect, useRef, useCallback } from 'react';
import Preloader from './Preloader';
import AuthForm from '../auth/AuthForm';
import SponsorPopup from './SponsorPopup';
import { useAuth } from '../../context/AuthContext';

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
  const [stage, setStage] = useState('loading'); // 'loading' -> 'auth' -> 'sponsor' -> 'wiping'
  const [frameScale, setFrameScale] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const { user } = useAuth();

  const handleLoaderDone = useCallback(() => {
    if (user) {
      setStage('sponsor');
    } else {
      setStage('auth');
    }
  }, [user]);

  useEffect(() => {
    if (stage === 'auth' && user) {
      setStage('sponsor');
    }
  }, [user, stage]);

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
        pointerEvents: (stage === 'auth' || stage === 'sponsor') ? 'auto' : 'none',
      }}
    >
      {stage === 'loading' && <Preloader onDone={handleLoaderDone} />}
      
      {stage === 'auth' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020101' }}>
          <AuthForm onSuccess={() => setStage('sponsor')} />
        </div>
      )}

      {stage === 'sponsor' && (
        <SponsorPopup onClose={() => {
          setStage('wiping');
          onWipeStart && onWipeStart();
        }} />
      )}

      {stage === 'wiping' && (
        <>
          {/* Four-panel curtain that shrinks outward, opening a hole in the
              middle. */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: `${insetY}%`, background: '#020101' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: `${insetY}%`, background: '#020101' }} />
          <div style={{ position: 'absolute', left: 0, top: `${insetY}%`, bottom: `${insetY}%`, width: `${insetX}%`, background: '#020101' }} />
          <div style={{ position: 'absolute', right: 0, top: `${insetY}%`, bottom: `${insetY}%`, width: `${insetX}%`, background: '#020101' }} />

          {/* Animated glowing border around the transparent hole */}
          <div
            style={{
              position: 'absolute',
              left: `${insetX}%`,
              top: `${insetY}%`,
              right: `${insetX}%`,
              bottom: `${insetY}%`,
              border: `2px solid rgba(179, 18, 58, ${0.8 - frameScale * 0.6})`,
              boxShadow: `0 0 ${20 + frameScale * 30}px rgba(179, 18, 58, ${0.4 - frameScale * 0.3}), inset 0 0 ${10 + frameScale * 20}px rgba(176, 141, 87, ${0.15 - frameScale * 0.1})`,
            }}
          />
        </>
      )}
    </div>
  );
}
