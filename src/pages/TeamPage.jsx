import React from 'react';
import { Mail, Users } from 'lucide-react';
import { Instagram, Linkedin } from '../components/common/SocialIcons';
import Reveal from '../components/common/Reveal';
import Sticker from '../components/common/Sticker';
import { TEAM } from '../constants/teamData';
import { useIsNarrow } from '../hooks/useIsNarrow';

export default function TeamPage() {
  const narrow = useIsNarrow(700);

  return (
    <section style={{ padding: '150px 24px 100px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <Sticker tone="orange" rotate={-2} style={{ marginBottom: 16 }}>
            The Crew Behind The Crown
          </Sticker>
          <h1
            className="crx-display"
            style={{ fontSize: 'clamp(36px,7vw,72px)', color: 'var(--cream)', margin: '0 0 8px' }}
          >
            THE TEAM
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 44 }}>
            Final names &amp; photos to be added — sample layout shown
          </p>
        </Reveal>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: narrow ? '1fr 1fr' : 'repeat(auto-fit,minmax(200px,1fr))',
            gap: 20,
          }}
        >
          {TEAM.map((m, i) => (
            <Reveal key={m.role} delay={i * 0.06}>
              <div
                className="crx-idcard"
                style={{
                  background: 'linear-gradient(160deg, #0E1A3D 0%, #060B1E 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '18px 18px 14px 14px',
                  padding: '20px 16px',
                  textAlign: 'center',
                  position: 'relative',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.5)',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 6,
                    background: 'rgba(255,243,214,.2)',
                    borderRadius: 4,
                    margin: '0 auto 16px',
                  }}
                />
                <p
                  style={{
                    fontSize: 9,
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    margin: '0 0 12px',
                    fontWeight: 700,
                  }}
                >
                  Crew &middot; Cerebrexia '26
                </p>
                <div
                  style={{
                    width: 74,
                    height: 74,
                    borderRadius: '50%',
                    margin: '0 auto 12px',
                    border: '2px solid var(--gold)',
                    overflow: 'hidden',
                    background: 'rgba(255,243,214,.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Users size={26} color="var(--muted)" />
                </div>
                <p className="crx-black" style={{ fontSize: 14, color: '#fff', margin: '0 0 8px' }}>
                  {m.name}
                </p>
                <Sticker tone="gold" rotate={-1} style={{ fontSize: 9, padding: '4px 10px', marginBottom: 12 }}>
                  {m.role}
                </Sticker>
                <div
                  style={{
                    borderTop: '1px dashed rgba(255,243,214,.2)',
                    paddingTop: 10,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 12,
                  }}
                >
                  <Mail size={13} color="var(--muted)" className="crx-social" />
                  <Instagram size={13} color="var(--muted)" className="crx-social" />
                  <Linkedin size={13} color="var(--muted)" className="crx-social" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
