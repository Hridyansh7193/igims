import React from 'react';
import { CATEGORIES } from '../../constants/eventsData';
import { ArrowRight } from 'lucide-react';

export default function FeaturedEvents({ setPage }) {
  // Take the first 5 events from Cultural and Sports as a preview
  const previewEvents = [
    ...CATEGORIES.find((c) => c.key === 'cultural').events.slice(0, 3).map(e => ({ name: e, category: 'Cultural' })),
    ...CATEGORIES.find((c) => c.key === 'sports').events.slice(0, 3).map(e => ({ name: e, category: 'Sports' })),
  ];

  return (
    <section style={{ background: 'var(--crx-bg)', padding: '120px 20px', position: 'relative' }}>
      <div className="section-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        
        {/* Left Side: Featured Image & Title */}
        <div>
          <p style={{ color: 'var(--crx-gold)', fontSize: 12, letterSpacing: '0.2em', fontWeight: 600, marginBottom: 16 }}>
            EXPLORE THE EVENTS
          </p>
          <h2 style={{ fontSize: 'clamp(40px, 6vw, 72px)', color: '#fff', lineHeight: 1.05, marginBottom: 32 }}>
            THE <br/>
            LINE-UP.
          </h2>
          <div style={{ position: 'relative', height: 400, borderRadius: 16, overflow: 'hidden' }}>
            <img 
              src="/dance.jpg" 
              alt="Featured Event" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.2) contrast(1.1)' }} 
            />
            <div style={{ position: 'absolute', bottom: 20, left: 20, background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: 100, backdropFilter: 'blur(10px)' }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em' }}>FEATURED: VENUST</span>
            </div>
          </div>
        </div>

        {/* Right Side: Event List Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 60 }}>
          {previewEvents.map((event, i) => (
            <div 
              key={i} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingBottom: 24,
                borderBottom: '1px solid var(--crx-border)',
                cursor: 'pointer',
              }}
              className="crx-social"
            >
              <div>
                <h4 style={{ color: '#fff', fontSize: 22, marginBottom: 6, fontFamily: 'var(--font-serif)', letterSpacing: '0.02em' }}>
                  {event.name}
                </h4>
                <p style={{ color: 'var(--crx-text-muted)', fontSize: 12, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {event.category}
                </p>
              </div>
              <ArrowRight size={20} color="var(--crx-gold)" />
            </div>
          ))}

          <button 
            className="crx-btn-outline" 
            style={{ alignSelf: 'flex-start', marginTop: 20 }}
            onClick={() => setPage('events')}
          >
            VIEW ALL 70+ EVENTS
          </button>
        </div>

      </div>
      <div className="section-divider" style={{ marginTop: 80 }} />
    </section>
  );
}
