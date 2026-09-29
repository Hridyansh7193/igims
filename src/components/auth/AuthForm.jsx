import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, LogIn, UserPlus, AlertCircle, CheckCircle, Timer } from 'lucide-react';
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

export default function AuthForm({ onSuccess }) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [isLogin,     setIsLogin]     = useState(true);
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [message,     setMessage]     = useState(null);
  const [isRateLimit, setIsRateLimit] = useState(false);
  const [cooldown,    setCooldown]    = useState(0);
  const timerRef = useRef(null);

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

  const startCooldown = (secs = 30) => { setCooldown(secs); setIsRateLimit(true); };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (cooldown > 0) return;
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email address.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError(null); setMessage(null); setIsRateLimit(false);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
        if (onSuccess) onSuccess();
      } else {
        await signUpWithEmail(email, password);
        setMessage('Account created! Check your email for the confirmation link.');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      if (err.isRateLimit) { startCooldown(30); }
      else { setIsRateLimit(false); }
      setError(err.message || 'Authentication failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (cooldown > 0) return;
    setError(null); setIsRateLimit(false);
    try { await signInWithGoogle(); }
    catch (err) { setError(err.message || 'Google sign-in failed. Try again.'); }
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

  const switchMode = () => { setIsLogin(v => !v); setError(null); setMessage(null); setIsRateLimit(false); };

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
        {isLogin ? 'Sign in to access your dashboard.' : 'Create an account to join Cerebrexia.'}
      </p>

      {/* Error banner */}
      {error && (
        <div style={{
          display:'flex', alignItems:'flex-start', gap:8, padding:'10px 14px',
          borderRadius:8, fontSize:13, marginBottom:18,
          background: isRateLimit ? 'rgba(245,158,11,0.1)' : 'rgba(220,38,38,0.1)',
          border: isRateLimit ? '1px solid #f59e0b' : '1px solid #DC2626',
          color: isRateLimit ? '#fcd34d' : '#ff8f8f',
        }}>
          {isRateLimit
            ? <Timer size={14} style={{ flexShrink:0, marginTop:2 }} />
            : <AlertCircle size={14} style={{ flexShrink:0, marginTop:2 }} />}
          <span>
            {error}
            {cooldown > 0 && <strong> Retry in {cooldown}s.</strong>}
          </span>
        </div>
      )}

      {/* Success banner */}
      {message && (
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.35)', color:'#86efac', padding:'10px 14px', borderRadius:8, fontSize:13, marginBottom:18 }}>
          <CheckCircle size={14} /> {message}
        </div>
      )}

      {/* Google OAuth button */}
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
          {!isLogin && <p style={{ fontSize:11, color:'var(--muted)', marginTop:5 }}>Min. 6 characters</p>}
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
    </div>
  );
}
