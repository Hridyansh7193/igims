import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Key,
  Tag,
  Percent,
  PlusCircle,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  ArrowRight,
  Copy,
  Check,
  Power,
  ExternalLink,
  Eye,
  EyeOff,
  Sparkles,
  Camera,
} from 'lucide-react';
import {
  adminLogin,
  adminLogout,
  getAdminSession,
  fetchAllPromoCodes,
  createPromoCode,
  deletePromoCode,
  togglePromoCodeActive,
} from '../lib/promoService';

export default function AdminPage({ setPage }) {
  // Session State
  const [session, setSession] = useState(getAdminSession);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Promo Codes State
  const [promoCodes, setPromoCodes] = useState([]);
  const [loadingCodes, setLoadingCodes] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // New Code Form State
  const [newCode, setNewCode] = useState('');
  const [newPercent, setNewPercent] = useState(15);
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // Actions State
  const [actionId, setActionId] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load promo codes if logged in
  const loadCodes = useCallback(async () => {
    if (!session) return;
    setLoadingCodes(true);
    setFetchError(null);
    try {
      const list = await fetchAllPromoCodes();
      setPromoCodes(list);
    } catch (err) {
      console.error('[AdminPage] loadCodes error:', err);
      setFetchError(err.message || 'Could not load promo codes.');
    } finally {
      setLoadingCodes(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      loadCodes();
    }
  }, [session, loadCodes]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await adminLogin(usernameInput, passwordInput);
      if (res.success && res.session) {
        setSession(res.session);
        setUsernameInput('');
        setPasswordInput('');
      } else {
        setLoginError(res.message || 'Invalid username or password.');
      }
    } catch (err) {
      setLoginError('Login failed. Please check connection.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    adminLogout();
    setSession(null);
  };

  // Handle Create Promo Code
  const handleCreatePromo = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const cleanCode = newCode.trim().toUpperCase();
    const percent = parseInt(newPercent, 10);

    if (!cleanCode) {
      setFormError('Please enter a promo code name.');
      return;
    }
    if (isNaN(percent) || percent <= 0 || percent > 100) {
      setFormError('Discount percentage must be between 1% and 100%.');
      return;
    }

    setCreating(true);
    try {
      const created = await createPromoCode({
        code: cleanCode,
        discountPercent: percent,
        description: newDesc.trim(),
      });

      setFormSuccess(`Promo code "${created.code}" with ${created.discount_percent}% discount created successfully!`);
      setNewCode('');
      setNewPercent(15);
      setNewDesc('');
      await loadCodes();
    } catch (err) {
      setFormError(err.message || 'Failed to create promo code.');
    } finally {
      setCreating(false);
    }
  };

  // Handle Toggle Active/Inactive
  const handleToggle = async (promo) => {
    setActionId(promo.id);
    try {
      await togglePromoCodeActive(promo.id, !promo.is_active);
      await loadCodes();
    } catch (err) {
      alert('Could not update status: ' + err.message);
    } finally {
      setActionId(null);
    }
  };

  // Handle Delete
  const handleDelete = async (promo) => {
    if (!window.confirm(`Are you sure you want to permanently delete promo code "${promo.code}"?`)) {
      return;
    }
    setActionId(promo.id);
    try {
      await deletePromoCode(promo.id);
      await loadCodes();
    } catch (err) {
      alert('Could not delete promo code: ' + err.message);
    } finally {
      setActionId(null);
    }
  };

  // Copy code to clipboard
  const handleCopy = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  // Live calculation for preview
  const previewPercent = Math.min(100, Math.max(1, parseInt(newPercent, 10) || 0));
  const previewDiscount = Math.round((2000 * previewPercent) / 100);
  const previewFinal = Math.max(0, 2000 - previewDiscount);

  // Filtered list
  const filteredCodes = promoCodes.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.code.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  });

  const activeCount = promoCodes.filter((p) => p.is_active).length;

  // ----------------------------------------------------
  // VIEW 1: ADMIN LOGIN FORM
  // ----------------------------------------------------
  if (!session) {
    return (
      <section
        style={{
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 20px 80px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 440,
            background: 'linear-gradient(160deg, #1b070d 0%, #0c0407 100%)',
            border: '1px solid rgba(220, 38, 38, 0.35)',
            borderRadius: 20,
            padding: '36px 30px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 50px rgba(220, 38, 38, 0.1)',
            position: 'relative',
          }}
        >
          {/* Lock Icon */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(220, 38, 38, 0.15)',
              border: '1px solid rgba(220, 38, 38, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
            }}
          >
            <Lock size={24} color="#DC2626" />
          </div>

          <h2
            className="crx-display"
            style={{
              fontSize: 24,
              color: 'var(--cream, #fff)',
              textAlign: 'center',
              margin: '0 0 6px',
            }}
          >
            ADMIN PORTAL
          </h2>
          <p
            style={{
              textAlign: 'center',
              fontSize: 13,
              color: 'var(--muted, #a1a1aa)',
              margin: '0 0 24px',
            }}
          >
            Cerebrexia '26 &bull; Promo &amp; Discount Management
          </p>

          {loginError && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: 10,
                padding: '10px 14px',
                marginBottom: 18,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                color: '#fca5a5',
                fontSize: 12.5,
              }}
            >
              <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Username Input */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  color: 'var(--muted, #a1a1aa)',
                  marginBottom: 6,
                }}
              >
                Admin Username
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={16}
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255,255,255,0.4)',
                  }}
                />
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="e.g. admin"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    borderRadius: 10,
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: 13.5,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  color: 'var(--muted, #a1a1aa)',
                  marginBottom: 6,
                }}
              >
                Admin Password
              </label>
              <div style={{ position: 'relative' }}>
                <Key
                  size={16}
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255,255,255,0.4)',
                  }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password"
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 40px',
                    borderRadius: 10,
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: 13.5,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginLoading}
              className="crx-btn gold"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '13px',
                fontSize: 13,
                fontWeight: 700,
                marginTop: 8,
              }}
            >
              {loginLoading ? 'AUTHENTICATING...' : 'SIGN IN TO ADMIN PORTAL'}
            </button>
          </form>

          {/* Quick Help */}
          <div
            style={{
              marginTop: 24,
              paddingTop: 16,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              fontSize: 11.5,
              color: 'rgba(255,255,255,0.4)',
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            Authorized fest administrators and festival coordinators only.
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // VIEW 2: AUTHENTICATED ADMIN PORTAL DASHBOARD
  // ----------------------------------------------------
  return (
    <section style={{ padding: '120px 24px 100px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 32,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(220, 38, 38, 0.15)',
              border: '1px solid rgba(220, 38, 38, 0.35)',
              borderRadius: 20,
              padding: '4px 12px',
              marginBottom: 8,
            }}
          >
            <ShieldCheck size={13} color="#DC2626" />
            <span
              style={{
                fontSize: 10.5,
                color: '#DC2626',
                fontWeight: 800,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
              }}
            >
              Admin Console &bull; {session.username || 'Admin'}
            </span>
          </div>

          <h1
            className="crx-display"
            style={{
              fontSize: 'clamp(24px, 4vw, 36px)',
              color: 'var(--cream, #fff)',
              margin: '0 0 6px',
            }}
          >
            PROMO CODE PORTAL
          </h1>
          <p style={{ color: 'var(--muted, #a1a1aa)', fontSize: 13, margin: 0 }}>
            Create, configure percentage discounts, and manage active promotional codes in real-time.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => setPage && setPage('scanner')}
            className="crx-btn"
            style={{
              background: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid rgba(212, 175, 55, 0.45)',
              color: 'var(--crx-gold, #D4AF37)',
              fontSize: 12,
              gap: 6,
            }}
          >
            <Camera size={13} /> Open Gate Scanner
          </button>
          <button
            onClick={() => setPage && setPage('home')}
            className="crx-btn"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'var(--cream, #fff)',
              fontSize: 12,
              gap: 6,
            }}
          >
            <ExternalLink size={13} /> View Website
          </button>
          <button
            onClick={handleLogout}
            className="crx-btn"
            style={{
              background: 'rgba(220, 38, 38, 0.15)',
              border: '1px solid rgba(220, 38, 38, 0.35)',
              color: '#fca5a5',
              fontSize: 12,
              gap: 6,
            }}
          >
            <LogOut size={13} /> Log Out
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div
          style={{
            background: 'linear-gradient(145deg, #18090f 0%, #0a0407 100%)',
            border: '1px solid rgba(220, 38, 38, 0.25)',
            borderRadius: 14,
            padding: '18px 20px',
          }}
        >
          <span style={{ fontSize: 11, color: 'var(--muted, #a1a1aa)', textTransform: 'uppercase', letterSpacing: 1 }}>
            Total Promo Codes
          </span>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginTop: 4 }}>
            {promoCodes.length}
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(145deg, #091710 0%, #040d07 100%)',
            border: '1px solid rgba(34, 197, 94, 0.25)',
            borderRadius: 14,
            padding: '18px 20px',
          }}
        >
          <span style={{ fontSize: 11, color: '#86efac', textTransform: 'uppercase', letterSpacing: 1 }}>
            Active Codes
          </span>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#22c55e', marginTop: 4 }}>
            {activeCount}
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(145deg, #171207 0%, #0d0a04 100%)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: 14,
            padding: '18px 20px',
          }}
        >
          <span style={{ fontSize: 11, color: 'var(--crx-gold, #D4AF37)', textTransform: 'uppercase', letterSpacing: 1 }}>
            Max Discount Active
          </span>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--crx-gold, #D4AF37)', marginTop: 4 }}>
            {promoCodes.length > 0
              ? `${Math.max(...promoCodes.filter((p) => p.is_active).map((p) => p.discount_percent || 0), 0)}%`
              : '0%'}
          </div>
        </div>
      </div>

      {/* Main Grid: Create Form (Left) & Existing Codes List (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
          alignItems: 'start',
        }}
      >
        {/* LEFT COLUMN: Add New Promo Code Form */}
        <div
          style={{
            background: 'linear-gradient(160deg, #19080e 0%, #0a0306 100%)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: 18,
            padding: '24px 22px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PlusCircle size={18} color="var(--crx-gold, #D4AF37)" />
            </div>
            <div>
              <h2 className="crx-display" style={{ fontSize: 18, color: '#fff', margin: 0 }}>
                CREATE PROMO CODE
              </h2>
              <span style={{ fontSize: 11.5, color: 'var(--muted, #a1a1aa)' }}>
                Attendees enter this at checkout
              </span>
            </div>
          </div>

          {formError && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 10,
                padding: '10px 12px',
                marginBottom: 16,
                color: '#fca5a5',
                fontSize: 12,
              }}
            >
              {formError}
            </div>
          )}

          {formSuccess && (
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: 10,
                padding: '10px 12px',
                marginBottom: 16,
                color: '#86efac',
                fontSize: 12,
              }}
            >
              {formSuccess}
            </div>
          )}

          <form onSubmit={handleCreatePromo} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Promo Code Name */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                  color: 'var(--muted, #a1a1aa)',
                  marginBottom: 6,
                }}
              >
                Promo Code Name *
              </label>
              <div style={{ position: 'relative' }}>
                <Tag
                  size={15}
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255,255,255,0.4)',
                  }}
                />
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FEST20, SPECIAL15"
                  style={{
                    width: '100%',
                    padding: '11px 12px 11px 36px',
                    borderRadius: 8,
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: 13,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Discount Percentage */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    color: 'var(--muted, #a1a1aa)',
                  }}
                >
                  Discount Percentage *
                </label>
                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--crx-gold, #D4AF37)' }}>
                  {previewPercent}% OFF
                </span>
              </div>

              {/* Quick Select Buttons */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                {[10, 15, 20, 25, 30, 50, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setNewPercent(pct)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 6,
                      background: newPercent === pct ? 'var(--crx-gold, #D4AF37)' : 'rgba(255,255,255,0.06)',
                      border: newPercent === pct ? '1px solid var(--crx-gold, #D4AF37)' : '1px solid rgba(255,255,255,0.12)',
                      color: newPercent === pct ? '#000' : 'var(--cream, #fff)',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {pct}%
                  </button>
                ))}
              </div>

              {/* Number / Range Input */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={newPercent}
                  onChange={(e) => setNewPercent(Number(e.target.value))}
                  style={{ flex: 1, accentColor: '#D4AF37' }}
                />
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={newPercent}
                  onChange={(e) => setNewPercent(e.target.value)}
                  style={{
                    width: 65,
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: 13,
                    textAlign: 'center',
                    fontWeight: 700,
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Live Calculation Preview Box */}
            <div
              style={{
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                borderRadius: 12,
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Sparkles size={14} color="var(--crx-gold, #D4AF37)" />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--crx-gold, #D4AF37)' }}>
                  Live Attendee Calculation
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted, #a1a1aa)', marginBottom: 4 }}>
                <span>Regular Base Registration:</span>
                <span>₹2,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#22c55e', marginBottom: 4 }}>
                <span>{previewPercent}% Discount Applied:</span>
                <span style={{ fontWeight: 700 }}>-₹{previewDiscount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '6px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#fff', fontWeight: 800 }}>
                <span>Final Attendee Price:</span>
                <span style={{ color: previewFinal === 0 ? '#22c55e' : '#fff' }}>
                  {previewFinal === 0 ? 'FREE PASS (100% OFF)' : `₹${previewFinal.toLocaleString('en-IN')}`}
                </span>
              </div>
            </div>

            {/* Description (Optional) */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                  color: 'var(--muted, #a1a1aa)',
                  marginBottom: 6,
                }}
              >
                Description / Internal Note (Optional)
              </label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="e.g. Early Bird Offer, Sponsor pass, IGIMS student"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  fontSize: 12.5,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={creating}
              className="crx-btn gold"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                fontSize: 12.5,
                fontWeight: 700,
              }}
            >
              {creating ? 'SAVING PROMO CODE...' : 'ACTIVATE NEW PROMO CODE'}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Active & Inactive Promo Codes List */}
        <div
          style={{
            background: 'linear-gradient(160deg, #12070c 0%, #080306 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 18,
            padding: '24px 22px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              flexWrap: 'wrap',
              gap: 10,
            }}
          >
            <div>
              <h2 className="crx-display" style={{ fontSize: 18, color: '#fff', margin: 0 }}>
                EXISTING PROMO CODES ({promoCodes.length})
              </h2>
              <span style={{ fontSize: 11.5, color: 'var(--muted, #a1a1aa)' }}>
                Toggle active state or remove codes permanently
              </span>
            </div>

            <button
              onClick={loadCodes}
              disabled={loadingCodes}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 8,
                padding: '6px 10px',
                color: 'var(--cream, #fff)',
                cursor: 'pointer',
                fontSize: 11.5,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <RefreshCw
                size={12}
                style={{
                  animation: loadingCodes ? 'spin 1s linear infinite' : 'none',
                }}
              />
              Refresh
            </button>
          </div>

          {/* Search Box */}
          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by code or description..."
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: 12,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {fetchError && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 10,
                padding: '12px',
                marginBottom: 16,
                color: '#fca5a5',
                fontSize: 12,
              }}
            >
              {fetchError}
            </div>
          )}

          {/* Promo Codes Cards List */}
          {loadingCodes && promoCodes.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted, #a1a1aa)', fontSize: 13 }}>
              <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite', color: '#DC2626', margin: '0 auto 10px' }} />
              Loading promo codes...
            </div>
          ) : filteredCodes.length === 0 ? (
            <div
              style={{
                padding: '36px 20px',
                textAlign: 'center',
                border: '1px dashed rgba(255,255,255,0.12)',
                borderRadius: 12,
                color: 'var(--muted, #a1a1aa)',
                fontSize: 12.5,
              }}
            >
              {searchQuery ? 'No promo codes match your search query.' : 'No promo codes found. Create your first code using the form on the left!'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '600px', overflowY: 'auto', paddingRight: 4 }}>
              {filteredCodes.map((p) => {
                const isItemAction = actionId === p.id;
                return (
                  <div
                    key={p.id}
                    style={{
                      background: p.is_active ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.4)',
                      border: p.is_active ? '1px solid rgba(212, 175, 55, 0.25)' : '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 12,
                      padding: '14px 16px',
                      opacity: p.is_active ? 1 : 0.65,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: 14,
                            fontWeight: 800,
                            letterSpacing: 1,
                            color: '#fff',
                            background: 'rgba(0,0,0,0.6)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            padding: '3px 8px',
                            borderRadius: 6,
                          }}
                        >
                          {p.code}
                        </span>

                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            color: 'var(--crx-gold, #D4AF37)',
                            background: 'rgba(212, 175, 55, 0.15)',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            padding: '3px 8px',
                            borderRadius: 12,
                          }}
                        >
                          {p.discount_percent}% OFF
                        </span>

                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: p.is_active ? '#22c55e' : '#f59e0b',
                            background: p.is_active ? 'rgba(34, 197, 94, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                            padding: '2px 8px',
                            borderRadius: 10,
                          }}
                        >
                          {p.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>

                      {/* Copy Code Button */}
                      <button
                        onClick={() => handleCopy(p.code)}
                        title="Copy promo code"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: copiedCode === p.code ? '#22c55e' : 'rgba(255,255,255,0.4)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 11,
                          padding: 4,
                        }}
                      >
                        {copiedCode === p.code ? <Check size={13} /> : <Copy size={13} />}
                        {copiedCode === p.code ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    {p.description && (
                      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted, #a1a1aa)' }}>
                        {p.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10, flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                        Saved: ₹{Math.round((2000 * p.discount_percent) / 100)}/person &bull; Used: {p.times_used || 0} times
                      </div>

                      {/* Action Buttons: Toggle and Delete */}
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleToggle(p)}
                          disabled={isItemAction}
                          style={{
                            background: p.is_active ? 'rgba(245, 158, 11, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                            border: `1px solid ${p.is_active ? 'rgba(245, 158, 11, 0.35)' : 'rgba(34, 197, 94, 0.35)'}`,
                            color: p.is_active ? '#fbbf24' : '#86efac',
                            padding: '4px 10px',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <Power size={11} />
                          {p.is_active ? 'Deactivate' : 'Activate'}
                        </button>

                        <button
                          onClick={() => handleDelete(p)}
                          disabled={isItemAction}
                          style={{
                            background: 'rgba(239, 68, 68, 0.12)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#fca5a5',
                            padding: '4px 10px',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <Trash2 size={11} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
