import React, { useState } from 'react';
import { X, CheckCircle, Shield, User, Building2, Phone, MapPin, Loader2, Edit3 } from 'lucide-react';

export default function QuickRegisterModal({ eventName, eventCat, participant, onConfirm, onEditProfile, onClose }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(eventName);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Confirm Event Registration"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(2,1,1,0.88)',
          backdropFilter: 'blur(6px)',
        }}
      />

      {/* Modal Card */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 480,
          background: 'linear-gradient(160deg, #190808 0%, #0A0505 100%)',
          border: '1px solid rgba(220,38,38,0.35)',
          borderRadius: 20,
          padding: '32px 28px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 80px rgba(220,38,38,0.1)',
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 160,
            height: 160,
            background: 'rgba(220,38,38,0.12)',
            filter: 'blur(50px)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
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
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 20,
              padding: '3px 10px',
              marginBottom: 10,
            }}
          >
            <Shield size={11} color="#22c55e" />
            <span style={{ fontSize: 9.5, color: '#86efac', letterSpacing: 1.2, fontWeight: 700, textTransform: 'uppercase' }}>
              Profile Verified
            </span>
          </div>

          <h2 className="crx-display" style={{ fontSize: 22, color: 'var(--cream)', margin: '0 0 4px' }}>
            CONFIRM REGISTRATION
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 12.5, margin: 0 }}>
            Registering for{' '}
            <span style={{ color: '#fff', fontWeight: 700 }}>{eventName}</span>
            {eventCat && <span style={{ color: 'var(--muted)' }}> ({eventCat})</span>}
          </p>
        </div>

        {/* Saved details preview */}
        <div
          style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: '16px 18px',
            marginBottom: 22,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600 }}>
              Using Saved Information
            </span>
            <button
              onClick={onEditProfile}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ff8f8f',
                fontSize: 11,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: 0,
              }}
            >
              <Edit3 size={11} /> Edit Details
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--cream)' }}>
              <User size={13} color="var(--muted)" />
              <span>{participant?.first_name} {participant?.last_name || participant?.surname}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--cream)' }}>
              <Building2 size={13} color="var(--muted)" />
              <span>{participant?.college_name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--cream)' }}>
              <Phone size={13} color="var(--muted)" />
              <span>{participant?.phone_number}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--cream)' }}>
              <MapPin size={13} color="var(--muted)" />
              <span>
                {participant?.college_city || participant?.city_of_college}, {participant?.college_state || participant?.state_of_college}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="crx-btn"
            style={{
              flex: 1,
              justifyContent: 'center',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'var(--muted)',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="crx-btn gold"
            style={{ flex: 2, justifyContent: 'center', fontSize: 12.5 }}
          >
            {loading ? (
              <>
                <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                REGISTERING...
              </>
            ) : (
              <>
                <CheckCircle size={14} />
                CONFIRM REGISTRATION
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
