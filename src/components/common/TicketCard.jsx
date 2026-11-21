import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Mail, CheckCircle2, Ticket, ShieldCheck, RefreshCw } from 'lucide-react';
import Sticker from './Sticker';
import { dispatchTicketEmail } from '../../lib/ticketService';

export default function TicketCard({ ticket }) {
  const [qrUrl, setQrUrl] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);

  useEffect(() => {
    if (!ticket?.qr_token) return;
    QRCode.toDataURL(ticket.qr_token, {
      width: 280,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then(setQrUrl)
      .catch((err) => console.error('[TicketCard] QR generation failed:', err));
  }, [ticket?.qr_token]);

  const handleDownload = () => {
    if (!qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `Cerebrexia26-Pass-${ticket.ticket_number}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSendEmail = async () => {
    if (!ticket?.attendee_email) return;
    setSendingEmail(true);
    setEmailStatus(null);
    try {
      const res = await dispatchTicketEmail(ticket, 1);
      if (res && res.success) {
        setEmailStatus('sent');
      } else {
        setEmailStatus('error');
      }
    } catch (_) {
      setEmailStatus('error');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, #18070d 0%, #0c0407 100%)',
        border: '1px solid rgba(212, 175, 55, 0.4)',
        borderRadius: 20,
        padding: '24px 20px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 30px rgba(212, 175, 55, 0.08)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        width: '100%',
        maxWidth: 360,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 12 }}>
        <Sticker tone="gold" rotate={-2} style={{ fontSize: 10 }}>
          {ticket.role === 'LEAD' ? 'LEAD DELEGATE' : ticket.role || 'DELEGATE'}
        </Sticker>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#22c55e',
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.35)',
            padding: '3px 8px',
            borderRadius: 12,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <CheckCircle2 size={11} /> VERIFIED PASS
        </span>
      </div>

      <h3 className="crx-display" style={{ fontSize: 20, color: '#fff', margin: '0 0 2px' }}>
        {ticket.attendee_name}
      </h3>
      <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 16px' }}>
        {ticket.attendee_college || 'Cerebrexia Delegate'}
      </p>

      {/* QR Code Container */}
      <div
        style={{
          background: '#fff',
          borderRadius: 14,
          padding: 12,
          border: '2px solid var(--crx-gold, #D4AF37)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          marginBottom: 12,
        }}
      >
        {qrUrl ? (
          <img
            src={qrUrl}
            alt={`QR code for ${ticket.ticket_number}`}
            style={{ width: 180, height: 180, display: 'block' }}
          />
        ) : (
          <div style={{ width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 12 }}>
            Generating QR...
          </div>
        )}
      </div>

      <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 800, color: 'var(--crx-gold, #D4AF37)', letterSpacing: 1, marginBottom: 8 }}>
        {ticket.ticket_number}
      </div>

      <p style={{ fontSize: 11, color: 'var(--muted)', margin: '0 0 16px', lineHeight: 1.5 }}>
        Valid 17, 18, 19, 20 Dec 2026<br />
        <strong style={{ color: '#fff' }}>1 Scan Allowed Per Day</strong>
      </p>

      <div style={{ display: 'flex', gap: 8, width: '100%' }}>
        <button
          onClick={handleDownload}
          className="crx-btn gold"
          style={{ flex: 1, justifyContent: 'center', fontSize: 11, padding: '8px 12px' }}
        >
          <Download size={13} /> Save QR
        </button>
        {ticket.attendee_email && (
          <button
            onClick={handleSendEmail}
            disabled={sendingEmail}
            className="crx-btn"
            style={{
              flex: 1,
              justifyContent: 'center',
              fontSize: 11,
              padding: '8px 12px',
              background: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: 'var(--crx-gold, #D4AF37)',
            }}
          >
            <Mail size={13} /> {sendingEmail ? 'Sending...' : 'Email QR'}
          </button>
        )}
      </div>

      {emailStatus === 'sent' && (
        <span style={{ fontSize: 11, color: '#22c55e', marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <CheckCircle2 size={12} /> QR Pass sent to {ticket.attendee_email}!
        </span>
      )}
      {emailStatus === 'error' && (
        <span style={{ fontSize: 11, color: '#ef4444', marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          Could not send email. Try again.
        </span>
      )}
      {emailStatus === null && ticket.attendee_email && (
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Mail size={10} /> Sent to {ticket.attendee_email}
        </span>
      )}
    </div>
  );
}
