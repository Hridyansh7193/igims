import React from 'react';

export default function Sticker({ children, tone = 'gold', rotate = -2, style = {} }) {
  return (
    <span className={`crx-sticker ${tone}`} style={{ transform: `rotate(${rotate}deg)`, ...style }}>
      {children}
    </span>
  );
}
