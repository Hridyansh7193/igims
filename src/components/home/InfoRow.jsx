import React from 'react';
import Marquee from '../common/Marquee';

export default function InfoRow() {
  const items = [
    { name: 'ACADEMIC', label: 'Quizzes & Talks' },
    { name: 'LITERARY', label: 'Debate & Poetry' },
    { name: 'CULTURAL', label: 'Music & Dance' },
    { name: 'SPORTS', label: '14 Games' },
    { name: 'ART', label: 'Painting & Ink' },
    { name: 'INFORMAL', label: 'Chaos & Fun' },
  ];

  return (
    <Marquee
      items={items.map((i) => `${i.name} \u2014 ${i.label}`)}
      tone="orange"
      rotate={1.4}
    />
  );
}
