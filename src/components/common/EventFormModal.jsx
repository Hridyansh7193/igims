import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getEventForms } from '../../constants/eventForms';
import { saveEventFormResponse, addRegisteredEvent, uploadEventFile } from '../../lib/eventsService';
import DynamicEventForm, { validateForm, buildAnswers, prefillValues } from './DynamicEventForm';

// Google Form descriptions contain dead "click here ..." / "INSTA HANDLE" lines
const cleanDescription = (d = '') =>
  d.split('\n').filter((l) => l.trim() && !/click here|^insta handle$/i.test(l.trim())).join('\n');

/**
 * Event-specific registration form (questions come from the college's Google Forms).
 * Answers are stored in Supabase `event_form_responses`; the event is then
 * registered exactly like before (sports_registrations / cultural_registrations).
 */
export default function EventFormModal({ eventName, eventKey, profile, onClose, onSuccess }) {
  const { user } = useAuth();
  const variants = useMemo(() => getEventForms(eventName), [eventName]);

  const [variantSlug, setVariantSlug] = useState(variants.length === 1 ? variants[0].slug : '');
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const current = variants.find((v) => v.slug === variantSlug) || null;
  const fields = current?.form?.fields || [];

  // Prefill from saved profile whenever the form changes
  useEffect(() => {
    if (!current) { setValues({}); return; }
    setValues(prefillValues(fields, { profile, email: user?.email }));
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variantSlug]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!current) { setError('Please choose a category first.'); return; }
    const problem = validateForm(fields, values);
    if (problem) { setError(problem); return; }

    setLoading(true);
    setError(null);
    try {
      // 1. Save answers first: if this fails the user is NOT marked registered
      await saveEventFormResponse(user.id, {
        eventName,
        categoryKey: eventKey,
        formSlug: current.slug,
        formLabel: current.label,
        formTitle: current.form.form_title,
        answers: buildAnswers(fields, values),
      });
      // 2. Register the event as before
      const updated = await addRegisteredEvent(user.id, eventName, user.user_metadata, eventKey);
      if (onSuccess) onSuccess(updated, eventName);
    } catch (err) {
      console.error('[EventFormModal] submit error:', err);
      const msg = (err?.message || '').toLowerCase();
      if (msg.includes('bucket not found') || msg.includes('event-uploads')) {
        setError('File upload storage is not set up yet. Please contact the organisers.');
      } else if (err?.code === '42P01' || msg.includes('event_form_responses')) {
        setError('Registration storage is not set up yet. Please contact the organisers.');
      } else if (err?.code === '42501' || msg.includes('row-level security')) {
        setError('Permission denied. Please sign in again and retry.');
      } else if (msg.includes('network') || msg.includes('fetch')) {
        setError('Network error. Check your connection and try again.');
      } else {
        setError(err?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div role="dialog" aria-modal="true" aria-label="Event Registration"
      style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(2,1,1,0.88)', backdropFilter: 'blur(8px)' }} />

      <div style={{
        position: 'relative', width: '100%', maxWidth: 620, maxHeight: '90vh', overflowY: 'auto',
        background: 'linear-gradient(160deg,#190808 0%,#0A0505 100%)',
        border: '1px solid rgba(220,38,38,0.35)', borderRadius: 20, padding: '32px 28px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.9),0 0 80px rgba(220,38,38,0.12)', zIndex: 1,
      }}>
        <button onClick={onClose} aria-label="Close"
          style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--muted)' }}>
          <X size={14} />
        </button>

        <div style={{ marginBottom: 20, paddingRight: 36 }}>
          <h2 className="crx-display" style={{ fontSize: 22, color: 'var(--cream)', marginBottom: 6 }}>
            REGISTER: {eventName.replace(/^[^A-Za-z0-9]+/, '').toUpperCase()}
          </h2>
          {cleanDescription(current?.form?.description) && (
            <p style={{ color: 'var(--muted)', fontSize: 12, lineHeight: 1.55, whiteSpace: 'pre-wrap', margin: 0 }}>
              {cleanDescription(current.form.description)}
            </p>
          )}
        </div>

        {error && (
          <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid #DC2626', color: '#ff8f8f', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 18 }}>
            &#9888; {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {variants.length > 1 && (
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--cream)', marginBottom: 6, fontWeight: 600 }}>
                Choose category <span style={{ color: '#f87171' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {variants.map((v) => (
                  <button type="button" key={v.slug} onClick={() => setVariantSlug(v.slug)}
                    style={{
                      padding: '9px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: 'white',
                      background: variantSlug === v.slug ? '#DC2626' : 'rgba(0,0,0,0.5)',
                      border: `1px solid ${variantSlug === v.slug ? '#DC2626' : 'rgba(255,255,255,0.15)'}`,
                    }}>{v.label}</button>
                ))}
              </div>
            </div>
          )}

          {current && (
            <DynamicEventForm
              fields={fields}
              values={values}
              onChange={(id, v) => setValues((prev) => ({ ...prev, [id]: v }))}
              onUpload={(file) => uploadEventFile(user.id, eventName, file)}
            />
          )}

          {current && (
            <button type="submit" disabled={loading} className="crx-btn gold"
              style={{ width: '100%', justifyContent: 'center', marginTop: 22, fontSize: 13 }}>
              {loading
                ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> SAVING...</>
                : <><CheckCircle size={14} /> CONFIRM REGISTRATION</>}
            </button>
          )}
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
}
