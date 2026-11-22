import React from 'react';
import { Instagram, WhatsApp } from '../common/SocialIcons';
import Sticker from '../common/Sticker';
import { useIsNarrow } from '../../hooks/useIsNarrow';

export default function Footer({ setPage }) {
  const narrow = useIsNarrow(760);

  return (
    <footer
      style={{
        borderTop: '1px solid rgba(179, 18, 58, 0.25)',
        background: 'linear-gradient(180deg, transparent 0%, rgba(10, 5, 5, 0.9) 100%)',
        padding: '60px 24px 40px',
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden',
        contain: 'paint',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: narrow ? '1fr' : '1.3fr 1fr 1.2fr 1fr',
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
          <p style={{ fontSize: 11.5, color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>
            Indira Gandhi Institute of Medical Sciences<br />
            Sheikhpura, Patna &ndash; 800014, Bihar
          </p>
        </div>
        <div>
          <Sticker tone="gold" rotate={2} style={{ marginBottom: 14 }}>
            Explore
          </Sticker>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Home', 'Events', 'Pronites', 'Accommodation', 'Contact'].map((p) => (
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
          <Sticker tone="gold" rotate={-1} style={{ marginBottom: 14 }}>
            Compliance
          </Sticker>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { id: 'terms', label: 'Terms & Conditions' },
              { id: 'privacy', label: 'Privacy Policy' },
              { id: 'refunds', label: 'Refund & Cancellation' },
              { id: 'pricing', label: 'Pricing & Delivery' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
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
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Sticker tone="cyan" rotate={-2} style={{ marginBottom: 14 }}>
            Connect
          </Sticker>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a
              href="https://www.instagram.com/igimsfest?srtk=MWR5NzJobTV6MDB5aw=="
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                color: 'var(--paper)',
                textDecoration: 'none',
                fontSize: 13,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#E1306C';
                e.currentTarget.style.transform = 'translateX(3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--paper)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(225, 48, 108, 0.12)',
                  border: '1px solid rgba(225, 48, 108, 0.28)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#E1306C',
                }}
              >
                <Instagram size={16} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>Instagram</span>
                <span>@igimsfest</span>
              </div>
            </a>

            {/* WhatsApp - Divyansh */}
            <a
              href="https://wa.me/918271791542"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                color: 'var(--paper)',
                textDecoration: 'none',
                fontSize: 13,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#25D366';
                e.currentTarget.style.transform = 'translateX(3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--paper)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(37, 211, 102, 0.12)',
                  border: '1px solid rgba(37, 211, 102, 0.28)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#25D366',
                }}
              >
                <WhatsApp size={16} color="#25D366" />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>WhatsApp &middot; Divyansh</span>
                <span>+91 82717 91542</span>
              </div>
            </a>

            {/* WhatsApp - Veer */}
            <a
              href="https://wa.me/919128187476"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                color: 'var(--paper)',
                textDecoration: 'none',
                fontSize: 13,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#25D366';
                e.currentTarget.style.transform = 'translateX(3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--paper)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(37, 211, 102, 0.12)',
                  border: '1px solid rgba(37, 211, 102, 0.28)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#25D366',
                }}
              >
                <WhatsApp size={16} color="#25D366" />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>WhatsApp &middot; Veer</span>
                <span>+91 91281 87476</span>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: '40px auto 0', paddingTop: 20, borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: 11.5, color: 'var(--muted)' }}>
        <p style={{ margin: 0 }}>
          &copy; 2026 Cerebrexia &middot; IGIMS Patna &middot; The Crowned Diagnosis
        </p>
        <div style={{ display: 'flex', gap: 14 }}>
          <button onClick={() => setPage('terms')} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 11.5, padding: 0 }}>Terms</button>
          <span>&middot;</span>
          <button onClick={() => setPage('privacy')} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 11.5, padding: 0 }}>Privacy</button>
          <span>&middot;</span>
          <button onClick={() => setPage('refunds')} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 11.5, padding: 0 }}>Refunds</button>
          <span>&middot;</span>
          <button onClick={() => setPage('pricing')} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 11.5, padding: 0 }}>Pricing</button>
        </div>
      </div>
    </footer>
  );
}
