import React, { useState } from 'react';
import { X } from 'lucide-react';
import { LOGO_SRC } from '../../constants/logo';
import { NAV } from '../../constants/navigation';
import { useIsNarrow } from '../../hooks/useIsNarrow';

export default function NavBar({ page, setPage }) {
  const [open, setOpen] = useState(false);
  const narrow = useIsNarrow(768);
  const go = (p) => {
    setPage(p.toLowerCase());
    setOpen(false);
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '24px 32px',
      }}
    >
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
            style={{
              width: 50,
              height: 50,
              background: '#FDC23E',
              border: '2px solid #181014',
              borderRadius: 14,
              boxShadow: '3px 3px 0 #181014',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              padding: 4,
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(1px, 1px)';
              e.currentTarget.style.boxShadow = '2px 2px 0 #181014';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '3px 3px 0 #181014';
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
                  background: active ? 'linear-gradient(135deg, #38BDF8 0%, #0284C7 50%, #1D4ED8 100%)' : 'transparent',
                  color: active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                  border: 'none',
                  borderRadius: 24,
                  padding: '7px 18px',
                  fontSize: 12.5,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
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
              background: '#FDC23E',
              color: '#181014',
              border: '2px solid #181014',
              borderRadius: 14,
              boxShadow: '3px 3px 0 #181014',
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
              e.currentTarget.style.boxShadow = '2px 2px 0 #181014';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '3px 3px 0 #181014';
            }}
          >
            SIGN IN
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            style={{
              background: '#FDC23E',
              border: '2px solid #181014',
              boxShadow: '2px 2px 0 #181014',
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
              <X size={20} color="#181014" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ width: 18, height: 2, background: '#181014' }} />
                <span style={{ width: 18, height: 2, background: '#181014' }} />
                <span style={{ width: 18, height: 2, background: '#181014' }} />
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
            border: '2px solid #181014',
            borderRadius: 18,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            backdropFilter: 'blur(20px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.8)',
          }}
        >
          {NAV.map((p) => (
            <button
              key={p}
              onClick={() => go(p)}
              style={{
                background: page === p.toLowerCase() ? 'linear-gradient(135deg, #38BDF8 0%, #0284C7 50%, #1D4ED8 100%)' : 'transparent',
                color: '#fff',
                border: 'none',
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
              background: '#FDC23E',
              color: '#181014',
              border: '2px solid #181014',
              borderRadius: 12,
              padding: '12px',
              fontWeight: 800,
              fontSize: 13,
              textTransform: 'uppercase',
              cursor: 'pointer',
              marginTop: 6,
            }}
          >
            SIGN IN
          </button>
        </div>
      )}
    </header>
  );
}
