import React, { useState, useEffect } from 'react';
import { X, User, Phone, Building2, MapPin, Mail, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { saveParticipantProfile, addRegisteredEvent, normalizeProfile } from '../../lib/eventsService';

// DB-level error translator
function mapDbError(err) {
  const code = err?.code || '';
  const msg  = (err?.message || '').toLowerCase();
  if (code === '23505' || msg.includes('duplicate') || msg.includes('unique'))
    return 'Your profile is already registered! Details have been updated.';
  if (code === '23503')
    return 'Session expired. Please sign in again.';
  if (code === '42501' || msg.includes('permission') || msg.includes('rls'))
    return 'Permission denied. Please sign in and try again.';
  if (msg.includes('network') || msg.includes('fetch'))
    return 'Network error. Check your connection and try again.';
  return err?.message || 'Registration failed. Please try again.';
}

export default function RegistrationModal({
  eventName,
  eventCat,
  initialProfile,
  onClose,
  onSuccess,
}) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    first_name      : initialProfile?.first_name || '',
    surname         : initialProfile?.last_name || initialProfile?.surname || '',
    college_name    : initialProfile?.college_name || '',
    phone_number    : initialProfile?.phone_number || '',
    city_of_college : initialProfile?.college_city || initialProfile?.city_of_college || '',
    state_of_college: initialProfile?.college_state || initialProfile?.state_of_college || '',
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // Sync if initialProfile changes
  useEffect(() => {
    if (initialProfile) {
      setForm({
        first_name      : initialProfile.first_name || '',
        surname         : initialProfile.last_name || initialProfile.surname || '',
        college_name    : initialProfile.college_name || '',
        phone_number    : initialProfile.phone_number || '',
        city_of_college : initialProfile.college_city || initialProfile.city_of_college || '',
        state_of_college: initialProfile.college_state || initialProfile.state_of_college || '',
      });
    }
  }, [initialProfile]);

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

    if (!trimmed.first_name)       { setError('First name is required.');            return; }
    if (!trimmed.surname)          { setError('Surname is required.');               return; }
    if (!trimmed.college_name)     { setError('College name is required.');          return; }
    if (!/^[0-9]{10}$/.test(trimmed.phone_number)) { setError('Phone must be exactly 10 digits.'); return; }
    if (!trimmed.city_of_college)  { setError('City is required.');                  return; }
    if (!trimmed.state_of_college) { setError('State is required.');                 return; }

    setLoading(true);
    setError(null);

    try {
      // 1. Save or update participant profile in Supabase table with correct column names
      const savedProfile = await saveParticipantProfile(user.id, user.email, {
        first_name   : trimmed.first_name,
        last_name    : trimmed.surname,
        college_name : trimmed.college_name,
        phone_number : trimmed.phone_number,
        college_city : trimmed.city_of_college,
        college_state: trimmed.state_of_college,
      });

      // 2. If an event is selected, register user for this event
      if (eventName) {
        await addRegisteredEvent(user.id, eventName, user.user_metadata);
      }

      if (onSuccess) onSuccess(savedProfile, eventName);
    } catch (err) {
      setError(mapDbError(err));
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)',
    padding: '11px 14px 11px 40px', borderRadius: 8, color: 'white', outline: 'none',
    boxSizing: 'border-box', fontSize: 13, transition: 'border-color 0.2s, box-shadow 0.2s',
  };
  const inpRO = { ...inp, opacity: 0.6, cursor: 'not-allowed' };

  const focusInp = (e) => { e.target.style.borderColor='rgba(220,38,38,0.6)'; e.target.style.boxShadow='0 0 0 3px rgba(220,38,38,0.08)'; };
  const blurInp  = (e) => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none'; };

  const fields = [
    { label:'First Name',       field:'first_name',       icon:User,      type:'text', placeholder:'Arjun',         span:1 },
    { label:'Surname',          field:'surname',          icon:User,      type:'text', placeholder:'Sharma',        span:1 },
    { label:'College Name',     field:'college_name',      icon:Building2, type:'text', placeholder:'IGIMS, Patna',  span:2 },
    { label:'Phone Number',     field:'phone_number',      icon:Phone,     type:'tel',  placeholder:'9XXXXXXXXX',    span:1 },
    { label:'City of College',  field:'city_of_college',   icon:MapPin,    type:'text', placeholder:'Patna',         span:1 },
    { label:'State of College', field:'state_of_college',  icon:MapPin,    type:'text', placeholder:'Bihar',         span:1 },
  ];

  return (
    <div
      role="dialog" aria-modal="true" aria-label="Event Registration"
      style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px 16px' }}
    >
      {/* Backdrop */}
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(2,1,1,0.88)', backdropFilter:'blur(6px)' }} />

      {/* Modal panel */}
      <div style={{
        position:'relative', width:'100%', maxWidth:560, maxHeight:'90vh', overflowY:'auto',
        background:'linear-gradient(160deg,#190808 0%,#0A0505 100%)',
        border:'1px solid rgba(220,38,38,0.35)', borderRadius:20, padding:'36px 32px',
        boxShadow:'0 24px 80px rgba(0,0,0,0.8),0 0 80px rgba(220,38,38,0.08)',
      }}>
        {/* Glow */}
        <div style={{ position:'absolute', top:-60, right:-60, width:200, height:200, background:'rgba(220,38,38,0.1)', filter:'blur(60px)', borderRadius:'50%', pointerEvents:'none' }} />

        {/* Close */}
        <button onClick={onClose} style={{ position:'absolute', top:16, right:16, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--muted)' }}>
          <X size={14} />
        </button>

        <div style={{ marginBottom:24 }}>
          <h2 className="crx-display" style={{ fontSize:24, color:'var(--cream)', marginBottom:6 }}>
            {initialProfile ? 'UPDATE DETAILS' : 'CANDIDATE REGISTRATION'}
          </h2>
          <p style={{ color:'var(--muted)', fontSize:12, letterSpacing:0.5 }}>
            {eventName
              ? `Registering for "${eventName}". Enter your details once to register for all future events seamlessly.`
              : 'Complete your details once to register for any Cerebrexia events.'}
          </p>
        </div>

        {error && (
          <div style={{ background:'rgba(220,38,38,0.1)', border:'1px solid #DC2626', color:'#ff8f8f', padding:'10px 14px', borderRadius:8, fontSize:13, marginBottom:20 }}>
            &#9888; {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }} noValidate>
          {/* Email — read-only, pre-filled */}
          <div>
            <label style={{ display:'block', fontSize:10, textTransform:'uppercase', color:'var(--muted)', marginBottom:5, letterSpacing:1.5 }}>Email Address</label>
            <div style={{ position:'relative' }}>
              <Mail size={14} color="var(--muted)" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
              <input type="email" value={user?.email || ''} readOnly disabled style={inpRO} />
            </div>
          </div>

          {/* Dynamic fields in 2-col grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {fields.map(({ label, field, icon: Icon, type, placeholder, span }) => (
              <div key={field} style={{ gridColumn: `span ${span}` }}>
                <label style={{ display:'block', fontSize:10, textTransform:'uppercase', color:'var(--muted)', marginBottom:5, letterSpacing:1.5 }}>{label}</label>
                <div style={{ position:'relative' }}>
                  <Icon size={14} color="var(--muted)" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
                  <input
                    type={type} value={form[field]} onChange={update(field)}
                    required placeholder={placeholder}
                    maxLength={field === 'phone_number' ? 10 : undefined}
                    style={inp} onFocus={focusInp} onBlur={blurInp}
                  />
                </div>
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading} className="crx-btn gold"
            style={{ width:'100%', justifyContent:'center', marginTop:10, fontSize:13 }}>
            {loading
              ? <><Loader2 size={14} style={{ animation:'spin 1s linear infinite' }} /> SAVING...</>
              : <><CheckCircle size={14} /> CONFIRM REGISTRATION</>}
          </button>
        </form>
      </div>
    </div>
  );
}
