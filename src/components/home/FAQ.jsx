import React, { useState } from 'react';
import { X } from 'lucide-react';
import Reveal from '../common/Reveal';
import Sticker from '../common/Sticker';
import { useIsNarrow } from '../../hooks/useIsNarrow';

const FAQS = [
  {
    q: 'When will CEREBREXIA take place?',
    a: 'CEREBREXIA 2026 takes place December 18–20, 2026 at IGIMS Patna. Schedule updates will be published on the official website and social-media channels.',
  },
  {
    q: 'How can I register?',
    a: 'Sign in with Google, complete your CEREBREXIA profile, confirm the participant mobile number, then build your registration with Basic Registration (BR), individual events, or both.',
  },
  {
    q: 'Is there a participation fee?',
    a: 'Basic Registration (BR) costs ₹2,000. Individual competitions or workshops may be selected alongside or with Basic Registration (BR).',
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
    q: 'Are Pronites included with Basic Registration (BR)?',
    a: 'Opening Night, Star Night and Pro Night are included with Basic Registration (BR). Event-only registration covers only the selected competitions or workshops and does not automatically include Pronite admission. Entry requires an active personal QR credential and valid identity card and remains subject to security checks and venue capacity.',
  },
];

function FaqCard({ index, faq, narrow }) {
  const [closed, setClosed] = useState(true);
  const num = String(index + 1).padStart(2, '0');

  return (
    <div
      style={{
        background: 'var(--crx-card)',
        border: '1px solid var(--crx-hairline)',
        borderRadius: 12,
        padding: narrow ? '16px' : '20px',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span
            style={{
              color: 'var(--crx-gold)',
              fontSize: 13,
              fontFamily: "'Space Grotesk', sans-serif",
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {num}
          </span>
          <h3
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              color: 'var(--crx-text-primary)',
              fontSize: narrow ? 14.5 : 15.5,
              lineHeight: 1.4,
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
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: '1px solid var(--crx-hairline)',
            background: 'var(--crx-surface)',
            color: 'var(--crx-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transform: closed ? 'rotate(45deg)' : 'none',
            transition: 'transform 160ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <X size={13} />
        </button>
      </div>

      <div
        style={{
          maxHeight: closed ? 0 : 260,
          opacity: closed ? 0 : 1,
          overflow: 'hidden',
          transition: 'all 200ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div style={{ borderTop: '1px solid var(--crx-hairline)', margin: '12px 0 10px' }} />
        <p style={{ color: 'var(--crx-text-secondary)', fontSize: 13, lineHeight: 1.6, margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
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
        padding: '64px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100vw',
        contain: 'paint',
      }}
    >
      <div className="section-container" style={{ maxWidth: 1040, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <Sticker tone="gold" rotate={0} style={{ marginBottom: 12 }}>
              Frequently Asked Questions
            </Sticker>
            <h2
              className="crx-display"
              style={{
                fontSize: 'clamp(28px, 5vw, 42px)',
                color: 'var(--crx-text-primary)',
                lineHeight: 1.15,
                margin: '0 0 12px',
                fontWeight: 400,
                letterSpacing: '0.5px',
              }}
            >
              GOT QUESTIONS? WE HAVE ANSWERS.
            </h2>
            <p style={{ color: 'var(--crx-text-secondary)', fontSize: 14, margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
              Answers for planning your arrival, credentials, and competition schedule.
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
            <Reveal key={faq.q} delay={Math.min(i, 4) * 0.04}>
              <FaqCard index={i} faq={faq} narrow={narrow} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
