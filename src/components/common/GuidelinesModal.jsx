import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ScrollText } from 'lucide-react';

function Block({ block }) {
  switch (block.type) {
    case 'h':
      return (
        <h3
          style={{
            margin: '18px 0 8px',
            fontSize: 11,
            color: '#fca5a5',
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          {block.text}
        </h3>
      );
    case 'ul':
    case 'ol': {
      const Tag = block.type;
      return (
        <Tag style={{ margin: '0 0 6px', paddingLeft: 20, color: 'var(--cream)', fontSize: 13, lineHeight: 1.65 }}>
          {block.items.map((it, i) => (
            <li key={i} style={{ marginBottom: 6 }}>{it}</li>
          ))}
        </Tag>
      );
    }
    case 'tag':
      return (
        <p
          style={{
            margin: '14px 0 0',
            padding: '12px 14px',
            borderLeft: '3px solid #DC2626',
            background: 'rgba(220,38,38,0.08)',
            borderRadius: '0 10px 10px 0',
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            lineHeight: 1.55,
          }}
        >
          {block.text}
        </p>
      );
    default:
      return (
        <p style={{ margin: '0 0 12px', color: 'var(--cream)', fontSize: 13, lineHeight: 1.7 }}>
          {block.text}
        </p>
      );
  }
}

export default function GuidelinesModal({ eventName, eventCat, guidelines, onClose }) {
  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Guidelines for ${eventName}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(2,1,1,0.88)', backdropFilter: 'blur(6px)' }}
      />

      {/* Modal Card */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 560,
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(160deg, #190808 0%, #0A0505 100%)',
          border: '1px solid rgba(220,38,38,0.35)',
          borderRadius: 20,
          boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 80px rgba(220,38,38,0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--muted)',
          }}
        >
          <X size={14} />
        </button>

        {/* Header */}
        <div style={{ padding: '28px 28px 16px', paddingRight: 64, flexShrink: 0 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(220,38,38,0.12)',
              border: '1px solid rgba(220,38,38,0.3)',
              borderRadius: 20,
              padding: '3px 10px',
              marginBottom: 10,
            }}
          >
            <ScrollText size={11} color="#fca5a5" />
            <span style={{ fontSize: 9.5, color: '#fca5a5', letterSpacing: 1.2, fontWeight: 700, textTransform: 'uppercase' }}>
              Guidelines
            </span>
          </div>
          <h2 className="crx-display" style={{ fontSize: 22, color: 'var(--cream)', margin: '0 0 4px', lineHeight: 1.2 }}>
            {eventName}
          </h2>
          {eventCat && <p style={{ color: 'var(--muted)', fontSize: 12, margin: 0 }}>{eventCat}</p>}
        </div>

        {/* Scrollable body */}
        <div
          className="crx-scrollbar"
          style={{ padding: '0 28px 8px', overflowY: 'auto', flex: 1, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}
        >
          {guidelines ? (
            guidelines.blocks.map((b, i) => <Block key={i} block={b} />)
          ) : (
            <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.7, margin: '0 0 12px' }}>
              Guidelines for this event will be announced soon. Stay tuned!
            </p>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 28px 24px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={onClose}
            className="crx-btn"
            style={{
              width: '100%',
              justifyContent: 'center',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'var(--muted)',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
