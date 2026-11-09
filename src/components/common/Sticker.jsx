import React from 'react';

export default function Sticker({ children, tone = 'gold', rotate = 0, style = {} }) {
  return (
    <span
      className={`crx-sticker ${tone}`}
      style={{
        ...(rotate !== 0 ? { transform: `rotate(${rotate}deg)` } : {}),
        ...style,
      }}
    >
      {children}
    </span>
  );
}
