import React, { useEffect, useRef, useState } from 'react';

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#$%&XZQK▓▒░';

/**
 * GlitchText — scrambles from noise characters into the final text,
 * with a cyan/gold channel-split flicker while resolving.
 *
 * Starts only when `start` becomes true, so it can be timed to a
 * parent sequence (e.g. right as a preloader wipes away).
 */
export default function GlitchText({
  text,
  start = false,
  duration = 900,
  as: Tag = 'span',
  style = {},
  className = '',
  onDone,
}) {
  const [display, setDisplay] = useState('');
  const [glitching, setGlitching] = useState(false);
  const [done, setDone] = useState(false);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!start || firedRef.current) return;
    firedRef.current = true;

    const reduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setDisplay(text);
      setDone(true);
      onDone && onDone();
      return;
    }

    setGlitching(true);
    startRef.current = performance.now();

    const tick = (now) => {
      const elapsed = now - startRef.current;
      const t = Math.min(1, elapsed / duration);
      const revealChance = Math.pow(t, 1.7);

      let out = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === ' ' || ch === "'" || ch === '’') {
          out += ch;
          continue;
        }
        out += Math.random() < revealChance
          ? ch
          : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      }
      setDisplay(out);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
        setGlitching(false);
        setDone(true);
        onDone && onDone();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [start, text, duration, onDone]);

  return (
    <Tag className={className} style={{ position: 'relative', display: 'inline-block', ...style }}>
      {/* Invisible placeholder reserves layout space so nothing jumps */}
      <span style={{ visibility: 'hidden' }} aria-hidden="true">
        {text}
      </span>
      <span
        aria-label={text}
        style={{
          position: 'absolute',
          inset: 0,
          ...(glitching
            ? {
                textShadow: '2px 0 #38BDF8, -2px 0 #FBBF24, 0 2px 12px rgba(56,189,248,0.35)',
                animation: 'crx-glitch-jitter .12s steps(2) infinite',
              }
            : done
            ? { textShadow: style.textShadow || 'none' }
            : { opacity: 0 }),
        }}
      >
        {display}
      </span>
    </Tag>
  );
}
