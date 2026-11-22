import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, CheckCircle, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getEventForms } from '../../constants/eventForms';
import { saveEventFormResponse, addRegisteredEvent, uploadEventFile } from '../../lib/eventsService';
import { payForEvent } from '../../lib/eventPayment';
import { getFeeConfig, computeFee } from '../../../api/_eventFees.js';
import DynamicEventForm, { validateForm, buildAnswers, prefillValues } from './DynamicEventForm';

// Google Form descriptions contain dead "click here ..." / "INSTA HANDLE" lines
const cleanDescription = (d = '') =>
  d.split('\n').filter((l) => l.trim() && !/click here|^insta handle$/i.test(l.trim())).join('\n');


const selStyle = {
  width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 12px',
  borderRadius: 8, color: 'white', fontSize: 13, colorScheme: 'dark', boxSizing: 'border-box',
};
const lbl = { display: 'block', fontSize: 12, color: 'var(--cream)', marginBottom: 6, fontWeight: 600 };
const range = (n) => Array.from({ length: n }, (_, i) => i + 1);

/** Entry options + live fee for the Razorpay payment step. */
function FeeBlock({ cfg, fee, selection, setSelection }) {
  const set = (k, v) => setSelection((p) => ({ ...p, [k]: v }));
  return (
    <div style={{ marginTop: 22, padding: '16px 16px 14px', borderRadius: 12, background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.3)' }}>
      <div style={{ fontSize: 12, color: '#fca5a5', letterSpacing: 1.5, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12 }}>
        Registration fee
      </div>

      {cfg.mode === 'per_head' && (
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>Number of participants</label>
          <select style={selStyle} value={selection.qty} onChange={(e) => set('qty', Number(e.target.value))}>
            {range(cfg.max).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      )}
      {cfg.mode === 'solo_group' && (
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>Entry type</label>
          <select style={selStyle} value={selection.type} onChange={(e) => set('type', e.target.value)}>
            <option value="solo">Solo - {'\u20B9'}{cfg.solo}</option>
            <option value="group">Group - {'\u20B9'}{cfg.group}</option>
          </select>
        </div>
      )}
      {cfg.mode === 'per_choice' && (
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>Number of games / events chosen ({'\u20B9'}{cfg.amount} each)</label>
          <select style={selStyle} value={selection.qty} onChange={(e) => set('qty', Number(e.target.value))}>
            {range(cfg.max).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      )}
      {cfg.mode === 'badminton' && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={lbl}>Players</label>
            <select style={selStyle} value={selection.qty} onChange={(e) => set('qty', Number(e.target.value))}>
              {range(cfg.maxPersons).map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={lbl}>Games per player</label>
            <select style={selStyle} value={selection.games} onChange={(e) => set('games', Number(e.target.value))}>
              {range(cfg.maxGames).map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
      )}
      {cfg.mode === 'photos' && (
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>Number of photographs</label>
          <select style={selStyle} value={selection.qty} onChange={(e) => set('qty', Number(e.target.value))}>
            {[1, 2, 3].map((n) => <option key={n} value={n}>{n} - {'\u20B9'}{cfg.prices[n]}</option>)}
          </select>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', color: 'var(--cream)' }}>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>{fee && !fee.error ? fee.label : ''}</span>
        <span style={{ fontSize: 22, fontWeight: 700 }}>{fee && !fee.error ? `\u20B9${fee.amount}` : '-'}</span>
      </div>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
        Pay securely with UPI / card / netbanking via Razorpay. No screenshot upload needed.
      </div>
    </div>
  );
}

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
  const [selection, setSelection] = useState({ qty: 1, games: 1, type: 'solo' });

  const current = variants.find((v) => v.slug === variantSlug) || null;
  const fields = current?.form?.fields || [];
  const feeCfg = current ? getFeeConfig(current.slug) : null;
  const fee = feeCfg ? computeFee(current.slug, selection) : null;

  // Prefill from saved profile whenever the form changes
  useEffect(() => {
    if (!current) { setValues({}); return; }
    const meta = user?.user_metadata || {};
    const fallbackName = (meta.full_name || meta.name || '').trim();
    const prof = profile || { first_name: fallbackName, last_name: '' };
    setValues(prefillValues(fields, { profile: prof, email: user?.email }));
    setError(null);
    setSelection({ qty: 1, games: 1, type: 'solo' });
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

    if (feeCfg && (!fee || fee.error)) { setError(fee?.error || 'Please choose your entry options.'); return; }

    setLoading(true);
    setError(null);
    try {
      // 1. Pay first (Razorpay). Nothing is saved unless the server verified the payment.
      let payment = null;
      if (feeCfg) {
        const meta = user?.user_metadata || {};
        payment = await payForEvent({
          slug: current.slug,
          eventName,
          selection,
          // kept server-side so the webhook can finish the registration if the tab is closed
          form: {
            categoryKey: eventKey,
            formLabel: current.label,
            formTitle: current.form.form_title,
            answers: buildAnswers(fields, values),
          },
          prefill: {
            name: [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || meta.full_name || meta.name || '',
            email: user?.email,
            contact: profile?.phone_number || '',
          },
        });
      }

      // 2. Save answers (+ payment details): if this fails the user is NOT marked registered
      const answers = buildAnswers(fields, values);
      if (payment) {
        answers.push({
          id: 'payment', label: 'Payment (Razorpay)', type: 'payment',
          value: `PAID \u20B9${payment.amount} | ${fee?.label || ''} | ${payment.payment_id}`,
        });
      }
      await saveEventFormResponse(user.id, {
        eventName,
        categoryKey: eventKey,
        formSlug: current.slug,
        formLabel: current.label,
        formTitle: current.form.form_title,
        answers,
      });
      // 3. Register the event as before
      const updated = await addRegisteredEvent(user.id, eventName, user.user_metadata, eventKey);
      if (onSuccess) onSuccess(updated, eventName);
    } catch (err) {
      if (err?.cancelled) { setError('Payment cancelled. You have not been charged.'); setLoading(false); return; }
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

          {current && feeCfg && <FeeBlock cfg={feeCfg} fee={fee} selection={selection} setSelection={setSelection} />}

          {current && (
            <button type="submit" disabled={loading} className="crx-btn gold"
              style={{ width: '100%', justifyContent: 'center', marginTop: 22, fontSize: 13 }}>
              {loading
                ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> {feeCfg ? 'PROCESSING PAYMENT...' : 'SAVING...'}</>
                : feeCfg
                  ? <><CreditCard size={14} /> PAY {fee && !fee.error ? `\u20B9${fee.amount} ` : ''}& REGISTER</>
                  : <><CheckCircle size={14} /> CONFIRM REGISTRATION</>}
            </button>
          )}
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
}
