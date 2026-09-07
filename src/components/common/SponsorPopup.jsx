import React from 'react';
import { X } from 'lucide-react';
import sponsorDiarchGo from '../../assets/sponsor-diarchgo.png';
import Sticker from './Sticker';

export default function SponsorPopup({ onClose }) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#020101',
      zIndex: 99999,
    }}>
      <div style={{
        position: 'relative',
        width: '90%',
        maxWidth: 500,
        background: 'rgba(16, 9, 14, 0.95)',
        border: '1px solid rgba(220, 38, 38, 0.3)',
        borderRadius: 24,
        padding: '50px 30px',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(220, 38, 38, 0.1)',
        backdropFilter: 'blur(20px)',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'transparent',
            border: 'none',
            color: 'var(--muted)',
            cursor: 'pointer',
            padding: 4,
          }}
        >
          <X size={24} />
        </button>

        <Sticker tone="gold" rotate={-2} style={{ margin: '0 auto 20px' }}>
          PROUDLY POWERED BY
        </Sticker>
        
        <h2 className="crx-display" style={{ fontSize: 32, color: 'var(--cream)', marginBottom: 30 }}>
          OUR SPONSOR
        </h2>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--crx-border)',
          borderRadius: 16,
          padding: 20,
          width: 200,
          height: 200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img
            src={sponsorDiarchGo}
            alt="Diarch Go"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      </div>
    </div>
  );
}
