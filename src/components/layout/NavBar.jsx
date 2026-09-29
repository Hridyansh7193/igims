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
        {/* Top-Left: Yellow/Gold rounded badge with dark offset shadow */}
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
              width: 50,
              height: 50,
              background: '#020101',
              border: '2px solid #DC2626',
              borderRadius: 14,
              boxShadow: '3px 3px 0 #170707, 0 0 14px rgba(179, 18, 58, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              padding: 3,
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(1px, 1px)';
              e.currentTarget.style.boxShadow = '2px 2px 0 #170707, 0 0 18px rgba(179, 18, 58, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '3px 3px 0 #170707, 0 0 14px rgba(179, 18, 58, 0.35)';
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

        {/* Center: Capsule Pill Navigation [ ○ [HOME] EVENTS TEAM ○ ] */}
        <nav
          style={{
            display: narrow ? 'none' : 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(16, 9, 14, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: 40,
            padding: '6px 14px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Left Hollow Ring Indicator */}
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              border: '1.5px solid rgba(255, 255, 255, 0.4)',
              marginRight: 8,
              display: 'inline-block',
            }}
          />

          {NAV.map((p) => {
            const active = page === p.toLowerCase();
            return (
              <button
                key={p}
                onClick={() => go(p)}
                style={{
                  background: 'transparent',
                  color: active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                  border: 'none',
                  borderBottom: active ? '2px solid #DC2626' : '2px solid transparent',
                  borderRadius: 24,
                  padding: '7px 18px',
                  fontSize: 12.5,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: active ? '0 4px 10px -2px rgba(220, 38, 38, 0.45)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
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
                background: 'transparent',
                color: NAV_MORE.some((p) => page === p.toLowerCase()) ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                border: 'none',
                borderBottom: NAV_MORE.some((p) => page === p.toLowerCase()) ? '2px solid #DC2626' : '2px solid transparent',
                borderRadius: 24,
                padding: '7px 14px',
                fontSize: 12.5,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              More <ChevronDown size={13} style={{ transform: moreOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
            </button>
            {moreOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(16, 9, 14, 0.96)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: 16,
                  padding: 8,
                  minWidth: 150,
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
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
                      color: page === p.toLowerCase() ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      border: 'none',
                      borderRadius: 10,
                      padding: '9px 14px',
                      fontSize: 12.5,
                      fontWeight: 700,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Hollow Ring Indicator */}
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              border: '1.5px solid rgba(255, 255, 255, 0.4)',
              marginLeft: 8,
              display: 'inline-block',
            }}
          />
        </nav>

        {/* Top-Right: Yellow "SIGN IN" button with black border and offset shadow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => go('Dashboard')}
            style={{
              background: '#DC2626',
              color: '#170707',
              border: '2px solid #170707',
              borderRadius: 14,
              boxShadow: '0 4px 20px rgba(220, 38, 38, 0.35), 3px 3px 0 #170707',
              padding: '10px 22px',
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: narrow ? 'none' : 'inline-flex',
              alignItems: 'center',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(1px, 1px)';
              e.currentTarget.style.boxShadow = '2px 2px 0 #170707';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '3px 3px 0 #170707';
            }}
          >
            {user ? 'DASHBOARD' : 'SIGN IN'}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="crx-hamburger-btn"
            style={{
              background: '#DC2626',
              border: '2px solid #170707',
              boxShadow: '2px 2px 0 #170707',
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
              <X size={20} color="#170707" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ width: 18, height: 2, background: '#170707' }} />
                <span style={{ width: 18, height: 2, background: '#170707' }} />
                <span style={{ width: 18, height: 2, background: '#170707' }} />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div
          style={{
            marginTop: 14,
            background: 'rgba(16, 9, 14, 0.96)',
            border: '2px solid #170707',
            borderRadius: 18,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            backdropFilter: 'blur(20px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.8)',
          }}
        >
          {[...NAV, ...NAV_MORE].map((p) => (
            <button
              key={p}
              onClick={() => go(p)}
              style={{
                background: 'transparent',
                color: page === p.toLowerCase() ? '#fff' : 'rgba(255,255,255,0.7)',
                border: 'none',
                borderLeft: page === p.toLowerCase() ? '2px solid #DC2626' : '2px solid transparent',
                borderRadius: 12,
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => go('Dashboard')}
            style={{
              background: '#DC2626',
              color: '#170707',
              border: '2px solid #170707',
              borderRadius: 12,
              padding: '12px',
              fontWeight: 800,
              fontSize: 13,
              textTransform: 'uppercase',
              cursor: 'pointer',
              marginTop: 6,
            }}
          >
            {user ? 'DASHBOARD' : 'SIGN IN'}
          </button>
        </div>
      )}
    </header>
  );
}
