import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';

export default function AuthForm({ onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (onSuccess) onSuccess();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // If you need to redirect somewhere specific after login
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 243, 214, 0.03)',
      border: '1px solid rgba(179, 18, 58, 0.3)',
      borderRadius: 16,
      padding: '40px 30px',
      maxWidth: 400,
      margin: '0 auto',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Glow */}
      <div style={{
        position: 'absolute',
        top: -50,
        left: -50,
        width: 150,
        height: 150,
        background: 'rgba(220, 38, 38, 0.15)',
        filter: 'blur(50px)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <h2 className="crx-display" style={{ fontSize: 26, color: 'var(--cream)', marginBottom: 8, textAlign: 'center' }}>
        {isLogin ? 'ACCESS TERMINAL' : 'INITIALIZE UPLINK'}
      </h2>
      <p style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', marginBottom: 30 }}>
        {isLogin ? 'Sign in to access your dashboard.' : 'Create an account to join Cerebrexia.'}
      </p>

      {error && (
        <div style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid var(--crx-red)', color: '#ff8f8f', padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 20 }}>
          {error}
        </div>
      )}

      {message && (
        <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', color: '#93c5fd', padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 20 }}>
          {message}
        </div>
      )}

      <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6, letterSpacing: 1 }}>
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} color="var(--muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '12px 14px 12px 40px',
                borderRadius: 8,
                color: 'white',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6, letterSpacing: 1 }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} color="var(--muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '12px 14px 12px 40px',
                borderRadius: 8,
                color: 'white',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="••••••••"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="crx-btn gold" 
          style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
        >
          {loading ? 'PROCESSING...' : (isLogin ? <><LogIn size={16}/> SIGN IN</> : <><UserPlus size={16}/> REGISTER</>)}
        </button>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', color: 'var(--muted)' }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
        <span style={{ padding: '0 10px', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>OR</span>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
      </div>

      <button 
        onClick={handleGoogleLogin}
        disabled={loading}
        className="crx-btn" 
        style={{ 
          width: '100%', 
          justifyContent: 'center', 
          background: 'white', 
          color: 'black', 
          boxShadow: '0 4px 15px rgba(255,255,255,0.2)' 
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
          </g>
        </svg>
        CONTINUE WITH GOOGLE
      </button>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button 
          onClick={() => setIsLogin(!isLogin)}
          style={{ background: 'none', border: 'none', color: 'var(--cyan)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
