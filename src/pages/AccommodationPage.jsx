import React from 'react';
import { BedDouble, Phone, ShieldCheck } from 'lucide-react';
import Reveal from '../components/common/Reveal';
import Sticker from '../components/common/Sticker';
import {
  ACCOMMODATION_FACTS,
  ACCOMMODATION_STEPS,
  ACCOMMODATION_BOYS,
  ACCOMMODATION_GIRLS,
  ACCOMMODATION_GUIDELINES,
  ACCOMMODATION_CONTACTS,
  ACCOMMODATION_INSTAGRAM,
} from '../constants/accommodationData';
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
            Stay on campus during Cerebrexia '26, 27 – 30 Nov, for just ₹150. Basic Registration (BR) is
            mandatory — no accommodation is provided without it.
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

        {/* Boys / Girls facilities */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: narrow ? '1fr' : '1fr 1fr',
            gap: 18,
            marginBottom: 70,
          }}
        >
          {[ACCOMMODATION_BOYS, ACCOMMODATION_GIRLS].map((g, i) => (
            <Reveal key={g.title} delay={i * 0.07}>
              <div
                style={{
                  height: '100%',
                  background: 'linear-gradient(160deg, #181212 0%, #0A0505 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: '26px 24px',
                }}
              >
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
                  {g.subtitle}
                </p>
                <h3 className="crx-display" style={{ fontSize: 26, color: 'var(--cream)', margin: '0 0 18px' }}>
                  {g.title}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--cream)', fontWeight: 700, margin: '0 0 10px' }}>
                  Facilities Provided
                </p>
                <ul style={{ margin: '0 0 20px', paddingLeft: 18, color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.8 }}>
                  {g.facilities.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <p style={{ fontSize: 12, color: 'var(--cream)', fontWeight: 700, margin: '0 0 8px' }}>Food &amp; Mess</p>
                <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>{g.food}</p>
              </div>
            </Reveal>
          ))}
        </div>

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
              background: 'rgba(220,38,38,0.06)',
              border: '1px solid rgba(220,38,38,0.25)',
              borderRadius: 14,
              padding: '24px 24px',
              marginBottom: 40,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <ShieldCheck size={22} color="#DC2626" />
              <h3 style={{ fontSize: 16, color: 'var(--cream)', margin: 0, fontWeight: 700 }}>Important Guidelines</h3>
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--paper)', fontSize: 13.5, lineHeight: 1.9 }}>
              {ACCOMMODATION_GUIDELINES.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal>
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <Phone size={20} color="#DC2626" />
              <h3 style={{ fontSize: 16, color: 'var(--cream)', margin: 0, fontWeight: 700 }}>Contact</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : 'repeat(3,1fr)', gap: 12 }}>
              {ACCOMMODATION_CONTACTS.map((c) => (
                <a
                  key={c.name}
                  href={`tel:+91${c.phone}`}
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    background: 'linear-gradient(160deg, #181212 0%, #0A0505 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12,
                    padding: '16px 18px',
                  }}
                >
                  <p style={{ fontSize: 14.5, color: 'var(--cream)', margin: '0 0 4px', fontWeight: 700 }}>{c.name}</p>
                  <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: 0 }}>{c.phone}</p>
                </a>
              ))}
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: '14px 0 0' }}>
              Instagram: {ACCOMMODATION_INSTAGRAM}
            </p>
          </div>
        </Reveal>

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
              Basic Registration (BR) is mandatory for accommodation. Closed campus, 24x7 accessibility, safe and
              secure environment.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
