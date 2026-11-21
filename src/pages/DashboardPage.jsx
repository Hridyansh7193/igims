import React, { useState, useEffect, useCallback } from 'react';
import {
  LogOut, ShieldCheck, Clock, CheckCircle2, User, AlertTriangle, RefreshCw,
  Calendar, ArrowRight, Edit3, PlusCircle, X, Copy, Check, CreditCard,
  MapPin, Ticket, Trophy, Music, Sparkles, Tag, Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import AuthForm from '../components/auth/AuthForm';
import RegistrationModal from '../components/common/RegistrationModal';
import BasicRegistrationModal from '../components/common/BasicRegistrationModal';
import {
  fetchParticipantProfile, getRegisteredEvents, normalizeProfile,
  fetchCategorizedRegistrations, markBasicRegistrationPaid
} from '../lib/eventsService';
import { openRazorpayCheckout, RAZORPAY_PAYMENT_PAGE_URL } from '../lib/razorpay';
import { fetchUserTickets, issueTicketsForBasicRegistration, dispatchTicketEmail } from '../lib/ticketService';
import { validatePromoCodeOnline } from '../lib/promoService';
import TicketCard from '../components/common/TicketCard';

export default function DashboardPage({ setPage }) {
  const { user, signOut } = useAuth();
  const [participant,      setParticipant]      = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [sportsList,       setSportsList]       = useState([]);
  const [culturalList,     setCulturalList]     = useState([]);
  const [basicReg,         setBasicReg]         = useState(null);
  const [userTickets,      setUserTickets]      = useState([]);
  const [fetchingReg,      setFetchingReg]      = useState(false);
  const [fetchError,       setFetchError]       = useState(null);
  const [signOutLoading,   setSignOutLoading]   = useState(false);
  const [showEditModal,    setShowEditModal]    = useState(false);
  const [showBRModal,      setShowBRModal]      = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [dashboardPaymentId, setDashboardPaymentId] = useState('');
  const [paying, setPaying] = useState(false);

  // Promo code state
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState(null);
  const [promoMessage, setPromoMessage] = useState(null);
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [emailingAll, setEmailingAll] = useState(false);
  const [emailAllMessage, setEmailAllMessage] = useState(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    setFetchingReg(true);
    setFetchError(null);
    try {
      const [profile, categorized, evs, tkts] = await Promise.all([
        fetchParticipantProfile(user.id, user.user_metadata),
        fetchCategorizedRegistrations(user.id),
        Promise.resolve(getRegisteredEvents(user.id, user.user_metadata)),
        fetchUserTickets(user.id, user.email),
      ]);

      let finalTickets = tkts || [];
      const isPaid = profile?.payment_status === 'PAID' || categorized.basic?.payment_status === 'PAID';
      if (isPaid && finalTickets.length === 0) {
        try {
          const issued = await issueTicketsForBasicRegistration(user.id, categorized.basic || profile, {});
          if (issued && issued.length > 0) {
            finalTickets = issued;
          }
        } catch (_) {}
      }

      setParticipant(profile);
      setBasicReg(categorized.basic);
      setSportsList(categorized.sports || []);
      setCulturalList(categorized.cultural || []);
      setRegisteredEvents(evs);
      setUserTickets(finalTickets);
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

  const baseFee = 2000;
  const discountAmount = appliedPromo ? Math.round((baseFee * (appliedPromo.value || 0)) / 100) : 0;
  const finalPayable = Math.max(0, baseFee - discountAmount);

  const handleApplyPromo = async (e) => {
    if (e) e.preventDefault();
    setPromoError(null);
    setPromoMessage(null);
    const cleanCode = promoCodeInput.trim().toUpperCase();
    if (!cleanCode) {
      setPromoError('Please enter a promo code.');
      return;
    }

    setValidatingPromo(true);
    try {
      const res = await validatePromoCodeOnline(cleanCode, {
        payableMembers: 1,
        payableSubtotal: baseFee,
      });

      if (res.valid) {
        setAppliedPromo(res.promo);
        setPromoMessage(res.message);
        setPromoError(null);
        setPromoCodeInput('');
      } else {
        setAppliedPromo(null);
        setPromoError(res.message || 'Invalid or expired promo code.');
        setPromoMessage(null);
      }
    } catch (err) {
      setPromoError('Could not verify promo code. Check connection.');
    } finally {
      setValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput('');
    setPromoError(null);
    setPromoMessage(null);
  };

  const handlePayNow = async () => {
    // If 100% discount, immediately unlock pass without launching payment gateway
    if (finalPayable === 0) {
      setPaying(true);
      try {
        await markBasicRegistrationPaid(user.id, {
          razorpay_payment_id: `free_${appliedPromo?.code || 'vip'}_${Date.now()}`,
          razorpay_order_id: `order_free_${Date.now()}`,
          method: 'PROMO_100_FREE',
          promo_code: appliedPromo?.code || null,
          discount_amount: discountAmount,
          final_amount: 0,
        });
        await loadData();
        setShowPaymentModal(false);
      } catch (err) {
        console.error('[Dashboard] Error activating free pass:', err);
      } finally {
        setPaying(false);
      }
      return;
    }

    setPaying(true);
    openRazorpayCheckout({
      amount: finalPayable,
      description: `Cerebrexia '26 | Basic Registration (BR)${appliedPromo ? ` [${appliedPromo.code}]` : ''}`,
      prefill: {
        name: participant ? `${participant.first_name || ''} ${participant.surname || ''}`.trim() : '',
        email: user?.email || '',
        contact: participant?.phone_number || '',
      },
      onSuccess: async (rzpRes) => {
        try {
          await markBasicRegistrationPaid(user.id, {
            ...rzpRes,
            promo_code: appliedPromo?.code || null,
            discount_amount: discountAmount,
            final_amount: finalPayable,
          });
          await loadData();
          setShowPaymentModal(false);
        } catch (err) {
          console.error('[Dashboard] Error recording payment:', err);
        } finally {
          setPaying(false);
        }
      },
      onDismiss: () => {
        setPaying(false);
      },
      onFallbackPrompt: () => {
        setPaying(false);
        setShowPaymentModal(true);
      },
    });
  };

  const handleManualPaymentConfirm = async () => {
    if (!user) return;
    setPaying(true);
    try {
      const confirmedId = dashboardPaymentId.trim() || `pay_rzp_${Date.now()}`;
      await markBasicRegistrationPaid(user.id, {
        razorpay_payment_id: confirmedId,
        razorpay_order_id: `order_crx_${Date.now()}`,
        method: dashboardPaymentId.trim() ? 'RAZORPAY_ME_VERIFIED' : 'RAZORPAY_GATEWAY',
      });
      await loadData();
      setShowPaymentModal(false);
    } catch (err) {
      console.error('[Dashboard] Payment confirm error:', err);
    } finally {
      setPaying(false);
    }
  };

  const handleEmailAllPasses = async () => {
    if (!userTickets || userTickets.length === 0) return;
    setEmailingAll(true);
    setEmailAllMessage(null);
    try {
      const results = await Promise.allSettled(
        userTickets.map((t) => dispatchTicketEmail(t, userTickets.length))
      );
      const successful = results.filter((r) => r.status === 'fulfilled' && r.value?.success).length;
      if (successful > 0) {
        setEmailAllMessage(`Sent ${successful} pass${successful > 1 ? 'es' : ''} to member email address(es)! Please check inbox and spam.`);
      } else {
        setEmailAllMessage('Could not send emails. Please verify your connection.');
      }
    } catch (_) {
      setEmailAllMessage('Failed to send pass emails. Please try again.');
    } finally {
      setEmailingAll(false);
    }
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
                RAZORPAY PAYMENT GATEWAY
              </h2>
            </div>

            <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6, margin: '0 0 18px' }}>
              Complete your Basic Registration (BR) payment to unlock your official festival QR delegate credential.
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
                marginBottom: 16,
              }}
            >
              <div>
                <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--muted)' }}>
                  Delegate Fee
                </span>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#fca5a5' }}>
                  {basicReg ? 'Basic Registration (BR)' : 'Festival delegate registration'}
                  {appliedPromo && ` • ${appliedPromo.code} (${appliedPromo.value}% OFF)`}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                {discountAmount > 0 && (
                  <span style={{ fontSize: 13, textDecoration: 'line-through', color: 'rgba(255,255,255,0.4)', display: 'block' }}>
                    ₹2000
                  </span>
                )}
                <span style={{ fontSize: 26, fontWeight: 800, color: finalPayable === 0 ? '#22c55e' : '#fff' }}>
                  {finalPayable === 0 ? 'FREE' : `₹${finalPayable.toLocaleString('en-IN')}`}
                </span>
              </div>
            </div>

            {/* Promo Code Input in Modal */}
            <div style={{ marginBottom: 16 }}>
              {appliedPromo ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={13} color="#22c55e" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{appliedPromo.code}</span>
                    <span style={{ fontSize: 11, color: '#86efac' }}>({appliedPromo.value}% OFF &bull; -₹{discountAmount})</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    style={{ background: 'none', border: 'none', color: '#fca5a5', fontSize: 11, cursor: 'pointer', fontWeight: 700 }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Tag size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                      <input
                        type="text"
                        value={promoCodeInput}
                        onChange={(e) => { setPromoCodeInput(e.target.value.toUpperCase()); setPromoError(null); }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleApplyPromo(e);
                          }
                        }}
                        placeholder="ENTER PROMO CODE"
                        style={{
                          width: '100%',
                          padding: '8px 10px 8px 30px',
                          borderRadius: 8,
                          background: 'rgba(0,0,0,0.5)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#fff',
                          fontSize: 12,
                          fontFamily: 'monospace',
                          letterSpacing: 0.8,
                          textTransform: 'uppercase',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={validatingPromo || !promoCodeInput.trim()}
                      className="crx-btn"
                      style={{
                        padding: '6px 14px',
                        fontSize: 11,
                        background: 'rgba(212, 175, 55, 0.15)',
                        border: '1px solid rgba(212, 175, 55, 0.4)',
                        color: 'var(--crx-gold, #D4AF37)',
                        fontWeight: 700,
                        borderRadius: 8,
                      }}
                    >
                      {validatingPromo ? '...' : 'APPLY'}
                    </button>
                  </div>
                  {promoError && (
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: '#f87171' }}>{promoError}</p>
                  )}
                  {promoMessage && !promoError && (
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: '#34d399' }}>{promoMessage}</p>
                  )}
                </div>
              )}
            </div>

            {/* Direct Gateway Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {finalPayable > 0 && (
                <a
                  href={RAZORPAY_PAYMENT_PAGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="crx-btn gold"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '12px',
                    fontSize: 13,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <CreditCard size={16} />
                  PAY VIA RAZORPAY.ME &rarr;
                </a>
              )}

              <button
                type="button"
                onClick={handlePayNow}
                disabled={paying}
                className="crx-btn gold"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '11px',
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                {paying
                  ? 'LAUNCHING GATEWAY...'
                  : finalPayable === 0
                  ? 'ACTIVATE FREE PASS (100% OFF)'
                  : `PAY ₹${finalPayable.toLocaleString('en-IN')} VIA POPUP GATEWAY`}
              </button>
            </div>

            {/* Verification / Confirmation Box */}
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: '14px',
                marginBottom: 16,
              }}
            >
              <p style={{ margin: '0 0 6px', fontSize: 11.5, fontWeight: 700, color: '#fcd34d', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Already Paid via Razorpay / UPI?
              </p>
              <p style={{ margin: '0 0 10px', fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.5 }}>
                Enter your Razorpay Payment ID from your SMS/email receipt to confirm immediately:
              </p>
              <input
                type="text"
                placeholder="e.g. pay_QXXXXXXXXXXXXX"
                value={dashboardPaymentId}
                onChange={(e) => setDashboardPaymentId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(212, 175, 106, 0.3)',
                  color: '#fff',
                  fontSize: 12,
                  marginBottom: 10,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={handleManualPaymentConfirm}
                disabled={paying}
                className="crx-btn"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '10px',
                  fontSize: 12,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 700,
                }}
              >
                CONFIRM PAYMENT &amp; UNLOCK PASS
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowPaymentModal(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.5)',
                fontSize: 12,
                cursor: 'pointer',
                padding: 6,
                width: '100%',
                textAlign: 'center',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <section style={{ padding: '150px 24px 100px', maxWidth: 1040, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="crx-display" style={{ fontSize: 'clamp(24px,4vw,34px)', color: 'var(--cream)', margin: '0 0 6px' }}>
              MY DASHBOARD
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>
                {user.email}
              </p>
              {participant && (
                <span style={{
                  fontSize: 11,
                  fontFamily: 'monospace',
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  color: 'var(--crx-gold, #D4AF37)',
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}>
                  {candidateId}
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

        {/* Body */}
        {fetchingReg ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '40px 24px', color: 'var(--muted)', fontSize: 13 }}>
            <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite', color: '#DC2626' }} />
            Loading your dashboard...
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
            {/* Top Overview Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
              {/* Profile Card */}
              <div style={{ padding: '24px', borderRadius: 16, border: '1px solid rgba(220,38,38,0.22)', background: 'linear-gradient(160deg,#1a0808 0%,#0A0505 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', position: 'relative' }}>
                <button
                  onClick={() => setShowEditModal(true)}
                  style={{
                    position: 'absolute', top: 20, right: 20,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8, padding: '6px 12px', color: 'var(--cream)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11,
                  }}
                >
                  <Edit3 size={12} /> Edit
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={18} color="#DC2626" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 16, color: 'var(--cream)', fontWeight: 700 }}>
                      {participant.first_name} {participant.last_name || participant.surname}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--muted)' }}>
                      {participant.college_name || 'Attendee'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    ['College', participant.college_name],
                    ['Location', [participant.college_city || participant.city_of_college, participant.college_state || participant.state_of_college].filter(Boolean).join(', ')],
                    ['Phone', participant.phone_number],
                    ['Email', participant.email || user.email],
                  ].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 8 }}>
                      <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
                      <span style={{ fontSize: 12, color: 'var(--cream)', textAlign: 'right', wordBreak: 'break-all', maxWidth: '65%' }}>{val || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pronites Pass & Payment Status Card */}
              <div style={{ padding: '24px', borderRadius: 16, border: '1px solid rgba(220,38,38,0.18)', background: 'linear-gradient(160deg,#130a05 0%,#0A0505 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Ticket size={18} color="var(--crx-gold, #D4AF37)" />
                      <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 700, color: 'var(--cream)' }}>
                        Pronites Pass Status
                      </span>
                    </div>
                    <span style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      color: statusColor,
                      background: isPaid ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
                      border: `1px solid ${isPaid ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`,
                      padding: '3px 10px',
                      borderRadius: 20,
                      letterSpacing: 0.8,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}>
                      <StatusIcon size={12} />
                      {isPaid ? 'ACTIVE / PAID' : 'PAYMENT PENDING'}
                    </span>
                  </div>

                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 16px' }}>
                    {isPaid
                      ? 'Your pass is confirmed. All 4 celebrity pronite and EDM concert nights (Dec 17–20) are unlocked.'
                      : 'Complete your ₹2000 registration fee to activate your entry pass and gate QR code.'}
                  </p>

                  {basicReg && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 14px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: 11, color: 'var(--muted)', display: 'block' }}>Pass Type</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--cream)' }}>
                          {basicReg.registration_type === 'GROUP' ? `Group Pass (${basicReg.group_size || 2} Members)` : 'Single Pass'}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowBRModal(true)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--crx-gold, #D4AF37)',
                          fontSize: 11,
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          padding: 0,
                        }}
                      >
                        Edit Details
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  {!isPaid && (
                    <div style={{ marginBottom: 14 }}>
                      <span style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--muted)', fontWeight: 700, marginBottom: 6 }}>
                        Have a promo code?
                      </span>
                      {appliedPromo ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: 8, padding: '8px 12px', marginBottom: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CheckCircle2 size={13} color="#22c55e" />
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{appliedPromo.code}</span>
                            <span style={{ fontSize: 11, color: '#86efac' }}>({appliedPromo.value}% OFF &bull; -₹{discountAmount})</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemovePromo}
                            style={{ background: 'none', border: 'none', color: '#fca5a5', fontSize: 11, cursor: 'pointer', fontWeight: 700 }}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                              <Tag size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                              <input
                                type="text"
                                value={promoCodeInput}
                                onChange={(e) => { setPromoCodeInput(e.target.value.toUpperCase()); setPromoError(null); }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleApplyPromo(e);
                                  }
                                }}
                                placeholder="ENTER PROMO CODE"
                                style={{
                                  width: '100%',
                                  padding: '8px 10px 8px 28px',
                                  borderRadius: 8,
                                  background: 'rgba(0,0,0,0.5)',
                                  border: '1px solid rgba(255,255,255,0.15)',
                                  color: '#fff',
                                  fontSize: 11.5,
                                  fontFamily: 'monospace',
                                  letterSpacing: 0.8,
                                  textTransform: 'uppercase',
                                  outline: 'none',
                                  boxSizing: 'border-box',
                                }}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleApplyPromo}
                              disabled={validatingPromo || !promoCodeInput.trim()}
                              className="crx-btn"
                              style={{
                                padding: '6px 14px',
                                fontSize: 11,
                                background: 'rgba(212, 175, 55, 0.15)',
                                border: '1px solid rgba(212, 175, 55, 0.4)',
                                color: 'var(--crx-gold, #D4AF37)',
                                fontWeight: 700,
                                borderRadius: 8,
                              }}
                            >
                              {validatingPromo ? '...' : 'APPLY'}
                            </button>
                          </div>
                          {promoError && (
                            <p style={{ margin: '4px 0 0', fontSize: 11, color: '#f87171' }}>{promoError}</p>
                          )}
                          {promoMessage && !promoError && (
                            <p style={{ margin: '4px 0 0', fontSize: 11, color: '#34d399' }}>{promoMessage}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {!isPaid ? (
                    <button
                      className="crx-btn gold"
                      style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8, padding: '12px' }}
                      onClick={handlePayNow}
                      disabled={paying}
                    >
                      <CreditCard size={15} />
                      {paying
                        ? 'LAUNCHING GATEWAY...'
                        : finalPayable === 0
                        ? 'CLAIM FREE PASS (100% OFF)'
                        : `PAY ₹${finalPayable.toLocaleString('en-IN')} & UNLOCK PASS`}
                    </button>
                  ) : !basicReg ? (
                    <button
                      onClick={() => setShowBRModal(true)}
                      className="crx-btn gold"
                      style={{ width: '100%', justifyContent: 'center', fontSize: 12, padding: '10px' }}
                    >
                      REGISTER FOR PRONITES
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            {/* OFFICIAL QR PASSES SECTION */}
            {userTickets.length > 0 && (
              <div
                style={{
                  padding: '28px 24px',
                  borderRadius: 20,
                  border: '1px solid rgba(212, 175, 55, 0.45)',
                  background: 'linear-gradient(160deg, #18080f 0%, #0a0306 100%)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 40px rgba(212, 175, 55, 0.1)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <Ticket size={20} color="var(--crx-gold, #D4AF37)" />
                      <h3 className="crx-display" style={{ fontSize: 20, color: '#fff', margin: 0 }}>
                        OFFICIAL GATE ENTRY PASS {userTickets.length > 1 ? `(${userTickets.length})` : ''}
                      </h3>
                    </div>
                    <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>
                      Present at gate &bull; Valid Dec 17, 18, 19, 20 &bull; 1 scan allowed per day
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={handleEmailAllPasses}
                      disabled={emailingAll}
                      className="crx-btn"
                      style={{
                        fontSize: 12,
                        padding: '8px 16px',
                        background: 'rgba(212, 175, 55, 0.15)',
                        border: '1px solid rgba(212, 175, 55, 0.45)',
                        color: 'var(--crx-gold, #D4AF37)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontWeight: 700,
                      }}
                    >
                      <Mail size={14} /> {emailingAll ? 'Sending Passes...' : (userTickets.length > 1 ? 'Email Passes to Members' : 'Email Pass to Me')}
                    </button>
                    {emailAllMessage && (
                      <div style={{ fontSize: 11, color: emailAllMessage.includes('Sent') ? '#22c55e' : '#ef4444', marginTop: 6, textAlign: 'right' }}>
                        {emailAllMessage}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, justifyContent: 'center' }}>
                  {userTickets.map((t) => (
                    <TicketCard key={t.id || t.ticket_number} ticket={t} />
                  ))}
                </div>
              </div>
            )}

            {/* UNIFIED REGISTERED EVENTS SECTION */}
            <div
              style={{
                padding: '24px 28px',
                borderRadius: 16,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'linear-gradient(160deg, #130a0a 0%, #0a0505 100%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Trophy size={18} color="var(--crx-gold, #D4AF37)" />
                    <h3 className="crx-display" style={{ fontSize: 19, color: 'var(--cream)', margin: 0 }}>
                      MY REGISTERED EVENTS ({sportsList.length + culturalList.length})
                    </h3>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: 12.5, margin: 0 }}>
                    Your enrolled competitive sports and cultural events
                  </p>
                </div>

                <button
                  onClick={() => setPage && setPage('events')}
                  className="crx-btn"
                  style={{
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    color: 'var(--crx-gold, #D4AF37)',
                    fontSize: 11,
                    gap: 6,
                    padding: '8px 14px',
                  }}
                >
                  <PlusCircle size={13} /> EXPLORE MORE EVENTS
                </button>
              </div>

              {sportsList.length + culturalList.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                  {sportsList.map((item) => (
                    <div
                      key={`sport-${item.id || item.event_name}`}
                      style={{
                        padding: '14px 16px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(234, 88, 12, 0.25)',
                        borderRadius: 12,
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
                        <span style={{ fontSize: 10, color: '#fb923c', textTransform: 'uppercase', fontWeight: 600 }}>
                          Sports
                        </span>
                      </div>
                      <span style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: '#22c55e',
                        background: 'rgba(34, 197, 94, 0.12)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        padding: '3px 8px',
                        borderRadius: 12,
                        letterSpacing: 0.5,
                        flexShrink: 0,
                      }}>
                        REGISTERED
                      </span>
                    </div>
                  ))}

                  {culturalList.map((item) => (
                    <div
                      key={`cult-${item.id || item.event_name}`}
                      style={{
                        padding: '14px 16px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(220, 38, 38, 0.25)',
                        borderRadius: 12,
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
                        <span style={{ fontSize: 10, color: '#fca5a5', textTransform: 'uppercase', fontWeight: 600 }}>
                          {item.category || 'Cultural'}
                        </span>
                      </div>
                      <span style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: '#22c55e',
                        background: 'rgba(34, 197, 94, 0.12)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        padding: '3px 8px',
                        borderRadius: 12,
                        letterSpacing: 0.5,
                        flexShrink: 0,
                      }}>
                        REGISTERED
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '24px 16px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 12 }}>
                  <p style={{ color: 'var(--muted)', fontSize: 13, margin: '0 0 12px' }}>
                    You haven't registered for any sports or cultural competitions yet.
                  </p>
                  <button
                    onClick={() => setPage && setPage('events')}
                    className="crx-btn gold"
                    style={{ fontSize: 11.5, margin: '0 auto', gap: 6, padding: '8px 16px' }}
                  >
                    BROWSE 70+ EVENTS <ArrowRight size={12} />
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
              You haven't registered your details yet. You can complete Basic Registration (BR) for pronites or browse 70+ competitive events.
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
