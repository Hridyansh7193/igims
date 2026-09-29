import React from 'react';
import Reveal from '../common/Reveal';
import { useIsNarrow } from '../../hooks/useIsNarrow';
import campusBlueprintImg from '../../assets/campus_blueprint.png';

// Isometric line-art illustration of the IGIMS campus building (uploaded asset).
function CampusBlueprint() {
  return (
    <>
      <img
        src={campusBlueprintImg}
        alt="Indira Gandhi Institute of Medical Sciences campus illustration"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 35%',
          display: 'block',
        }}
      />
      {/* bottom gradient so the text stays readable over the artwork */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(10,10,10,0) 45%, rgba(10,10,10,0.55) 78%, rgba(10,10,10,0.92) 100%)',
        }}
      />
    </>
  );
}

function StatItem({ label, value, borderRight, borderBottom }) {
  return (
    <div
      style={{
        padding: '13px 16px',
        borderRight: borderRight ? '1px solid var(--crx-border)' : 'none',
        borderBottom: borderBottom ? '1px solid var(--crx-border)' : 'none',
      }}
    >
      <p
        style={{
          fontSize: 10,
          letterSpacing: '0.13em',
          color: 'var(--crx-text-muted)',
          margin: '0 0 6px',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </p>
      <p style={{ fontSize: 13.5, color: 'var(--cream)', margin: 0, fontWeight: 600 }}>{value}</p>
    </div>
  );
}

export default function HostCampusSection() {
  const narrow = useIsNarrow(860);

  const stats = [
    { label: 'Established', value: '19 November 1983' },
    { label: 'Campus', value: '131 acres, Sheikhpura, Patna' },
    { label: 'Hospital', value: '≈1,070 beds' },
    { label: 'MBBS Seats', value: '150 per year' },
    { label: 'Governance', value: 'Autonomous — Government of Bihar' },
    { label: 'Fest Dates', value: 'November 14–16, 2026' },
  ];

  return (
    <section style={{ padding: '30px 20px 100px', position: 'relative', overflow: 'hidden', width: '100%', maxWidth: '100vw', contain: 'paint' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        {/* Banner */}
        <Reveal>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: narrow ? 320 : 460,
              borderRadius: 22,
              overflow: 'hidden',
              border: '1px solid var(--crx-border)',
              background: '#0A0A0A',
            }}
          >
            <CampusBlueprint />

            <div
              style={{
                position: 'absolute',
                left: narrow ? 20 : 40,
                bottom: narrow ? 20 : 36,
                right: narrow ? 20 : 260,
              }}
            >
              <p
                style={{
                  color: 'var(--gold-glow)',
                  fontSize: 11,
                  letterSpacing: '0.22em',
                  fontWeight: 700,
                  margin: '0 0 8px',
                  textTransform: 'uppercase',
                }}
              >
                The Host Campus
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--cream)',
                  fontSize: narrow ? 15 : 'clamp(15px, 1.6vw, 20px)',
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                Indira Gandhi Institute of Medical Sciences (IGIMS)
              </h2>
            </div>

            {!narrow && (
              <div
                style={{
                  position: 'absolute',
                  right: 40,
                  bottom: 40,
                  borderLeft: '1px solid var(--gold)',
                  paddingLeft: 16,
                  textAlign: 'right',
                }}
              >
                <p style={{ margin: 0, color: 'var(--cream)', fontSize: 13, letterSpacing: '0.08em', fontWeight: 600 }}>
                  SHEIKHPURA
                </p>
                <p style={{ margin: 0, color: 'var(--crx-text-muted)', fontSize: 13, letterSpacing: '0.08em' }}>
                  PATNA
                </p>
              </div>
            )}
          </div>
        </Reveal>

        {/* Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: narrow ? '1fr' : '1fr 1fr',
            gap: 24,
            marginTop: 24,
            alignItems: 'stretch',
          }}
        >
          <Reveal delay={0.1}>
            <div
              style={{
                height: '100%',
                boxSizing: 'border-box',
                padding: narrow ? '24px 22px' : '30px 32px',
                borderRadius: 16,
                border: '1px solid var(--crx-border)',
                background: 'var(--navy-card)',
              }}
            >
              <p
                style={{
                  color: 'var(--cyan-glow)',
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  fontWeight: 700,
                  margin: '0 0 14px',
                  textTransform: 'uppercase',
                }}
              >
                Where Medicine Meets Culture
              </p>
              <p style={{ color: 'var(--crx-text-muted)', fontSize: 13.5, lineHeight: 1.75, margin: '0 0 20px' }}>
                CEREBREXIA is the annual socio-cultural and academic festival of the Indira Gandhi Institute of
                Medical Sciences, Patna — an autonomous institute of the Government of Bihar founded in 1983 and
                spread across a 131-acre campus at Sheikhpura. Since its first formal edition in 2017, the fest
                has brought together medical and non-medical students through academics, culture, sport and
                creative competition.
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  color: 'var(--cyan-glow)',
                  fontSize: narrow ? 16 : 18,
                  lineHeight: 1.4,
                  margin: '0 0 22px',
                }}
              >
                A journey of talent, knowledge, creativity and celebration.
              </p>
              <a
                href="https://igims.org"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  border: '1px solid var(--gold)',
                  borderRadius: 8,
                  color: 'var(--gold-glow)',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                }}
              >
                Visit IGIMS.org ↗
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div
              style={{
                height: '100%',
                boxSizing: 'border-box',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 16,
                border: '1px solid var(--crx-border)',
                background: 'var(--navy-card)',
                padding: narrow ? '24px 22px 6px' : '30px 32px 6px',
              }}
            >
              <p
                style={{
                  color: 'var(--crx-text-muted)',
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  fontWeight: 700,
                  margin: '0 0 12px',
                  textTransform: 'uppercase',
                  position: 'relative',
                }}
              >
                Institute At A Glance
              </p>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--cream)',
                  fontSize: narrow ? 20 : 24,
                  margin: '0 0 20px',
                  position: 'relative',
                }}
              >
                IGIMS Patna
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  border: '1px solid var(--crx-border)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {stats.map((s, i) => (
                  <StatItem
                    key={s.label}
                    label={s.label}
                    value={s.value}
                    borderRight={i % 2 === 0}
                    borderBottom={i < stats.length - 2}
                  />
                ))}
              </div>
              <div style={{ height: narrow ? 16 : 20 }} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
