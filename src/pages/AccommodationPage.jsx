import React, { useState, useEffect } from 'react';
import {
  BedDouble,
  Phone,
  ShieldCheck,
  MessageCircle,
  Wifi,
  Cctv,
  Droplets,
  Sparkles,
  Stethoscope,
  Users,
  Utensils,
  IndianRupee,
  Check,
} from 'lucide-react';
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

const RED = '#DC2626';
// Accommodation opens 27 Nov 2026 (local time)
const START_DATE = new Date(2026, 10, 27, 0, 0, 0);

const CARD_BG = 'linear-gradient(160deg, #181212 0%, #0A0505 100%)';
const CARD_BORDER = '1px solid rgba(255,255,255,0.08)';

function iconForFacility(text) {
  const t = text.toLowerCase();
  if (t.includes('wi-fi')) return Wifi;
  if (t.includes('cctv') || t.includes('security')) return Cctv;
  if (t.includes('water')) return Droplets;
  if (t.includes('washroom') || t.includes('housekeeping')) return Sparkles;
  if (t.includes('medical')) return Stethoscope;
  if (t.includes('common area')) return Users;
  return BedDouble;
}

function useCountdown(target) {
  const calc = () => Math.max(0, target.getTime() - Date.now());
  const [ms, setMs] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setMs(calc()), 30000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mins = Math.floor(ms / 60000);
  return {
    done: ms <= 0,
    days: Math.floor(mins / 1440),
    hours: Math.floor((mins % 1440) / 60),
    minutes: mins % 60,
  };
}

export default function AccommodationPage() {
  const narrow = useIsNarrow(760);
  const [tab, setTab] = useState('boys');
  const cd = useCountdown(START_DATE);

  const group = tab === 'boys' ? ACCOMMODATION_BOYS : ACCOMMODATION_GIRLS;

  return (
    <section style={{ padding: '150px 24px 100px' }}>
      <style>{`
        @keyframes accGlow { 0%,100% { box-shadow: 0 0 22px rgba(220,38,38,0.28); } 50% { box-shadow: 0 0 40px rgba(220,38,38,0.5); } }
        @keyframes accFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .acc-lift { transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
        .acc-lift:hover { transform: translateY(-3px); border-color: rgba(220,38,38,0.55) !important; box-shadow: 0 10px 30px rgba(220,38,38,0.12); }
        .acc-panel { animation: accFade .35s ease; }
        .acc-btn { transition: transform .2s ease, background .2s ease; }
        .acc-btn:hover { transform: translateY(-1px); }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Hero */}
        <Reveal>
          <div
            style={{
              display: 'flex',
              flexDirection: narrow ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: narrow ? 'flex-start' : 'flex-end',
              gap: 28,
              marginBottom: 50,
            }}
          >
            <div style={{ maxWidth: 580 }}>
              <Sticker tone="gold" rotate={-2} style={{ marginBottom: 16 }}>
                Staying on Campus
              </Sticker>
              <h1 className="crx-display" style={{ fontSize: 'clamp(36px,7vw,72px)', color: 'var(--cream)', margin: '0 0 12px' }}>
                ACCOMMODATION
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0, lineHeight: 1.7 }}>
                Stay on campus during Cerebrexia '26, 27 – 30 Nov, for just ₹150. Basic Registration (BR) is
                mandatory — no accommodation is provided without it.
              </p>
            </div>

            {/* Price badge + countdown */}
            <div
              style={{
                background: CARD_BG,
                border: '1px solid rgba(220,38,38,0.35)',
                borderRadius: 18,
                padding: '20px 24px',
                minWidth: narrow ? '100%' : 280,
                boxSizing: 'border-box',
                animation: 'accGlow 3.5s ease-in-out infinite',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'rgba(220,38,38,0.14)',
                    border: '1px solid rgba(220,38,38,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IndianRupee size={18} color={RED} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>
                    Boys &amp; Girls
                  </p>
                  <p className="crx-display" style={{ margin: 0, fontSize: 30, color: 'var(--cream)', lineHeight: 1.1 }}>
                    ₹150
                  </p>
                </div>
              </div>

              {cd.done ? (
                <p style={{ margin: 0, fontSize: 13, color: '#86efac', fontWeight: 700 }}>Accommodation is live — 27 to 30 Nov</p>
              ) : (
                <>
                  <p style={{ margin: '0 0 8px', fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--muted)' }}>
                    Check-in starts 27 Nov in
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      [cd.days, 'Days'],
                      [cd.hours, 'Hrs'],
                      [cd.minutes, 'Min'],
                    ].map(([v, l]) => (
                      <div
                        key={l}
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          background: 'rgba(0,0,0,0.45)',
                          border: CARD_BORDER,
                          borderRadius: 10,
                          padding: '8px 4px',
                        }}
                      >
                        <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'var(--cream)' }}>{String(v).padStart(2, '0')}</p>
                        <p style={{ margin: 0, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)' }}>{l}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
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

        {/* Boys / Girls toggle */}
        <Reveal>
          <div style={{ marginBottom: 70 }}>
            <div
              style={{
                display: 'inline-flex',
                padding: 4,
                gap: 4,
                background: 'rgba(0,0,0,0.5)',
                border: CARD_BORDER,
                borderRadius: 999,
                marginBottom: 22,
              }}
            >
              {[
                ['boys', 'For Boys', 'Hostel Rooms'],
                ['girls', 'For Girls', 'Lodgings'],
              ].map(([key, label, sub]) => {
                const active = tab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className="acc-btn"
                    style={{
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: 999,
                      padding: narrow ? '10px 16px' : '10px 24px',
                      background: active ? RED : 'transparent',
                      color: active ? '#fff' : 'var(--muted)',
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      boxShadow: active ? '0 4px 18px rgba(220,38,38,0.4)' : 'none',
                    }}
                  >
                    {label}
                    <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 500, opacity: 0.8 }}>{narrow ? '' : `· ${sub}`}</span>
                  </button>
                );
              })}
            </div>

            <div key={tab} className="acc-panel">
              <p style={{ fontSize: 12, color: 'var(--cream)', fontWeight: 700, margin: '0 0 12px', letterSpacing: 0.4 }}>
                Facilities Provided
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: narrow ? '1fr' : 'repeat(3,1fr)',
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                {group.facilities.map((f) => {
                  const Icon = iconForFacility(f);
                  return (
                    <div
                      key={f}
                      className="acc-lift"
                      style={{
                        display: 'flex',
                        gap: 12,
                        alignItems: 'flex-start',
                        background: CARD_BG,
                        border: CARD_BORDER,
                        borderRadius: 14,
                        padding: '16px 16px',
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
                        <Icon size={17} color={RED} />
                      </div>
                      <p style={{ margin: 0, fontSize: 13.5, color: 'var(--cream)', lineHeight: 1.55 }}>{f}</p>
                    </div>
                  );
                })}
              </div>

              <div
                className="acc-lift"
                style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                  background: CARD_BG,
                  border: CARD_BORDER,
                  borderRadius: 14,
                  padding: '18px 18px',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    borderRadius: 10,
                    background: 'rgba(212,175,106,0.12)',
                    border: '1px solid rgba(212,175,106,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Utensils size={17} color="#D4AF6A" />
                </div>
                <div>
                  <p style={{ margin: '0 0 6px', fontSize: 12, color: 'var(--cream)', fontWeight: 700 }}>Food &amp; Mess</p>
                  <p style={{ margin: 0, fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.7 }}>{group.food}</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Process steps — timeline */}
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

        <div style={{ position: 'relative', marginBottom: 60, paddingLeft: narrow ? 0 : 0 }}>
          {/* vertical connecting line */}
          <div
            style={{
              position: 'absolute',
              left: 16,
              top: 18,
              bottom: 18,
              width: 2,
              background: 'linear-gradient(180deg, rgba(220,38,38,0.7), rgba(220,38,38,0.1))',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {ACCOMMODATION_STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.07}>
                <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', position: 'relative' }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      flexShrink: 0,
                      borderRadius: '50%',
                      background: '#1A0707',
                      border: `2px solid ${RED}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 800,
                      color: '#fff',
                      boxShadow: '0 0 16px rgba(220,38,38,0.55)',
                      zIndex: 1,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div
                    className="acc-lift"
                    style={{
                      flex: 1,
                      background: CARD_BG,
                      border: CARD_BORDER,
                      borderRadius: 14,
                      padding: '16px 20px',
                    }}
                  >
                    <h3 style={{ fontSize: 15.5, color: 'var(--cream)', margin: '0 0 6px', fontWeight: 700 }}>{s.title}</h3>
                    <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>{s.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Guidelines */}
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
              <ShieldCheck size={22} color={RED} />
              <h3 style={{ fontSize: 16, color: 'var(--cream)', margin: 0, fontWeight: 700 }}>Important Guidelines</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ACCOMMODATION_GUIDELINES.map((g) => (
                <div key={g} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      flexShrink: 0,
                      marginTop: 1,
                      borderRadius: '50%',
                      background: 'rgba(220,38,38,0.16)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={12} color={RED} />
                  </div>
                  <p style={{ margin: 0, fontSize: 13.5, color: 'var(--paper)', lineHeight: 1.7 }}>{g}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Contacts */}
        <Reveal>
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <Phone size={20} color={RED} />
              <h3 style={{ fontSize: 16, color: 'var(--cream)', margin: 0, fontWeight: 700 }}>Contact</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : 'repeat(3,1fr)', gap: 12 }}>
              {ACCOMMODATION_CONTACTS.map((c) => (
                <div
                  key={c.name}
                  className="acc-lift"
                  style={{ background: CARD_BG, border: CARD_BORDER, borderRadius: 12, padding: '16px 18px' }}
                >
                  <p style={{ fontSize: 14.5, color: 'var(--cream)', margin: '0 0 4px', fontWeight: 700 }}>{c.name}</p>
                  <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: '0 0 14px' }}>{c.phone}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a
                      href={`tel:+91${c.phone}`}
                      className="acc-btn"
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        padding: '8px 10px',
                        borderRadius: 8,
                        background: RED,
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      <Phone size={13} /> Call
                    </a>
                    <a
                      href={`https://wa.me/91${c.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="acc-btn"
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        padding: '8px 10px',
                        borderRadius: 8,
                        background: 'rgba(34,197,94,0.12)',
                        border: '1px solid rgba(34,197,94,0.4)',
                        color: '#86efac',
                        fontSize: 12,
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      <MessageCircle size={13} /> WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <a
              href={`https://instagram.com/${ACCOMMODATION_INSTAGRAM.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="acc-btn"
              style={{
                display: 'inline-block',
                marginTop: 14,
                fontSize: 13,
                color: 'var(--gold)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Instagram: {ACCOMMODATION_INSTAGRAM} →
            </a>
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
            <BedDouble size={26} color={RED} style={{ flexShrink: 0 }} />
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
