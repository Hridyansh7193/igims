import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  User,
  Users,
  Phone,
  Building2,
  MapPin,
  Mail,
  Loader2,
  Music,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Ticket,
  Tag,
  ArrowRight,
  Plus,
  Minus,
  CreditCard,
  AlertCircle,
  Percent,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  saveBasicRegistration,
  fetchBasicRegistration,
  fetchParticipantProfile,
  markBasicRegistrationPaid,
} from '../../lib/eventsService';
import { validatePromoCode, calculateDefaultGroupOffer } from '../../constants/promoCodes';
import { openRazorpayCheckout } from '../../lib/razorpay';

const REG_PRICE_PER_PERSON = 2000;
const MAX_GROUP_SIZE = 50;

export default function BasicRegistrationModal({
  initialProfile,
  onClose,
  onSuccess,
}) {
  const { user } = useAuth();

  // Prefill name from Google OAuth metadata if initialProfile is empty
  const googleNameParts = (user?.user_metadata?.full_name || user?.user_metadata?.name || '').trim().split(/\s+/);
  const defaultFirstName = initialProfile?.first_name || (googleNameParts[0] && googleNameParts[0] !== 'undefined' ? googleNameParts[0] : '');
  const defaultSurname = initialProfile?.last_name || initialProfile?.surname || (googleNameParts.length > 1 ? googleNameParts.slice(1).join(' ') : '');

  // Registration Type: 'SINGLE' | 'GROUP'
  const [regType, setRegType] = useState('SINGLE');
  const [groupSize, setGroupSize] = useState(2);
  const [activeMemberTab, setActiveMemberTab] = useState(0);

  // Group Dropdown state
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const [groupCategoryFilter, setGroupCategoryFilter] = useState('ALL');
  const [memberDropdownOpen, setMemberDropdownOpen] = useState(false);
  const [bulkCollegeCopied, setBulkCollegeCopied] = useState(false);

  const groupDropdownRef = useRef(null);
  const memberDropdownRef = useRef(null);

  // Lead Member (Member 1) Form Data
  const [leadForm, setLeadForm] = useState({
    first_name      : defaultFirstName,
    surname         : defaultSurname,
    college_name    : initialProfile?.college_name || '',
    phone_number    : initialProfile?.phone_number || '',
    city_of_college : initialProfile?.college_city || initialProfile?.city_of_college || '',
    state_of_college: initialProfile?.college_state || initialProfile?.state_of_college || '',
  });

  // Additional Group Members (Index 0 = Member 2, Index 1 = Member 3, etc.)
  const [groupMembers, setGroupMembers] = useState([
    { first_name: '', surname: '', phone_number: '', email: '', college_name: '', city_of_college: '', state_of_college: '' },
  ]);

  // Promo / Coupon Code State
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoMessage, setPromoMessage] = useState(null);
  const [promoError, setPromoError] = useState(null);

  // Processing & UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [existingBR, setExistingBR] = useState(null);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [showRazorpayFallback, setShowRazorpayFallback] = useState(false);
  const [pendingRegistration, setPendingRegistration] = useState(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (groupDropdownRef.current && !groupDropdownRef.current.contains(e.target)) {
        setGroupDropdownOpen(false);
      }
      if (memberDropdownRef.current && !memberDropdownRef.current.contains(e.target)) {
        setMemberDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Sync groupMembers array length when groupSize changes (supporting up to 50)
  useEffect(() => {
    if (regType === 'GROUP') {
      const neededMembersCount = Math.max(1, groupSize - 1);
      setGroupMembers((prev) => {
        const next = [...prev];
        while (next.length < neededMembersCount) {
          next.push({
            first_name: '',
            surname: '',
            phone_number: '',
            email: '',
            college_name: leadForm.college_name || '',
            city_of_college: leadForm.city_of_college || '',
            state_of_college: leadForm.state_of_college || '',
          });
        }
        return next.slice(0, neededMembersCount);
      });
    }
  }, [groupSize, regType, leadForm.college_name, leadForm.city_of_college, leadForm.state_of_college]);

  // Clamp activeMemberTab if groupSize decreases
  useEffect(() => {
    if (activeMemberTab >= groupSize) {
      setActiveMemberTab(Math.max(0, groupSize - 1));
    }
  }, [groupSize, activeMemberTab]);

  // Re-validate applied coupon code if groupSize or regType changes
  useEffect(() => {
    if (appliedPromo) {
      const count = regType === 'GROUP' ? groupSize : 1;
      const offer = calculateDefaultGroupOffer(count, REG_PRICE_PER_PERSON);
      const res = validatePromoCode(appliedPromo.code, {
        payableMembers: offer.payableMembers,
        payableSubtotal: offer.groupPayable,
        totalMembers: count,
      });
      if (res.valid) {
        setAppliedPromo(res.promo);
        setPromoMessage(res.message);
      } else {
        setAppliedPromo(null);
        setPromoMessage(null);
        setPromoError(res.message);
      }
    }
  }, [groupSize, regType]);

  // Check if user already has an active Basic Registration
  useEffect(() => {
    let active = true;
    async function checkBR() {
      if (!user) {
        setCheckingExisting(false);
        return;
      }
      try {
        const [p, br] = await Promise.all([
          initialProfile ? Promise.resolve(initialProfile) : fetchParticipantProfile(user.id, user.user_metadata),
          fetchBasicRegistration(user.id),
        ]);
        if (active) {
          if (p) {
            setLeadForm((prev) => ({
              ...prev,
              first_name: p.first_name || prev.first_name,
              surname: p.last_name || p.surname || prev.surname,
              college_name: p.college_name || prev.college_name,
              phone_number: p.phone_number || prev.phone_number,
              city_of_college: p.college_city || p.city_of_college || prev.city_of_college,
              state_of_college: p.college_state || p.state_of_college || prev.state_of_college,
            }));
          }
          if (br) {
            setExistingBR(br);
            if (br.registration_type === 'GROUP' && br.group_size) {
              setRegType('GROUP');
              setGroupSize(Math.min(MAX_GROUP_SIZE, br.group_size));
              if (Array.isArray(br.group_members) && br.group_members.length > 0) {
                setGroupMembers(br.group_members);
              }
            }
          }
        }
      } catch (err) {
        console.warn('BR check error:', err);
      } finally {
        if (active) setCheckingExisting(false);
      }
    }
    checkBR();
    return () => { active = false; };
  }, [user, initialProfile]);

  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Form update handlers
  const updateLead = (field) => (e) => {
    setLeadForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const updateMember = (index, field) => (e) => {
    const val = e.target.value;
    setGroupMembers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const copyLeadCollegeToMember = (index) => {
    setGroupMembers((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        college_name: leadForm.college_name,
        city_of_college: leadForm.city_of_college,
        state_of_college: leadForm.state_of_college,
      };
      return next;
    });
  };

  // Bulk copy lead college to ALL members in group
  const applyLeadCollegeToAll = () => {
    if (!leadForm.college_name?.trim()) {
      setError('Please enter Lead Member college name first.');
      return;
    }
    setGroupMembers((prev) =>
      prev.map((m) => ({
        ...m,
        college_name: leadForm.college_name,
        city_of_college: leadForm.city_of_college,
        state_of_college: leadForm.state_of_college,
      }))
    );
    setBulkCollegeCopied(true);
    setTimeout(() => setBulkCollegeCopied(false), 3500);
  };

  // Pricing Calculations
  // 1. Default Group Offer (Built-in, zero code required)
  const isGroup = regType === 'GROUP';
  const totalMemberCount = isGroup ? groupSize : 1;
  const groupOffer = calculateDefaultGroupOffer(totalMemberCount, REG_PRICE_PER_PERSON);
  const {
    freeMembers,
    payableMembers,
    baseTotal,
    groupDiscount,
    groupPayable,
  } = groupOffer;

  // 2. Coupon Discount Calculation (Applies on each payable BR)
  let couponDiscount = 0;
  let couponDiscountPerBR = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      couponDiscountPerBR = Math.round((REG_PRICE_PER_PERSON * appliedPromo.value) / 100);
      couponDiscount = Math.round((groupPayable * appliedPromo.value) / 100);
    } else if (appliedPromo.type === 'per_br') {
      couponDiscountPerBR = Math.min(REG_PRICE_PER_PERSON, appliedPromo.value);
      couponDiscount = couponDiscountPerBR * payableMembers;
    } else if (appliedPromo.type === 'flat') {
      couponDiscount = Math.min(groupPayable, appliedPromo.value);
      couponDiscountPerBR = payableMembers > 0 ? Math.round(couponDiscount / payableMembers) : 0;
    }
  }

  // 3. Final Checkout Total & Cumulative Savings
  const finalPayable = Math.max(0, groupPayable - couponDiscount);
  const totalSavings = groupDiscount + couponDiscount;

  // Coupon Code Validation Handler
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError(null);
    setPromoMessage(null);

    if (!promoInput.trim()) {
      setPromoError('Please enter a coupon code.');
      return;
    }

    const res = validatePromoCode(promoInput, {
      payableMembers,
      payableSubtotal: groupPayable,
      totalMembers: totalMemberCount,
    });

    if (res.valid) {
      setAppliedPromo(res.promo);
      setPromoMessage(res.message);
      setPromoError(null);
      setPromoInput('');
    } else {
      setAppliedPromo(null);
      setPromoError(res.message);
      setPromoMessage(null);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoMessage(null);
    setPromoError(null);
  };

  // Validation
  const validateForm = () => {
    // 1. Validate Lead Member
    const lead = {
      first_name      : leadForm.first_name.trim(),
      surname         : leadForm.surname.trim(),
      college_name    : leadForm.college_name.trim(),
      phone_number    : leadForm.phone_number.trim(),
      city_of_college : leadForm.city_of_college.trim(),
      state_of_college: leadForm.state_of_college.trim(),
    };

    if (!lead.first_name) { setActiveMemberTab(0); return 'Lead member first name is required.'; }
    if (!lead.surname) { setActiveMemberTab(0); return 'Lead member surname is required.'; }
    if (!lead.college_name) { setActiveMemberTab(0); return 'Lead member college name is required.'; }
    if (!/^[0-9]{10}$/.test(lead.phone_number)) { setActiveMemberTab(0); return 'Lead member phone must be exactly 10 digits.'; }
    if (!lead.city_of_college) { setActiveMemberTab(0); return 'Lead member city is required.'; }
    if (!lead.state_of_college) { setActiveMemberTab(0); return 'Lead member state is required.'; }

    // 2. Validate Group Members if GROUP
    if (regType === 'GROUP') {
      for (let i = 0; i < groupMembers.length; i++) {
        const m = groupMembers[i];
        const num = i + 2;
        if (!m.first_name?.trim()) { setActiveMemberTab(i + 1); return `Member ${num}: First name is required.`; }
        if (!m.surname?.trim()) { setActiveMemberTab(i + 1); return `Member ${num}: Surname is required.`; }
        if (!/^[0-9]{10}$/.test(m.phone_number?.trim() || '')) {
          setActiveMemberTab(i + 1);
          return `Member ${num}: Valid 10-digit phone number is required.`;
        }
        if (!m.college_name?.trim()) { setActiveMemberTab(i + 1); return `Member ${num}: College name is required.`; }
      }
    }

    return null;
  };

  // Submit & Proceed to Final Checkout (Razorpay)
  const handleProceedToCheckout = async (e) => {
    e.preventDefault();
    const valErr = validateForm();
    if (valErr) {
      setError(valErr);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const allMembersData = [
        {
          role: 'LEAD',
          first_name: leadForm.first_name.trim(),
          surname: leadForm.surname.trim(),
          phone_number: leadForm.phone_number.trim(),
          email: user?.email || '',
          college_name: leadForm.college_name.trim(),
          city_of_college: leadForm.city_of_college.trim(),
          state_of_college: leadForm.state_of_college.trim(),
        },
        ...(regType === 'GROUP'
          ? groupMembers.map((m, idx) => ({
              role: `MEMBER_${idx + 2}`,
              first_name: m.first_name.trim(),
              surname: m.surname.trim(),
              phone_number: m.phone_number.trim(),
              email: m.email.trim(),
              college_name: m.college_name.trim(),
              city_of_college: m.city_of_college.trim() || leadForm.city_of_college.trim(),
              state_of_college: m.state_of_college.trim() || leadForm.state_of_college.trim(),
            }))
          : []),
      ];

      const checkoutMeta = {
        registration_type: regType,
        group_size: totalMemberCount,
        payable_members: payableMembers,
        free_members: freeMembers,
        group_members: allMembersData,
        group_discount: groupDiscount,
        coupon_code: appliedPromo ? appliedPromo.code : null,
        coupon_discount: couponDiscount,
        discount_amount: totalSavings,
        final_amount: finalPayable,
        payment_status: finalPayable === 0 ? 'PAID' : 'PENDING',
      };

      // 1. Save registration details in database
      const saveRes = await saveBasicRegistration(
        user.id,
        user.email,
        {
          first_name: leadForm.first_name.trim(),
          last_name: leadForm.surname.trim(),
          college_name: leadForm.college_name.trim(),
          phone_number: leadForm.phone_number.trim(),
          college_city: leadForm.city_of_college.trim(),
          college_state: leadForm.state_of_college.trim(),
        },
        checkoutMeta
      );

      setPendingRegistration({ profile: saveRes.profile, basicRegistration: saveRes.basicRegistration, checkoutMeta });

      // 2. If 100% discount / free registration
      if (finalPayable === 0) {
        await markBasicRegistrationPaid(user.id, {
          razorpay_payment_id: `free_${appliedPromo?.code || 'vip'}_${Date.now()}`,
          razorpay_order_id: `free_ord_${Date.now()}`,
        });
        setLoading(false);
        if (onSuccess) {
          onSuccess(saveRes.profile, saveRes.basicRegistration);
        } else {
          onClose();
        }
        return;
      }

      // 3. Prompt the Razorpay Payment Gateway
      setLoading(false);
      openRazorpayCheckout({
        amount: finalPayable,
        description: regType === 'GROUP'
          ? `Cerebrexia '26 — Group Basic Registration (BR) (${groupSize} Members)`
          : `Cerebrexia '26 — Single Basic Registration (BR)`,
        prefill: {
          name: `${leadForm.first_name} ${leadForm.surname}`,
          email: user?.email || '',
          contact: leadForm.phone_number,
        },
        onSuccess: async (rzpRes) => {
          setLoading(true);
          try {
            await markBasicRegistrationPaid(user.id, rzpRes);
            if (onSuccess) {
              onSuccess(saveRes.profile, { ...saveRes.basicRegistration, payment_status: 'PAID' });
            } else {
              onClose();
            }
          } catch (err) {
            console.error('Payment confirmation error:', err);
          } finally {
            setLoading(false);
          }
        },
        onDismiss: () => {
          console.info('[Razorpay] Payment dismissed by user.');
        },
        onFallbackPrompt: () => {
          // Open interactive simulated Razorpay sheet if live key is not supplied
          setShowRazorpayFallback(true);
        },
      });
    } catch (err) {
      console.error('Basic registration error:', err);
      setError(err?.message || 'Registration failed. Please verify details and try again.');
      setLoading(false);
    }
  };

  const handleSimulatedPaymentSuccess = async () => {
    setLoading(true);
    setShowRazorpayFallback(false);
    try {
      const mockRzpId = `pay_rzp_${Date.now()}`;
      await markBasicRegistrationPaid(user.id, {
        razorpay_payment_id: mockRzpId,
        razorpay_order_id: `order_crx_${Date.now()}`,
      });
      if (onSuccess && pendingRegistration) {
        onSuccess(pendingRegistration.profile, {
          ...pendingRegistration.basicRegistration,
          payment_status: 'PAID',
          razorpay_payment_id: mockRzpId,
        });
      } else {
        onClose();
      }
    } catch (err) {
      console.error('Payment simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Completion calculation for group
  const leadCompleted = Boolean(
    leadForm.first_name?.trim() &&
    leadForm.surname?.trim() &&
    /^[0-9]{10}$/.test(leadForm.phone_number?.trim()) &&
    leadForm.college_name?.trim()
  );
  const additionalCompletedCount = groupMembers.filter(
    (m) =>
      m.first_name?.trim() &&
      m.surname?.trim() &&
      /^[0-9]{10}$/.test(m.phone_number?.trim() || '') &&
      m.college_name?.trim()
  ).length;
  const totalCompletedCount = (leadCompleted ? 1 : 0) + additionalCompletedCount;

  // Group size options array: 2 to 50
  const allGroupOptions = Array.from({ length: 49 }, (_, i) => i + 2);
  const filteredGroupOptions = allGroupOptions.filter((num) => {
    if (groupCategoryFilter === 'SQUAD') return num >= 2 && num <= 5;
    if (groupCategoryFilter === 'DELEGATION') return num >= 6 && num <= 15;
    if (groupCategoryFilter === 'MAJOR') return num >= 16 && num <= 30;
    if (groupCategoryFilter === 'MEGA') return num >= 31 && num <= 50;
    return true; // 'ALL'
  });

  const getTierLabel = (n) => {
    if (n <= 5) return 'Squad Registration';
    if (n <= 15) return 'College Delegation';
    if (n <= 30) return 'Major Delegation';
    return 'Mega Campus Contingent';
  };

  // Current active member name
  const currentMemberDisplayName = activeMemberTab === 0
    ? (leadForm.first_name ? `${leadForm.first_name} ${leadForm.surname} (Lead)` : 'Member 1 (Group Lead)')
    : (groupMembers[activeMemberTab - 1]?.first_name
        ? `${groupMembers[activeMemberTab - 1].first_name} ${groupMembers[activeMemberTab - 1].surname}`
        : `Member ${activeMemberTab + 1}`);

  // Styling helpers
  const inp = {
    width: '100%',
    background: 'rgba(0,0,0,0.55)',
    border: '1px solid rgba(255,255,255,0.12)',
    padding: '11px 14px 11px 40px',
    borderRadius: 8,
    color: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box',
    fontSize: 13,
    fontFamily: "'Space Grotesk', sans-serif",
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };
  const inpRO = { ...inp, opacity: 0.65, cursor: 'not-allowed' };

  const focusInp = (e) => {
    e.target.style.borderColor = 'var(--crx-gold, #D4AF37)';
    e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 106, 0.2)';
  };
  const blurInp = (e) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.12)';
    e.target.style.boxShadow = 'none';
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="br-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Dark Blur Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(5, 2, 4, 0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      />

      {/* Main Dialog Modal */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 680,
          maxHeight: '92vh',
          overflowY: 'auto',
          background: 'linear-gradient(165deg, #170A0F 0%, #0A0407 100%)',
          border: '1px solid rgba(212, 175, 106, 0.35)',
          borderRadius: 22,
          padding: '28px 24px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.95), 0 0 45px rgba(212, 175, 106, 0.12)',
          zIndex: 1,
          boxSizing: 'border-box',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8,
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--cream, #fff)',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(212, 175, 106, 0.12)',
              border: '1px solid rgba(212, 175, 106, 0.4)',
              borderRadius: 20,
              padding: '4px 12px',
              fontSize: 10.5,
              fontWeight: 700,
              color: 'var(--crx-gold, #D4AF37)',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            <Music size={13} />
            PRONITES BASIC REGISTRATION (BR)
          </div>

          <h2
            id="br-modal-title"
            className="crx-display"
            style={{
              fontSize: 'clamp(24px, 4.2vw, 32px)',
              color: 'var(--crx-text-primary, #fff)',
              margin: '0 0 6px',
              letterSpacing: 0.5,
              fontWeight: 400,
            }}
          >
            BASIC REGISTRATION (BR)
          </h2>

          <p style={{ color: 'var(--crx-text-secondary, #a1a1aa)', fontSize: 13, lineHeight: 1.5, margin: 0 }}>
            Full access to celebrity pronites and EDM nights. Select single or group Basic Registration (BR) (up to 50 people) with built-in 9+1 group savings.
          </p>
        </div>

        {/* Existing Registration Banner */}
        {existingBR && (
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.35)',
              borderRadius: 12,
              padding: '12px 16px',
              marginBottom: 18,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <CheckCircle2 size={18} color="#22c55e" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: 12, color: 'var(--cream, #fff)' }}>
              <strong>Active Registration Found:</strong> You hold an existing Basic Registration ({existingBR.registration_type === 'GROUP' ? `Group of ${existingBR.group_size}` : 'Single Basic Registration (BR)'}). Updating will refresh your official credentials.
            </div>
          </div>
        )}

        {/* Form Error Banner */}
        {error && (
          <div
            style={{
              background: 'rgba(220, 38, 38, 0.15)',
              border: '1px solid #DC2626',
              borderRadius: 10,
              padding: '10px 14px',
              color: '#fca5a5',
              fontSize: 12.5,
              marginBottom: 18,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Registration Option Selector (Single vs Group) */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--crx-gold, #D4AF37)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            Select Registration Option
          </label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
            }}
          >
            {/* Single Registration Card */}
            <button
              type="button"
              onClick={() => { setRegType('SINGLE'); setActiveMemberTab(0); }}
              style={{
                background: regType === 'SINGLE'
                  ? 'linear-gradient(135deg, rgba(212, 175, 106, 0.16) 0%, rgba(192, 57, 43, 0.16) 100%)'
                  : 'rgba(255, 255, 255, 0.03)',
                border: regType === 'SINGLE'
                  ? '2px solid var(--crx-gold, #D4AF37)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 14,
                padding: '14px 16px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: regType === 'SINGLE' ? 'rgba(212, 175, 106, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <User size={18} color={regType === 'SINGLE' ? 'var(--crx-gold, #D4AF37)' : 'rgba(255,255,255,0.6)'} />
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: regType === 'SINGLE' ? '#fff' : 'rgba(255,255,255,0.8)', marginBottom: 2 }}>
                  Single Registration
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--crx-text-secondary, #a1a1aa)', lineHeight: 1.35 }}>
                  Individual Basic Registration (BR) for 1 person
                </div>
              </div>
            </button>

            {/* Group Registration Card */}
            <button
              type="button"
              onClick={() => setRegType('GROUP')}
              style={{
                background: regType === 'GROUP'
                  ? 'linear-gradient(135deg, rgba(212, 175, 106, 0.16) 0%, rgba(192, 57, 43, 0.16) 100%)'
                  : 'rgba(255, 255, 255, 0.03)',
                border: regType === 'GROUP'
                  ? '2px solid var(--crx-gold, #D4AF37)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 14,
                padding: '14px 16px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: regType === 'GROUP' ? 'rgba(212, 175, 106, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Users size={18} color={regType === 'GROUP' ? 'var(--crx-gold, #D4AF37)' : 'rgba(255,255,255,0.6)'} />
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: regType === 'GROUP' ? '#fff' : 'rgba(255,255,255,0.8)', marginBottom: 2 }}>
                  Group Registration
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--crx-text-secondary, #a1a1aa)', lineHeight: 1.35 }}>
                  Groups &amp; delegations up to 50 people
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* STEP 2: If Group Registration, Themed Dropdown Selector (up to 50 people) */}
        {regType === 'GROUP' && (
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(212, 175, 106, 0.08) 0%, rgba(192, 57, 43, 0.08) 100%)',
              border: '1.5px solid rgba(212, 175, 106, 0.35)',
              borderRadius: 16,
              padding: '18px 20px',
              marginBottom: 20,
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={17} color="var(--crx-gold, #D4AF37)" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  Group Size Selector (Up to 50 People)
                </span>
              </div>
              <span style={{ fontSize: 11, background: 'rgba(212, 175, 106, 0.15)', color: 'var(--crx-gold, #D4AF37)', padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>
                {getTierLabel(groupSize)}
              </span>
            </div>

            {/* Themed Custom Dropdown Trigger & Stepper Controls */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', position: 'relative' }}>
              {/* Dropdown Container */}
              <div ref={groupDropdownRef} style={{ position: 'relative', flex: 1 }}>
                <button
                  type="button"
                  onClick={() => setGroupDropdownOpen(!groupDropdownOpen)}
                  style={{
                    width: '100%',
                    background: 'rgba(10, 4, 7, 0.95)',
                    border: '1.5px solid var(--crx-gold, #D4AF37)',
                    borderRadius: 12,
                    padding: '11px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    color: '#fff',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background: 'rgba(212, 175, 106, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 13,
                        fontWeight: 800,
                        color: 'var(--crx-gold, #D4AF37)',
                      }}
                    >
                      {groupSize}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                          {groupSize} People {freeMembers > 0 ? `(${payableMembers} Paid + ${freeMembers} Free)` : `(${groupSize} Members)`}
                        </span>
                        {freeMembers > 0 && (
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '1px 6px', borderRadius: 4 }}>
                            {freeMembers} FREE
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--crx-text-secondary, #a1a1aa)' }}>
                        Pay: <strong style={{ color: '#fff' }}>₹{groupPayable.toLocaleString('en-IN')}</strong> {freeMembers > 0 ? `(Default 9+1 Offer: Saved ₹${groupDiscount.toLocaleString('en-IN')})` : ''} &bull; Click to choose 2 to 50
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    size={18}
                    color="var(--crx-gold, #D4AF37)"
                    style={{
                      transform: groupDropdownOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0,
                    }}
                  />
                </button>

                {/* Dropdown Menu Overlay */}
                {groupDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      left: 0,
                      right: 0,
                      background: 'rgba(16, 7, 12, 0.98)',
                      border: '1.5px solid var(--crx-gold, #D4AF37)',
                      borderRadius: 14,
                      padding: '10px 10px',
                      zIndex: 100,
                      boxShadow: '0 16px 40px rgba(0,0,0,0.95), 0 0 30px rgba(212, 175, 106, 0.2)',
                      backdropFilter: 'blur(20px)',
                      maxHeight: 310,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Filter Category Pills */}
                    <div style={{ display: 'flex', gap: 4, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
                      {[
                        { id: 'ALL', label: 'All (2–50)' },
                        { id: 'SQUAD', label: 'Squad (2–5)' },
                        { id: 'DELEGATION', label: 'Delegation (6–15)' },
                        { id: 'MAJOR', label: 'Major (16–30)' },
                        { id: 'MEGA', label: 'Mega (31–50)' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setGroupCategoryFilter(cat.id); }}
                          style={{
                            background: groupCategoryFilter === cat.id ? 'var(--crx-gold, #D4AF37)' : 'rgba(255,255,255,0.06)',
                            color: groupCategoryFilter === cat.id ? '#000' : 'rgba(255,255,255,0.8)',
                            border: 'none',
                            borderRadius: 6,
                            padding: '4px 8px',
                            fontSize: 10.5,
                            fontWeight: 700,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Scrollable List of Group Sizes (2 to 50) */}
                    <div style={{ overflowY: 'auto', maxHeight: 240, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {filteredGroupOptions.map((num) => {
                        const isSelected = groupSize === num;
                        const optOffer = calculateDefaultGroupOffer(num, REG_PRICE_PER_PERSON);
                        return (
                          <div
                            key={num}
                            onClick={() => {
                              setGroupSize(num);
                              setGroupDropdownOpen(false);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 12px',
                              borderRadius: 8,
                              background: isSelected ? 'rgba(212, 175, 106, 0.22)' : 'transparent',
                              border: isSelected ? '1px solid var(--crx-gold, #D4AF37)' : '1px solid transparent',
                              cursor: 'pointer',
                              transition: 'background 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? 'var(--crx-gold, #D4AF37)' : '#ffffff' }}>
                                {num} People
                              </span>
                              <span style={{ fontSize: 10.5, color: 'var(--crx-text-secondary, #a1a1aa)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 4 }}>
                                {getTierLabel(num)}
                              </span>
                              {optOffer.freeMembers > 0 && (
                                <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '1px 5px', borderRadius: 4 }}>
                                  {optOffer.freeMembers} Free (Pay {optOffer.payableMembers})
                                </span>
                              )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 12, fontWeight: 600, color: isSelected ? 'var(--crx-gold, #D4AF37)' : '#ffffff' }}>
                                ₹{optOffer.groupPayable.toLocaleString('en-IN')}
                              </span>
                              {isSelected && <CheckCircle2 size={14} color="var(--crx-gold, #D4AF37)" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Stepper Buttons */}
              <button
                type="button"
                onClick={() => setGroupSize((prev) => Math.max(2, prev - 1))}
                disabled={groupSize <= 2}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: '#fff',
                  cursor: groupSize <= 2 ? 'not-allowed' : 'pointer',
                  opacity: groupSize <= 2 ? 0.35 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
                title="Decrease by 1"
              >
                <Minus size={16} />
              </button>

              <button
                type="button"
                onClick={() => setGroupSize((prev) => Math.min(MAX_GROUP_SIZE, prev + 1))}
                disabled={groupSize >= MAX_GROUP_SIZE}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: '#fff',
                  cursor: groupSize >= MAX_GROUP_SIZE ? 'not-allowed' : 'pointer',
                  opacity: groupSize >= MAX_GROUP_SIZE ? 0.35 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
                title="Increase by 1"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Quick Preset Shortcuts */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: 'var(--crx-text-secondary, #a1a1aa)', marginRight: 4 }}>
                Quick select:
              </span>
              {[2, 5, 10, 15, 20, 30, 50].map((n) => {
                const optOffer = calculateDefaultGroupOffer(n, REG_PRICE_PER_PERSON);
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setGroupSize(n)}
                    style={{
                      background: groupSize === n ? 'var(--crx-gold, #D4AF37)' : 'rgba(255,255,255,0.06)',
                      color: groupSize === n ? '#000' : 'rgba(255,255,255,0.85)',
                      border: '1px solid ' + (groupSize === n ? 'var(--crx-gold, #D4AF37)' : 'rgba(255,255,255,0.12)'),
                      borderRadius: 8,
                      padding: '5px 10px',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {n} {n >= 10 ? `(${optOffer.freeMembers} Free)` : 'Members'}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Member Details Forms */}
        <form onSubmit={handleProceedToCheckout} noValidate>
          {regType === 'GROUP' && (
            <div style={{ marginBottom: 16 }}>
              {/* Header with Progress Bar & Bulk Tool */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', color: 'var(--crx-gold, #D4AF37)', letterSpacing: 0.8 }}>
                    Group Members ({totalCompletedCount} of {groupSize} Completed)
                  </span>
                  <div
                    style={{
                      width: 140,
                      height: 4,
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: 2,
                      marginTop: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.round((totalCompletedCount / groupSize) * 100)}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--crx-gold, #D4AF37), #22c55e)',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>

                {/* Bulk Copy Lead College button */}
                <button
                  type="button"
                  onClick={applyLeadCollegeToAll}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: bulkCollegeCopied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(212, 175, 106, 0.12)',
                    border: '1px solid ' + (bulkCollegeCopied ? '#22c55e' : 'rgba(212, 175, 106, 0.35)'),
                    borderRadius: 8,
                    padding: '6px 12px',
                    color: bulkCollegeCopied ? '#22c55e' : 'var(--crx-gold, #D4AF37)',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  title="Copies lead college name, city, and state to all group members"
                >
                  <CheckCheck size={14} />
                  {bulkCollegeCopied ? 'Copied to all 50 members!' : 'Apply Lead College to All Members'}
                </button>
              </div>

              {/* Navigation Bar for Selecting Member (Dropdown + Pager) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                {/* Previous Member Button */}
                <button
                  type="button"
                  onClick={() => setActiveMemberTab((prev) => Math.max(0, prev - 1))}
                  disabled={activeMemberTab === 0}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: activeMemberTab === 0 ? 'not-allowed' : 'pointer',
                    opacity: activeMemberTab === 0 ? 0.3 : 1,
                    flexShrink: 0,
                  }}
                  title="Previous Member"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Member Selector Dropdown */}
                <div ref={memberDropdownRef} style={{ position: 'relative', flex: 1 }}>
                  <button
                    type="button"
                    onClick={() => setMemberDropdownOpen(!memberDropdownOpen)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(212, 175, 106, 0.4)',
                      borderRadius: 8,
                      padding: '7px 12px',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Editing: {currentMemberDisplayName}
                    </span>
                    <ChevronDown size={14} color="var(--crx-gold, #D4AF37)" />
                  </button>

                  {memberDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        background: '#13070d',
                        border: '1px solid var(--crx-gold, #D4AF37)',
                        borderRadius: 10,
                        padding: 6,
                        maxHeight: 220,
                        overflowY: 'auto',
                        zIndex: 90,
                        boxShadow: '0 12px 32px rgba(0,0,0,0.9)',
                      }}
                    >
                      {/* Member 1 Lead */}
                      <div
                        onClick={() => { setActiveMemberTab(0); setMemberDropdownOpen(false); }}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 6,
                          background: activeMemberTab === 0 ? 'rgba(212, 175, 106, 0.25)' : 'transparent',
                          color: activeMemberTab === 0 ? 'var(--crx-gold, #D4AF37)' : '#fff',
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>Member 1 (Lead: {leadForm.first_name || 'Primary'})</span>
                        {leadCompleted && <CheckCircle2 size={13} color="#22c55e" />}
                      </div>

                      {/* Members 2 to N */}
                      {Array.from({ length: groupSize - 1 }).map((_, idx) => {
                        const mNum = idx + 2;
                        const m = groupMembers[idx];
                        const isDone = Boolean(m?.first_name?.trim() && m?.phone_number?.trim());
                        const isSel = activeMemberTab === idx + 1;
                        return (
                          <div
                            key={mNum}
                            onClick={() => { setActiveMemberTab(idx + 1); setMemberDropdownOpen(false); }}
                            style={{
                              padding: '6px 10px',
                              borderRadius: 6,
                              background: isSel ? 'rgba(212, 175, 106, 0.25)' : 'transparent',
                              color: isSel ? 'var(--crx-gold, #D4AF37)' : '#fff',
                              fontSize: 11.5,
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <span>Member {mNum}: {m?.first_name ? `${m.first_name} ${m.surname || ''}` : 'Pending details'}</span>
                            {isDone && <CheckCircle2 size={13} color="#22c55e" />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Next Member Button */}
                <button
                  type="button"
                  onClick={() => setActiveMemberTab((prev) => Math.min(groupSize - 1, prev + 1))}
                  disabled={activeMemberTab >= groupSize - 1}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: activeMemberTab >= groupSize - 1 ? 'not-allowed' : 'pointer',
                    opacity: activeMemberTab >= groupSize - 1 ? 0.3 : 1,
                    flexShrink: 0,
                  }}
                  title="Next Member"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Horizontal Pill Scroller (Quick Jump) */}
              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  overflowX: 'auto',
                  paddingBottom: 6,
                  scrollbarWidth: 'thin',
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveMemberTab(0)}
                  style={{
                    background: activeMemberTab === 0 ? 'var(--crx-gold, #D4AF37)' : 'rgba(255,255,255,0.06)',
                    color: activeMemberTab === 0 ? '#000' : '#fff',
                    border: leadCompleted ? '1px solid #22c55e' : '1px solid transparent',
                    borderRadius: 8,
                    padding: '5px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  M1 (Lead)
                  {leadCompleted && <CheckCircle2 size={11} color={activeMemberTab === 0 ? '#000' : '#22c55e'} />}
                </button>
                {Array.from({ length: groupSize - 1 }).map((_, idx) => {
                  const mNum = idx + 2;
                  const isFilled = groupMembers[idx]?.first_name && groupMembers[idx]?.phone_number;
                  const isSel = activeMemberTab === idx + 1;
                  return (
                    <button
                      key={mNum}
                      type="button"
                      onClick={() => setActiveMemberTab(idx + 1)}
                      style={{
                        background: isSel ? 'var(--crx-gold, #D4AF37)' : 'rgba(255,255,255,0.06)',
                        color: isSel ? '#000' : '#fff',
                        border: isFilled ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8,
                        padding: '5px 10px',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      M{mNum}
                      {isFilled && <CheckCircle2 size={11} color={isSel ? '#000' : '#22c55e'} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Member 1 (Lead / Single) Form Fields */}
          {(regType === 'SINGLE' || activeMemberTab === 0) && (
            <div
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14,
                padding: '16px',
                marginBottom: 18,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                <User size={15} color="var(--crx-gold, #D4AF37)" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  {regType === 'GROUP' ? 'Member 1 (Primary / Group Lead Details)' : 'Participant Details'}
                </span>
              </div>

              {/* Registered Account Email */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--crx-text-secondary, #a1a1aa)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  Registered Email (Account ID)
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                  <input type="email" value={user?.email || ''} readOnly style={inpRO} />
                </div>
              </div>

              {/* Grid Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--crx-text-secondary, #a1a1aa)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    First Name <span style={{ color: 'var(--crx-gold, #D4AF37)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={leadForm.first_name}
                      onChange={updateLead('first_name')}
                      onFocus={focusInp}
                      onBlur={blurInp}
                      placeholder="e.g. Arjun"
                      style={inp}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--crx-text-secondary, #a1a1aa)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    Surname <span style={{ color: 'var(--crx-gold, #D4AF37)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={leadForm.surname}
                      onChange={updateLead('surname')}
                      onFocus={focusInp}
                      onBlur={blurInp}
                      placeholder="e.g. Sharma"
                      style={inp}
                      required
                    />
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--crx-text-secondary, #a1a1aa)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    College Name <span style={{ color: 'var(--crx-gold, #D4AF37)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Building2 size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={leadForm.college_name}
                      onChange={updateLead('college_name')}
                      onFocus={focusInp}
                      onBlur={blurInp}
                      placeholder="e.g. IGIMS, Patna"
                      style={inp}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--crx-text-secondary, #a1a1aa)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    Phone (WhatsApp) <span style={{ color: 'var(--crx-gold, #D4AF37)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                    <input
                      type="tel"
                      value={leadForm.phone_number}
                      onChange={updateLead('phone_number')}
                      onFocus={focusInp}
                      onBlur={blurInp}
                      placeholder="10-digit number"
                      maxLength={10}
                      style={inp}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--crx-text-secondary, #a1a1aa)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    City <span style={{ color: 'var(--crx-gold, #D4AF37)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={leadForm.city_of_college}
                      onChange={updateLead('city_of_college')}
                      onFocus={focusInp}
                      onBlur={blurInp}
                      placeholder="Patna"
                      style={inp}
                      required
                    />
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--crx-text-secondary, #a1a1aa)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    State <span style={{ color: 'var(--crx-gold, #D4AF37)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={leadForm.state_of_college}
                      onChange={updateLead('state_of_college')}
                      onFocus={focusInp}
                      onBlur={blurInp}
                      placeholder="Bihar"
                      style={inp}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Group Member Additional Fields (Member 2, 3, up to 50) */}
          {regType === 'GROUP' && activeMemberTab > 0 && (
            <div
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14,
                padding: '16px',
                marginBottom: 18,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <User size={15} color="var(--crx-gold, #D4AF37)" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    Member {activeMemberTab + 1} of {groupSize} Details
                  </span>
                </div>
                {leadForm.college_name && (
                  <button
                    type="button"
                    onClick={() => copyLeadCollegeToMember(activeMemberTab - 1)}
                    style={{
                      background: 'rgba(212, 175, 106, 0.12)',
                      border: '1px solid rgba(212, 175, 106, 0.3)',
                      borderRadius: 6,
                      color: 'var(--crx-gold, #D4AF37)',
                      fontSize: 10.5,
                      padding: '4px 8px',
                      cursor: 'pointer',
                    }}
                  >
                    Same College as Lead &rarr;
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--crx-text-secondary, #a1a1aa)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    First Name <span style={{ color: 'var(--crx-gold, #D4AF37)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={groupMembers[activeMemberTab - 1]?.first_name || ''}
                      onChange={updateMember(activeMemberTab - 1, 'first_name')}
                      onFocus={focusInp}
                      onBlur={blurInp}
                      placeholder="e.g. Priya"
                      style={inp}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--crx-text-secondary, #a1a1aa)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    Surname <span style={{ color: 'var(--crx-gold, #D4AF37)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={groupMembers[activeMemberTab - 1]?.surname || ''}
                      onChange={updateMember(activeMemberTab - 1, 'surname')}
                      onFocus={focusInp}
                      onBlur={blurInp}
                      placeholder="e.g. Verma"
                      style={inp}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--crx-text-secondary, #a1a1aa)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    Phone Number <span style={{ color: 'var(--crx-gold, #D4AF37)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                    <input
                      type="tel"
                      value={groupMembers[activeMemberTab - 1]?.phone_number || ''}
                      onChange={updateMember(activeMemberTab - 1, 'phone_number')}
                      onFocus={focusInp}
                      onBlur={blurInp}
                      placeholder="10-digit number"
                      maxLength={10}
                      style={inp}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--crx-text-secondary, #a1a1aa)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    Email (for E-Ticket)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                    <input
                      type="email"
                      value={groupMembers[activeMemberTab - 1]?.email || ''}
                      onChange={updateMember(activeMemberTab - 1, 'email')}
                      onFocus={focusInp}
                      onBlur={blurInp}
                      placeholder="member@college.edu"
                      style={inp}
                    />
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--crx-text-secondary, #a1a1aa)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    College Name <span style={{ color: 'var(--crx-gold, #D4AF37)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Building2 size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={groupMembers[activeMemberTab - 1]?.college_name || ''}
                      onChange={updateMember(activeMemberTab - 1, 'college_name')}
                      onFocus={focusInp}
                      onBlur={blurInp}
                      placeholder="College Name"
                      style={inp}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Coupon Code (Disabled for now) */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 14,
              padding: '14px 16px',
              marginBottom: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Tag size={15} color="rgba(255,255,255,0.4)" />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  Coupon Code
                </span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--crx-text-secondary, #a1a1aa)' }}>
                Coupons currently inactive
              </span>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Tag size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(null); }}
                  placeholder="NO ACTIVE COUPONS AVAILABLE"
                  disabled={true}
                  style={{
                    ...inp,
                    paddingLeft: 34,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    opacity: 0.6,
                    cursor: 'not-allowed',
                  }}
                />
              </div>
              <button
                type="button"
                disabled={true}
                className="crx-btn"
                style={{
                  padding: '8px 16px',
                  fontSize: 12,
                  fontWeight: 700,
                  borderRadius: 8,
                  opacity: 0.4,
                  cursor: 'not-allowed',
                }}
              >
                APPLY
              </button>
            </div>
          </div>

          {/* STEP 5: Order Breakdown & Final Checkout Summary */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(20, 10, 15, 0.8) 0%, rgba(10, 5, 8, 0.95) 100%)',
              border: '1px solid rgba(212, 175, 106, 0.25)',
              borderRadius: 14,
              padding: '16px',
              marginBottom: 20,
            }}
          >
            {/* Total Base Registration */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--crx-text-secondary, #a1a1aa)', marginBottom: 6 }}>
              <span>
                {isGroup ? `Group Basic Registration (${groupSize} People × ₹2,000)` : 'Single Basic Registration (BR)'}
              </span>
              <span style={{ color: '#fff', fontWeight: 600 }}>
                ₹{baseTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Default Group Offer (9+1 Offer) */}
            {isGroup && freeMembers > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#22c55e', marginBottom: 6 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={13} color="#22c55e" />
                  Default Group Offer ({freeMembers} Free Member{freeMembers > 1 ? 's' : ''} • Paying for {payableMembers})
                </span>
                <span style={{ fontWeight: 700 }}>
                  -₹{groupDiscount.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {/* Group Subtotal before coupon if free members exist */}
            {isGroup && freeMembers > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'rgba(255,255,255,0.65)', marginBottom: 6, paddingLeft: 18 }}>
                <span>Group Subtotal ({payableMembers} Payable BRs × ₹2,000)</span>
                <span>₹{groupPayable.toLocaleString('en-IN')}</span>
              </div>
            )}

            {/* Coupon Code Discount */}
            {couponDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#38bdf8', marginBottom: 6 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Tag size={13} color="#38bdf8" />
                  Coupon Discount ({appliedPromo?.code}
                  {appliedPromo?.type === 'percent'
                    ? ` • ${appliedPromo.value}% off on each BR`
                    : appliedPromo?.type === 'per_br'
                    ? ` • -₹${couponDiscountPerBR}/BR`
                    : ''})
                </span>
                <span style={{ fontWeight: 700 }}>-₹{couponDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '8px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--crx-gold, #D4AF37)', display: 'block', fontWeight: 700 }}>
                  Total Final Amount {isGroup && freeMembers > 0 && `(Pay for ${payableMembers} of ${groupSize})`}
                </span>
                <span style={{ fontSize: 11, color: 'var(--crx-text-secondary, #a1a1aa)' }}>
                  Includes {totalMemberCount} official wristbands &amp; pronite admission
                  {totalSavings > 0 && ` • Saved ₹${totalSavings.toLocaleString('en-IN')}`}
                </span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: "'Space Grotesk', sans-serif" }}>
                ₹{finalPayable.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Privacy & Cross-Category Note */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <ShieldCheck size={14} color="var(--crx-gold, #D4AF37)" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: 11, color: 'var(--crx-text-secondary, #a1a1aa)', lineHeight: 1.4 }}>
              Secure payment via Razorpay. Registrations are linked to your official festival account.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="crx-btn"
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'var(--crx-text-secondary, #a1a1aa)',
                justifyContent: 'center',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || checkingExisting}
              className="crx-btn gold"
              style={{
                flex: 2,
                justifyContent: 'center',
                gap: 8,
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: '0.04em',
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  PREPARING CHECKOUT...
                </>
              ) : (
                <>
                  <CreditCard size={16} />
                  {finalPayable === 0
                    ? 'CONFIRM COMPLIMENTARY REGISTRATION'
                    : `PROCEED TO FINAL CHECKOUT • ₹${finalPayable.toLocaleString('en-IN')}`}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Razorpay Interactive Fallback / Simulator Modal (if key is awaiting merchant auth) */}
        {showRazorpayFallback && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100000,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: 420,
                background: '#0d060a',
                border: '1px solid rgba(212, 175, 106, 0.4)',
                borderRadius: 18,
                padding: '24px 22px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'rgba(212, 175, 106, 0.15)',
                  border: '1px solid var(--crx-gold, #D4AF37)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}
              >
                <CreditCard size={24} color="var(--crx-gold, #D4AF37)" />
              </div>

              <h3 style={{ fontSize: 20, color: '#fff', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>
                Razorpay Payment Gateway
              </h3>
              <p style={{ fontSize: 12.5, color: 'var(--crx-text-secondary, #a1a1aa)', margin: '0 0 16px', lineHeight: 1.5 }}>
                Prompting checkout for <strong>{regType === 'GROUP' ? `Group Basic Registration (BR) for ${groupSize} People` : 'Single Basic Registration (BR)'}</strong>.
                Total amount: <strong style={{ color: '#fff' }}>₹{finalPayable.toLocaleString('en-IN')}</strong>
                {isGroup && freeMembers > 0 ? ` (${freeMembers} Free Member${freeMembers > 1 ? 's' : ''} • Paying for ${payableMembers})` : ''}
                {couponDiscount > 0 ? ` [Coupon ${appliedPromo?.code} Applied]` : ''}.
              </p>

              {/* Supported payment badges */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                {['UPI / QR', 'Google Pay', 'PhonePe', 'Credit / Debit Card', 'Net Banking'].map((method) => (
                  <span
                    key={method}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 6,
                      padding: '4px 8px',
                      fontSize: 10.5,
                      color: 'rgba(255,255,255,0.8)',
                    }}
                  >
                    {method}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  type="button"
                  onClick={handleSimulatedPaymentSuccess}
                  className="crx-btn gold"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 13 }}
                >
                  CONFIRM &amp; COMPLETE PAYMENT
                </button>
                <button
                  type="button"
                  onClick={() => setShowRazorpayFallback(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: 12,
                    cursor: 'pointer',
                    padding: 6,
                  }}
                >
                  Cancel Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
