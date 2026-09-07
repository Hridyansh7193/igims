import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { LOGO_SRC } from '../../constants/logo';
import { NAV, NAV_MORE } from '../../constants/navigation';
import { useIsNarrow } from '../../hooks/useIsNarrow';

export default function NavBar({ page, setPage }) {
  const [open, setOpen] = useState(false);
  const narrow = useIsNarrow(1024);
  const go = (p) => {
    setPage(p.toLowerCase());
    setOpen(false);
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 20,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1300,
          background: 'rgba(10, 10, 10, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px 8px 24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Left: Branding */}
        <button
          onClick={() => go('Home')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <img
            src={LOGO_SRC}
            alt="Logo"
            style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ textAlign: 'left', display: narrow ? 'none' : 'block' }}>
            <h1 style={{ fontSize: 13, fontWeight: 700, margin: 0, letterSpacing: '0.05em', color: '#fff', fontFamily: 'var(--font-sans)' }}>
              CEREBREXIA
            </h1>
            <p style={{ fontSize: 9, color: 'var(--crx-text-muted)', margin: 0, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              IGIMS PATNA - 2026
            </p>
          </div>
        </button>

        {/* Center: Main Links */}
        {!narrow && (
          <nav style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {['HOME', 'EVENTS', 'PRONITES', 'ACCOMMODATION', 'SCHEDULE'].map((p) => {
              const active = page === p.toLowerCase();
              return (
                <button
                  key={p}
                  onClick={() => go(p)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: active ? '#fff' : 'var(--crx-text-muted)',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-sans)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.color = 'var(--crx-text-muted)';
                  }}
                >
                  {p}
                </button>
              );
            })}
          </nav>
        )}

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!narrow && (
            <>
              <button
                onClick={() => go('Partner')}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 100,
                  color: 'var(--crx-text-muted)',
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--crx-text-muted)';
                  e.currentTarget.style.background = 'none';
                }}
              >
                <ShieldCheck size={12} />
                PARTNER WITH US
              </button>
              <button
                onClick={() => go('Dashboard')}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 100,
                  color: 'var(--crx-text-muted)',
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--crx-text-muted)';
                  e.currentTarget.style.background = 'none';
                }}
              >
                <Tag size={12} />
                MY PASS
              </button>
            </>
          )}

          <button
            className="crx-btn-primary"
            onClick={() => go('Register')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              fontSize: 10,
              borderRadius: 100,
            }}
          >
            REGISTER AS A DELEGATE
            <ArrowRight size={14} />
          </button>

          {narrow && (
            <button
              onClick={() => setOpen(!open)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 4,
              }}
            >
              {open ? <X size={24} /> : <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ width: 20, height: 2, background: '#fff' }} />
                <span style={{ width: 20, height: 2, background: '#fff' }} />
              </div>}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {open && narrow && (
        <div
          style={{
            position: 'absolute',
            top: 80,
            left: 20,
            right: 20,
            background: 'rgba(10, 10, 10, 0.95)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
          }}
        >
          {['HOME', 'EVENTS', 'PRONITES', 'ACCOMMODATION', 'SCHEDULE'].map((p) => (
            <button
              key={p}
              onClick={() => go(p)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                textAlign: 'left',
                padding: '8px 0',
                fontFamily: 'var(--font-sans)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
