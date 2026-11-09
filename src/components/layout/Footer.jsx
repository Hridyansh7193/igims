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
        borderTop: '1px solid var(--crx-hairline)',
        background: 'var(--crx-bg-deep)',
        padding: '64px 24px 32px',
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
          maxWidth: 1040,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: narrow ? '1fr' : '1.3fr 1fr 1.2fr 1fr',
          gap: 32,
        }}
      >
        <div>
          <Sticker tone="gold" rotate={0} style={{ marginBottom: 12 }}>
            Cerebrexia '26
          </Sticker>
          <p style={{ fontSize: 13, color: 'var(--crx-text-secondary)', lineHeight: 1.6, maxWidth: 320, margin: '0 0 14px' }}>
            The annual medical-college festival of IGIMS. Compete, perform, belong.
          </p>
          <p style={{ fontSize: 12, color: 'var(--crx-text-muted)', margin: 0, lineHeight: 1.6 }}>
            Indira Gandhi Institute of Medical Sciences<br />
            Sheikhpura, Patna &ndash; 800014, Bihar
          </p>
        </div>
        <div>
          <Sticker tone="gold" rotate={0} style={{ marginBottom: 12 }}>
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
                  color: 'var(--crx-text-muted)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 13,
                  padding: 0,
                  transition: 'color 160ms ease',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--crx-text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--crx-text-muted)')}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Sticker tone="gold" rotate={0} style={{ marginBottom: 12 }}>
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
                  color: 'var(--crx-text-muted)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 13,
                  padding: 0,
                  transition: 'color 160ms ease',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--crx-text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--crx-text-muted)')}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Sticker tone="gold" rotate={0} style={{ marginBottom: 12 }}>
            Connect
          </Sticker>
          <div style={{ display: 'flex', gap: 14, marginBottom: 10 }}>
            {socials.map((Icon, i) => (
              <a key={i} href="#" className="crx-social" style={{ color: 'var(--crx-text-secondary)' }}>
                <Icon size={16} />
              </a>
            ))}
          </div>
          <p style={{ fontSize: 13, color: 'var(--crx-text-muted)', margin: '0 0 12px' }}>cerebrexia@igims.edu</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(239,233,222,0.04)', border: '1px solid var(--crx-hairline)', borderRadius: 6, padding: '4px 8px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4cc38a' }} />
            <span style={{ fontSize: 10, color: 'var(--crx-text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Razorpay Secured</span>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1040, margin: '36px auto 0', paddingTop: 16, borderTop: '1px solid var(--crx-hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: 11.5, color: 'var(--crx-text-muted)' }}>
        <p style={{ margin: 0 }}>
          &copy; 2026 Cerebrexia &middot; IGIMS Patna
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
