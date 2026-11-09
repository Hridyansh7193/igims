import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { LOGO_SRC } from '../../constants/logo';
import { NAV, NAV_MORE } from '../../constants/navigation';
import { useIsNarrow } from '../../hooks/useIsNarrow';
import { useAuth } from '../../context/AuthContext';

export default function NavBar({ page, setPage }) {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef(null);
  const narrow = useIsNarrow(768);
  const { user } = useAuth();
  const go = (p) => {
    setPage(p.toLowerCase());
    setOpen(false);
    setMoreOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!moreOpen) return;
    const onClick = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [moreOpen]);

  return (
    <header className={`crx-nav-header ${scrolled ? 'scrolled' : ''}`}>
      <div
        style={{
          maxWidth: 1360,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Top-Left: Logo badge with quiet hairline */}
        <button
          onClick={() => go('Home')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            position: 'relative',
          }}
        >
          <div
            className="crx-logo-badge"
            style={{
              width: 44,
              height: 44,
              background: 'var(--crx-surface)',
              border: '1px solid var(--crx-hairline-accent)',
              borderRadius: 10,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              padding: 2,
              transition: 'transform 160ms ease',
            }}
          >
            <img
              src={LOGO_SRC}
              alt="Cerebrexia"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 8,
                objectFit: 'cover',
              }}
            />
          </div>
        </button>

        {/* Center: Quiet Floating Navigation Pill */}
        <nav
          style={{
            display: narrow ? 'none' : 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'rgba(20, 14, 17, 0.88)',
            border: '1px solid var(--crx-hairline)',
            borderRadius: 32,
            padding: '4px 10px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.45)',
          }}
        >
          {NAV.map((p) => {
            const active = page === p.toLowerCase();
            return (
              <button
                key={p}
                onClick={() => go(p)}
                style={{
                  background: active ? 'rgba(239, 233, 222, 0.08)' : 'transparent',
                  color: active ? 'var(--crx-text-primary)' : 'var(--crx-text-secondary)',
                  border: 'none',
                  borderRadius: 20,
                  padding: '6px 14px',
                  fontSize: 12.5,
                  fontWeight: 500,
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif",
                  transition: 'color 160ms ease, background-color 160ms ease',
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.color = 'var(--crx-text-primary)';
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.color = 'var(--crx-text-secondary)';
                }}
              >
                {p}
              </button>
            );
          })}

          {/* "More" dropdown pill for secondary pages */}
          <div ref={moreRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: NAV_MORE.some((p) => page === p.toLowerCase()) ? 'rgba(239, 233, 222, 0.08)' : 'transparent',
                color: NAV_MORE.some((p) => page === p.toLowerCase()) ? 'var(--crx-text-primary)' : 'var(--crx-text-secondary)',
                border: 'none',
                borderRadius: 20,
                padding: '6px 12px',
                fontSize: 12.5,
                fontWeight: 500,
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: "'Space Grotesk', sans-serif",
                transition: 'color 160ms ease',
              }}
            >
              More <ChevronDown size={13} style={{ transform: moreOpen ? 'rotate(180deg)' : 'none', transition: 'transform 160ms ease' }} />
            </button>
            {moreOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--crx-card)',
                  border: '1px solid var(--crx-hairline-accent)',
                  borderRadius: 12,
                  padding: 6,
                  minWidth: 150,
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {NAV_MORE.map((p) => (
                  <button
                    key={p}
                    onClick={() => go(p)}
                    style={{
                      background: 'transparent',
                      color: page === p.toLowerCase() ? 'var(--crx-text-primary)' : 'var(--crx-text-secondary)',
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 12px',
                      fontSize: 12,
                      fontWeight: 500,
                      letterSpacing: '0.03em',
                      textTransform: 'uppercase',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Top-Right: Solid Crimson Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => go('Dashboard')}
            style={{
              background: 'var(--crx-accent)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 8,
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 2px 6px rgba(0, 0, 0, 0.35)',
              padding: '8px 18px',
              fontWeight: 600,
              fontSize: 12.5,
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: narrow ? 'none' : 'inline-flex',
              alignItems: 'center',
              fontFamily: "'Space Grotesk', sans-serif",
              transition: 'background-color 160ms ease, transform 160ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--crx-accent-hover)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--crx-accent)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {user ? 'Dashboard' : 'Sign In'}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="crx-hamburger-btn"
            style={{
              background: 'var(--crx-surface)',
              border: '1px solid var(--crx-hairline)',
              borderRadius: 8,
              width: 38,
              height: 38,
              cursor: 'pointer',
              display: narrow ? 'flex' : 'none',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {open ? (
              <X size={18} color="var(--crx-text-primary)" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ width: 16, height: 1.5, background: 'var(--crx-text-primary)' }} />
                <span style={{ width: 16, height: 1.5, background: 'var(--crx-text-primary)' }} />
                <span style={{ width: 16, height: 1.5, background: 'var(--crx-text-primary)' }} />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div
          style={{
            marginTop: 12,
            background: 'var(--crx-card)',
            border: '1px solid var(--crx-hairline-accent)',
            borderRadius: 14,
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            backdropFilter: 'blur(20px)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.7)',
          }}
        >
          {[...NAV, ...NAV_MORE].map((p) => (
            <button
              key={p}
              onClick={() => go(p)}
              style={{
                background: 'transparent',
                color: page === p.toLowerCase() ? 'var(--crx-text-primary)' : 'var(--crx-text-secondary)',
                border: 'none',
                borderRadius: 8,
                padding: '10px 14px',
                textAlign: 'left',
                fontWeight: 500,
                fontSize: 13,
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => go('Dashboard')}
            style={{
              background: 'var(--crx-accent)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 8,
              padding: '10px',
              fontWeight: 600,
              fontSize: 12.5,
              textTransform: 'uppercase',
              cursor: 'pointer',
              marginTop: 6,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {user ? 'Dashboard' : 'Sign In'}
          </button>
        </div>
      )}
    </header>
  );
}
