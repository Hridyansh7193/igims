import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'HOW DO I REGISTER?',
    a: 'You can register online through this website by clicking the "Register" button. Fill in your details and complete the payment process to secure your Delegate Pass.',
  },
  {
    q: 'DO I HAVE TO PAY FOR EVERY EVENT INDIVIDUALLY?',
    a: 'No, if you purchase a Delegate Pass, it covers entry to most general events and pro-nites. However, certain flagship events might have a separate registration fee.',
  },
  {
    q: 'ARE THERE ANY DISCOUNTS?',
    a: 'Early bird discounts are available for the first 200 registrations. Group registrations of 10 or more people also receive a special discount.',
  },
  {
    q: 'WHAT IF I NEED ACCOMMODATION?',
    a: 'Accommodation is provided on a first-come, first-serve basis inside the IGIMS campus. You can add accommodation to your package during the registration process.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section style={{ background: 'var(--crx-bg)', padding: '120px 20px', position: 'relative' }}>
      <div className="section-container" style={{ maxWidth: 800 }}>
        
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{ color: 'var(--crx-gold)', fontSize: 12, letterSpacing: '0.2em', fontWeight: 600, marginBottom: 16 }}>
            FAQ
          </p>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', color: '#fff', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>
            GOT QUESTIONS?<br />WE HAVE ANSWERS.
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                style={{
                  background: '#111',
                  border: '1px solid var(--crx-border)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    padding: '24px 32px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: '#fff',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '0.05em' }}>
                    {faq.q}
                  </span>
                  <ChevronDown 
                    size={20} 
                    color="var(--crx-gold)" 
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} 
                  />
                </button>
                
                <div style={{
                  maxHeight: isOpen ? 200 : 0,
                  opacity: isOpen ? 1 : 0,
                  transition: 'all 0.3s ease',
                  padding: isOpen ? '0 32px 24px' : '0 32px 0',
                }}>
                  <p style={{ color: 'var(--crx-text-muted)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
