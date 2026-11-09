import React, { useEffect, useRef, useState } from 'react';

/**
 * Clean entrance reveal — smooth fade and rise into the crisp title text.
 */
export default function GlitchText({
  text,
  start = false,
  duration = 600,
  as: Tag = 'span',
  style = {},
  className = '',
  onDone,
}) {
  const [done, setDone] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!start || firedRef.current) return;
    firedRef.current = true;

    const timer = setTimeout(() => {
      setDone(true);
      if (onDone) onDone();
    }, duration);

    return () => clearTimeout(timer);
  }, [start, duration, onDone]);

  return (
    <Tag
      className={className}
      style={{
        display: 'inline-block',
        transition: 'opacity 300ms cubic-bezier(0.22, 1, 0.36, 1), transform 300ms cubic-bezier(0.22, 1, 0.36, 1)',
        opacity: start ? 1 : 0,
        transform: start ? 'translateY(0)' : 'translateY(8px)',
        ...style,
      }}
    >
      {text}
    </Tag>
  );
}
