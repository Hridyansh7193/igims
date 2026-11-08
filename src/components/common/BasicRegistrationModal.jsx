import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Phone, Building2, MapPin, Mail, Loader2, Music, Sparkles, CheckCircle2, ShieldCheck, Ticket } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { saveBasicRegistration, fetchBasicRegistration, fetchParticipantProfile } from '../../lib/eventsService';

export default function BasicRegistrationModal({
  initialProfile,
  onClose,
  onSuccess,
}) {
  const { user } = useAuth();

  // Prefill name from Google OAuth metadata if initialProfile is empty
  const googleNameParts = (user?.user_metadata?.full_name || user?.user_metadata?.name || '').trim().split(/\s+/);
  const defaultFirstName = initialProfile?.first_name || (googleNameParts[0] && googleNameParts[0] !== 'undefined' ? googleNameParts[0] : '');
  const defaultSurname = initialProfile?.last_name || initialProfile?.surname || (googleNameParts.length > 1 ? googleNameParts.slice(1).join(' ') : '');

  const [form, setForm] = useState({
    first_name      : defaultFirstName,
    surname         : defaultSurname,
    college_name    : initialProfile?.college_name || '',
    phone_number    : initialProfile?.phone_number || '',
    city_of_college : initialProfile?.college_city || initialProfile?.city_of_college || '',
    state_of_college: initialProfile?.college_state || initialProfile?.state_of_college || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [existingBR, setExistingBR] = useState(null);
  const [checkingExisting, setCheckingExisting] = useState(true);

  // Check if user already has a Basic Registration
  useEffect(() => {
    let active = true;
    async function checkBR() {
      if (!user) {
        setCheckingExisting(false);
        return;
      }
      try {
        const [p, br] = await Promise.all([
          initialProfile ? Promise.resolve(initialProfile) : fetchParticipantProfile(user.id, user.user_metadata),
          fetchBasicRegistration(user.id),
        ]);
        if (active) {
          if (p) {
            setForm(prev => ({
              ...prev,
              first_name: p.first_name || prev.first_name,
              surname: p.last_name || p.surname || prev.surname,
              college_name: p.college_name || prev.college_name,
              phone_number: p.phone_number || prev.phone_number,
              city_of_college: p.college_city || p.city_of_college || prev.city_of_college,
              state_of_college: p.college_state || p.state_of_college || prev.state_of_college,
            }));
          }
          if (br) {
            setExistingBR(br);
          }
        }
      } catch (err) {
        console.warn('BR check error:', err);
      } finally {
        if (active) setCheckingExisting(false);
      }
    }
    checkBR();
    return () => { active = false; };
  }, [user, initialProfile]);

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

  const update = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = {
      first_name      : form.first_name.trim(),
      surname         : form.surname.trim(),
      college_name    : form.college_name.trim(),
      phone_number    : form.phone_number.trim(),
      city_of_college : form.city_of_college.trim(),
      state_of_college: form.state_of_college.trim(),
    };

    if (!trimmed.first_name) { setError('First name is required.'); return; }
    if (!trimmed.surname) { setError('Surname is required.'); return; }
    if (!trimmed.college_name) { setError('College name is required.'); return; }
    if (!/^[0-9]{10}$/.test(trimmed.phone_number)) { setError('Phone number must be exactly 10 digits.'); return; }
    if (!trimmed.city_of_college) { setError('City is required.'); return; }
    if (!trimmed.state_of_college) { setError('State is required.'); return; }

    setLoading(true);
    setError(null);

    try {
      // Registers BR and ensures a single profile entry in `participants`
      const result = await saveBasicRegistration(user.id, user.email, {
        first_name   : trimmed.first_name,
        last_name    : trimmed.surname,
        college_name : trimmed.college_name,
        phone_number : trimmed.phone_number,
        college_city : trimmed.city_of_college,
        college_state: trimmed.state_of_college,
      });

      if (onSuccess) {
        onSuccess(result.profile, result.basicRegistration);
      } else {
        onClose();
      }
    } catch (err) {
      console.error('Basic registration error:', err);
      setError(err?.message || 'Basic registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%',
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '11px 14px 11px 40px',
    borderRadius: 8,
    color: 'white',
    outline: 'none',
    boxSizing: 'border-box',
    fontSize: 13,
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };
  const inpRO = { ...inp, opacity: 0.6, cursor: 'not-allowed' };

  const focusInp = (e) => {
    e.target.style.borderColor = '#00F0FF';
    e.target.style.boxShadow = '0 0 0 3px rgba(0,240,255,0.12)';
  };
  const blurInp = (e) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
    e.target.style.boxShadow = 'none';
  };

  const fields = [
    { label: 'First Name', field: 'first_name', icon: User, type: 'text', placeholder: 'Arjun', span: 1 },
    { label: 'Surname', field: 'surname', icon: User, type: 'text', placeholder: 'Sharma', span: 1 },
    { label: 'College Name', field: 'college_name', icon: Building2, type: 'text', placeholder: 'IGIMS, Patna', span: 2 },
    { label: 'Phone Number', field: 'phone_number', icon: Phone, type: 'tel', placeholder: '9XXXXXXXXX', span: 1 },
    { label: 'City of College', field: 'city_of_college', icon: MapPin, type: 'text', placeholder: 'Patna', span: 1 },
    { label: 'State of College', field: 'state_of_college', icon: MapPin, type: 'text', placeholder: 'Bihar', span: 1 },
  ];

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="br-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(2,1,1,0.88)',
          backdropFilter: 'blur(10px)',
        }}
      />

      {/* Modal Dialog */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 580,
          maxHeight: '92vh',
          overflowY: 'auto',
          background: 'linear-gradient(160deg, #17070a 0%, #080305 100%)',
          border: '1px solid rgba(0, 240, 255, 0.4)',
          borderRadius: 20,
          padding: '32px 28px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.95), 0 0 60px rgba(0, 240, 255, 0.15)',
          zIndex: 1,
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--cream)',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
        >
          <X size={15} />
        </button>

        {/* Header Badge & Title */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(0, 240, 255, 0.12)',
              border: '1px solid rgba(0, 240, 255, 0.35)',
              borderRadius: 20,
              padding: '4px 12px',
              fontSize: 10,
              fontWeight: 700,
              color: '#00F0FF',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            <Music size={12} />
            CONCERT &amp; PRONITES (BR)
          </div>

          <h2
            id="br-modal-title"
            className="crx-display"
            style={{
              fontSize: 'clamp(24px, 4.5vw, 32px)',
              color: 'var(--cream)',
              margin: '0 0 8px',
              letterSpacing: 0.5,
            }}
          >
            BASIC REGISTRATION (BR)
          </h2>

          <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.55, margin: 0 }}>
            Submit your details to register directly for the star celebrity concert and pronites. You will <strong style={{ color: '#fff' }}>NOT</strong> be entered into any competitive sports or cultural events.
          </p>
        </div>

        {/* BR Highlight Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.08) 0%, rgba(220, 38, 38, 0.08) 100%)',
            border: '1px solid rgba(0, 240, 255, 0.25)',
            borderRadius: 14,
            padding: '16px 18px',
            marginBottom: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Ticket size={15} color="#00F0FF" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#00F0FF', textTransform: 'uppercase', letterSpacing: 1 }}>
                Official Concert Registration (BR)
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 11.5, color: 'var(--paper)', lineHeight: 1.4 }}>
              Full admission to star celebrity pronites &bull; ID &amp; wristband included
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}>
              Fee
            </span>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#fff', fontFamily: "'Anton', sans-serif" }}>
              ₹2000
            </span>
          </div>
        </div>

        {/* Existing BR Status Banner */}
        {existingBR && (
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.35)',
              borderRadius: 12,
              padding: '12px 16px',
              marginBottom: 18,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <CheckCircle2 size={18} color="#22c55e" flexShrink={0} />
            <div style={{ fontSize: 12, color: 'var(--cream)' }}>
              <strong>Already Registered:</strong> You hold an active Basic Registration for the Concert. You can update your contact information below.
            </div>
          </div>
        )}

        {/* Form Error */}
        {error && (
          <div
            style={{
              background: 'rgba(220, 38, 38, 0.15)',
              border: '1px solid #DC2626',
              borderRadius: 10,
              padding: '10px 14px',
              color: '#fca5a5',
              fontSize: 12,
              marginBottom: 18,
            }}
          >
            {error}
          </div>
        )}

        {/* Candidate Details Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Read-Only Authenticated Email */}
          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Registered Email (Account ID)
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
              <input type="email" value={user?.email || ''} readOnly style={inpRO} />
            </div>
          </div>

          {/* Grid Fields */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
            }}
          >
            {fields.map(({ label, field, icon: Icon, type, placeholder, span }) => (
              <div key={field} style={{ gridColumn: span === 2 ? 'span 2' : 'span 1' }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  {label} <span style={{ color: '#00F0FF' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Icon size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                  <input
                    type={type}
                    value={form[field]}
                    onChange={update(field)}
                    onFocus={focusInp}
                    onBlur={blurInp}
                    placeholder={placeholder}
                    maxLength={field === 'phone_number' ? 10 : 100}
                    style={inp}
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Privacy Note */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <ShieldCheck size={14} color="#00F0FF" />
            <p style={{ margin: 0, fontSize: 11, color: 'var(--muted)' }}>
              Single participant entry saved. Cross-category registrations will share this exact profile ID.
            </p>
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="crx-btn"
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'var(--muted)',
                justifyContent: 'center',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || checkingExisting}
              className="crx-btn gold"
              style={{
                flex: 2,
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  PROCESSING BR REGISTRATION...
                </>
              ) : existingBR ? (
                'UPDATE CONCERT DETAILS'
              ) : (
                'CONFIRM BASIC REGISTRATION (BR) — ₹2000'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

