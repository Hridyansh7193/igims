import React, { useState, useEffect, useCallback } from 'react';
import Reveal from '../components/common/Reveal';
import Sticker from '../components/common/Sticker';
import RegistrationModal from '../components/common/RegistrationModal';
import QuickRegisterModal from '../components/common/QuickRegisterModal';
import { CATEGORIES, TOTAL_EVENTS } from '../constants/eventsData';
import { useIsNarrow } from '../hooks/useIsNarrow';
import { useAuth } from '../context/AuthContext';
import { fetchParticipantProfile, getRegisteredEvents, addRegisteredEvent } from '../lib/eventsService';
import { CheckCircle2, Check, ArrowRight, Sparkles } from 'lucide-react';

export default function EventsPage({ setPage }) {
  const [activeCat, setActiveCat] = useState('all');
  const narrow = useIsNarrow(700);
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(false);

  // Modal states
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showQuickModal, setShowQuickModal] = useState(false);
  const [showFullModal, setShowFullModal] = useState(false);

  // Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (title, text, type = 'success') => {
    setToast({ title, text, type });
    setTimeout(() => {
      setToast(prev => (prev?.title === title ? null : prev));
    }, 4500);
  };

  // Sync profile and registered events
  const loadUserData = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setRegisteredEvents([]);
      return;
    }
    setLoadingInitial(true);
    try {
      const p = await fetchParticipantProfile(user.id);
      setProfile(p);
      const evs = getRegisteredEvents(user.id, user.user_metadata);
      setRegisteredEvents(evs);
    } catch (err) {
      console.error('[EventsPage] loadUserData error:', err);
    } finally {
      setLoadingInitial(false);
    }
  }, [user]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Listen to cross-component event updates
  useEffect(() => {
    const handleEventsUpdated = (e) => {
      if (e?.detail?.events) {
        setRegisteredEvents(e.detail.events);
      }
    };
    window.addEventListener('crx_events_updated', handleEventsUpdated);
    return () => window.removeEventListener('crx_events_updated', handleEventsUpdated);
  }, []);

  const handleCardClick = (ev) => {
    if (!user) {
      if (setPage) setPage('dashboard');
      return;
    }

    const isAlready = registeredEvents.includes(ev.name);
    if (isAlready) {
      showToast(
        'Already Registered',
        `You have already secured your spot for ${ev.name}. View your Command Center.`,
        'info'
      );
      return;
    }

    setSelectedEvent(ev);

    // If candidate has already entered their details once, use the 1-click Quick Register modal
    if (profile) {
      setShowQuickModal(true);
    } else {
      setShowFullModal(true);
    }
  };

  // 1-Click registration confirmation
  const handleQuickRegisterConfirm = async (eventName) => {
    try {
      const updated = await addRegisteredEvent(user.id, eventName, user.user_metadata);
      setRegisteredEvents(updated);
      setShowQuickModal(false);
      showToast(
        'Registration Confirmed!',
        `Successfully registered for ${eventName} using your saved details.`,
        'success'
      );
    } catch (err) {
      console.error('Quick register error:', err);
      showToast('Registration Error', err.message || 'Could not register for event.', 'error');
    }
  };

  // Full form submission (first-time registration or detail edit)
  const handleFullModalSuccess = (savedProfile, eventName) => {
    setProfile(savedProfile);
    setShowFullModal(false);
    if (eventName) {
      const updated = getRegisteredEvents(user.id, user.user_metadata);
      if (!updated.includes(eventName)) updated.push(eventName);
      setRegisteredEvents([...updated]);
    }
    showToast(
      'Profile Saved & Registered!',
      eventName
        ? `Registered for "${eventName}". Your details are saved—any additional events require only 1 click!`
        : 'Your details have been updated.',
      'success'
    );
  };

  const cards =
    activeCat === 'all'
      ? CATEGORIES.flatMap((c) => c.events.map((e) => ({ name: e, cat: c.label, key: c.key })))
      : (CATEGORIES.find((c) => c.key === activeCat)?.events || []).map((e) => ({
          name: e,
          cat: CATEGORIES.find((c) => c.key === activeCat).label,
          key: activeCat,
        }));

  const cardGradients = [
    'linear-gradient(160deg, #3D0B14 0%, #0A0505 100%)',
    'linear-gradient(160deg, #2E0A12 0%, #0A0505 100%)',
    'linear-gradient(160deg, #3B0F1D 0%, #0A0505 100%)',
    'linear-gradient(160deg, #350A0F 0%, #0A0505 100%)',
    'linear-gradient(160deg, #33101A 0%, #0A0505 100%)',
    'linear-gradient(160deg, #241010 0%, #0A0505 100%)',
  ];

  return (
    <>
      {/* 1-Click Quick Register Modal (Uses saved profile details) */}
      {showQuickModal && selectedEvent && (
        <QuickRegisterModal
          eventName={selectedEvent.name}
          eventCat={selectedEvent.cat}
          participant={profile}
          onConfirm={handleQuickRegisterConfirm}
          onEditProfile={() => {
            setShowQuickModal(false);
            setShowFullModal(true);
          }}
          onClose={() => {
            setShowQuickModal(false);
            setSelectedEvent(null);
          }}
        />
      )}

      {/* Full Registration Modal (First time filling details or editing) */}
      {showFullModal && (
        <RegistrationModal
          eventName={selectedEvent?.name}
          eventCat={selectedEvent?.cat}
          initialProfile={profile}
          onClose={() => {
            setShowFullModal(false);
            setSelectedEvent(null);
          }}
          onSuccess={handleFullModalSuccess}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 28,
            right: 28,
            zIndex: 300,
            maxWidth: 380,
            background: 'linear-gradient(135deg, #1C0808 0%, #0D0505 100%)',
            border: toast.type === 'info'
              ? '1px solid rgba(56,189,248,0.4)'
              : toast.type === 'error'
              ? '1px solid #DC2626'
              : '1px solid rgba(34,197,94,0.5)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.8), 0 0 30px rgba(220,38,38,0.15)',
            borderRadius: 14,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            animation: 'fadeInUp 0.3s ease-out',
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: toast.type === 'info'
                ? 'rgba(56,189,248,0.15)'
                : toast.type === 'error'
                ? 'rgba(220,38,38,0.2)'
                : 'rgba(34,197,94,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CheckCircle2
              size={16}
              color={toast.type === 'info' ? '#38bdf8' : toast.type === 'error' ? '#ef4444' : '#22c55e'}
            />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 3px', fontSize: 13, fontWeight: 700, color: 'var(--cream)' }}>
              {toast.title}
            </p>
            <p style={{ margin: 0, fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.4 }}>
              {toast.text}
            </p>
          </div>
        </div>
      )}

      <section style={{ padding: '150px 24px 100px', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
              <div>
                <Sticker tone='cyan' rotate={-2} style={{ marginBottom: 16 }}>
                  {TOTAL_EVENTS}+ Events on File
                </Sticker>
                <h1 className='crx-display' style={{ fontSize: 'clamp(36px,7vw,72px)', color: 'var(--cream)', margin: '0 0 10px' }}>
                  CHOOSE YOUR CASE
                </h1>
                <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0, maxWidth: 540 }}>
                  Register for multiple events freely. Fill in your candidate details once, and claim spots across any case with single-click ease.
                </p>
              </div>

              {user && registeredEvents.length > 0 && (
                <div
                  onClick={() => setPage && setPage('dashboard')}
                  style={{
                    background: 'rgba(220,38,38,0.08)',
                    border: '1px solid rgba(220,38,38,0.25)',
                    borderRadius: 14,
                    padding: '12px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={16} color="#22c55e" />
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>My Events</span>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--cream)' }}>
                      {registeredEvents.length} Event{registeredEvents.length > 1 ? 's' : ''} Claimed
                    </p>
                  </div>
                  <ArrowRight size={14} color="var(--muted)" />
                </div>
              )}
            </div>
          </Reveal>

          {/* Category Filter Pills */}
          <div className='crx-scrollbar' style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, marginBottom: 34 }}>
            <button
              onClick={() => setActiveCat('all')}
              className='crx-btn'
              style={{
                background: activeCat === 'all' ? 'linear-gradient(135deg, var(--cyan), var(--cyan-dark))' : 'rgba(179,18,58,0.08)',
                border: activeCat === 'all' ? '1px solid var(--cyan)' : '1px solid rgba(179,18,58,0.2)',
                color: activeCat === 'all' ? '#fff' : 'var(--paper)',
                padding: '9px 18px', fontSize: 11.5,
                boxShadow: activeCat === 'all' ? '0 0 15px rgba(179,18,58,0.4)' : 'none',
              }}
            >
              All Cases
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveCat(c.key)}
                className='crx-btn'
                style={{
                  background: activeCat === c.key ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))' : 'rgba(179,18,58,0.08)',
                  border: activeCat === c.key ? '1px solid var(--gold)' : '1px solid rgba(179,18,58,0.2)',
                  color: activeCat === c.key ? '#020101' : 'var(--paper)',
                  padding: '9px 18px', fontSize: 11.5,
                  boxShadow: activeCat === c.key ? '0 0 15px rgba(140,107,61,0.4)' : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: narrow ? 'repeat(2,1fr)' : 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
            {cards.map((ev, i) => {
              const isRegistered = registeredEvents.includes(ev.name);

              return (
                <Reveal key={ev.name} delay={Math.min(i * 0.02, 0.3)}>
                  <div
                    className='crx-card'
                    style={{
                      position: 'relative', height: 260, borderRadius: 14, overflow: 'hidden',
                      background: cardGradients[i % cardGradients.length],
                      border: isRegistered ? '1px solid rgba(34,197,94,0.35)' : '1px solid rgba(255,255,255,0.08)',
                      boxShadow: isRegistered ? '0 8px 24px rgba(34,197,94,0.1)' : '0 8px 24px rgba(0,0,0,0.4)',
                      display: 'flex', flexDirection: 'column',
                    }}
                  >
                    <span style={{ position: 'absolute', top: 10, left: 10, fontSize: 9, color: 'var(--muted)', fontFamily: 'monospace', letterSpacing: 1 }}>
                      N&ordm; {String(i + 1).padStart(2, '0')}/{cards.length}
                    </span>

                    <Sticker
                      tone={i % 2 === 0 ? 'gold' : 'cyan'}
                      rotate={0}
                      style={{ position: 'absolute', top: 12, right: 12, fontSize: 9, padding: '4px 9px' }}
                    >
                      {ev.cat}
                    </Sticker>

                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px', background: 'linear-gradient(0deg, rgba(10,5,5,0.98) 0%, rgba(10,5,5,0.7) 60%, transparent 100%)' }}>
                      <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{ev.name}</p>

                      <button
                        onClick={() => handleCardClick(ev)}
                        disabled={loadingInitial}
                        className='crx-btn'
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          fontSize: 10.5,
                          padding: '8px 12px',
                          background: isRegistered
                            ? 'rgba(34,197,94,0.15)'
                            : user && profile
                            ? 'linear-gradient(135deg, rgba(220,38,38,0.25), rgba(220,38,38,0.1))'
                            : 'rgba(220,38,38,0.15)',
                          border: isRegistered
                            ? '1px solid rgba(34,197,94,0.5)'
                            : '1px solid rgba(220,38,38,0.4)',
                          color: isRegistered ? '#86efac' : '#fca5a5',
                          boxShadow: isRegistered
                            ? '0 0 12px rgba(34,197,94,0.15)'
                            : '0 0 10px rgba(220,38,38,0.08)',
                          letterSpacing: 1,
                          cursor: 'pointer',
                          gap: 6,
                        }}
                      >
                        {loadingInitial ? (
                          '...'
                        ) : isRegistered ? (
                          <>
                            <Check size={12} color="#86efac" /> REGISTERED
                          </>
                        ) : !user ? (
                          'SIGN IN TO REGISTER'
                        ) : profile ? (
                          <>
                            <Sparkles size={11} color="#fca5a5" /> 1-CLICK REGISTER
                          </>
                        ) : (
                          'REGISTER'
                        )}
                      </button>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
