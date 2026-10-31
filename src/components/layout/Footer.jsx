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
            {['Home', 'Events', 'Pronites', 'Accommodation', 'Team', 'Contact'].map((p) => (
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
          <div style={{ display: 'flex', gap: 14, marginBottom: 10 }}>
            {socials.map((Icon, i) => (
              <a key={i} href="#" className="crx-social" style={{ color: 'var(--paper)' }}>
                <Icon size={17} />
              </a>
            ))}
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 12px' }}>cerebrexia@igims.edu</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '4px 8px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 0.5, textTransform: 'uppercase' }}>Razorpay Secured</span>
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
