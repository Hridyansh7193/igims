import React, { useState, useEffect, useCallback } from 'react';
import {
  LogOut, ShieldCheck, Clock, CheckCircle2, User, AlertTriangle, RefreshCw,
  Calendar, ArrowRight, Edit3, PlusCircle, X, Copy, Check, CreditCard,
  MapPin, Ticket, Trophy, Music, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import AuthForm from '../components/auth/AuthForm';
import RegistrationModal from '../components/common/RegistrationModal';
import BasicRegistrationModal from '../components/common/BasicRegistrationModal';
import {
  fetchParticipantProfile, getRegisteredEvents, normalizeProfile,
  fetchCategorizedRegistrations
} from '../lib/eventsService';

export default function DashboardPage({ setPage }) {
  const { user, signOut } = useAuth();
  const [participant,      setParticipant]      = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [sportsList,       setSportsList]       = useState([]);
  const [culturalList,     setCulturalList]     = useState([]);
  const [basicReg,         setBasicReg]         = useState(null);
  const [fetchingReg,      setFetchingReg]      = useState(false);
  const [fetchError,       setFetchError]       = useState(null);
  const [signOutLoading,   setSignOutLoading]   = useState(false);
  const [showEditModal,    setShowEditModal]    = useState(false);
  const [showBRModal,      setShowBRModal]      = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    setFetchingReg(true);
    setFetchError(null);
    try {
      const [profile, categorized, evs] = await Promise.all([
        fetchParticipantProfile(user.id, user.user_metadata),
        fetchCategorizedRegistrations(user.id),
        Promise.resolve(getRegisteredEvents(user.id, user.user_metadata)),
      ]);

      setParticipant(profile);
      setBasicReg(categorized.basic);
      setSportsList(categorized.sports || []);
      setCulturalList(categorized.cultural || []);
      setRegisteredEvents(evs);
    } catch (err) {
      console.error('[Dashboard] fetch error:', err);
      setFetchError('Could not load your registration. Check your connection.');
    } finally {
      setFetchingReg(false);
    }
  }, [user]);

  // Fetch and subscribe to changes in real-time
  useEffect(() => {
    loadData();

    if (!user) return;

    // Real-time subscription on participants table
    const channel = supabase
      .channel('participant_' + user.id)
      .on('postgres_changes', {
        event : '*',
        schema: 'public',
        table : 'participants',
        filter: 'user_id=eq.' + user.id,
      }, (payload) => {
        if (payload.eventType === 'DELETE') { setParticipant(null); return; }
        setParticipant(normalizeProfile(payload.new));
      })
      .subscribe();

    const handleEventsUpdated = (e) => {
      if (e?.detail?.events) {
        setRegisteredEvents(e.detail.events);
      }
      loadData();
    };

    const handleRegistrationsUpdated = () => {
      loadData();
    };

    window.addEventListener('crx_events_updated', handleEventsUpdated);
    window.addEventListener('crx_registrations_updated', handleRegistrationsUpdated);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('crx_events_updated', handleEventsUpdated);
      window.removeEventListener('crx_registrations_updated', handleRegistrationsUpdated);
    };
  }, [user, loadData]);

  const handleSignOut = async () => {
    setSignOutLoading(true);
    try {
      await signOut();
      setParticipant(null);
      setRegisteredEvents([]);
      setBasicReg(null);
      setSportsList([]);
      setCulturalList([]);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('crx_intro_seen');
      }
      setPage && setPage('home');
    } catch (err) {
      console.error('[Dashboard] signOut error:', err);
    } finally {
      setSignOutLoading(false);
    }
  };

  const handleEditSuccess = (savedProfile) => {
    setParticipant(savedProfile);
    setShowEditModal(false);
    loadData();
  };

  const handleBRSuccess = (savedProfile, br) => {
    setParticipant(savedProfile);
    setBasicReg(br);
    setShowBRModal(false);
    loadData();
  };

  if (!user) {
    return (
      <section style={{ padding: '150px 24px 100px', maxWidth: 600, margin: '0 auto' }}>
        <AuthForm />
      </section>
    );
  }

  const isPaid      = participant?.payment_status === 'PAID';
  const statusColor = isPaid ? '#22c55e' : '#f59e0b';
  const StatusIcon  = isPaid ? CheckCircle2 : Clock;
  const candidateId = participant?.id
    ? `CRX-26-${participant.id.slice(0, 8).toUpperCase()}`
    : `CRX-26-${user.id.slice(0, 8).toUpperCase()}`;

  return (
    <>
      {showEditModal && (
        <RegistrationModal
          initialProfile={participant}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {showBRModal && (
        <BasicRegistrationModal
          initialProfile={participant}
          onClose={() => setShowBRModal(false)}
          onSuccess={handleBRSuccess}
        />
      )}

      {showPaymentModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Payment Information"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 16px',
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setShowPaymentModal(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(2,1,1,0.85)',
              backdropFilter: 'blur(8px)',
            }}
          />

          {/* Modal Card */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 480,
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'linear-gradient(160deg, #1b0909 0%, #0a0404 100%)',
              border: '1px solid rgba(220,38,38,0.4)',
              borderRadius: 20,
              padding: '32px 28px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.9), 0 0 60px rgba(220,38,38,0.12)',
              zIndex: 1,
            }}
          >
            <button
              onClick={() => setShowPaymentModal(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8,
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--cream)',
              }}
            >
              <X size={15} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(220,38,38,0.15)',
                  border: '1px solid rgba(220,38,38,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CreditCard size={18} color="#DC2626" />
              </div>
              <h2 className="crx-display" style={{ fontSize: 21, color: 'var(--cream)', margin: 0 }}>
                PAYMENT GATEWAY STATUS
              </h2>
            </div>

            <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6, margin: '0 0 18px' }}>
              Your registration details have been securely recorded. Online payment collection configuration is currently in progress.
            </p>

            {/* Price Box */}
            <div
              style={{
                background: 'rgba(220,38,38,0.08)',
                border: '1px solid rgba(220,38,38,0.25)',
                borderRadius: 12,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 18,
              }}
            >
              <div>
                <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--muted)' }}>
                  Delegate Fee
                </span>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#fca5a5' }}>
                  {basicReg ? 'Basic Registration (BR)' : 'Festival delegate registration'}
                </p>
              </div>
              <span style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>
                ₹2000
              </span>
            </div>

            {/* Notice */}
            <div
              style={{
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.35)',
                borderRadius: 12,
                padding: '16px',
                marginBottom: 16,
              }}
            >
              <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: '#fcd34d', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Gateway &amp; UPI Under Setup
              </p>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--cream)', lineHeight: 1.6 }}>
                The official festival UPI ID and Razorpay payment gateway are currently being finalized with the IGIMS Finance &amp; Organising Committee.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPaymentModal(false)}
              className="crx-btn gold"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              UNDERSTOOD, CLOSE
            </button>
          </div>
        </div>
      )}

      <section style={{ padding: '150px 24px 100px', maxWidth: 1040, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 30, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 20, padding: '4px 12px', marginBottom: 12 }}>
              <ShieldCheck size={12} color="#DC2626" />
              <span style={{ fontSize: 10, color: '#DC2626', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700 }}>Authenticated</span>
            </div>
            <h1 className="crx-display" style={{ fontSize: 'clamp(24px,4vw,36px)', color: 'var(--cream)', marginBottom: 6 }}>
              COMMAND CENTER
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Logged in as </span>
                <span style={{ color: 'var(--cream)' }}>{user.email}</span>
              </p>
              {participant && (
                <span style={{
                  fontSize: 11,
                  fontFamily: 'monospace',
                  background: 'rgba(0, 240, 255, 0.12)',
                  border: '1px solid rgba(0, 240, 255, 0.35)',
                  color: '#00F0FF',
                  padding: '3px 10px',
                  borderRadius: 6,
                  fontWeight: 700,
                  letterSpacing: 0.8,
                }}>
                  ID: {candidateId}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleSignOut}
            disabled={signOutLoading}
            className="crx-btn"
            style={{ background: 'transparent', border: '1px solid rgba(220,38,38,0.35)', color: '#ff8f8f', gap: 8, flexShrink: 0 }}
          >
            <LogOut size={14} />
            {signOutLoading ? 'SIGNING OUT...' : 'SIGN OUT'}
          </button>
        </div>

        {/* Database Unified ID Info Callout */}
        {participant && (
          <div
            style={{
              background: 'linear-gradient(90deg, rgba(0, 240, 255, 0.08) 0%, rgba(220, 38, 38, 0.08) 100%)',
              border: '1px solid rgba(0, 240, 255, 0.25)',
              borderRadius: 12,
              padding: '12px 18px',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Sparkles size={16} color="#00F0FF" />
              <span style={{ fontSize: 12, color: 'var(--cream)' }}>
                <strong>Unified Candidate Identity:</strong> Your Basic, Sports &amp; Cultural registrations are linked to single participant ID: <code style={{ color: '#00F0FF' }}>{candidateId}</code>.
              </span>
            </div>
          </div>
        )}

        {/* Body */}
        {fetchingReg ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '40px 24px', color: 'var(--muted)', fontSize: 13 }}>
            <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite', color: '#DC2626' }} />
            Checking registration status...
          </div>
        ) : fetchError ? (
          <div style={{ padding: '28px 24px', borderRadius: 14, border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertTriangle size={20} color="#DC2626" />
            <div>
              <p style={{ color: 'var(--cream)', margin: '0 0 4px', fontWeight: 600 }}>Could not load registration</p>
              <p style={{ color: 'var(--muted)', margin: 0, fontSize: 13 }}>{fetchError}</p>
            </div>
          </div>
        ) : participant ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Top Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {/* Profile card */}
              <div style={{ padding: '24px', borderRadius: 16, border: '1px solid rgba(220,38,38,0.22)', background: 'linear-gradient(160deg,#1a0808 0%,#0A0505 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', position: 'relative' }}>
                <button
                  onClick={() => setShowEditModal(true)}
                  style={{
                    position: 'absolute', top: 20, right: 20,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8, padding: '6px 10px', color: 'var(--muted)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11,
                  }}
                >
                  <Edit3 size={12} /> Edit
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={18} color="#DC2626" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 15, color: 'var(--cream)', fontWeight: 700 }}>
                      {participant.first_name} {participant.last_name || participant.surname}
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>{participant.college_name}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    ['City',  participant.college_city || participant.city_of_college],
                    ['State', participant.college_state || participant.state_of_college],
                    ['Phone', participant.phone_number],
                    ['Email', participant.email],
                  ].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 8 }}>
                      <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
                      <span style={{ fontSize: 12, color: 'var(--cream)', textAlign: 'right', wordBreak: 'break-all', maxWidth: '60%' }}>{val || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment status card */}
              <div style={{ padding: '24px', borderRadius: 16, border: '1px solid rgba(220,38,38,0.18)', background: 'linear-gradient(160deg,#130a05 0%,#0A0505 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ margin: 0, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.8, color: 'var(--muted)' }}>Registration Status</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: isPaid ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <StatusIcon size={18} color={statusColor} />
                  </div>
                  <span style={{ fontSize: 20, fontWeight: 800, color: statusColor, letterSpacing: 1 }}>
                    {participant.payment_status || 'PENDING'}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65, margin: 0 }}>
                  {isPaid
                    ? 'Your payment is confirmed. See you at Cerebrexia!'
                    : 'Candidate profile active. Online payment collection is currently under configuration by the finance committee.'}
                </p>
                {!isPaid && (
                  <button className="crx-btn gold" style={{ justifyContent: 'center' }}
                    onClick={() => setShowPaymentModal(true)}>
                    PAYMENT GATEWAY STATUS
                  </button>
                )}
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', margin: 0 }}>
                  Status updates live — no refresh needed.
                </p>
              </div>
            </div>

            {/* SEPARATE DATABASE 1: Basic Registration (BR) */}
            <div
              style={{
                padding: '24px 28px',
                borderRadius: 16,
                border: basicReg ? '1px solid rgba(0, 240, 255, 0.4)' : '1px dashed rgba(0, 240, 255, 0.3)',
                background: 'linear-gradient(160deg, #09171C 0%, #050B0E 100%)',
                boxShadow: basicReg ? '0 8px 32px rgba(0,0,0,0.5), 0 0 30px rgba(0, 240, 255, 0.1)' : '0 8px 32px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <Ticket size={18} color="#00F0FF" />
                    <h3 className="crx-display" style={{ fontSize: 19, color: '#fff', margin: 0 }}>
                      BASIC REGISTRATION (BR) — CONCERT &amp; PRONITES
                    </h3>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: 12.5, margin: '0 0 6px', maxWidth: 620, lineHeight: 1.5 }}>
                    Concert registration database entry. Grants full admission to celebrity musical concerts and star pronites without entering any competitive events.
                  </p>
                  <span style={{ fontSize: 11, color: '#00F0FF', fontWeight: 600 }}>
                    Table: <code style={{ color: '#fff' }}>public.basic_registrations</code> &bull; Ref ID: {candidateId}
                  </span>
                </div>

                {basicReg ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#22c55e',
                        background: 'rgba(34, 197, 94, 0.15)',
                        border: '1px solid rgba(34, 197, 94, 0.35)',
                        padding: '6px 14px',
                        borderRadius: 20,
                        letterSpacing: 0.8,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <CheckCircle2 size={13} /> BR ACTIVE
                    </span>
                    <button
                      onClick={() => setShowBRModal(true)}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 8,
                        padding: '6px 12px',
                        color: 'var(--cream)',
                        cursor: 'pointer',
                        fontSize: 11,
                      }}
                    >
                      Update Details
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowBRModal(true)}
                    className="crx-btn cyan"
                    style={{ fontSize: 11.5, gap: 6, padding: '10px 18px' }}
                  >
                    <Ticket size={14} /> CLAIM BASIC REGISTRATION (BR) — ₹2000
                  </button>
                )}
              </div>
            </div>

            {/* SEPARATE DATABASE 2: Sports Registrations */}
            <div
              style={{
                padding: '24px 28px',
                borderRadius: 16,
                border: '1px solid rgba(234, 88, 12, 0.3)',
                background: 'linear-gradient(160deg, #180C05 0%, #0B0502 100%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Trophy size={17} color="#ea580c" />
                    <h3 className="crx-display" style={{ fontSize: 18, color: 'var(--cream)', margin: 0 }}>
                      SPORTS REGISTRATIONS ({sportsList.length})
                    </h3>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: 12, margin: 0 }}>
                    Stored in <code style={{ color: '#ea580c' }}>public.sports_registrations</code> &bull; Ref ID: {candidateId}
                  </p>
                </div>

                <button
                  onClick={() => setPage && setPage('events')}
                  className="crx-btn"
                  style={{
                    background: 'rgba(234, 88, 12, 0.12)',
                    border: '1px solid rgba(234, 88, 12, 0.35)',
                    color: '#fb923c',
                    fontSize: 11,
                    gap: 6,
                  }}
                >
                  <PlusCircle size={13} /> ADD SPORTS EVENT
                </button>
              </div>

              {sportsList.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                  {sportsList.map((item) => (
                    <div
                      key={item.id || item.event_name}
                      style={{
                        padding: '14px 16px',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(234, 88, 12, 0.25)',
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                      }}
                    >
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', display: 'block' }}>
                          {item.event_name}
                        </span>
                        <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>
                          Sports Arena
                        </span>
                      </div>
                      <span style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: '#fb923c',
                        background: 'rgba(234, 88, 12, 0.15)',
                        padding: '3px 8px',
                        borderRadius: 12,
                        letterSpacing: 0.8,
                        flexShrink: 0,
                      }}>
                        CONFIRMED
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '20px 16px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 10 }}>
                  <p style={{ color: 'var(--muted)', fontSize: 12.5, margin: '0 0 10px' }}>
                    No sports entries registered under this ID yet.
                  </p>
                  <button
                    onClick={() => setPage && setPage('events')}
                    className="crx-btn gold"
                    style={{ fontSize: 11, margin: '0 auto', gap: 6 }}
                  >
                    BROWSE SPORTS EVENTS <ArrowRight size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* SEPARATE DATABASE 3: Cultural & Stage Registrations */}
            <div
              style={{
                padding: '24px 28px',
                borderRadius: 16,
                border: '1px solid rgba(220, 38, 38, 0.3)',
                background: 'linear-gradient(160deg, #180608 0%, #0A0204 100%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Music size={17} color="#DC2626" />
                    <h3 className="crx-display" style={{ fontSize: 18, color: 'var(--cream)', margin: 0 }}>
                      CULTURAL &amp; STAGE REGISTRATIONS ({culturalList.length})
                    </h3>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: 12, margin: 0 }}>
                    Stored in <code style={{ color: '#DC2626' }}>public.cultural_registrations</code> &bull; Ref ID: {candidateId}
                  </p>
                </div>

                <button
                  onClick={() => setPage && setPage('events')}
                  className="crx-btn"
                  style={{
                    background: 'rgba(220,38,38,0.15)',
                    border: '1px solid rgba(220,38,38,0.4)',
                    color: '#fca5a5',
                    fontSize: 11,
                    gap: 6,
                  }}
                >
                  <PlusCircle size={13} /> ADD CULTURAL EVENT
                </button>
              </div>

              {culturalList.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                  {culturalList.map((item) => (
                    <div
                      key={item.id || item.event_name}
                      style={{
                        padding: '14px 16px',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(220,38,38,0.25)',
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                      }}
                    >
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', display: 'block' }}>
                          {item.event_name}
                        </span>
                        <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>
                          {item.category || 'Cultural'}
                        </span>
                      </div>
                      <span style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: '#fca5a5',
                        background: 'rgba(220,38,38,0.15)',
                        padding: '3px 8px',
                        borderRadius: 12,
                        letterSpacing: 0.8,
                        flexShrink: 0,
                      }}>
                        CONFIRMED
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '20px 16px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 10 }}>
                  <p style={{ color: 'var(--muted)', fontSize: 12.5, margin: '0 0 10px' }}>
                    No cultural entries registered under this ID yet.
                  </p>
                  <button
                    onClick={() => setPage && setPage('events')}
                    className="crx-btn gold"
                    style={{ fontSize: 11, margin: '0 auto', gap: 6 }}
                  >
                    BROWSE CULTURAL EVENTS <ArrowRight size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ padding: '48px 32px', borderRadius: 16, border: '1px dashed rgba(220,38,38,0.25)', background: 'rgba(220,38,38,0.02)', textAlign: 'center' }}>
            <ShieldCheck size={40} color="rgba(220,38,38,0.3)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ color: 'var(--cream)', fontSize: 18, marginBottom: 8 }}>No Registration Found</h3>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>
              You haven't registered your details yet. You can complete Basic Registration for the concert or browse 70+ competitive events.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowBRModal(true)}
                className="crx-btn cyan"
                style={{ fontSize: 12, gap: 8 }}
              >
                <Ticket size={14} /> BASIC REGISTRATION (BR)
              </button>
              <button
                onClick={() => setPage && setPage('events')}
                className="crx-btn gold"
                style={{ fontSize: 12, gap: 8 }}
              >
                BROWSE EVENTS <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
