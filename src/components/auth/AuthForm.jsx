import React, { useState } from 'react';
import { AlertCircle, Shield, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const GOOGLE_SVG = (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(1,0,0,1,27.009001,-39.238998)">
      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
    </g>
  </svg>
);

export default function AuthForm({ onSuccess, onOpenPolicy }) {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(255,243,214,0.03)',
      border: '1px solid rgba(220,38,38,0.35)',
      borderRadius: 16,
      padding: 'clamp(24px, 5vw, 40px) clamp(16px, 4vw, 30px)',
      width: '92%',
      maxWidth: 420,
      margin: '0 auto',
      boxShadow: '0 10px 40px rgba(0,0,0,0.6), 0 0 60px rgba(220,38,38,0.07)',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
      textAlign: 'center',
    }}>
      {/* Ambient glows */}
      <div style={{ position:'absolute', top:-50, left:-50, width:160, height:160, background:'rgba(220,38,38,0.14)', filter:'blur(50px)', borderRadius:'50%', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-40, right:-40, width:120, height:120, background:'rgba(220,38,38,0.07)', filter:'blur(40px)', borderRadius:'50%', pointerEvents:'none' }} />

      <h2 className="crx-display" style={{ fontSize: 26, color: 'var(--cream)', marginBottom: 8, letterSpacing: 1 }}>
        ACCESS TERMINAL
      </h2>
      <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.5, marginBottom: 28, letterSpacing: 0.3 }}>
        Sign in with your Google account to access Cerebrexia '26 and manage your passes.
      </p>

      {/* Error banner */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          padding: '12px 14px',
          borderRadius: 8,
          fontSize: 13,
          marginBottom: 20,
          background: 'rgba(220,38,38,0.12)',
          border: '1px solid #DC2626',
          color: '#ff8f8f',
          textAlign: 'left',
        }}>
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Google OAuth button — instant verified access */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="crx-btn"
        style={{
          width: '100%',
          justifyContent: 'center',
          background: 'white',
          color: '#111',
          boxShadow: '0 4px 18px rgba(255,255,255,0.15)',
          marginBottom: 20,
          gap: 12,
          fontSize: 14,
          fontWeight: 700,
          padding: '14px 20px',
          borderRadius: 10,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'all 0.2s ease',
        }}
      >
        {loading ? (
          <>
            <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
            CONNECTING TO GOOGLE...
          </>
        ) : (
          <>
            {GOOGLE_SVG}
            CONTINUE WITH GOOGLE
          </>
        )}
      </button>

      {/* Security note */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8,
        padding: '10px 14px',
        color: 'var(--muted)',
        fontSize: 12,
        lineHeight: 1.4,
        marginBottom: 20,
      }}>
        <Shield size={15} color="#D4AF6A" style={{ flexShrink: 0 }} />
        <span>Instant, secure login. No passwords required.</span>
      </div>

      {/* Official Legal / Compliance Links for Razorpay Merchant KYC & delegates */}
      <div style={{ marginTop: 10, paddingTop: 14, borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
        <p style={{ fontSize: 10.5, color: 'var(--muted)', margin: '0 0 8px', letterSpacing: 0.5 }}>
          Official Festival Compliance &amp; Policies:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 12px', fontSize: 11 }}>
          <button
            type="button"
            onClick={() => onOpenPolicy ? onOpenPolicy('terms') : (window.location.hash = 'terms')}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
          >
            Terms &amp; Conditions
          </button>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <button
            type="button"
            onClick={() => onOpenPolicy ? onOpenPolicy('privacy') : (window.location.hash = 'privacy')}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
          >
            Privacy Policy
          </button>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <button
            type="button"
            onClick={() => onOpenPolicy ? onOpenPolicy('refunds') : (window.location.hash = 'refunds')}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
          >
            Refund Policy
          </button>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <button
            type="button"
            onClick={() => onOpenPolicy ? onOpenPolicy('pricing') : (window.location.hash = 'pricing')}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
          >
            Pricing &amp; Delivery
          </button>
        </div>
      </div>
    </div>
  );
}
