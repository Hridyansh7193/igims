import React from 'react';

export default function GhostText({ children }) {
  return (
    <div
      aria-hidden="true"
      className="crx-display"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        fontSize: 'clamp(80px,18vw,260px)',
        color: 'transparent',
        WebkitTextStroke: '1px rgba(255,243,214,.07)',
        whiteSpace: 'nowrap',
        zIndex: 0,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {children}
    </div>
  );
}
