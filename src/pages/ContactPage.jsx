import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Reveal from '../components/common/Reveal';
import Sticker from '../components/common/Sticker';
import { useIsNarrow } from '../hooks/useIsNarrow';

const inputStyle = {
  background: 'rgba(5, 8, 20, 0.75)',
  border: '1px solid rgba(56, 189, 248, 0.28)',
  borderRadius: 10,
  padding: '12px 14px',
  color: 'var(--paper)',
  fontSize: 14,
  outline: 'none',
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
};

export default function ContactPage() {
  const narrow = useIsNarrow(760);
  const [sent, setSent] = useState(false);

  return (
    <section style={{ padding: '150px 24px 100px' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <Reveal>
          <Sticker tone="gold" rotate={-2} style={{ marginBottom: 16 }}>
            Referral Desk
          </Sticker>
          <h1
            className="crx-display"
            style={{ fontSize: 'clamp(36px,7vw,72px)', color: 'var(--cream)', margin: '0 0 40px' }}
          >
            GET IN TOUCH
          </h1>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1.2fr', gap: 30 }}>
          <Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                { icon: Mail, l: 'Email', v: 'cerebrexia@igims.edu' },
                { icon: Phone, l: 'Phone', v: '+91 00000 00000' },
                { icon: MapPin, l: 'Venue', v: 'IGIMS, Sheikhpura, Patna – 800014' },
              ].map((item) => (
                <div key={item.l} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: 'linear-gradient(135deg,var(--gold),var(--gold-2))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <item.icon size={16} color="var(--ink)" />
                  </div>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 10,
                        color: 'var(--muted)',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        fontWeight: 700,
                      }}
                    >
                      {item.l}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 14, color: 'var(--paper)' }}>{item.v}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                padding: 24,
                borderRadius: 16,
                border: '1px solid rgba(56, 189, 248, 0.3)',
                background: 'linear-gradient(160deg, #0C1A3F 0%, #060B1E 100%)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
              }}
            >
              {sent ? (
                <p style={{ color: 'var(--gold)', fontSize: 14, textAlign: 'center', padding: '30px 0' }}>
                  Message sent — we'll respond soon.
                </p>
              ) : (
                <>
                  <input required placeholder="Your name" style={inputStyle} />
                  <input required type="email" placeholder="Your email" style={inputStyle} />
                  <textarea required placeholder="Your message" rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
                  <button type="submit" className="crx-btn gold" style={{ justifyContent: 'center' }}>
                    Send Message <Send size={14} />
                  </button>
                </>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
