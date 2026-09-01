import React from 'react';
import { Instagram, Facebook, Linkedin, Youtube } from '../common/SocialIcons';
import Sticker from '../common/Sticker';
import { useIsNarrow } from '../../hooks/useIsNarrow';

export default function Footer({ setPage }) {
  const socials = [Instagram, Facebook, Linkedin, Youtube];
  const narrow = useIsNarrow(760);

  return (
    <footer
      style={{
        borderTop: '1px solid rgba(56, 189, 248, 0.25)',
        background: 'linear-gradient(180deg, transparent 0%, rgba(5, 8, 20, 0.9) 100%)',
        padding: '60px 24px 40px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: narrow ? '1fr' : '1.2fr 1fr 1fr',
          gap: 30,
        }}
      >
        <div>
          <Sticker tone="cyan" rotate={-2} style={{ marginBottom: 14 }}>
            Cerebrexia '26
          </Sticker>
          <p style={{ fontSize: 13.5, color: 'var(--paper)', lineHeight: 1.7, maxWidth: 320, margin: '0 0 16px' }}>
            The annual medical-college fest of IGIMS. Compete, perform, belong.
          </p>
        </div>
        <div>
          <Sticker tone="gold" rotate={2} style={{ marginBottom: 14 }}>
            Explore
          </Sticker>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Events', 'Team', 'Home'].map((p) => (
              <button
                key={p}
                onClick={() => setPage(p.toLowerCase())}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 13.5,
                  padding: 0,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cyan)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Sticker tone="cyan" rotate={-2} style={{ marginBottom: 14 }}>
            Connect
          </Sticker>
          <div style={{ display: 'flex', gap: 14, marginBottom: 10 }}>
            {socials.map((Icon, i) => (
              <a key={i} href="#" className="crx-social" style={{ color: 'var(--paper)' }}>
                <Icon size={17} />
              </a>
            ))}
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>cerebrexia@igims.edu</p>
        </div>
      </div>
      <p style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--muted)', marginTop: 44 }}>
        IGIMS, Sheikhpura, Patna &ndash; 800014 &middot; The Crowned Diagnosis
      </p>
    </footer>
  );
}
