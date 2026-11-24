import React, { useState, useEffect } from 'react';
import {
  Lock,
  User,
  Users,
  CreditCard,
  Tag,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  Mail,
  ChevronRight,
  LogOut,
  Sparkles,
  Ticket,
  Plus,
  Minus,
  RefreshCw,
  Search,
} from 'lucide-react';
import QRCode from 'qrcode';
import { openRazorpayCheckout } from '../lib/razorpay';
import { validatePromoCodeOnline } from '../lib/promoService';
import { calculateDefaultGroupOffer } from '../constants/promoCodes';

const STORAGE_KEY = 'crx_booking_portal_session';

export default function BookingPortalPage({ setPage }) {
  // Authentication State
  const [session, setSession] = useState(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  });

  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Portal Navigation Tab
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'history'

  // Booking Form State
  const [regType, setRegType] = useState('SINGLE'); // 'SINGLE' | 'GROUP'
  const [groupSize, setGroupSize] = useState(2);
  const [activeMemberTab, setActiveMemberTab] = useState(0);

  const [leadForm, setLeadForm] = useState({
    first_name: '',
    surname: '',
    phone_number: '',
    email: '',
    college_name: '',
    city_of_college: '',
    state_of_college: '',
  });

  const [groupMembers, setGroupMembers] = useState(() =>
    Array.from({ length: 9 }, () => ({
      first_name: '',
      surname: '',
      phone_number: '',
      email: '',
      college_name: '',
      city_of_college: '',
      state_of_college: '',
    }))
  );

  // Promo Code State
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState(null);
  const [promoMessage, setPromoMessage] = useState(null);

  // Manual payment override
  const [manualPaymentId, setManualPaymentId] = useState('');
  const [showManualPay, setShowManualPay] = useState(false);

  // Submission State
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [completedBooking, setCompletedBooking] = useState(null);
  const [qrCodeDataUrls, setQrCodeDataUrls] = useState({});

  // History State
  const [historyList, setHistoryList] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Calculate Group Offer and Pricing
  const totalDelegates = regType === 'SINGLE' ? 1 : groupSize;
  const groupOffer = regType === 'GROUP'
    ? calculateDefaultGroupOffer(groupSize)
    : { payable: 1, free: 0, baseTotal: 2000, payableTotal: 2000, discountAmount: 0 };

  const payableSubtotal = groupOffer.payableTotal;
  const groupDiscount = groupOffer.discountAmount || 0;

  // Calculate Promo Discount
  const couponDiscount = appliedPromo
    ? (appliedPromo.type === 'percent'
        ? Math.round((payableSubtotal * (appliedPromo.value || 0)) / 100)
        : Math.min(payableSubtotal, appliedPromo.value || 0))
    : 0;

  const totalDiscount = groupDiscount + couponDiscount;
  const finalPayable = Math.max(0, payableSubtotal - couponDiscount);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginId.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both Portal ID and Password.');
      return;
    }

    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/portal-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          username: loginId.trim(),
          password: loginPassword.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        const sess = {
          token: data.token,
          username: data.username,
          time: Date.now(),
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sess));
        setSession(sess);
      } else {
        setLoginError(data.message || 'Invalid Portal ID or Password.');
      }
    } catch (err) {
      setLoginError('Failed to connect to authentication service. Try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setSession(null);
  };

  // Apply Lead college to all members
  const applyLeadCollegeToAll = () => {
    setGroupMembers((prev) =>
      prev.map((m) => ({
        ...m,
        college_name: leadForm.college_name,
        city_of_college: leadForm.city_of_college,
        state_of_college: leadForm.state_of_college,
      }))
    );
  };

  // Apply Promo Code
  const handleApplyPromo = async (e) => {
    if (e) e.preventDefault();
    setPromoError(null);
    setPromoMessage(null);
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoError('Please enter a promo code.');
      return;
    }

    setPromoLoading(true);
    try {
      const res = await validatePromoCodeOnline(code, {
        payableMembers: groupOffer.payable,
        payableSubtotal,
      });

      if (res && res.valid && res.promo) {
        setAppliedPromo(res.promo);
        setPromoMessage(res.message);
        setPromoError(null);
      } else {
        setAppliedPromo(null);
        setPromoError(res?.message || 'Invalid or expired promo code.');
      }
    } catch (_) {
      setPromoError('Could not verify promo code.');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError(null);
    setPromoMessage(null);
  };

  // Fetch Booking History
  const fetchHistory = async () => {
    if (!session?.token) return;
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/portal-booking?action=list-bookings', {
        headers: { 'x-portal-token': session.token },
      });
      const data = await res.json();
      if (res.ok && data.bookings) {
        setHistoryList(data.bookings);
      }
    } catch (_) {}
    finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  // Construct Candidates Array
  const compileCandidates = () => {
    const list = [
      {
        first_name: leadForm.first_name.trim(),
        surname: leadForm.surname.trim(),
        phone_number: leadForm.phone_number.trim(),
        email: leadForm.email.trim().toLowerCase(),
        college_name: leadForm.college_name.trim(),
        city_of_college: leadForm.city_of_college.trim(),
        state_of_college: leadForm.state_of_college.trim(),
      },
    ];

    if (regType === 'GROUP') {
      const membersCount = groupSize - 1;
      for (let i = 0; i < membersCount; i++) {
        const m = groupMembers[i] || {};
        list.push({
          first_name: (m.first_name || '').trim(),
          surname: (m.surname || '').trim(),
          phone_number: (m.phone_number || '').trim(),
          email: (m.email || leadForm.email || '').trim().toLowerCase(),
          college_name: (m.college_name || leadForm.college_name || '').trim(),
          city_of_college: (m.city_of_college || leadForm.city_of_college || '').trim(),
          state_of_college: (m.state_of_college || leadForm.state_of_college || '').trim(),
        });
      }
    }

    return list;
  };

  // Submit Booking to Backend
  const submitBookingToApi = async (paymentDetails = {}) => {
    const candidates = compileCandidates();

    const payload = {
      action: 'create-booking',
      registration_type: regType,
      candidates,
      promo_code: appliedPromo ? appliedPromo.code : null,
      discount_amount: totalDiscount,
      final_amount: finalPayable,
      razorpay_payment_id: paymentDetails.razorpay_payment_id || `desk_pay_${Date.now()}`,
      razorpay_order_id: paymentDetails.razorpay_order_id || `desk_ord_${Date.now()}`,
      portal_username: session?.username || 'booking_desk',
    };

    const res = await fetch('/api/portal-booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-portal-token': session?.token || '',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to complete portal booking.');
    }

    return data;
  };

  // Generate QR codes for success screen
  const generateQRsForTickets = async (tickets = []) => {
    const urls = {};
    for (const t of tickets) {
      if (t.qr_token) {
        try {
          urls[t.ticket_number] = await QRCode.toDataURL(t.qr_token, {
            width: 300,
            margin: 2,
            color: { dark: '#000000', light: '#ffffff' },
          });
        } catch (_) {}
      }
    }
    setQrCodeDataUrls(urls);
  };

  // Primary Checkout Trigger
  const handleStartBookingPayment = async () => {
    setBookingError(null);

    // Basic Validation
    if (!leadForm.first_name.trim() || !leadForm.surname.trim()) {
      setBookingError('Please enter Member 1 First Name and Surname.');
      return;
    }
    if (!/^[0-9]{10}$/.test(leadForm.phone_number.trim())) {
      setBookingError('Please enter a valid 10-digit phone number for Member 1.');
      return;
    }
    if (!leadForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadForm.email.trim())) {
      setBookingError('Please enter a valid email address for pass delivery.');
      return;
    }
    if (!leadForm.college_name.trim()) {
      setBookingError('Please enter Member 1 College Name.');
      return;
    }

    if (regType === 'GROUP') {
      for (let i = 0; i < groupSize - 1; i++) {
        const m = groupMembers[i];
        if (!m?.first_name?.trim() || !m?.surname?.trim()) {
          setBookingError(`Please enter details for Member ${i + 2}.`);
          setActiveMemberTab(i + 1);
          return;
        }
        if (!/^[0-9]{10}$/.test(m?.phone_number?.trim() || '')) {
          setBookingError(`Please enter a valid 10-digit phone number for Member ${i + 2}.`);
          setActiveMemberTab(i + 1);
          return;
        }
        if (!m?.college_name?.trim()) {
          setBookingError(`Please enter college name for Member ${i + 2}.`);
          setActiveMemberTab(i + 1);
          return;
        }
      }
    }

    // 1. If ₹0 (100% Discount / Complimentary Pass)
    if (finalPayable === 0) {
      setBookingLoading(true);
      try {
        const result = await submitBookingToApi({
          razorpay_payment_id: `comp_${appliedPromo?.code || 'vip'}_${Date.now()}`,
          razorpay_order_id: `comp_ord_${Date.now()}`,
        });
        setCompletedBooking(result);
        generateQRsForTickets(result.tickets);
      } catch (err) {
        setBookingError(err.message);
      } finally {
        setBookingLoading(false);
      }
      return;
    }

    // 2. Launch Razorpay Gateway
    openRazorpayCheckout({
      amount: finalPayable,
      description: regType === 'GROUP'
        ? `Cerebrexia '26 — Portal Desk Group BR (${groupSize} Members)`
        : `Cerebrexia '26 — Portal Desk Single BR`,
      prefill: {
        name: `${leadForm.first_name} ${leadForm.surname}`,
        email: leadForm.email,
        contact: leadForm.phone_number,
      },
      notes: {
        source: 'booking_portal',
        booked_by: session?.username || 'booking_desk',
        promo_code: appliedPromo ? appliedPromo.code : '',
        group_size: String(totalDelegates),
      },
      onSuccess: async (rzpRes) => {
        setBookingLoading(true);
        try {
          const result = await submitBookingToApi(rzpRes);
          setCompletedBooking(result);
          generateQRsForTickets(result.tickets);
        } catch (err) {
          setBookingError(err.message);
        } finally {
          setBookingLoading(false);
        }
      },
      onDismiss: () => {
        setBookingError('Payment cancelled or dismissed.');
      },
      onFallbackPrompt: () => {
        setShowManualPay(true);
      },
    });
  };

  // Manual payment ID submission
  const handleManualPaymentSubmit = async () => {
    if (!manualPaymentId.trim()) {
      setBookingError('Please enter a valid Razorpay Payment ID (e.g. pay_...).');
      return;
    }
    setBookingLoading(true);
    setBookingError(null);
    try {
      const result = await submitBookingToApi({
        razorpay_payment_id: manualPaymentId.trim(),
        razorpay_order_id: `manual_ord_${Date.now()}`,
      });
      setCompletedBooking(result);
      generateQRsForTickets(result.tickets);
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  // Reset form for next booking
  const handleResetForNext = () => {
    setCompletedBooking(null);
    setQrCodeDataUrls({});
    setLeadForm({
      first_name: '',
      surname: '',
      phone_number: '',
      email: '',
      college_name: '',
      city_of_college: '',
      state_of_college: '',
    });
    setGroupMembers(
      Array.from({ length: 9 }, () => ({
        first_name: '',
        surname: '',
        phone_number: '',
        email: '',
        college_name: '',
        city_of_college: '',
        state_of_college: '',
      }))
    );
    setRegType('SINGLE');
    setGroupSize(2);
    setActiveMemberTab(0);
    setAppliedPromo(null);
    setPromoInput('');
    setManualPaymentId('');
    setShowManualPay(false);
    setBookingError(null);
  };

  // -------------------------------------------------------------
  // VIEW 1: LOGIN SCREEN (When operator is unauthenticated)
  // -------------------------------------------------------------
  if (!session) {
    return (
      <div
        style={{
          minHeight: '100vh',
          padding: '120px 20px 60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 440,
            width: '100%',
            background: 'linear-gradient(145deg, rgba(24, 7, 13, 0.95) 0%, rgba(12, 4, 7, 0.98) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: 24,
            padding: '36px 28px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(212, 175, 55, 0.1)',
            backdropFilter: 'blur(20px)',
            boxSizing: 'border-box',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              color: 'var(--crx-gold, #D4AF37)',
            }}
          >
            <Lock size={26} />
          </div>

          <h2
            className="crx-display"
            style={{
              fontSize: 'clamp(22px, 4vw, 28px)',
              color: '#fff',
              margin: '0 0 6px',
              letterSpacing: 1,
            }}
          >
            BOOKING PORTAL
          </h2>
          <p
            style={{
              fontSize: 12.5,
              color: 'var(--muted)',
              margin: '0 0 24px',
              lineHeight: 1.5,
            }}
          >
            Internal Desk Access for Booking Basic Registrations (BR).
            <br />
            Authorized credentials required.
          </p>

          {loginError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: 10,
                padding: '10px 14px',
                color: '#fca5a5',
                fontSize: 12,
                marginBottom: 18,
                textAlign: 'left',
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--cream)', letterSpacing: 0.8, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Portal ID / Username
              </label>
              <input
                type="text"
                placeholder="e.g. booking_desk"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 10,
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--cream)', letterSpacing: 0.8, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 10,
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="crx-btn gold"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                fontSize: 13,
                fontWeight: 700,
                marginTop: 8,
              }}
            >
              {loginLoading ? 'AUTHENTICATING...' : 'ACCESS BOOKING DESK &rarr;'}
            </button>
          </form>

          <p style={{ marginTop: 20, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
            Cerebrexia &apos;26 &bull; Indira Gandhi Institute of Medical Sciences
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: BOOKING SUCCESS CONFIRMATION
  // -------------------------------------------------------------
  if (completedBooking) {
    const tickets = completedBooking.tickets || [];
    return (
      <div style={{ minHeight: '100vh', padding: '120px 20px 80px', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div
          style={{
            background: 'linear-gradient(145deg, rgba(24, 7, 13, 0.95) 0%, rgba(12, 4, 7, 0.98) 100%)',
            border: '1px solid rgba(34, 197, 94, 0.5)',
            borderRadius: 24,
            padding: '36px 28px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(34, 197, 94, 0.15)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '2px solid #22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#22c55e',
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <h2 className="crx-display" style={{ fontSize: 'clamp(26px, 5vw, 36px)', color: '#fff', margin: '0 0 6px' }}>
            BOOKING CONFIRMED!
          </h2>
          <p style={{ fontSize: 14, color: '#86efac', margin: '0 0 16px', fontWeight: 600 }}>
            {completedBooking.message || 'Official Basic Registration passes generated successfully.'}
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 30,
              padding: '6px 18px',
              fontFamily: 'monospace',
              fontSize: 13,
              color: 'var(--crx-gold, #D4AF37)',
              marginBottom: 28,
            }}
          >
            <span>BOOKING REF: {completedBooking.booking_id}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 32 }}>
            {tickets.map((t) => {
              const qrUrl = qrCodeDataUrls[t.ticket_number];
              const downloadQr = () => {
                if (!qrUrl) return;
                const a = document.createElement('a');
                a.href = qrUrl;
                a.download = `Cerebrexia26-Pass-${t.ticket_number}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              };

              return (
                <div
                  key={t.ticket_number}
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: 16,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--crx-gold, #D4AF37)', background: 'rgba(212, 175, 55, 0.15)', padding: '2px 8px', borderRadius: 8, marginBottom: 8 }}>
                    {t.role || 'DELEGATE'}
                  </span>
                  <strong style={{ fontSize: 16, color: '#fff', marginBottom: 2 }}>{t.attendee_name}</strong>
                  <span style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>{t.attendee_college}</span>

                  <div style={{ background: '#fff', borderRadius: 10, padding: 8, marginBottom: 10 }}>
                    {qrUrl ? (
                      <img src={qrUrl} alt={t.ticket_number} style={{ width: 140, height: 140, display: 'block' }} />
                    ) : (
                      <div style={{ width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 11 }}>
                        QR Generated
                      </div>
                    )}
                  </div>

                  <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--crx-gold, #D4AF37)', marginBottom: 10 }}>
                    {t.ticket_number}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#86efac', marginBottom: 12 }}>
                    <Mail size={12} />
                    <span>Sent to: {t.attendee_email}</span>
                  </div>

                  <button
                    type="button"
                    onClick={downloadQr}
                    className="crx-btn gold"
                    style={{ width: '100%', justifyContent: 'center', fontSize: 11, padding: '7px 12px' }}
                  >
                    <Download size={12} /> Save QR Image
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleResetForNext}
              className="crx-btn gold"
              style={{ padding: '12px 28px', fontSize: 13, fontWeight: 700 }}
            >
              + BOOK ANOTHER PASS
            </button>
            <button
              type="button"
              onClick={() => { setCompletedBooking(null); setActiveTab('history'); }}
              className="crx-btn"
              style={{ padding: '12px 24px', fontSize: 13 }}
            >
              VIEW ALL DESK BOOKINGS
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: MAIN OPERATOR PORTAL (New Booking & History)
  // -------------------------------------------------------------
  return (
    <div style={{ minHeight: '100vh', padding: '100px 20px 80px', maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 10 }}>
      {/* Portal Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          background: 'linear-gradient(145deg, rgba(24, 7, 13, 0.9) 0%, rgba(12, 4, 7, 0.95) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: 20,
          padding: '16px 24px',
          marginBottom: 24,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--crx-gold, #D4AF37)',
            }}
          >
            <Ticket size={22} />
          </div>
          <div>
            <h1 className="crx-display" style={{ fontSize: 20, color: '#fff', margin: 0, letterSpacing: 1 }}>
              BOOKING PORTAL
            </h1>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>
              Operator: <strong style={{ color: 'var(--crx-gold, #D4AF37)' }}>{session.username}</strong> &bull; Multiple BRs / 1 Email Supported
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', borderRadius: 10, padding: 3, border: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              type="button"
              onClick={() => setActiveTab('new')}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: 'none',
                background: activeTab === 'new' ? 'var(--crx-gold, #D4AF37)' : 'transparent',
                color: activeTab === 'new' ? '#070204' : '#fff',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              New Booking
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: 'none',
                background: activeTab === 'history' ? 'var(--crx-gold, #D4AF37)' : 'transparent',
                color: activeTab === 'history' ? '#070204' : '#fff',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              Bookings Log
            </button>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '7px 12px',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>

      {/* ----------------- TAB: HISTORY ----------------- */}
      {activeTab === 'history' && (
        <div
          style={{
            background: 'linear-gradient(145deg, rgba(24, 7, 13, 0.95) 0%, rgba(12, 4, 7, 0.98) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: 20,
            padding: 24,
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 className="crx-display" style={{ fontSize: 18, color: '#fff', margin: 0 }}>
              DESK BOOKING HISTORY (RECENT 50)
            </h3>
            <button
              type="button"
              onClick={fetchHistory}
              disabled={historyLoading}
              className="crx-btn"
              style={{ padding: '6px 14px', fontSize: 11 }}
            >
              <RefreshCw size={12} className={historyLoading ? 'spin' : ''} /> Refresh
            </button>
          </div>

          {historyLoading ? (
            <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0' }}>Loading booking records...</p>
          ) : historyList.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0' }}>No bookings made from this portal yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.3)', color: 'var(--crx-gold, #D4AF37)' }}>
                    <th style={{ padding: '10px 8px' }}>Ref / Date</th>
                    <th style={{ padding: '10px 8px' }}>Lead Delegate</th>
                    <th style={{ padding: '10px 8px' }}>Members</th>
                    <th style={{ padding: '10px 8px' }}>Amount</th>
                    <th style={{ padding: '10px 8px' }}>Promo Code</th>
                    <th style={{ padding: '10px 8px' }}>Payment ID</th>
                    <th style={{ padding: '10px 8px' }}>Tickets Issued</th>
                  </tr>
                </thead>
                <tbody>
                  {historyList.map((b) => (
                    <tr key={b.booking_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '10px 8px', fontFamily: 'monospace', color: '#fff' }}>
                        {b.booking_id}
                        <div style={{ fontSize: 10, color: 'var(--muted)' }}>
                          {b.created_at ? new Date(b.created_at).toLocaleDateString('en-IN') : '-'}
                        </div>
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <strong style={{ color: '#fff' }}>{b.lead_name}</strong>
                        <div style={{ fontSize: 10, color: 'var(--muted)' }}>{b.lead_email}</div>
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <span style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--crx-gold, #D4AF37)', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
                          {b.group_size || 1} Person
                        </span>
                      </td>
                      <td style={{ padding: '10px 8px', fontWeight: 700, color: '#86efac' }}>
                        ₹{Number(b.final_amount || 0).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '10px 8px', fontFamily: 'monospace', color: b.promo_code ? '#fcd34d' : 'var(--muted)' }}>
                        {b.promo_code || '-'}
                      </td>
                      <td style={{ padding: '10px 8px', fontFamily: 'monospace', fontSize: 11, color: '#fff' }}>
                        {b.razorpay_payment_id || '-'}
                      </td>
                      <td style={{ padding: '10px 8px', fontFamily: 'monospace', fontSize: 11, color: 'var(--crx-gold, #D4AF37)' }}>
                        {(b.ticket_numbers || []).join(', ') || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ----------------- TAB: NEW BOOKING ----------------- */}
      {activeTab === 'new' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
          {/* Booking Type Selector */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(24, 7, 13, 0.95) 0%, rgba(12, 4, 7, 0.98) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: 20,
              padding: 24,
              boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <button
                type="button"
                onClick={() => { setRegType('SINGLE'); setActiveMemberTab(0); }}
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  borderRadius: 14,
                  border: regType === 'SINGLE' ? '2px solid var(--crx-gold, #D4AF37)' : '1px solid rgba(255,255,255,0.1)',
                  background: regType === 'SINGLE' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0,0,0,0.5)',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <User size={18} color="var(--crx-gold, #D4AF37)" />
                  <strong style={{ fontSize: 14 }}>Single Candidate</strong>
                </div>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>1 Person Basic Registration (₹2,000)</span>
              </button>

              <button
                type="button"
                onClick={() => { setRegType('GROUP'); setActiveMemberTab(0); }}
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  borderRadius: 14,
                  border: regType === 'GROUP' ? '2px solid var(--crx-gold, #D4AF37)' : '1px solid rgba(255,255,255,0.1)',
                  background: regType === 'GROUP' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0,0,0,0.5)',
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Users size={18} color="var(--crx-gold, #D4AF37)" />
                  <strong style={{ fontSize: 14 }}>Group / Delegation</strong>
                </div>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>2 to 50 Candidates (Group Offers Apply)</span>
              </button>
            </div>

            {/* If Group, Group Size Control */}
            {regType === 'GROUP' && (
              <div
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: 14,
                  padding: 16,
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--crx-gold, #D4AF37)', display: 'block', textTransform: 'uppercase' }}>
                    Total Group Size
                  </span>
                  <span style={{ fontSize: 13, color: '#fff' }}>
                    {groupSize} Members &bull; Pay for {groupOffer.payable} {groupOffer.free > 0 && <span style={{ color: '#86efac' }}>({groupOffer.free} FREE)</span>}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setGroupSize((prev) => Math.max(2, prev - 1))}
                    disabled={groupSize <= 2}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Minus size={16} />
                  </button>

                  <select
                    value={groupSize}
                    onChange={(e) => setGroupSize(Number(e.target.value))}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 8,
                      background: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 700,
                      outline: 'none',
                    }}
                  >
                    {Array.from({ length: 49 }, (_, i) => i + 2).map((n) => (
                      <option key={n} value={n}>
                        {n} People
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => setGroupSize((prev) => Math.min(50, prev + 1))}
                    disabled={groupSize >= 50}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Candidate Member Tabs (If Group) */}
            {regType === 'GROUP' && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--cream)', textTransform: 'uppercase' }}>
                    Fill Candidate Details
                  </span>
                  <button
                    type="button"
                    onClick={applyLeadCollegeToAll}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--crx-gold, #D4AF37)',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Copy Lead College to All Members &rarr;
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6 }}>
                  {Array.from({ length: groupSize }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveMemberTab(idx)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        border: activeMemberTab === idx ? '1px solid var(--crx-gold, #D4AF37)' : '1px solid rgba(255,255,255,0.1)',
                        background: activeMemberTab === idx ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0,0,0,0.5)',
                        color: activeMemberTab === idx ? '#fff' : 'var(--muted)',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {idx === 0 ? 'M1 (Lead)' : `M${idx + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Form Fields: Active Candidate */}
            {activeMemberTab === 0 ? (
              // MEMBER 1 (LEAD)
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 18, borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--crx-gold, #D4AF37)', display: 'block', marginBottom: 12, textTransform: 'uppercase' }}>
                  {regType === 'GROUP' ? 'Member 1 (Primary / Lead Delegate Details)' : 'Candidate Details'}
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--cream)', display: 'block', marginBottom: 4 }}>First Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul"
                      value={leadForm.first_name}
                      onChange={(e) => setLeadForm({ ...leadForm, first_name: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--cream)', display: 'block', marginBottom: 4 }}>Surname *</label>
                    <input
                      type="text"
                      placeholder="e.g. Kumar"
                      value={leadForm.surname}
                      onChange={(e) => setLeadForm({ ...leadForm, surname: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--cream)', display: 'block', marginBottom: 4 }}>Phone Number (10 Digits) *</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={leadForm.phone_number}
                      onChange={(e) => setLeadForm({ ...leadForm, phone_number: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--cream)', display: 'block', marginBottom: 4 }}>
                      Email Address (QR Pass Delivery) *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. candidate@gmail.com"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                    />
                    <span style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2, display: 'block' }}>
                      Can be the coordinator&apos;s or candidate&apos;s email. Multiple passes can share this email.
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--cream)', display: 'block', marginBottom: 4 }}>College Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. IGIMS Patna"
                      value={leadForm.college_name}
                      onChange={(e) => setLeadForm({ ...leadForm, college_name: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--cream)', display: 'block', marginBottom: 4 }}>City of College</label>
                    <input
                      type="text"
                      placeholder="e.g. Patna"
                      value={leadForm.city_of_college}
                      onChange={(e) => setLeadForm({ ...leadForm, city_of_college: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--cream)', display: 'block', marginBottom: 4 }}>State of College</label>
                    <input
                      type="text"
                      placeholder="e.g. Bihar"
                      value={leadForm.state_of_college}
                      onChange={(e) => setLeadForm({ ...leadForm, state_of_college: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              // SUBSEQUENT MEMBERS
              (() => {
                const memberIndex = activeMemberTab - 1;
                const m = groupMembers[memberIndex] || {};
                const updateMember = (field, val) => {
                  setGroupMembers((prev) => {
                    const copy = [...prev];
                    copy[memberIndex] = { ...copy[memberIndex], [field]: val };
                    return copy;
                  });
                };

                return (
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: 18, borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--crx-gold, #D4AF37)', textTransform: 'uppercase' }}>
                        Member {activeMemberTab + 1} Details
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          updateMember('college_name', leadForm.college_name);
                          updateMember('city_of_college', leadForm.city_of_college);
                          updateMember('state_of_college', leadForm.state_of_college);
                        }}
                        style={{ background: 'none', border: 'none', color: '#86efac', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}
                      >
                        Copy Lead College Details
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 14 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--cream)', display: 'block', marginBottom: 4 }}>First Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Priya"
                          value={m.first_name || ''}
                          onChange={(e) => updateMember('first_name', e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--cream)', display: 'block', marginBottom: 4 }}>Surname *</label>
                        <input
                          type="text"
                          placeholder="e.g. Singh"
                          value={m.surname || ''}
                          onChange={(e) => updateMember('surname', e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--cream)', display: 'block', marginBottom: 4 }}>Phone Number *</label>
                        <input
                          type="tel"
                          placeholder="e.g. 9876543210"
                          value={m.phone_number || ''}
                          onChange={(e) => updateMember('phone_number', e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--cream)', display: 'block', marginBottom: 4 }}>Email (QR Pass Delivery)</label>
                        <input
                          type="email"
                          placeholder={leadForm.email || 'candidate@gmail.com'}
                          value={m.email || ''}
                          onChange={(e) => updateMember('email', e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                        />
                        <span style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2, display: 'block' }}>
                          Leave blank to send to Lead&apos;s email ({leadForm.email || 'Lead Email'})
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--cream)', display: 'block', marginBottom: 4 }}>College Name *</label>
                        <input
                          type="text"
                          placeholder={leadForm.college_name || 'College Name'}
                          value={m.college_name || ''}
                          onChange={(e) => updateMember('college_name', e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--cream)', display: 'block', marginBottom: 4 }}>City of College</label>
                        <input
                          type="text"
                          placeholder={leadForm.city_of_college || 'City'}
                          value={m.city_of_college || ''}
                          onChange={(e) => updateMember('city_of_college', e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--cream)', display: 'block', marginBottom: 4 }}>State of College</label>
                        <input
                          type="text"
                          placeholder={leadForm.state_of_college || 'State'}
                          value={m.state_of_college || ''}
                          onChange={(e) => updateMember('state_of_college', e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
          </div>

          {/* Pricing & Promo Code Card */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(24, 7, 13, 0.95) 0%, rgba(12, 4, 7, 0.98) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: 20,
              padding: 24,
              boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
            }}
          >
            <h3 className="crx-display" style={{ fontSize: 18, color: '#fff', margin: '0 0 16px' }}>
              PAYMENT & PROMO CODES
            </h3>

            {/* Promo Code Box */}
            <div style={{ marginBottom: 20 }}>
              {appliedPromo ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.35)',
                    borderRadius: 10,
                    padding: '10px 14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={16} color="#22c55e" />
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{appliedPromo.code}</span>
                      <span style={{ fontSize: 11, color: '#86efac', marginLeft: 8 }}>
                        ({appliedPromo.value}% OFF &bull; -₹{couponDiscount.toLocaleString('en-IN')})
                      </span>
                    </div>
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
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Tag size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                    <input
                      type="text"
                      placeholder="ENTER PROMO / COUPON CODE"
                      value={promoInput}
                      onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(null); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleApplyPromo(e); }}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 34px',
                        borderRadius: 10,
                        background: 'rgba(0,0,0,0.6)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff',
                        fontSize: 12,
                        fontFamily: 'monospace',
                        textTransform: 'uppercase',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoLoading || !promoInput.trim()}
                    className="crx-btn"
                    style={{ padding: '0 18px', fontSize: 11, fontWeight: 700 }}
                  >
                    {promoLoading ? '...' : 'APPLY'}
                  </button>
                </div>
              )}

              {promoError && <p style={{ margin: '6px 0 0', fontSize: 11, color: '#f87171' }}>{promoError}</p>}
              {promoMessage && !promoError && <p style={{ margin: '6px 0 0', fontSize: 11, color: '#34d399' }}>{promoMessage}</p>}
            </div>

            {/* Price Breakdown */}
            <div
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: '14px 18px',
                marginBottom: 20,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--muted)', marginBottom: 8 }}>
                <span>Subtotal ({totalDelegates} Person @ ₹2,000/person):</span>
                <span>₹{(totalDelegates * 2000).toLocaleString('en-IN')}</span>
              </div>

              {groupDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#86efac', marginBottom: 8 }}>
                  <span>Group Tier Offer Discount:</span>
                  <span>-₹{groupDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#86efac', marginBottom: 8 }}>
                  <span>Promo Discount ({appliedPromo?.code}):</span>
                  <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  paddingTop: 10,
                  marginTop: 6,
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Final Payable Amount:</span>
                <span style={{ fontSize: 24, fontWeight: 800, color: finalPayable === 0 ? '#22c55e' : 'var(--crx-gold, #D4AF37)' }}>
                  {finalPayable === 0 ? 'FREE / ₹0' : `₹${finalPayable.toLocaleString('en-IN')}`}
                </span>
              </div>
            </div>

            {bookingError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  color: '#fca5a5',
                  fontSize: 12,
                  marginBottom: 16,
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{bookingError}</span>
              </div>
            )}

            {/* Launch Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                type="button"
                onClick={handleStartBookingPayment}
                disabled={bookingLoading}
                className="crx-btn gold"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '14px',
                  fontSize: 13.5,
                  fontWeight: 700,
                }}
              >
                {bookingLoading
                  ? 'PROCESSING BOOKING...'
                  : finalPayable === 0
                  ? `ISSUE ${totalDelegates} FREE BR PASS(ES) (₹0)`
                  : `PAY ₹${finalPayable.toLocaleString('en-IN')} VIA RAZORPAY GATEWAY`}
              </button>

              <div style={{ textAlign: 'center', marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setShowManualPay(!showManualPay)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted)',
                    fontSize: 11.5,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  {showManualPay ? 'Hide Manual Payment ID Input' : 'Paid via Direct UPI / Cash at Desk? Enter Payment ID'}
                </button>
              </div>

              {/* Manual Payment ID Input Box */}
              {showManualPay && (
                <div
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    borderRadius: 12,
                    padding: 14,
                    marginTop: 8,
                  }}
                >
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--cream)', display: 'block', marginBottom: 4 }}>
                    Enter Razorpay Payment ID / Desk Receipt ID
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      placeholder="e.g. pay_QXXXXXXXXXXXXX"
                      value={manualPaymentId}
                      onChange={(e) => setManualPaymentId(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        borderRadius: 8,
                        background: 'rgba(0,0,0,0.6)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff',
                        fontSize: 12,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleManualPaymentSubmit}
                      disabled={bookingLoading}
                      className="crx-btn"
                      style={{ padding: '0 16px', fontSize: 11, fontWeight: 700 }}
                    >
                      CONFIRM
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
