import React from 'react';
import { BedDouble } from 'lucide-react';
import Reveal from '../components/common/Reveal';
import Sticker from '../components/common/Sticker';
import { ACCOMMODATION_FACTS, ACCOMMODATION_STEPS } from '../constants/accommodationData';
import { useIsNarrow } from '../hooks/useIsNarrow';

export default function AccommodationPage() {
  const narrow = useIsNarrow(760);

  return (
    <section style={{ padding: '150px 24px 100px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <Sticker tone="gold" rotate={-2} style={{ marginBottom: 16 }}>
            Staying on Campus
          </Sticker>
          <h1 className="crx-display" style={{ fontSize: 'clamp(36px,7vw,72px)', color: 'var(--cream)', margin: '0 0 12px' }}>
            ACCOMMODATION
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 50, maxWidth: 580, lineHeight: 1.7 }}>
            A confirmed Delegate Registration makes you eligible to apply for on-campus accommodation. It's
            separately charged, subject to availability, and never guaranteed automatically.
          </p>
        </Reveal>

        {/* Facts grid */}
        <Reveal delay={0.05}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: narrow ? '1fr 1fr' : 'repeat(3,1fr)',
              gap: 1,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              overflow: 'hidden',
              marginBottom: 70,
            }}
          >
            {ACCOMMODATION_FACTS.map((f) => (
              <div key={f.label} style={{ background: '#0A0505', padding: '22px 20px' }}>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: 1.2,
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    fontWeight: 700,
                    margin: '0 0 8px',
                  }}
                >
                  {f.label}
                </p>
                <p style={{ fontSize: 14.5, color: 'var(--cream)', margin: 0, lineHeight: 1.5 }}>{f.value}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Process steps */}
        <Reveal>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 50, marginBottom: 36 }}>
            <Sticker tone="cyan" rotate={2} style={{ marginBottom: 16 }}>
              How It Works
            </Sticker>
            <h2 className="crx-display" style={{ fontSize: 'clamp(26px,4.5vw,42px)', color: 'var(--cream)', margin: 0 }}>
              Four Steps to a Bed on Campus
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 60 }}>
          {ACCOMMODATION_STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.07}>
              <div
                style={{
                  display: 'flex',
                  gap: 18,
                  alignItems: 'flex-start',
                  background: 'linear-gradient(160deg, #181212 0%, #0A0505 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14,
                  padding: '20px 22px',
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    flexShrink: 0,
                    borderRadius: '50%',
                    background: 'rgba(220,38,38,0.14)',
                    border: '1px solid rgba(220,38,38,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 800,
                    color: '#DC2626',
                  }}
                >
                  {i + 1}
                </div>
                <div>
                  <h3 style={{ fontSize: 15.5, color: 'var(--cream)', margin: '0 0 6px', fontWeight: 700 }}>{s.title}</h3>
                  <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>{s.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              background: 'rgba(220,38,38,0.06)',
              border: '1px solid rgba(220,38,38,0.25)',
              borderRadius: 14,
              padding: '20px 24px',
            }}
          >
            <BedDouble size={26} color="#DC2626" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 13.5, color: 'var(--paper)', margin: 0, lineHeight: 1.7 }}>
              Accommodation is limited and offered on a first-come basis to confirmed delegates. We recommend
              registering early if you plan to stay on campus.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
