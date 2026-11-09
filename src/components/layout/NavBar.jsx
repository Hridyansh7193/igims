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
        {/* Top-Left: Logo badge */}
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
              width: 54,
              height: 54,
              background: '#0C0508',
              border: '2px solid rgba(212, 175, 106, 0.65)',
              borderRadius: 14,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              padding: 2,
              transition: 'transform 180ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <img
              src={LOGO_SRC}
              alt="Cerebrexia"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 10,
                objectFit: 'cover',
              }}
            />
          </div>
        </button>

        {/* Center: Floating Navigation Capsule Pill */}
        <nav
          style={{
            display: narrow ? 'none' : 'flex',
            alignItems: 'center',
            gap: 4,
            background: scrolled ? 'rgba(18, 9, 14, 0.88)' : 'rgba(20, 10, 14, 0.72)',
            border: scrolled
              ? '1px solid rgba(212, 175, 106, 0.55)'
              : '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 40,
            padding: '6px 14px',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: scrolled
              ? '0 0 0 1px rgba(255, 255, 255, 0.14), 0 0 22px rgba(212, 175, 106, 0.28), 0 12px 36px rgba(0, 0, 0, 0.8)'
              : '0 8px 30px rgba(0, 0, 0, 0.45)',
            transition: 'border 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {NAV.map((p) => {
            const active = page === p.toLowerCase();
            return (
              <button
                key={p}
                onClick={() => go(p)}
                style={{
                  background: active ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                  border: active ? '1px solid rgba(255, 255, 255, 0.16)' : '1px solid transparent',
                  color: active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.72)',
                  borderRadius: 24,
                  padding: '7px 18px',
                  fontSize: 13.5,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: "'Space Grotesk', sans-serif",
                  transition: 'color 160ms ease, background-color 160ms ease, border-color 160ms ease',
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)';
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
                gap: 5,
                background: NAV_MORE.some((p) => page === p.toLowerCase()) ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                border: NAV_MORE.some((p) => page === p.toLowerCase()) ? '1px solid rgba(255, 255, 255, 0.16)' : '1px solid transparent',
                color: NAV_MORE.some((p) => page === p.toLowerCase()) ? '#FFFFFF' : 'rgba(255, 255, 255, 0.72)',
                borderRadius: 24,
                padding: '7px 16px',
                fontSize: 13.5,
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: "'Space Grotesk', sans-serif",
                transition: 'color 160ms ease',
              }}
            >
              More <ChevronDown size={14} style={{ transform: moreOpen ? 'rotate(180deg)' : 'none', transition: 'transform 160ms ease' }} />
            </button>
            {moreOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(16, 9, 14, 0.98)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: 16,
                  padding: 8,
                  minWidth: 160,
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.7)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                {NAV_MORE.map((p) => (
                  <button
                    key={p}
                    onClick={() => go(p)}
                    style={{
                      background: 'transparent',
                      color: page === p.toLowerCase() ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                      border: 'none',
                      borderRadius: 10,
                      padding: '9px 14px',
                      fontSize: 13,
                      fontWeight: 600,
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

        {/* Top-Right: DASHBOARD Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => go('Dashboard')}
            style={{
              background: 'linear-gradient(135deg, #C0392B 0%, #D4500A 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 12,
              boxShadow: '0 4px 20px rgba(192, 57, 43, 0.45)',
              padding: '11px 24px',
              fontWeight: 800,
              fontSize: 13.5,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: narrow ? 'none' : 'inline-flex',
              alignItems: 'center',
              fontFamily: "'Space Grotesk', sans-serif",
              transition: 'transform 180ms ease, box-shadow 180ms ease, filter 180ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.filter = 'brightness(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.filter = 'brightness(1)';
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
              background: 'linear-gradient(135deg, #C0392B 0%, #D4500A 100%)',
              border: 'none',
              borderRadius: 12,
              width: 44,
              height: 44,
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
