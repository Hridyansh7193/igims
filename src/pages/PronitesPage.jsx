import React from 'react';
import { Mic2, Disc3, Shirt, Calendar, Sparkles } from 'lucide-react';
import Reveal from '../components/common/Reveal';
import Sticker from '../components/common/Sticker';
import { NIGHTS } from '../constants/pronitesData';
import { useIsNarrow } from '../hooks/useIsNarrow';

const LINEUP_ICONS = { singer: Mic2, dj: Disc3, fashion: Shirt };

const PAGE_CSS = `
  .pn-card {
    transition: transform .35s ease, border-color .35s ease, box-shadow .35s ease;
  }
  .pn-card:hover {
    transform: translateY(-6px);
    border-color: rgba(220,38,38,0.55);
    box-shadow: 0 18px 40px rgba(220,38,38,0.12);
  }
  .pn-card.pn-featured {
    border-color: rgba(201,151,58,0.5);
    box-shadow: 0 14px 44px rgba(201,151,58,0.10);
  }
  .pn-card.pn-featured:hover {
    border-color: rgba(201,151,58,0.9);
    box-shadow: 0 20px 50px rgba(201,151,58,0.18);
  }
  .pn-row {
    transition: background .25s ease, border-color .25s ease;
  }
  .pn-row:hover {
    background: rgba(220,38,38,0.08);
    border-color: rgba(220,38,38,0.3);
  }
  @media (prefers-reduced-motion: reduce) {
    .pn-card, .pn-row { transition: none; }
    .pn-card:hover { transform: none; }
  }
`;

function SummaryStrip({ narrow }) {
  return (
    <Reveal>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: narrow ? '1fr' : 'repeat(3,1fr)',
          gap: 12,
          marginBottom: 36,
        }}
      >
        {NIGHTS.map((n) => (
          <div
            key={n.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 18px',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${n.featured ? 'rgba(201,151,58,0.4)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            <span
              className="crx-display"
              style={{ fontSize: 30, lineHeight: 1, color: n.featured ? 'var(--gold)' : '#DC2626' }}
            >
              {n.day}
            </span>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: 'var(--cream)' }}>{n.date}</p>
              <p style={{ margin: '2px 0 0', fontSize: 11.5, color: 'var(--muted)' }}>
                {n.lineup.map((l) => l.label).join(' + ')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

function LineupRow({ item }) {
  const Icon = LINEUP_ICONS[item.type] || Sparkles;
  return (
    <div
      className="pn-row"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          flexShrink: 0,
          borderRadius: 10,
          background: 'rgba(220,38,38,0.12)',
          border: '1px solid rgba(220,38,38,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={16} color="#DC2626" />
      </div>
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            color: 'var(--cream)',
          }}
        >
          {item.label}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.4 }}>{item.note}</p>
      </div>
    </div>
  );
}

function DayCard({ n, i, narrow }) {
  const lift = n.featured && !narrow;
  return (
    <Reveal delay={i * 0.1} style={{ height: '100%' }}>
      <div
        className={`pn-card${n.featured ? ' pn-featured' : ''}`}
        style={{
          background: n.featured
            ? 'linear-gradient(160deg, #2A0F0C 0%, #0A0505 100%)'
            : 'linear-gradient(160deg, #200A0A 0%, #0A0505 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '18px 18px 14px 14px',
          padding: '28px 22px 24px',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          marginTop: lift ? -14 : 0,
          marginBottom: lift ? 14 : 0,
          boxSizing: 'border-box',
        }}
      >
        <span
          aria-hidden="true"
          className="crx-display"
          style={{
            position: 'absolute',
            top: -6,
            right: 14,
            fontSize: 110,
            lineHeight: 1,
            color: n.featured ? 'rgba(201,151,58,0.09)' : 'rgba(255,255,255,0.045)',
            pointerEvents: 'none',
          }}
        >
          {n.day}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, position: 'relative' }}>
          <span
            style={{
              fontSize: 10.5,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: 'var(--gold)',
              fontWeight: 700,
            }}
          >
            {n.tag}
          </span>
          <span
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: n.featured ? '#0A0505' : 'var(--paper)',
              background: n.featured ? 'var(--gold)' : 'rgba(255,255,255,0.06)',
              border: n.featured ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.12)',
              borderRadius: 999,
              padding: '3px 9px',
            }}
          >
            {n.badge}
          </span>
        </div>

        <h3
          className="crx-display"
          style={{ fontSize: 26, color: 'var(--cream)', margin: '0 0 10px', position: 'relative' }}
        >
          {n.title}
        </h3>
        <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.7, margin: '0 0 20px', position: 'relative' }}>
          {n.text}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, position: 'relative' }}>
          {n.lineup.map((item) => (
            <LineupRow key={item.label} item={item} />
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            color: 'var(--paper)',
            paddingTop: 14,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            position: 'relative',
          }}
        >
          <Calendar size={13} color="#DC2626" /> {n.date}
        </div>
      </div>
    </Reveal>
  );
}

export default function PronitesPage() {
  const narrow = useIsNarrow(760);

  return (
    <section style={{ padding: '150px 24px 100px', position: 'relative' }}>
      <style>{PAGE_CSS}</style>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <Sticker tone="cyan" rotate={-2} style={{ marginBottom: 16 }}>
            The Headline Evenings
          </Sticker>
          <h1 className="crx-display" style={{ fontSize: 'clamp(36px,7vw,72px)', color: 'var(--cream)', margin: '0 0 12px' }}>
            PRONITES
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 36, maxWidth: 560, lineHeight: 1.7 }}>
            Three days, one growing crescendo. Included with Basic Registration (BR) — artist names to be
            announced.
          </p>
        </Reveal>

        <SummaryStrip narrow={narrow} />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: narrow ? '1fr' : 'repeat(3,1fr)',
            gap: 20,
            alignItems: 'stretch',
          }}
        >
          {NIGHTS.map((n, i) => (
            <DayCard key={n.key} n={n} i={i} narrow={narrow} />
          ))}
        </div>
      </div>
    </section>
  );
}
