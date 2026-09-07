import React from 'react';

import { LOGO_SRC } from '../../constants/logo';
import { useIsNarrow } from '../../hooks/useIsNarrow';

export default function Footer({ setPage }) {
  const narrow = useIsNarrow(768);

  return (
    <footer
      style={{
        background: '#0a0a0a',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '80px 24px 40px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: narrow ? '1fr' : '1.5fr 1fr 1fr',
          gap: 60,
          marginBottom: 80,
        }}
      >
        {/* Left Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <img src={LOGO_SRC} alt="Cerebrexia Logo" style={{ width: 32, height: 32, borderRadius: '50%' }} />
            <div>
              <h3 style={{ fontSize: 16, margin: 0, fontWeight: 700, letterSpacing: '0.05em' }}>CEREBREXIA</h3>
              <p style={{ fontSize: 10, margin: 0, color: 'var(--crx-gold)', letterSpacing: '0.1em' }}>IGIMS PATNA · DECEMBER 18-20, 2026</p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--crx-text-muted)', lineHeight: 1.8, maxWidth: 360, marginBottom: 24 }}>
            The annual student festival of the Indira Gandhi Institute of Medical Sciences, Patna — culture, creativity, academics, competition and unforgettable nights.
          </p>
          <p style={{ fontSize: 11, color: 'var(--crx-gold)', fontWeight: 600, letterSpacing: '0.05em' }}>
            COGNITORESOURCES@GMAIL.COM
          </p>
        </div>

        {/* Middle Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {['HOME', 'SCHEDULE', 'PROFILE', 'TERMS AND CONDITIONS', 'REFUND POLICY'].map((item) => (
            <button
              key={item}
              onClick={() => setPage(item === 'HOME' ? 'home' : item.toLowerCase())}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--crx-text-muted)',
                textAlign: 'left',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.05em',
                cursor: 'pointer',
                padding: 0,
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--crx-text-muted)')}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {['EVENTS', 'DELEGATE REGISTRATION', 'PRIVACY POLICY', 'CODE OF CONDUCT'].map((item) => (
            <button
              key={item}
              onClick={() => setPage(item.toLowerCase())}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--crx-text-muted)',
                textAlign: 'left',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.05em',
                cursor: 'pointer',
                padding: 0,
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--crx-text-muted)')}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: 32,
          display: 'flex',
          flexDirection: narrow ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: narrow ? 'flex-start' : 'center',
          gap: 20,
        }}
      >
        <p style={{ fontSize: 10, color: 'var(--crx-text-muted)', margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          © CEREBREXIA · IGIMS PATNA · SHEIKHPURA, PATNA — 800014, BIHAR, INDIA
        </p>
        <p style={{ fontSize: 10, color: 'var(--crx-text-muted)', margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          CULTURE · CREATIVITY · ACADEMICS · COMPETITION
        </p>
      </div>
    </footer>
  );
}
