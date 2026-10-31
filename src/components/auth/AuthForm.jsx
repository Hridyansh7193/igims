import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, LogIn, UserPlus, AlertCircle, CheckCircle, Timer, ShieldAlert, ArrowRight, RefreshCw, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const GOOGLE_SVG = (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(1,0,0,1,27.009001,-39.238998)">
      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
    </g>
  </svg>
);

export default function AuthForm({ onSuccess, onOpenPolicy }) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, resendVerificationEmail } = useAuth();
  const [isLogin,                  setIsLogin]                  = useState(true);
  const [email,                    setEmail]                    = useState('');
  const [password,                 setPassword]                 = useState('');
  const [loading,                  setLoading]                  = useState(false);
  const [error,                    setError]                    = useState(null);
  const [message,                  setMessage]                  = useState(null);
  const [isRateLimit,              setIsRateLimit]              = useState(false);
  const [isEmailUnconfirmed,       setIsEmailUnconfirmed]       = useState(false);
  const [cooldown,                 setCooldown]                 = useState(0);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState(null);
  const [resending,                setResending]                = useState(false);
  const [resendCooldown,           setResendCooldown]           = useState(0);
  const [resendSuccess,            setResendSuccess]            = useState(false);

  const timerRef = useRef(null);
  const resendTimerRef = useRef(null);

  // Countdown ticker for rate-limit cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    timerRef.current = setInterval(() => {
      setCooldown(c => {
        if (c <= 1) { clearInterval(timerRef.current); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [cooldown]);

  // Countdown ticker for resend verification cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    resendTimerRef.current = setInterval(() => {
      setResendCooldown(c => {
        if (c <= 1) { clearInterval(resendTimerRef.current); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(resendTimerRef.current);
  }, [resendCooldown]);

  const startCooldown = (secs = 30) => { setCooldown(secs); setIsRateLimit(true); };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (cooldown > 0) return;
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email address.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    
    setLoading(true);
    setError(null);
    setMessage(null);
    setIsRateLimit(false);
    setIsEmailUnconfirmed(false);

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
        // Successful login
        if (onSuccess) onSuccess();
      } else {
        const data = await signUpWithEmail(email, password);
        // Supabase returns an empty identities list if user already exists
        if (data?.user?.identities && data.user.identities.length === 0) {
          setError('An account with this email already exists. Try signing in.');
          setIsLogin(true);
        } else {
          // New user created — DO NOT call onSuccess!
          // Lock access and show verification screen notification
          setPendingVerificationEmail(email.trim().toLowerCase());
        }
      }
    } catch (err) {
      if (err.isRateLimit) {
        startCooldown(30);
      } else {
        setIsRateLimit(false);
      }
      if (err.isEmailNotConfirmed) {
        setIsEmailUnconfirmed(true);
      }
      setError(err.message || 'Authentication failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (cooldown > 0) return;
    setError(null);
    setIsRateLimit(false);
    setIsEmailUnconfirmed(false);
    try {
      await signInWithGoogle();
      // Google OAuth authenticates and verifies email implicitly
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Try again.');
    }
  };

  const handleResend = async (targetEmail) => {
    const toSend = targetEmail || email || pendingVerificationEmail;
    if (!toSend || resendCooldown > 0) return;
    setResending(true);
    setResendSuccess(false);
    setError(null);
    try {
      await resendVerificationEmail(toSend);
      setResendSuccess(true);
      setResendCooldown(45);
      setTimeout(() => setResendSuccess(false), 6000);
    } catch (err) {
      setError(err.message || 'Failed to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  const inp = {
    width: '100%', background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '12px 14px 12px 40px', borderRadius: 8,
    color: 'white', outline: 'none', boxSizing: 'border-box',
    fontSize: 14, transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const focusInp = (e) => {
    e.target.style.borderColor = 'rgba(220,38,38,0.6)';
    e.target.style.boxShadow   = '0 0 0 3px rgba(220,38,38,0.08)';
  };
  const blurInp = (e) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
    e.target.style.boxShadow   = 'none';
  };

  const switchMode = () => {
    setIsLogin(v => !v);
    setError(null);
    setMessage(null);
    setIsRateLimit(false);
    setIsEmailUnconfirmed(false);
  };

  // ── SCREEN NOTIFICATION: Email Verification Pending ─────────────────────────
  if (pendingVerificationEmail) {
    return (
      <div style={{
        background: 'linear-gradient(160deg, #1b0808 0%, #090303 100%)',
        border: '1px solid rgba(220,38,38,0.45)',
        borderRadius: 20,
        padding: 'clamp(28px, 5vw, 44px) clamp(20px, 4vw, 32px)',
        width: '92%',
        maxWidth: 440,
        margin: '0 auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.85), 0 0 60px rgba(220,38,38,0.14)',
        backdropFilter: 'blur(12px)',
        position: 'relative',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}>
        {/* Glowing badge */}
        <div style={{
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: 'rgba(220,38,38,0.15)',
          border: '1px solid rgba(220,38,38,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 0 25px rgba(220,38,38,0.3)',
        }}>
          <Mail size={26} color="#DC2626" />
        </div>

        <h2 className="crx-display" style={{ fontSize: 24, color: 'var(--cream)', marginBottom: 8 }}>
          VERIFY YOUR EMAIL
        </h2>
        
        <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
          We have sent a confirmation link to:
        </p>

        <div style={{
          background: 'rgba(0,0,0,0.4)',
          border: '1px solid rgba(220,38,38,0.3)',
          borderRadius: 8,
          padding: '10px 14px',
          color: 'var(--gold)',
          fontWeight: 700,
          fontSize: 14,
          wordBreak: 'break-all',
          marginBottom: 20,
        }}>
          {pendingVerificationEmail}
        </div>

        {/* Lockout Notice */}
        <div style={{
          background: 'rgba(220,38,38,0.1)',
          border: '1px solid rgba(220,38,38,0.35)',
          borderRadius: 10,
          padding: '12px 14px',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          marginBottom: 22,
        }}>
          <ShieldAlert size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ margin: 0, fontSize: 12, color: '#fca5a5', lineHeight: 1.5 }}>
            <strong>Access Locked:</strong> You cannot enter Cerebrexia '26 until your email is verified. Click the link sent to your inbox to activate your account.
          </p>
        </div>

        {resendSuccess && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.35)',
            color: '#86efac',
            padding: '10px',
            borderRadius: 8,
            fontSize: 12,
            marginBottom: 16,
          }}>
            <Check size={14} /> A fresh confirmation link was dispatched!
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(220,38,38,0.12)',
            border: '1px solid #DC2626',
            color: '#ff8f8f',
            padding: '10px',
            borderRadius: 8,
            fontSize: 12,
            marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        {/* Resend button */}
        <button
          type="button"
          onClick={() => handleResend(pendingVerificationEmail)}
          disabled={resending || resendCooldown > 0}
          className="crx-btn"
          style={{
            width: '100%',
            justifyContent: 'center',
            marginBottom: 12,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.14)',
            color: 'var(--cream)',
            fontSize: 12,
            opacity: resendCooldown > 0 ? 0.6 : 1,
          }}
        >
          {resending ? (
            <><RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> SENDING...</>
          ) : resendCooldown > 0 ? (
            <><Timer size={13} /> RESEND AVAILABLE IN {resendCooldown}s</>
          ) : (
            'RESEND CONFIRMATION LINK'
          )}
        </button>

        {/* Sign in button once verified */}
        <button
          type="button"
          onClick={() => {
            setPendingVerificationEmail(null);
            setIsLogin(true);
            setMessage('If you confirmed your email, sign in now to enter!');
          }}
          className="crx-btn gold"
          style={{ width: '100%', justifyContent: 'center', marginBottom: 16, fontSize: 13 }}
        >
          I'VE VERIFIED MY EMAIL &rarr; SIGN IN
        </button>

        <button
          type="button"
          onClick={() => {
            setPendingVerificationEmail(null);
            setIsLogin(false);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--muted)',
            fontSize: 11.5,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          &larr; Use a different email address
        </button>
      </div>
    );
  }

  // ── STANDARD AUTH FORM (Login / Signup) ─────────────────────────────────────
  return (
    <div style={{
      background: 'rgba(255,243,214,0.03)', border: '1px solid rgba(220,38,38,0.35)',
      borderRadius: 16, padding: 'clamp(24px, 5vw, 40px) clamp(16px, 4vw, 30px)', width: '92%', maxWidth: 420, margin: '0 auto',
      boxShadow: '0 10px 40px rgba(0,0,0,0.6),0 0 60px rgba(220,38,38,0.07)',
      backdropFilter: 'blur(10px)', position: 'relative', overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      {/* Ambient glows */}
      <div style={{ position:'absolute', top:-50, left:-50, width:160, height:160, background:'rgba(220,38,38,0.14)', filter:'blur(50px)', borderRadius:'50%', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-40, right:-40, width:120, height:120, background:'rgba(220,38,38,0.07)', filter:'blur(40px)', borderRadius:'50%', pointerEvents:'none' }} />

      <h2 className="crx-display" style={{ fontSize:26, color:'var(--cream)', marginBottom:6, textAlign:'center' }}>
        {isLogin ? 'ACCESS TERMINAL' : 'INITIALIZE UPLINK'}
      </h2>
      <p style={{ color:'var(--muted)', fontSize:12, textAlign:'center', marginBottom:28, letterSpacing:0.5 }}>
        {isLogin ? 'Sign in to access Cerebrexia \'26.' : 'Create an account to join Cerebrexia.'}
      </p>

      {/* Error banner */}
      {error && (
        <div style={{
          display:'flex', flexDirection:'column', gap:8, padding:'12px 14px',
          borderRadius:8, fontSize:13, marginBottom:18,
          background: isRateLimit ? 'rgba(245,158,11,0.1)' : 'rgba(220,38,38,0.12)',
          border: isRateLimit ? '1px solid #f59e0b' : '1px solid #DC2626',
          color: isRateLimit ? '#fcd34d' : '#ff8f8f',
        }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
            {isRateLimit
              ? <Timer size={14} style={{ flexShrink:0, marginTop:2 }} />
              : <AlertCircle size={14} style={{ flexShrink:0, marginTop:2 }} />}
            <span>
              {error}
              {cooldown > 0 && <strong> Retry in {cooldown}s.</strong>}
            </span>
          </div>

          {/* If email is unconfirmed, show quick 1-click resend */}
          {isEmailUnconfirmed && (
            <button
              type="button"
              onClick={() => handleResend(email)}
              disabled={resending || resendCooldown > 0}
              style={{
                alignSelf: 'flex-start',
                marginTop: 4,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(220,38,38,0.4)',
                color: 'var(--cream)',
                borderRadius: 6,
                padding: '6px 12px',
                fontSize: 11,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {resending ? 'Dispatching...' : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Verification Link'}
            </button>
          )}
        </div>
      )}

      {/* Success banner */}
      {message && (
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.35)', color:'#86efac', padding:'10px 14px', borderRadius:8, fontSize:13, marginBottom:18 }}>
          <CheckCircle size={14} /> {message}
        </div>
      )}

      {/* Google OAuth button — instant verified access */}
      <button
        type="button" onClick={handleGoogleLogin}
        disabled={loading || cooldown > 0}
        className="crx-btn"
        style={{ width:'100%', justifyContent:'center', background:'white', color:'#111', boxShadow:'0 4px 15px rgba(255,255,255,0.12)', marginBottom:20, gap:10, opacity: cooldown > 0 ? 0.5 : 1 }}
      >
        {GOOGLE_SVG} CONTINUE WITH GOOGLE
      </button>

      {/* Divider */}
      <div style={{ display:'flex', alignItems:'center', margin:'0 0 20px', color:'var(--muted)' }}>
        <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }} />
        <span style={{ padding:'0 12px', fontSize:11, textTransform:'uppercase', letterSpacing:2 }}>OR</span>
        <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }} />
      </div>

      <form onSubmit={handleEmailAuth} style={{ display:'flex', flexDirection:'column', gap:14 }} noValidate>
        {/* Email */}
        <div>
          <label style={{ display:'block', fontSize:10, textTransform:'uppercase', color:'var(--muted)', marginBottom:6, letterSpacing:1.5 }}>Email Address</label>
          <div style={{ position:'relative' }}>
            <Mail size={15} color="var(--muted)" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              required autoComplete="email" style={inp} placeholder="you@example.com"
              onFocus={focusInp} onBlur={blurInp} />
          </div>
        </div>

        {/* Password */}
        <div>
          <label style={{ display:'block', fontSize:10, textTransform:'uppercase', color:'var(--muted)', marginBottom:6, letterSpacing:1.5 }}>Password</label>
          <div style={{ position:'relative' }}>
            <Lock size={15} color="var(--muted)" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              required minLength={6}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              style={inp} placeholder="••••••••"
              onFocus={focusInp} onBlur={blurInp} />
          </div>
          {!isLogin && <p style={{ fontSize:11, color:'var(--muted)', marginTop:5 }}>Min. 6 characters · A confirmation link will be sent</p>}
        </div>

        <button type="submit" disabled={loading || cooldown > 0}
          className="crx-btn gold"
          style={{ width:'100%', justifyContent:'center', marginTop:4, opacity: cooldown > 0 ? 0.5 : 1 }}
        >
          {loading        ? 'PROCESSING...'
           : cooldown > 0 ? <><Timer size={14} /> WAIT {cooldown}s</>
           : isLogin      ? <><LogIn size={14} /> SIGN IN</>
           : <><UserPlus size={14} /> CREATE ACCOUNT</>}
        </button>
      </form>

      <div style={{ textAlign:'center', marginTop:20 }}>
        <button onClick={switchMode} style={{ background:'none', border:'none', color:'var(--cyan)', fontSize:12, cursor:'pointer', textDecoration:'underline' }}>
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>

      {/* Official Legal / Compliance Links for Razorpay Merchant KYC & delegates */}
      <div style={{ marginTop: 22, paddingTop: 14, borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
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
