import React from 'react';
import Reveal from '../common/Reveal';
import Sticker from '../common/Sticker';
import { Crown, ExternalLink } from 'lucide-react';
import titleSponsorImg from '../../assets/title_sponsor.webp';

const TITLE_SPONSOR_URL = 'https://jeevandanhealth.org/';

export default function TitleSponsorSection() {
  return (
    <section
      id="title-sponsor"
      style={{
        position: 'relative',
        padding: 'clamp(40px, 6vw, 72px) 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(600px, 90vw)',
          height: 'min(600px, 90vw)',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(230, 57, 80, 0.04) 45%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Reveal>
          <Sticker
            color="gold"
            style={{
              marginBottom: 16,
              fontSize: 'clamp(11px, 2vw, 13px)',
              padding: '6px 20px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Crown size={14} color="var(--gold)" />
              Presented By
            </span>
          </Sticker>
          <h2
            className="crx-display"
            style={{
              fontSize: 'clamp(32px, 5.5vw, 56px)',
              color: 'var(--cream)',
              margin: '0 0 12px',
              letterSpacing: '1.2px',
            }}
          >
            TITLE SPONSOR
          </h2>
          <p
            style={{
              fontSize: 'clamp(14px, 2vw, 16px)',
              color: 'var(--muted)',
              maxWidth: '520px',
              margin: '0 auto 28px',
              lineHeight: 1.6,
            }}
          >
            Proudly presented by Jeevandan Health — Cerebrexia '26, The Crowned Diagnosis
          </p>
        </Reveal>

        {/* Sponsor Poster Card */}
        <Reveal delay={0.1} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '280px',
              aspectRatio: '1 / 1',
              borderRadius: '18px',
              padding: '10px',
              background: 'linear-gradient(145deg, rgba(25, 14, 22, 0.85) 0%, rgba(10, 4, 9, 0.95) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              boxShadow: '0 0 40px rgba(212, 175, 55, 0.15), 0 16px 40px rgba(0, 0, 0, 0.8)',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.65)';
              e.currentTarget.style.boxShadow = '0 0 55px rgba(212, 175, 55, 0.28), 0 24px 60px rgba(0, 0, 0, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
              e.currentTarget.style.boxShadow = '0 0 40px rgba(212, 175, 55, 0.15), 0 16px 40px rgba(0, 0, 0, 0.8)';
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#0B0409',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={titleSponsorImg}
                alt="Cerebrexia '26 Official Title Sponsor — Jeevandan Health"
                width={800}
                height={800}
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>
          </div>

          <a
            href={TITLE_SPONSOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit the Jeevandan Health website (opens in a new tab)"
            style={{
              marginTop: 18,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 20px',
              borderRadius: 999,
              border: '1px solid rgba(212, 175, 55, 0.5)',
              background: 'rgba(212, 175, 55, 0.08)',
              color: 'var(--gold)',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            Click here <ExternalLink size={13} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
