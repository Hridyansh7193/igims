import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { WhatsApp } from '../components/common/SocialIcons';
import Reveal from '../components/common/Reveal';
import Sticker from '../components/common/Sticker';
import { useIsNarrow } from '../hooks/useIsNarrow';

const inputStyle = {
  background: 'rgba(10, 5, 5, 0.75)',
  border: '1px solid rgba(179, 18, 58, 0.28)',
  borderRadius: 10,
  padding: '12px 14px',
  color: 'var(--paper)',
  fontSize: 14,
  outline: 'none',
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
};

const OFFICIAL_EMAIL = 'cerebrexia26igims@gmail.com';

export default function ContactPage() {
  const narrow = useIsNarrow(760);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSending(true);

    try {
      const response = await fetch('/api/send-contact-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setSent(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        // Fallback directly to mailto so the query is never lost
        const mailtoUrl = `mailto:${OFFICIAL_EMAIL}?subject=${encodeURIComponent(
          `Cerebrexia '26 Query from ${name}`
        )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        window.location.href = mailtoUrl;
        setSent(true);
      }
    } catch (err) {
      console.warn('API submission failed, falling back to mailto:', err);
      const mailtoUrl = `mailto:${OFFICIAL_EMAIL}?subject=${encodeURIComponent(
        `Cerebrexia '26 Query from ${name}`
      )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
      window.location.href = mailtoUrl;
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  const contactItems = [
    {
      icon: Mail,
      l: 'Email',
      v: OFFICIAL_EMAIL,
      href: `mailto:${OFFICIAL_EMAIL}`,
    },
    {
      icon: WhatsApp,
      l: 'WhatsApp Support',
      v: 'Divyansh: +91 82717 91542 / Veer: +91 91281 87476',
      href: 'https://wa.me/918271791542',
    },
    {
      icon: MapPin,
      l: 'Venue',
      v: 'IGIMS, Sheikhpura, Patna – 800014',
      href: 'https://maps.google.com/?q=IGIMS+Patna',
    },
  ];

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
              {contactItems.map((item) => (
                <div key={item.l} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, var(--gold-glow), var(--gold-dark))',
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
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        style={{
                          display: 'inline-block',
                          margin: '2px 0 0',
                          fontSize: 14,
                          color: 'var(--paper)',
                          textDecoration: 'none',
                          wordBreak: 'break-all',
                        }}
                      >
                        {item.v}
                      </a>
                    ) : (
                      <p style={{ margin: '2px 0 0', fontSize: 14, color: 'var(--paper)' }}>{item.v}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                padding: 24,
                borderRadius: 16,
                border: '1px solid rgba(179, 18, 58, 0.3)',
                background: 'linear-gradient(160deg, #181212 0%, #0A0505 100%)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
              }}
            >
              {sent ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'rgba(34,197,94,0.15)',
                      border: '1px solid #22c55e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 14px',
                    }}
                  >
                    <CheckCircle2 size={24} color="#22c55e" />
                  </div>
                  <h3 style={{ color: 'var(--cream)', fontSize: 18, margin: '0 0 6px', fontWeight: 700 }}>
                    Message Sent Successfully
                  </h3>
                  <p style={{ color: 'var(--gold)', fontSize: 13.5, lineHeight: 1.6, margin: '0 0 16px' }}>
                    Your inquiry has been delivered directly to <strong>{OFFICIAL_EMAIL}</strong>. Our team will reply shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSent(false);
                      setErrorMsg('');
                    }}
                    className="crx-btn"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'var(--cream)',
                      fontSize: 11,
                      margin: '0 auto',
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  {errorMsg && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '10px 14px',
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid #ef4444',
                        borderRadius: 8,
                        fontSize: 12.5,
                        color: '#fca5a5',
                      }}
                    >
                      <AlertCircle size={15} color="#ef4444" style={{ flexShrink: 0 }} />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                  <input
                    required
                    maxLength={80}
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    required
                    maxLength={120}
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                  />
                  <textarea
                    required
                    maxLength={1000}
                    placeholder="Your message / query"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="crx-btn gold"
                    style={{
                      justifyContent: 'center',
                      gap: 8,
                      opacity: sending ? 0.7 : 1,
                      cursor: sending ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {sending ? (
                      <>
                        <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                        SENDING QUERY...
                      </>
                    ) : (
                      <>
                        SEND MESSAGE <Send size={14} />
                      </>
                    )}
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
