import React from 'react';
import { Music, Mic2, Disc3, Calendar } from 'lucide-react';
import Reveal from '../components/common/Reveal';
import Sticker from '../components/common/Sticker';
import { NIGHTS, REWIND_ARTISTS } from '../constants/pronitesData';
import { useIsNarrow } from '../hooks/useIsNarrow';

import bandsImg from '../assets/events/bands.jpg';
import concertImg from '../assets/events/concert.jpg';
import danceImg from '../assets/events/dance.jpg';
import sportsImg from '../assets/events/sports.jpg';

const IMG_MAP = { bands: bandsImg, concert: concertImg, dance: danceImg, sports: sportsImg };
const NIGHT_ICONS = { opening: Music, star: Mic2, pro: Disc3 };

function NightCard({ n, i }) {
  const Icon = NIGHT_ICONS[n.key] || Music;
  return (
    <Reveal delay={i * 0.08}>
      <div
        style={{
          background: 'linear-gradient(160deg, #200A0A 0%, #0A0505 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '18px 18px 14px 14px',
          padding: '26px 22px',
          height: '100%',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: 'rgba(220,38,38,0.12)',
            border: '1px solid rgba(220,38,38,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18,
          }}
        >
          <Icon size={20} color="#DC2626" />
        </div>
        <p
          style={{
            fontSize: 10.5,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: 'var(--gold)',
            fontWeight: 700,
            margin: '0 0 6px',
          }}
        >
          {n.tag}
        </p>
        <h3 className="crx-display" style={{ fontSize: 24, color: 'var(--cream)', margin: '0 0 10px' }}>
          {n.title}
        </h3>
        <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.7, margin: '0 0 16px' }}>{n.text}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--paper)' }}>
          <Calendar size={13} color="#DC2626" /> {n.date}
        </div>
      </div>
    </Reveal>
  );
}

function ArtistSpotlight({ a, i, narrow }) {
  const reverse = i % 2 === 1;
  return (
    <Reveal delay={0.05}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: narrow ? '1fr' : reverse ? '1fr 1.1fr' : '1.1fr 1fr',
          gap: 0,
          alignItems: 'stretch',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 18,
          overflow: 'hidden',
          marginBottom: 20,
          background: '#0A0505',
        }}
      >
        <div
          style={{
            order: narrow ? 0 : reverse ? 2 : 1,
            minHeight: 260,
            backgroundImage: `url(${IMG_MAP[a.img]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(10,5,5,0.15) 0%, rgba(10,5,5,0.55) 100%)',
            }}
          />
        </div>
        <div
          style={{
            order: narrow ? 1 : reverse ? 1 : 2,
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <span
            aria-hidden="true"
            className="crx-display"
            style={{
              position: 'absolute',
              top: 10,
              right: 20,
              fontSize: 64,
              color: 'rgba(255,255,255,0.04)',
              lineHeight: 1,
            }}
          >
            {a.no}
          </span>
          <p
            style={{
              fontSize: 10.5,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: 'var(--gold)',
              fontWeight: 700,
              margin: '0 0 8px',
            }}
          >
            {a.tag}
          </p>
          <h3 className="crx-display" style={{ fontSize: 'clamp(24px,3vw,34px)', color: 'var(--cream)', margin: '0 0 4px' }}>
            {a.name}
          </h3>
          <p
            style={{
              fontSize: 10.5,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: 'var(--muted)',
              margin: '0 0 14px',
            }}
          >
            {a.role}
          </p>
          <p style={{ fontSize: 13.5, color: 'var(--paper)', lineHeight: 1.75, margin: 0, maxWidth: 420 }}>{a.text}</p>
        </div>
      </div>
    </Reveal>
  );
}

export default function PronitesPage() {
  const narrow = useIsNarrow(760);

  return (
    <section style={{ padding: '150px 24px 100px', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <Sticker tone="cyan" rotate={-2} style={{ marginBottom: 16 }}>
            The Headline Evenings
          </Sticker>
          <h1 className="crx-display" style={{ fontSize: 'clamp(36px,7vw,72px)', color: 'var(--cream)', margin: '0 0 12px' }}>
            PRONITES
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 46, maxWidth: 560, lineHeight: 1.7 }}>
            Three nights, one growing crescendo. Included with every Three-Day Delegate Pass — final lineup drops
            closer to December.
          </p>
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: narrow ? '1fr' : 'repeat(3,1fr)',
            gap: 20,
            marginBottom: 70,
          }}
        >
          {NIGHTS.map((n, i) => (
            <NightCard key={n.key} n={n} i={i} />
          ))}
        </div>

        <Reveal>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 50, marginBottom: 36 }}>
            <Sticker tone="gold" rotate={2} style={{ marginBottom: 16 }}>
              Last Year at IGIMS
            </Sticker>
            <h2 className="crx-display" style={{ fontSize: 'clamp(28px,5vw,48px)', color: 'var(--cream)', margin: '0 0 10px' }}>
              CEREBREXIA REWIND
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 40, maxWidth: 620, lineHeight: 1.7 }}>
              Sample layout for the previous edition's highlight reel — real archive photos and a confirmed lineup
              will replace these placeholders once available.
            </p>
          </div>
        </Reveal>

        {REWIND_ARTISTS.map((a, i) => (
          <ArtistSpotlight key={a.no} a={a} i={i} narrow={narrow} />
        ))}
      </div>
    </section>
  );
}
