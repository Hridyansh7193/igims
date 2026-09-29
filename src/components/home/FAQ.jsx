import React, { useState } from 'react';
import { X } from 'lucide-react';
import Reveal from '../common/Reveal';
import { useIsNarrow } from '../../hooks/useIsNarrow';

const FAQS = [
  {
    q: 'When will CEREBREXIA take place?',
    a: 'CEREBREXIA 2026 takes place December 18–20, 2026 at IGIMS Patna. Schedule updates will be published on the official website and social-media channels.',
  },
  {
    q: 'How can I register?',
    a: 'Sign in with Google, complete your CEREBREXIA profile, confirm the participant mobile number, then build your registration with a Three-Day Delegate Pass, individual events, or both.',
  },
  {
    q: 'Is there a participation fee?',
    a: 'The optional Three-Day Delegate Pass costs ₹1,199. Individual competitions or workshops cost ₹199 or ₹299 per participant as shown, and may be selected with or without the Delegate Pass.',
  },
  {
    q: 'Can participants enter multiple events?',
    a: 'Yes, participants may register for multiple eligible events, subject to schedule availability and individual event rules.',
  },
  {
    q: 'Who can participate?',
    a: 'Participation is generally open to students currently enrolled in recognized colleges or universities. Individual events may have additional eligibility rules.',
  },
  {
    q: 'Will participants receive certificates?',
    a: 'Certificates may be issued to eligible participants and winners according to the rules of each event.',
  },
  {
    q: 'Is accommodation available?',
    a: 'A confirmed Delegate Registration makes the user eligible to apply for accommodation. Accommodation is separately charged, subject to availability and not guaranteed.',
  },
  {
    q: 'Are Pronites included with Delegate Registration?',
    a: 'Opening Night, Star Night and Pro Night are included with the Three-Day Delegate Pass. Event-only registration covers only the selected competitions or workshops and does not automatically include Pronite admission. Entry requires an active personal QR pass and valid identity card and remains subject to security checks and venue capacity.',
  },
];

function FaqCard({ index, faq, narrow }) {
  const [closed, setClosed] = useState(true);
  const num = String(index + 1).padStart(2, '0');

  return (
    <div
      style={{
        background: 'var(--navy-card)',
        border: '1px solid var(--crx-border)',
        borderRadius: 14,
        padding: narrow ? '18px 18px' : '20px 24px',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span
            className="crx-display"
            style={{ color: 'var(--gold)', fontSize: 14, letterSpacing: '0.05em', flexShrink: 0 }}
          >
            {num}
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              color: 'var(--cyan-glow)',
              fontSize: narrow ? 15 : 16.5,
              lineHeight: 1.35,
              margin: 0,
            }}
          >
            {faq.q}
          </h3>
        </div>
        <button
          onClick={() => setClosed((c) => !c)}
          aria-label={closed ? 'Expand answer' : 'Collapse answer'}
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            border: '1px solid var(--cyan)',
            background: 'transparent',
            color: 'var(--cyan-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transform: closed ? 'rotate(45deg)' : 'none',
            transition: 'transform 0.25s ease',
          }}
        >
          <X size={14} />
        </button>
      </div>

      <div
        style={{
          maxHeight: closed ? 0 : 260,
          opacity: closed ? 0 : 1,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ borderTop: '1px solid var(--crx-border)', margin: '14px 0 12px' }} />
        <p style={{ color: 'var(--crx-text-muted)', fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>
          {faq.a}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const narrow = useIsNarrow(860);

  return (
    <section
      style={{
        padding: '50px 20px 100px',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100vw',
        contain: 'paint',
      }}
    >
      <div className="section-container" style={{ maxWidth: 1180, margin: '0 auto' }}>

        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ color: 'var(--crx-gold)', fontSize: 12, letterSpacing: '0.2em', fontWeight: 600, marginBottom: 16 }}>
              FAQ
            </p>
            <h2
              className="crx-display"
              style={{ fontSize: 'clamp(32px, 5vw, 48px)', color: '#fff', lineHeight: 1.15, margin: '0 0 16px' }}
            >
              GOT QUESTIONS?<br />WE HAVE ANSWERS.
            </h2>
            <p style={{ color: 'var(--crx-text-muted)', fontSize: 15, margin: 0 }}>
              Clear answers for planning your arrival, participation and three-day experience.
            </p>
          </div>
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: narrow ? '1fr' : '1fr 1fr',
            gap: 16,
          }}
        >
          {FAQS.map((faq, i) => (
            <Reveal key={faq.q} delay={Math.min(i, 4) * 0.05}>
              <FaqCard index={i} faq={faq} narrow={narrow} />
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
