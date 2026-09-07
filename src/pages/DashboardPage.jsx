import React from 'react';
import { ShieldCheck, QrCode, Download, LogOut } from 'lucide-react';
import Sticker from '../components/common/Sticker';
import { useIsNarrow } from '../hooks/useIsNarrow';
import AuthForm from '../components/auth/AuthForm';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const narrow = useIsNarrow(760);

  if (loading) {
    return (
      <section style={{ padding: '180px 24px 100px', maxWidth: 420, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>Initializing uplink...</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section style={{ padding: '150px 24px 100px', maxWidth: 600, margin: '0 auto' }}>
        <AuthForm />
      </section>
    );
  }

  return (
    <section style={{ padding: '150px 24px 100px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 30 }}>
        <div>
          <h1 className="crx-display" style={{ fontSize: 28, color: 'var(--cream)', marginBottom: 8 }}>
            YOUR REGISTRATIONS
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>Logged in as: {user.email}</p>
        </div>
        <button onClick={signOut} className="crx-btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>
          <LogOut size={14} /> SIGN OUT
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 260px', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {['Cricket', 'Got Talent', 'Case Presentation'].map((ev) => (
            <div
              key={ev}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                borderRadius: 12,
                border: '1px solid var(--hair)',
                background: 'rgba(255,243,214,.05)',
              }}
            >
              <span style={{ fontSize: 14 }}>{ev}</span>
              <Sticker tone="gold" rotate={0} style={{ fontSize: 9, padding: '4px 10px' }}>
                Confirmed
              </Sticker>
            </div>
          ))}
        </div>
        <div
          style={{
            padding: 20,
            borderRadius: 16,
            border: '1px solid rgba(179, 18, 58, 0.3)',
            background: 'linear-gradient(160deg, #181212 0%, #0A0505 100%)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            textAlign: 'center',
          }}
        >
          <QrCode size={70} color="var(--gold)" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 12 }}>Unique per-day entry QR</p>
          <button className="crx-btn gold" style={{ width: '100%', justifyContent: 'center', fontSize: 11 }}>
            <Download size={13} /> Download Badge
          </button>
        </div>
      </div>
    </section>
  );
}
