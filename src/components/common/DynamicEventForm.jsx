import React from 'react';

/**
 * Renders a scraped Google-Form definition (see scripts/scrape-forms.mjs).
 * Fully controlled: parent owns `values` ({ [fieldId]: value }).
 *   - checkbox values are arrays, grid values are { [row]: column }, others strings
 *   - file_upload questions upload to Supabase Storage (value = 'upload:<path>'), with a pasted-link fallback
 */

export const fieldId = (i) => `q${i}`;

const OTHER = '__other__';

const inp = {
  width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)',
  padding: '11px 14px', borderRadius: 8, color: 'white', outline: 'none',
  boxSizing: 'border-box', fontSize: 13, fontFamily: 'inherit',
};
const labelStyle = { display: 'block', fontSize: 12, color: 'var(--cream)', marginBottom: 6, lineHeight: 1.45, fontWeight: 600 };
const helpStyle = { fontSize: 11, color: 'var(--muted)', marginBottom: 8, lineHeight: 1.5, whiteSpace: 'pre-wrap' };
const optRow = { display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--cream)', marginBottom: 7, cursor: 'pointer', lineHeight: 1.4 };

const focusInp = (e) => { e.target.style.borderColor = 'rgba(220,38,38,0.6)'; };
const blurInp = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; };

const isEmpty = (f, v) => {
  if (f.type === 'checkbox') return !Array.isArray(v) || v.length === 0;
  if (f.type === 'grid') {
    const rows = f.rows || [];
    return rows.some((r) => !v || !v[r]);
  }
  return v == null || String(v).trim() === '';
};

/** Returns an error string or null. */
export function validateForm(fields, values) {
  for (let i = 0; i < fields.length; i++) {
    const f = fields[i];
    if (f.type === 'section' || f.type === 'info') continue;
    const v = values[fieldId(i)];
    if (f.required && isEmpty(f, v)) return `"${f.label}" is required.`;
    if (f.type === 'file_upload' && v && String(v).trim() && !String(v).startsWith(UPLOAD_PREFIX) && !/^https?:\/\/\S+$/i.test(String(v).trim())) {
      return `"${f.label}": upload a file or paste a valid link (http:// or https://).`;
    }
    if ((f.type === 'radio' || f.type === 'dropdown') && v === OTHER) {
      return `Please type your answer for "${f.label}" (Other).`;
    }
    if (f.type === 'checkbox' && Array.isArray(v) && v.includes(OTHER)) {
      return `Please type your answer for "${f.label}" (Other).`;
    }
  }
  return null;
}

/** Converts values into a readable snapshot to store in Supabase. */
export function buildAnswers(fields, values) {
  const out = [];
  fields.forEach((f, i) => {
    if (f.type === 'section' || f.type === 'info') return;
    let v = values[fieldId(i)];
    if (v == null || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0)) v = null;
    if (typeof v === 'string') v = v.trim();
    out.push({ id: fieldId(i), label: f.label, type: f.type, value: v });
  });
  return out;
}

/** Best-effort prefill of common questions from the saved profile. */
export function prefillValues(fields, { profile, email }) {
  const values = {};
  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ');
  fields.forEach((f, i) => {
    if (f.type !== 'short_text') return;
    const l = (f.label || '').toLowerCase().trim();
    if (/partner|teammate|member/.test(l)) return; // never prefill someone else's details
    let v = '';
    if (/e-?mail/.test(l)) v = email || '';
    else if (/(phone|mobile|whats ?app|contact)/.test(l)) v = profile?.phone_number || '';
    else if (/(college|institution|institute|university)/.test(l) && !/(year|batch|course|id\b|roll)/.test(l)) v = profile?.college_name || '';
    else if (/^(city)\s*$/.test(l)) v = profile?.college_city || '';
    else if (/^(state)\s*$/.test(l)) v = profile?.college_state || '';
    else if (/^(your |full |participant'?s? )?name\s*(\/.*)?$/.test(l) || /^your name/.test(l) || /^name of (the )?(captain|participant|igl)\b/.test(l)) v = fullName;
    if (v) values[fieldId(i)] = v;
  });
  return values;
}

function Other({ value, onChange }) {
  return (
    <input
      type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Type your answer"
      style={{ ...inp, marginTop: 4, marginBottom: 6, padding: '8px 12px' }} onFocus={focusInp} onBlur={blurInp}
    />
  );
}

const UPLOAD_PREFIX = 'upload:';
const MAX_MB = 5;

function FileField({ value, onChange, onUpload, label }) {
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');
  const uploaded = typeof value === 'string' && value.startsWith(UPLOAD_PREFIX);
  const shownName = uploaded ? value.split('/').pop().replace(/^\d+_/, '') : '';

  const pick = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    setErr('');
    if (file.size > MAX_MB * 1024 * 1024) { setErr(`File is too big. Max ${MAX_MB} MB.`); return; }
    if (!/^(image\/|application\/pdf)/.test(file.type)) { setErr('Only images or PDF are allowed.'); return; }
    if (!onUpload) { setErr('Upload is not available. Paste a link instead.'); return; }
    setBusy(true);
    try {
      const path = await onUpload(file, label);
      onChange(UPLOAD_PREFIX + path);
    } catch (ex) {
      console.error('[upload]', ex);
      setErr('Upload failed. Try again, or paste a Google Drive link below.');
    } finally { setBusy(false); }
  };

  return (
    <div>
      <label style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 8,
        cursor: busy ? 'wait' : 'pointer', fontSize: 13, color: 'white',
        background: 'rgba(0,0,0,0.5)', border: '1px dashed rgba(255,255,255,0.3)',
      }}>
        {busy ? 'Uploading...' : uploaded ? 'Change file' : 'Choose file (image / PDF)'}
        <input type="file" accept="image/*,application/pdf" onChange={pick} disabled={busy} style={{ display: 'none' }} />
      </label>
      {uploaded && <span style={{ marginLeft: 10, fontSize: 12, color: '#86efac' }}>&#10003; {shownName}</span>}
      {err && <div style={{ fontSize: 12, color: '#fca5a5', marginTop: 6 }}>{err}</div>}
      {!uploaded && (
        <input
          type="url" value={typeof value === 'string' ? value : ''} onChange={(e) => onChange(e.target.value)}
          placeholder="or paste a Google Drive link (Anyone with the link)"
          style={{ ...inp, marginTop: 8, padding: '8px 12px', fontSize: 12 }} onFocus={focusInp} onBlur={blurInp}
        />
      )}
      {uploaded && (
        <button type="button" onClick={() => onChange('')}
          style={{ display: 'block', marginTop: 6, background: 'none', border: 'none', color: 'var(--muted)', fontSize: 11, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
          Remove file
        </button>
      )}
    </div>
  );
}

function Field({ f, id, value, onChange, onUpload }) {
  const opts = f.options || [];

  switch (f.type) {
    case 'short_text':
      return <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} style={inp} onFocus={focusInp} onBlur={blurInp} maxLength={500} />;

    case 'paragraph':
      return <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} rows={4} style={{ ...inp, resize: 'vertical' }} onFocus={focusInp} onBlur={blurInp} maxLength={4000} />;

    case 'date':
      return <input type="date" value={value || ''} onChange={(e) => onChange(e.target.value)} style={{ ...inp, colorScheme: 'dark' }} onFocus={focusInp} onBlur={blurInp} />;

    case 'time':
      return <input type="time" value={value || ''} onChange={(e) => onChange(e.target.value)} style={{ ...inp, colorScheme: 'dark' }} onFocus={focusInp} onBlur={blurInp} />;

    case 'file_upload':
      return <FileField value={value} onChange={onChange} onUpload={onUpload} label={f.label} />;

    case 'dropdown': {
      const isOtherSel = value === OTHER || (typeof value === 'string' && value.startsWith('Other: '));
      return (
        <>
          <select
            value={isOtherSel ? OTHER : (value || '')}
            onChange={(e) => onChange(e.target.value)}
            style={{ ...inp, colorScheme: 'dark' }} onFocus={focusInp} onBlur={blurInp}
          >
            <option value="">Choose</option>
            {opts.map((o) => <option key={o} value={o}>{o}</option>)}
            {f.allow_other && <option value={OTHER}>Other</option>}
          </select>
          {isOtherSel && <Other value={value === OTHER ? '' : value.slice(7)} onChange={(t) => onChange(t ? `Other: ${t}` : OTHER)} />}
        </>
      );
    }

    case 'radio': {
      const isOtherSel = value === OTHER || (typeof value === 'string' && value.startsWith('Other: '));
      return (
        <div>
          {opts.map((o) => (
            <label key={o} style={optRow}>
              <input type="radio" name={id} checked={value === o} onChange={() => onChange(o)} style={{ marginTop: 3, accentColor: '#DC2626' }} />
              <span>{o}</span>
            </label>
          ))}
          {f.allow_other && (
            <>
              <label style={optRow}>
                <input type="radio" name={id} checked={isOtherSel} onChange={() => onChange(OTHER)} style={{ marginTop: 3, accentColor: '#DC2626' }} />
                <span>Other</span>
              </label>
              {isOtherSel && <Other value={value === OTHER ? '' : value.slice(7)} onChange={(t) => onChange(t ? `Other: ${t}` : OTHER)} />}
            </>
          )}
        </div>
      );
    }

    case 'checkbox': {
      const arr = Array.isArray(value) ? value : [];
      const otherEntry = arr.find((x) => x === OTHER || x.startsWith('Other: '));
      const toggle = (o) => onChange(arr.includes(o) ? arr.filter((x) => x !== o) : [...arr, o]);
      return (
        <div>
          {opts.map((o) => (
            <label key={o} style={optRow}>
              <input type="checkbox" checked={arr.includes(o)} onChange={() => toggle(o)} style={{ marginTop: 3, accentColor: '#DC2626' }} />
              <span>{o}</span>
            </label>
          ))}
          {f.allow_other && (
            <>
              <label style={optRow}>
                <input
                  type="checkbox" checked={!!otherEntry}
                  onChange={() => onChange(otherEntry ? arr.filter((x) => x !== otherEntry) : [...arr, OTHER])}
                  style={{ marginTop: 3, accentColor: '#DC2626' }}
                />
                <span>Other</span>
              </label>
              {otherEntry && (
                <Other
                  value={otherEntry === OTHER ? '' : otherEntry.slice(7)}
                  onChange={(t) => onChange(arr.map((x) => (x === otherEntry ? (t ? `Other: ${t}` : OTHER) : x)))}
                />
              )}
            </>
          )}
        </div>
      );
    }

    case 'scale': {
      const [lo, hi] = f.scale_labels || [];
      return (
        <div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {lo && <span style={{ fontSize: 11, color: 'var(--muted)' }}>{lo}</span>}
            {opts.map((o) => (
              <button
                type="button" key={o} onClick={() => onChange(o)}
                style={{
                  minWidth: 38, padding: '8px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 13,
                  background: value === o ? '#DC2626' : 'rgba(0,0,0,0.5)', color: 'white',
                  border: `1px solid ${value === o ? '#DC2626' : 'rgba(255,255,255,0.15)'}`,
                }}
              >{o}</button>
            ))}
            {hi && <span style={{ fontSize: 11, color: 'var(--muted)' }}>{hi}</span>}
          </div>
        </div>
      );
    }

    case 'grid': {
      const v = value && typeof value === 'object' ? value : {};
      return (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', fontSize: 12, color: 'var(--cream)', minWidth: '100%' }}>
            <thead>
              <tr>
                <th />
                {(f.columns || []).map((c) => <th key={c} style={{ padding: '4px 8px', fontWeight: 600, textAlign: 'center' }}>{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {(f.rows || []).map((r) => (
                <tr key={r}>
                  <td style={{ padding: '6px 8px 6px 0' }}>{r}</td>
                  {(f.columns || []).map((c) => (
                    <td key={c} style={{ textAlign: 'center' }}>
                      <input type="radio" name={`${id}-${r}`} checked={v[r] === c} onChange={() => onChange({ ...v, [r]: c })} style={{ accentColor: '#DC2626' }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    default:
      // Unknown question type: plain text so the answer is not lost
      return <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} style={inp} onFocus={focusInp} onBlur={blurInp} />;
  }
}

export default function DynamicEventForm({ fields, values, onChange, onUpload }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {fields.map((f, i) => {
        const id = fieldId(i);

        if (f.type === 'section') {
          return (
            <div key={id} style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
              <h3 style={{ margin: 0, fontSize: 12, color: '#fca5a5', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700 }}>{f.label}</h3>
              {f.help && <div style={{ ...helpStyle, marginTop: 6, marginBottom: 0 }}>{f.help}</div>}
            </div>
          );
        }
        if (f.type === 'info') {
          return (
            <div key={id}>
              {f.label && <div style={{ fontSize: 13, color: 'var(--cream)', fontWeight: 600 }}>{f.label}</div>}
              {f.help && <div style={{ ...helpStyle, marginTop: 4, marginBottom: 0 }}>{f.help}</div>}
            </div>
          );
        }

        return (
          <div key={id}>
            <label style={labelStyle}>
              {f.label}{f.required && <span style={{ color: '#f87171' }}> *</span>}
            </label>
            {f.help && <div style={helpStyle}>{f.help}</div>}
            <Field f={f} id={id} value={values[id]} onChange={(v) => onChange(id, v)} onUpload={onUpload} />
          </div>
        );
      })}
    </div>
  );
}
