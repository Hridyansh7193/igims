import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BedDouble,
  Phone,
  ShieldCheck,
  MessageCircle,
  Wifi,
  Cctv,
  Droplets,
  Sparkles,
  Stethoscope,
  Users,
  Utensils,
  IndianRupee,
  Check,
  Calendar,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Printer,
} from 'lucide-react';
import Reveal from '../components/common/Reveal';
import Sticker from '../components/common/Sticker';
import { useAuth } from '../context/AuthContext';
import { fetchParticipantProfile } from '../lib/eventsService';
import {
  bookAccommodationWithRazorpay,
  fetchUserAccommodation,
} from '../lib/accommodationService';
import {
  ACCOMMODATION_FACTS,
  ACCOMMODATION_DATES,
  PRICE_PER_DAY,
  ACCOMMODATION_STEPS,
  ACCOMMODATION_BOYS,
  ACCOMMODATION_GIRLS,
  ACCOMMODATION_GUIDELINES,
  ACCOMMODATION_CONTACTS,
  ACCOMMODATION_INSTAGRAM,
} from '../constants/accommodationData';
import { useIsNarrow } from '../hooks/useIsNarrow';

const RED = '#DC2626';
// Festival starts 17 Dec 2026
const START_DATE = new Date(2026, 11, 17, 0, 0, 0);

const CARD_BG = 'linear-gradient(160deg, #181212 0%, #0A0505 100%)';
const CARD_BORDER = '1px solid rgba(255,255,255,0.08)';

function iconForFacility(text) {
  const t = text.toLowerCase();
  if (t.includes('wi-fi')) return Wifi;
  if (t.includes('cctv') || t.includes('security')) return Cctv;
  if (t.includes('water')) return Droplets;
  if (t.includes('washroom') || t.includes('housekeeping')) return Sparkles;
  if (t.includes('medical')) return Stethoscope;
  if (t.includes('common area')) return Users;
  return BedDouble;
}

function useCountdown(target) {
  const calc = () => Math.max(0, target.getTime() - Date.now());
  const [ms, setMs] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setMs(calc()), 30000);
    return () => clearInterval(id);
  }, [target]);

  const mins = Math.floor(ms / 60000);
  return {
    done: ms <= 0,
    days: Math.floor(mins / 1440),
    hours: Math.floor((mins % 1440) / 60),
    minutes: mins % 60,
  };
}

export default function AccommodationPage() {
  const narrow = useIsNarrow(760);
  const { user, signInWithGoogle } = useAuth();
  const [tab, setTab] = useState('boys');
  const cd = useCountdown(START_DATE);

  // Booking Form State
  const [selectedGender, setSelectedGender] = useState('BOYS'); // 'BOYS' or 'GIRLS'
  const [selectedDateIds, setSelectedDateIds] = useState(['2026-12-17', '2026-12-18', '2026-12-19', '2026-12-20']); // All 4 by default
  const [profile, setProfile] = useState(null);
  const [phoneInput, setPhoneInput] = useState('');
  const [collegeInput, setCollegeInput] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [paying, setPaying] = useState(false);
  const [bookError, setBookError] = useState(null);

  const group = tab === 'boys' ? ACCOMMODATION_BOYS : ACCOMMODATION_GIRLS;

  // Load existing profile & booking
  useEffect(() => {
    if (!user) {
      setConfirmedBooking(null);
      return;
    }
    fetchParticipantProfile(user.id, user.user_metadata).then((p) => {
      setProfile(p);
      if (p?.phone_number) setPhoneInput(p.phone_number);
      if (p?.college_name) setCollegeInput(p.college_name);
      if (p?.gender && p.gender.toUpperCase().includes('F')) {
        setSelectedGender('GIRLS');
        setTab('girls');
      }
    });

    fetchUserAccommodation(user.id).then((b) => {
      if (b) setConfirmedBooking(b);
    });
  }, [user]);

  // Toggle single date
  const toggleDate = (dateId) => {
    setSelectedDateIds((prev) => {
      if (prev.includes(dateId)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((d) => d !== dateId);
      }
      return [...prev, dateId].sort();
    });
    setBookError(null);
  };

  // Select all 4 dates
  const selectAllDates = () => {
    setSelectedDateIds(ACCOMMODATION_DATES.map((d) => d.id));
    setBookError(null);
  };

  // Dynamic calculations
  const numDays = selectedDateIds.length;
  const totalAmount = numDays * PRICE_PER_DAY;

  const selectedDateLabels = useMemo(() => {
    return ACCOMMODATION_DATES.filter((d) => selectedDateIds.includes(d.id)).map((d) => d.dateStr);
  }, [selectedDateIds]);

  // Handle booking submission
  const handleProceedToPayment = async () => {
    if (!user) {
      try {
        await signInWithGoogle();
      } catch (err) {
        setBookError(err?.message || 'Please sign in to proceed.');
      }
      return;
    }

    if (selectedDateIds.length === 0) {
      setBookError('Please select at least one date for your accommodation.');
      return;
    }

    setPaying(true);
    setBookError(null);

    const mergedProfile = {
      ...(profile || {}),
      phone_number: phoneInput.trim() || profile?.phone_number || '',
      college_name: collegeInput.trim() || profile?.college_name || '',
    };

    try {
      const booking = await bookAccommodationWithRazorpay({
        user,
        profile: mergedProfile,
        gender: selectedGender,
        selectedDates: selectedDateLabels,
        onSuccess: (saved) => {
          setConfirmedBooking(saved);
          setPaying(false);
        },
        onError: (err) => {
          if (!err?.cancelled) {
            setBookError(err?.message || 'Payment could not be completed. Please retry.');
          }
          setPaying(false);
        },
      });
      if (booking) {
        setConfirmedBooking(booking);
      }
    } catch (err) {
      if (!err?.cancelled) {
        setBookError(err?.message || 'Booking failed. Please try again.');
      }
    } finally {
      setPaying(false);
    }
  };

  return (
    <section style={{ padding: '150px 24px 100px' }}>
      <style>{`
        @keyframes accGlow { 0%,100% { box-shadow: 0 0 22px rgba(220,38,38,0.28); } 50% { box-shadow: 0 0 40px rgba(220,38,38,0.5); } }
        @keyframes accFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .acc-lift { transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
        .acc-lift:hover { transform: translateY(-3px); border-color: rgba(220,38,38,0.55) !important; box-shadow: 0 10px 30px rgba(220,38,38,0.12); }
        .acc-panel { animation: accFade .35s ease; }
        .acc-btn { transition: transform .2s ease, background .2s ease; }
        .acc-btn:hover { transform: translateY(-1px); }
        .date-chip { transition: all 0.2s ease; cursor: pointer; user-select: none; }
        .date-chip:hover { transform: translateY(-2px); }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Hero */}
        <Reveal>
          <div
            style={{
              display: 'flex',
              flexDirection: narrow ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: narrow ? 'flex-start' : 'flex-end',
              gap: 28,
              marginBottom: 50,
            }}
          >
            <div style={{ maxWidth: 580 }}>
              <Sticker tone="gold" rotate={-2} style={{ marginBottom: 16 }}>
                Staying on Campus · 17 to 20 Dec
              </Sticker>
              <h1 className="crx-display" style={{ fontSize: 'clamp(36px,7vw,72px)', color: 'var(--cream)', margin: '0 0 12px' }}>
                ACCOMMODATION
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: 14.5, margin: 0, lineHeight: 1.7 }}>
                Stay on campus during Cerebrexia '26, <strong>17 – 20 December</strong>, for just <strong>₹150/day</strong>.
                Safe, clean and furnished hostel rooms for boys and lodgings for girls right next to festival arenas.
              </p>
            </div>

            {/* Price badge + countdown */}
            <div
              style={{
                background: CARD_BG,
                border: '1px solid rgba(220,38,38,0.35)',
                borderRadius: 18,
                padding: '20px 24px',
                minWidth: narrow ? '100%' : 280,
                boxSizing: 'border-box',
                animation: 'accGlow 3.5s ease-in-out infinite',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'rgba(220,38,38,0.14)',
                    border: '1px solid rgba(220,38,38,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IndianRupee size={18} color={RED} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>
                    Fixed Tariff · Boys &amp; Girls
                  </p>
                  <p className="crx-display" style={{ margin: 0, fontSize: 28, color: 'var(--cream)', lineHeight: 1.1 }}>
                    ₹150 <span style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'sans-serif' }}>/ day</span>
                  </p>
                </div>
              </div>

              {cd.done ? (
                <p style={{ margin: 0, fontSize: 13, color: '#86efac', fontWeight: 700 }}>Accommodation is live — 17 to 20 Dec</p>
              ) : (
                <>
                  <p style={{ margin: '0 0 8px', fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--muted)' }}>
                    Check-in starts 17 Dec in
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      [cd.days, 'Days'],
                      [cd.hours, 'Hrs'],
                      [cd.minutes, 'Min'],
                    ].map(([v, l]) => (
                      <div
                        key={l}
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          background: 'rgba(0,0,0,0.45)',
                          border: CARD_BORDER,
                          borderRadius: 10,
                          padding: '8px 4px',
                        }}
                      >
                        <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'var(--cream)' }}>{String(v).padStart(2, '0')}</p>
                        <p style={{ margin: 0, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)' }}>{l}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </Reveal>

        {/* ── BOOKING SECTION / CONFIRMATION RECEIPT ─────────────────────────── */}
        <Reveal>
          <div
            id="book-accommodation"
            style={{
              background: 'linear-gradient(165deg, #1f0b0b 0%, #0d0404 100%)',
              border: '1.5px solid rgba(220,38,38,0.5)',
              borderRadius: 20,
              padding: narrow ? '24px 18px' : '36px 36px',
              marginBottom: 70,
              boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(220,38,38,0.12)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Ambient corner glow */}
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'rgba(220,38,38,0.18)', filter: 'blur(60px)', borderRadius: '50%', pointerEvents: 'none' }} />

            {confirmedBooking ? (
              /* ── CONFIRMED PASS CARD ─────────────────────────────────────── */
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '1px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={24} color="#22c55e" />
                  </div>
                  <div>
                    <span style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#86efac', fontWeight: 800 }}>
                      BOOKING CONFIRMED &bull; PASS ACTIVE
                    </span>
                    <h2 className="crx-display" style={{ fontSize: 'clamp(22px, 4vw, 32px)', color: 'var(--cream)', margin: 0 }}>
                      YOUR ACCOMMODATION IS RESERVED
                    </h2>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 14,
                    padding: '20px 24px',
                    display: 'grid',
                    gridTemplateColumns: narrow ? '1fr' : 'repeat(3, 1fr)',
                    gap: 16,
                    marginBottom: 24,
                  }}
                >
                  <div>
                    <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Booking ID</span>
                    <strong style={{ fontSize: 16, color: 'var(--gold)', letterSpacing: 1 }}>{confirmedBooking.booking_id}</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Resident Name</span>
                    <strong style={{ fontSize: 15, color: '#fff' }}>{confirmedBooking.full_name}</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Stay Allocation</span>
                    <strong style={{ fontSize: 15, color: confirmedBooking.gender === 'GIRLS' ? '#f472b6' : '#60a5fa' }}>
                      {confirmedBooking.gender === 'GIRLS' ? 'Girls Lodgings' : 'Boys Hostel Rooms'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Reserved Dates</span>
                    <strong style={{ fontSize: 14, color: '#fff' }}>
                      {Array.isArray(confirmedBooking.selected_dates)
                        ? confirmedBooking.selected_dates.join(' · ')
                        : confirmedBooking.selected_dates}
                    </strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Total Amount Paid</span>
                    <strong style={{ fontSize: 15, color: '#86efac' }}>₹{confirmedBooking.amount_inr}</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Payment Ref</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'monospace' }}>
                      {confirmedBooking.razorpay_payment_id || 'VERIFIED'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <p style={{ margin: 0, fontSize: 12.5, color: 'var(--muted)' }}>
                    &bull; Carry your College ID / Aadhaar card at hostel check-in desk.
                  </p>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="crx-btn"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 12 }}
                  >
                    <Printer size={14} /> Print / Save Voucher
                  </button>
                </div>
              </div>
            ) : (
              /* ── DATE SELECTION & PAYMENT FORM ───────────────────────────── */
              <div>
                <div style={{ marginBottom: 24 }}>
                  <Sticker tone="red" rotate={-1} style={{ marginBottom: 10 }}>
                    Instant Online Reservation
                  </Sticker>
                  <h2 className="crx-display" style={{ fontSize: 'clamp(24px, 4.5vw, 36px)', color: 'var(--cream)', margin: '0 0 8px' }}>
                    BOOK YOUR STAY (₹150 / DAY)
                  </h2>
                  <p style={{ color: 'var(--muted)', fontSize: 13.5, margin: 0, lineHeight: 1.6 }}>
                    Select the dates you will be staying at IGIMS Patna during Cerebrexia '26. You can choose any combination of days from 17 to 20 December.
                  </p>
                </div>

                {bookError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(220,38,38,0.15)', border: '1px solid #DC2626', borderRadius: 10, color: '#ff8f8f', fontSize: 13, marginBottom: 20 }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{bookError}</span>
                  </div>
                )}

                {/* 1. Stay Type Selector (Boys/Girls) */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: 'var(--gold)', fontWeight: 700, marginBottom: 8 }}>
                    1. Select Accommodation Type
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1fr', gap: 12 }}>
                    <div
                      onClick={() => { setSelectedGender('BOYS'); setTab('boys'); }}
                      className="date-chip"
                      style={{
                        padding: '16px 18px',
                        borderRadius: 12,
                        background: selectedGender === 'BOYS' ? 'rgba(220,38,38,0.2)' : 'rgba(0,0,0,0.4)',
                        border: selectedGender === 'BOYS' ? `2px solid ${RED}` : '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <strong style={{ display: 'block', fontSize: 15, color: '#fff' }}>Boys Hostel Rooms</strong>
                        <span style={{ fontSize: 12, color: 'var(--muted)' }}>Beds &amp; clean amenities in boys hostel campus</span>
                      </div>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', border: selectedGender === 'BOYS' ? `6px solid ${RED}` : '2px solid rgba(255,255,255,0.3)', background: '#fff' }} />
                    </div>

                    <div
                      onClick={() => { setSelectedGender('GIRLS'); setTab('girls'); }}
                      className="date-chip"
                      style={{
                        padding: '16px 18px',
                        borderRadius: 12,
                        background: selectedGender === 'GIRLS' ? 'rgba(220,38,38,0.2)' : 'rgba(0,0,0,0.4)',
                        border: selectedGender === 'GIRLS' ? `2px solid ${RED}` : '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <strong style={{ display: 'block', fontSize: 15, color: '#fff' }}>Girls Lodgings</strong>
                        <span style={{ fontSize: 12, color: 'var(--muted)' }}>Safe premises with 24x7 female security</span>
                      </div>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', border: selectedGender === 'GIRLS' ? `6px solid ${RED}` : '2px solid rgba(255,255,255,0.3)', background: '#fff' }} />
                    </div>
                  </div>
                </div>

                {/* 2. Date Selection (17, 18, 19, 20 Dec) */}
                <div style={{ marginBottom: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                    <label style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: 'var(--gold)', fontWeight: 700 }}>
                      2. Choose Stay Dates (₹150 / day)
                    </label>
                    <button
                      type="button"
                      onClick={selectAllDates}
                      style={{ background: 'none', border: 'none', color: 'var(--cyan)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                    >
                      Select All 4 Days (17 – 20 Dec)
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 10 }}>
                    {ACCOMMODATION_DATES.map((d) => {
                      const isSelected = selectedDateIds.includes(d.id);
                      return (
                        <div
                          key={d.id}
                          onClick={() => toggleDate(d.id)}
                          className="date-chip"
                          style={{
                            padding: '16px 14px',
                            borderRadius: 12,
                            background: isSelected ? 'rgba(212, 175, 106, 0.15)' : 'rgba(0,0,0,0.4)',
                            border: isSelected ? '1.5px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)',
                            textAlign: 'center',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
                            <Calendar size={14} color={isSelected ? 'var(--gold)' : 'var(--muted)'} />
                            <strong style={{ fontSize: 15, color: isSelected ? 'var(--gold)' : '#fff' }}>{d.dateStr}</strong>
                          </div>
                          <span style={{ fontSize: 11, color: isSelected ? '#fff' : 'var(--muted)', display: 'block' }}>
                            {d.label.split('·')[0]}
                          </span>
                          <span style={{ fontSize: 11, color: isSelected ? '#86efac' : 'var(--muted)', fontWeight: 600, marginTop: 4, display: 'block' }}>
                            {isSelected ? '✓ ₹150' : '+ Add ₹150'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Resident Contact details */}
                <div style={{ marginBottom: 28 }}>
                  <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, color: 'var(--gold)', fontWeight: 700, marginBottom: 8 }}>
                    3. Resident Details
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : 'repeat(3, 1fr)', gap: 12 }}>
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Full Name</span>
                      <input
                        type="text"
                        readOnly
                        value={
                          [profile?.first_name, profile?.last_name || profile?.surname].filter(Boolean).join(' ') ||
                          user?.user_metadata?.full_name ||
                          user?.user_metadata?.name ||
                          (user ? 'Signed in Delegate' : 'Please sign in')
                        }
                        style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px', color: '#ccc', fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Mobile Number</span>
                      <input
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="e.g. 9876543210"
                        style={{ width: '100%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>College / Institution</span>
                      <input
                        type="text"
                        value={collegeInput}
                        onChange={(e) => setCollegeInput(e.target.value)}
                        placeholder="e.g. AIIMS Patna / IGIMS"
                        style={{ width: '100%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 13 }}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Price Summary & Checkout Action */}
                <div
                  style={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: 20,
                    display: 'flex',
                    flexDirection: narrow ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: narrow ? 'stretch' : 'center',
                    gap: 16,
                  }}
                >
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                      Selected: <strong>{numDays} Day{numDays > 1 ? 's' : ''}</strong> ({selectedDateLabels.join(', ')}) &bull; ₹150 / day
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 700 }}>Total Payable:</span>
                      <span style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>₹{totalAmount}</span>
                    </div>
                  </div>

                  {user ? (
                    <button
                      type="button"
                      onClick={handleProceedToPayment}
                      disabled={paying || numDays === 0}
                      className="crx-btn gold"
                      style={{
                        padding: '14px 28px',
                        fontSize: 14,
                        fontWeight: 700,
                        justifyContent: 'center',
                        gap: 10,
                        opacity: paying ? 0.7 : 1,
                      }}
                    >
                      {paying ? (
                        <>
                          <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                          OPENING RAZORPAY...
                        </>
                      ) : (
                        <>
                          <Lock size={15} />
                          PAY ₹{totalAmount} VIA RAZORPAY
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={signInWithGoogle}
                      className="crx-btn"
                      style={{
                        background: '#fff',
                        color: '#111',
                        padding: '14px 24px',
                        fontSize: 13.5,
                        fontWeight: 700,
                        justifyContent: 'center',
                        gap: 10,
                      }}
                    >
                      SIGN IN WITH GOOGLE TO BOOK
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </Reveal>

        {/* Facts grid */}
        <Reveal delay={0.05}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: narrow ? '1fr 1fr' : 'repeat(3,1fr)',
              gap: 1,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              overflow: 'hidden',
              marginBottom: 70,
            }}
          >
            {ACCOMMODATION_FACTS.map((f) => (
              <div key={f.label} style={{ background: '#0A0505', padding: '22px 20px' }}>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: 1.2,
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    fontWeight: 700,
                    margin: '0 0 8px',
                  }}
                >
                  {f.label}
                </p>
                <p style={{ fontSize: 14.5, color: 'var(--cream)', margin: 0, lineHeight: 1.5 }}>{f.value}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Boys / Girls Facilities toggle */}
        <Reveal>
          <div style={{ marginBottom: 70 }}>
            <div
              style={{
                display: 'inline-flex',
                padding: 4,
                gap: 4,
                background: 'rgba(0,0,0,0.5)',
                border: CARD_BORDER,
                borderRadius: 999,
                marginBottom: 22,
              }}
            >
              {[
                ['boys', 'For Boys', 'Hostel Rooms'],
                ['girls', 'For Girls', 'Lodgings'],
              ].map(([key, label, sub]) => {
                const active = tab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className="acc-btn"
                    style={{
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: 999,
                      padding: narrow ? '10px 16px' : '10px 24px',
                      background: active ? RED : 'transparent',
                      color: active ? '#fff' : 'var(--muted)',
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      boxShadow: active ? '0 4px 18px rgba(220,38,38,0.4)' : 'none',
                    }}
                  >
                    {label}
                    <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 500, opacity: 0.8 }}>{narrow ? '' : `· ${sub}`}</span>
                  </button>
                );
              })}
            </div>

            <div key={tab} className="acc-panel">
              <p style={{ fontSize: 12, color: 'var(--cream)', fontWeight: 700, margin: '0 0 12px', letterSpacing: 0.4 }}>
                Facilities Provided
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: narrow ? '1fr' : 'repeat(3,1fr)',
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                {group.facilities.map((f) => {
                  const Icon = iconForFacility(f);
                  return (
                    <div
                      key={f}
                      className="acc-lift"
                      style={{
                        display: 'flex',
                        gap: 12,
                        alignItems: 'flex-start',
                        background: CARD_BG,
                        border: CARD_BORDER,
                        borderRadius: 14,
                        padding: '16px 16px',
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          flexShrink: 0,
                          borderRadius: 10,
                          background: 'rgba(220,38,38,0.12)',
                          border: '1px solid rgba(220,38,38,0.35)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={17} color={RED} />
                      </div>
                      <p style={{ margin: 0, fontSize: 13.5, color: 'var(--cream)', lineHeight: 1.55 }}>{f}</p>
                    </div>
                  );
                })}
              </div>

              <div
                className="acc-lift"
                style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                  background: CARD_BG,
                  border: CARD_BORDER,
                  borderRadius: 14,
                  padding: '18px 18px',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    borderRadius: 10,
                    background: 'rgba(212,175,106,0.12)',
                    border: '1px solid rgba(212,175,106,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Utensils size={17} color="#D4AF6A" />
                </div>
                <div>
                  <p style={{ margin: '0 0 6px', fontSize: 12, color: 'var(--cream)', fontWeight: 700 }}>Food &amp; Mess</p>
                  <p style={{ margin: 0, fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.7 }}>{group.food}</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Process steps — timeline */}
        <Reveal>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 50, marginBottom: 36 }}>
            <Sticker tone="cyan" rotate={2} style={{ marginBottom: 16 }}>
              How It Works
            </Sticker>
            <h2 className="crx-display" style={{ fontSize: 'clamp(26px,4.5vw,42px)', color: 'var(--cream)', margin: 0 }}>
              Four Steps to a Bed on Campus
            </h2>
          </div>
        </Reveal>

        <div style={{ position: 'relative', marginBottom: 60 }}>
          {/* vertical connecting line */}
          <div
            style={{
              position: 'absolute',
              left: 16,
              top: 18,
              bottom: 18,
              width: 2,
              background: 'linear-gradient(180deg, rgba(220,38,38,0.7), rgba(220,38,38,0.1))',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {ACCOMMODATION_STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.07}>
                <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', position: 'relative' }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      flexShrink: 0,
                      borderRadius: '50%',
                      background: '#1A0707',
                      border: `2px solid ${RED}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 800,
                      color: '#fff',
                      boxShadow: '0 0 16px rgba(220,38,38,0.55)',
                      zIndex: 1,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div
                    className="acc-lift"
                    style={{
                      flex: 1,
                      background: CARD_BG,
                      border: CARD_BORDER,
                      borderRadius: 14,
                      padding: '16px 20px',
                    }}
                  >
                    <h3 style={{ fontSize: 15.5, color: 'var(--cream)', margin: '0 0 6px', fontWeight: 700 }}>{s.title}</h3>
                    <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>{s.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Guidelines */}
        <Reveal>
          <div
            style={{
              background: 'rgba(220,38,38,0.06)',
              border: '1px solid rgba(220,38,38,0.25)',
              borderRadius: 14,
              padding: '24px 24px',
              marginBottom: 40,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <ShieldCheck size={22} color={RED} />
              <h3 style={{ fontSize: 16, color: 'var(--cream)', margin: 0, fontWeight: 700 }}>Important Guidelines</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ACCOMMODATION_GUIDELINES.map((g) => (
                <div key={g} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      flexShrink: 0,
                      marginTop: 1,
                      borderRadius: '50%',
                      background: 'rgba(220,38,38,0.16)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={12} color={RED} />
                  </div>
                  <p style={{ margin: 0, fontSize: 13.5, color: 'var(--paper)', lineHeight: 1.7 }}>{g}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── CONTACTS SECTION (Only Ankit kumar, Mritunjay, Swati singh) ──── */}
        <Reveal>
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <Phone size={20} color={RED} />
              <h3 style={{ fontSize: 16, color: 'var(--cream)', margin: 0, fontWeight: 700 }}>Accommodation Help Desk</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : 'repeat(3,1fr)', gap: 12 }}>
              {ACCOMMODATION_CONTACTS.map((c) => (
                <div
                  key={c.name}
                  className="acc-lift"
                  style={{ background: CARD_BG, border: CARD_BORDER, borderRadius: 12, padding: '16px 18px' }}
                >
                  <p style={{ fontSize: 15, color: 'var(--cream)', margin: '0 0 4px', fontWeight: 700 }}>{c.name}</p>
                  <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: '0 0 14px' }}>+91 {c.phone}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a
                      href={`tel:+91${c.phone}`}
                      className="acc-btn"
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        padding: '8px 10px',
                        borderRadius: 8,
                        background: RED,
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      <Phone size={13} /> Call
                    </a>
                    <a
                      href={`https://wa.me/91${c.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="acc-btn"
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        padding: '8px 10px',
                        borderRadius: 8,
                        background: 'rgba(34,197,94,0.12)',
                        border: '1px solid rgba(34,197,94,0.4)',
                        color: '#86efac',
                        fontSize: 12,
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      <MessageCircle size={13} /> WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <a
              href={`https://instagram.com/${ACCOMMODATION_INSTAGRAM.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="acc-btn"
              style={{
                display: 'inline-block',
                marginTop: 14,
                fontSize: 13,
                color: 'var(--gold)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Instagram: {ACCOMMODATION_INSTAGRAM} →
            </a>
          </div>
        </Reveal>

        <Reveal>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              background: 'rgba(220,38,38,0.06)',
              border: '1px solid rgba(220,38,38,0.25)',
              borderRadius: 14,
              padding: '20px 24px',
            }}
          >
            <BedDouble size={26} color={RED} style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 13.5, color: 'var(--paper)', margin: 0, lineHeight: 1.7 }}>
              Basic Registration (BR) is mandatory for accommodation. Closed campus, 24x7 accessibility, safe and
              secure environment across all festival days (17 to 20 December).
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
