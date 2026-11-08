import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, RefreshCw, CreditCard, ArrowLeft, Mail, MapPin, Building, Lock, CheckCircle2 } from 'lucide-react';
import Reveal from '../components/common/Reveal';
import Sticker from '../components/common/Sticker';
import { useIsNarrow } from '../hooks/useIsNarrow';

export const POLICIES = [
  { id: 'terms', title: 'Terms & Conditions', icon: FileText, tag: 'Legal Agreement' },
  { id: 'privacy', title: 'Privacy Policy', icon: Lock, tag: 'Data Protection' },
  { id: 'refunds', title: 'Refund & Cancellation', icon: RefreshCw, tag: 'Payments & Refunds' },
  { id: 'pricing', title: 'Pricing & Delivery', icon: CreditCard, tag: 'Registration Fulfillment' },
];

export default function PolicyPage({ initialTab = 'terms', setPage }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const narrow = useIsNarrow(768);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '#' + tabId);
    }
  };

  return (
    <section style={{ padding: '140px 24px 100px', maxWidth: 1120, margin: '0 auto', minHeight: '85vh' }}>
      {/* Top Breadcrumb & Title */}
      <Reveal>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <button
            onClick={() => setPage && setPage('home')}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 8,
              padding: '6px 14px',
              color: 'var(--cream)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={14} /> Back to Fest Home
          </button>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: '4px 12px' }}>
            <ShieldCheck size={13} color="#22c55e" />
            <span style={{ fontSize: 10.5, color: '#86efac', letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700 }}>
              Official Institutional Compliance
            </span>
          </div>
        </div>

        <Sticker tone="gold" rotate={-1} style={{ marginBottom: 12 }}>
          Regulatory Documentation
        </Sticker>
        <h1 className="crx-display" style={{ fontSize: 'clamp(28px, 5vw, 44px)', color: 'var(--cream)', margin: '0 0 12px' }}>
          POLICIES &amp; COMPLIANCE
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 13.5, maxWidth: 760, lineHeight: 1.6, margin: '0 0 32px' }}>
          Official terms, data security policies, and payment terms governing participation in{' '}
          <strong style={{ color: 'var(--cream)' }}>Cerebrexia '26</strong>, organized by the Indira Gandhi Institute of Medical Sciences (IGIMS), Patna.
        </p>
      </Reveal>

      {/* Policy Selector Tabs */}
      <Reveal delay={0.05}>
        <div
          style={{
            display: 'flex',
            gap: 10,
            overflowX: 'auto',
            paddingBottom: 8,
            marginBottom: 36,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {POLICIES.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                style={{
                  background: isSelected ? 'linear-gradient(135deg, rgba(220,38,38,0.2) 0%, rgba(220,38,38,0.08) 100%)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? '1px solid #DC2626' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 12,
                  padding: '12px 18px',
                  color: isSelected ? '#fff' : 'var(--muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  whiteSpace: 'nowrap',
                  fontSize: 13,
                  fontWeight: 700,
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
              >
                <Icon size={16} color={isSelected ? '#DC2626' : 'var(--muted)'} />
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Main Content Area */}
      <div
        style={{
          background: 'linear-gradient(160deg, #150808 0%, #090404 100%)',
          border: '1px solid rgba(220, 38, 38, 0.25)',
          borderRadius: 20,
          padding: narrow ? '26px 18px' : '44px 40px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
          position: 'relative',
        }}
      >
        {activeTab === 'terms' && <TermsContent />}
        {activeTab === 'privacy' && <PrivacyContent />}
        {activeTab === 'refunds' && <RefundContent />}
        {activeTab === 'pricing' && <PricingContent />}

        {/* Institutional Signature & Contact Box */}
        <div
          style={{
            marginTop: 48,
            paddingTop: 28,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'grid',
            gridTemplateColumns: narrow ? '1fr' : '1.5fr 1fr',
            gap: 20,
            fontSize: 12,
            color: 'var(--muted)',
          }}
        >
          <div>
            <p style={{ fontWeight: 700, color: 'var(--cream)', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: 1 }}>
              Festival Secretarial Office
            </p>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Indira Gandhi Institute of Medical Sciences (IGIMS)<br />
              Sheikhpura, Patna, Bihar &ndash; 800014, India.<br />
              Email: <a href="mailto:cerebrexia@igims.edu" style={{ color: 'var(--gold)', textDecoration: 'none' }}>cerebrexia@igims.edu</a>
            </p>
          </div>
          <div>
            <p style={{ fontWeight: 700, color: 'var(--cream)', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: 1 }}>
              Payment Security Assurance
            </p>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Online transactions are securely encrypted and processed by <strong>Razorpay Software Pvt. Ltd.</strong>, conforming to PCI-DSS Level 1 certification.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. TERMS & CONDITIONS
// ─────────────────────────────────────────────────────────────────────────────
function TermsContent() {
  return (
    <article style={{ color: 'var(--paper)', lineHeight: 1.75, fontSize: 13.5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <FileText size={20} color="#DC2626" />
        <h2 className="crx-display" style={{ fontSize: 24, color: 'var(--cream)', margin: 0 }}>
          TERMS AND CONDITIONS
        </h2>
      </div>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 28 }}>
        Effective Date: October 2026 &middot; Applicable to Cerebrexia '26 (IGIMS Annual Fest)
      </p>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>1. Introduction &amp; Scope</h3>
        <p>
          Welcome to the official web portal of <strong>Cerebrexia '26</strong>, the annual inter-collegiate festival of the Indira Gandhi Institute of Medical Sciences (IGIMS), Patna. These Terms and Conditions govern your registration, participation, festival credential issuance, payment processing, and presence on the IGIMS campus during the festival dates.
        </p>
        <p>
          By creating an account, registering for events, or making payment on this portal, you agree to comply with and be bound by these terms. If you disagree with any part of these terms, please do not use this portal or register for the festival.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>2. Delegate Eligibility &amp; Identity Verification</h3>
        <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
          <li>Participation is open to bonafide undergraduate and postgraduate students from recognized colleges, universities, and medical institutes.</li>
          <li>All participants must carry their original College Identity Card and a valid Government-issued photo ID (Aadhaar Card, Driving Licence, or Passport) at all times while on campus.</li>
          <li>Providing fraudulent, impersonated, or inaccurate college credentials during registration will result in immediate disqualification and forfeiture of registration fees.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>3. Basic Registration (BR) &amp; Access Rights</h3>
        <p>
          Basic Registration (BR) (₹2,000) confers a personal, non-transferable licence to enter the festival grounds and attend scheduled celebrity nights (Pronites). An issued digital QR credential is unique to the registrant and cannot be transferred, resold, or exchanged.
        </p>
        <p>
          Physical wristbands or badges issued at the campus registration desk must remain intact for the festival's duration. Tampered or duplicate wristbands will be revoked immediately without entitlement to re-issuance.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>4. Campus Discipline &amp; Code of Conduct</h3>
        <p>
          Indira Gandhi Institute of Medical Sciences (IGIMS) is a premier healthcare and educational institution. All attendees must adhere to rigorous decorum:
        </p>
        <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
          <li>Possession or consumption of alcohol, narcotics, contraband substances, or weapons of any kind is strictly forbidden and punishable under Indian law.</li>
          <li>Any form of ragging, physical altercation, verbal harassment, vandalism, or unauthorized entry into hospital treatment areas will lead to immediate police reporting and expulsion.</li>
          <li>The organizing committee, institute proctorial board, and campus security reserve the absolute right to refuse entry or evict any individual violating safety protocols.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>5. Event Rules &amp; Jury Determinations</h3>
        <p>
          Detailed rules, slot durations, and evaluation parameters for all 70+ academic, cultural, sports, and fine arts events are detailed in the official rulebooks. Decisions delivered by appointed judges, event coordinators, and juries are final and legally binding. No appeals or disputes will be entertained once results are officially declared.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>6. Intellectual Property &amp; Media Consent</h3>
        <p>
          By attending Cerebrexia '26, participants grant IGIMS and the Cerebrexia organizing body a non-exclusive, royalty-free, worldwide licence to photograph, film, and broadcast their performances and likeness across official website archives, social media handles, and institutional press releases.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>7. Disclaimers &amp; Limitation of Liability</h3>
        <p>
          While the institute maintains 24x7 security, emergency medical desks, and surveillance, participants are personally responsible for the safety of their belongings (laptops, instruments, wallets, phones). IGIMS and the festival committee bear no civil or financial liability for personal losses, theft, accidental injuries, or schedule delays arising from unforeseen weather or civic emergencies.
        </p>
      </section>

      <section>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>8. Governing Law &amp; Legal Jurisdiction</h3>
        <p>
          These Terms and any dispute or claim arising out of festival participation or portal transactions shall be governed by and construed in accordance with the laws of India. The courts of <strong>Patna, Bihar</strong> shall have exclusive jurisdiction over all matters.
        </p>
      </section>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. PRIVACY POLICY
// ─────────────────────────────────────────────────────────────────────────────
function PrivacyContent() {
  return (
    <article style={{ color: 'var(--paper)', lineHeight: 1.75, fontSize: 13.5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Lock size={20} color="#DC2626" />
        <h2 className="crx-display" style={{ fontSize: 24, color: 'var(--cream)', margin: 0 }}>
          PRIVACY POLICY
        </h2>
      </div>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 28 }}>
        Effective Date: October 2026 &middot; Compliant with Information Technology Act, 2000 &amp; SPDI Rules
      </p>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>1. Our Commitment to Your Privacy</h3>
        <p>
          The Cerebrexia '26 Organising Committee at Indira Gandhi Institute of Medical Sciences (IGIMS) respects your personal privacy. This Privacy Policy details what information we collect from participants, delegates, and guests through our website, how we process and store it, and the safeguards implemented to protect your data.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>2. Information We Collect</h3>
        <p>To register you as an official fest participant and issue valid credentials, we collect:</p>
        <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
          <li><strong>Identity &amp; Contact Data:</strong> First name, surname, email address, mobile phone number.</li>
          <li><strong>Institutional Data:</strong> Name of your college or university, city of college, state.</li>
          <li><strong>Event Selections:</strong> List of cultural, academic, or sports events you register for.</li>
          <li><strong>Authentication Data:</strong> Encrypted password hashes or Google OAuth profile tokens.</li>
          <li><strong>Payment Identifiers:</strong> Razorpay order ID, payment transaction ID, timestamp, and payment status (PAID/PENDING).</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>3. Financial Data &amp; Payment Gateway Security</h3>
        <div style={{ background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: 10, padding: '14px 18px', marginBottom: 14 }}>
          <p style={{ margin: 0, color: '#86efac', fontWeight: 600 }}>
            We do NOT store or process your banking passwords, Credit/Debit Card CVVs, or UPI PINs on our servers.
          </p>
        </div>
        <p>
          All electronic fee payments are handled directly by our certified payment gateway partner, <strong>Razorpay Software Private Limited</strong>. Razorpay operates under strict Reserve Bank of India (RBI) guidelines and complies with the Payment Card Industry Data Security Standard (PCI-DSS Level 1). Our servers only receive a cryptographically signed authorization token confirming the success of the transaction.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>4. How We Use Your Information</h3>
        <p>Collected information is strictly utilized for legitimate festival administration purposes:</p>
        <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
          <li>Generating personalized digital QR festival credentials and participant ID credentials.</li>
          <li>Enrolling and seeding participants in specific tournament brackets and competitive events.</li>
          <li>Communicating schedule adjustments, emergency alerts, or winner notifications.</li>
          <li>Transmitting transactional receipts and automated reminder notices via Resend.</li>
          <li>Verifying hostel accommodation rosters and campus security checkpoints.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>5. Zero Data-Selling Guarantee</h3>
        <p>
          We maintain a strict zero-tolerance policy towards unsolicited commercial marketing:
        </p>
        <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
          <li>We will <strong>never</strong> sell, rent, lease, or monetize your contact details to third-party telemarketers or external advertising networks.</li>
          <li>Data is shared only with authorized members of the IGIMS Fest Committee, campus security personnel, and statutory authorities if mandated by Indian judicial law.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>6. Storage &amp; Cloud Infrastructure Security</h3>
        <p>
          Your personal data and registration records are hosted on enterprise cloud infrastructure (Supabase PostgreSQL) utilizing SSL/TLS 256-bit encryption in transit and AES-256 encryption at rest. Strict Row-Level Security (RLS) policies ensure that your private profile data can only be accessed by your authenticated session.
        </p>
      </section>

      <section>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>7. Grievance Officer &amp; Inquiries</h3>
        <p>
          If you have questions regarding data privacy, wish to request correction of your profile, or have an inquiry, you may reach our coordinator desk at:
        </p>
        <p style={{ margin: '8px 0 0', color: 'var(--cream)' }}>
          <strong>Cerebrexia Secretariat &middot; Privacy Inquiries</strong><br />
          IGIMS Campus, Sheikhpura, Patna &ndash; 800014, Bihar<br />
          Email: <a href="mailto:cerebrexia@igims.edu" style={{ color: 'var(--gold)', textDecoration: 'none' }}>cerebrexia@igims.edu</a>
        </p>
      </section>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. REFUND & CANCELLATION POLICY
// ─────────────────────────────────────────────────────────────────────────────
function RefundContent() {
  return (
    <article style={{ color: 'var(--paper)', lineHeight: 1.75, fontSize: 13.5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <RefreshCw size={20} color="#DC2626" />
        <h2 className="crx-display" style={{ fontSize: 24, color: 'var(--cream)', margin: 0 }}>
          REFUND &amp; CANCELLATION POLICY
        </h2>
      </div>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 28 }}>
        Effective Date: October 2026 &middot; Mandatory Payment Compliance
      </p>

      <div style={{ background: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 24 }}>
        <p style={{ margin: 0, color: 'var(--cream)', fontWeight: 600 }}>
          Summary: All festival registration fees and accommodation charges are non-refundable once payment is completed. Accidental duplicate deductions are reversed automatically within 5 to 7 business days.
        </p>
      </div>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>1. General Non-Refundability Policy</h3>
        <p>
          Cerebrexia '26 is a student-organized medical festival with finite venue capacity, pre-booked stage artist engagements, fixed logistical arrangements, and pre-allocated competitive event slots.
        </p>
        <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
          <li><strong>Basic Registration (BR) Fee (₹2,000):</strong> Strictly non-refundable and non-transferable under any personal circumstances (including voluntary cancellation, travel changes, academic scheduling conflicts, or examination dates).</li>
          <li><strong>Accommodation Fee (₹150):</strong> Non-refundable once room inventory has been reserved in the boys' hostel or girls' lodgings.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>2. Duplicate Payments &amp; Technical Errors</h3>
        <p>
          If a technical glitch or network timeout causes a user's account to be charged more than once for the same registration, or if the fee was deducted from your bank but your portal status failed to update to <strong>PAID</strong>:
        </p>
        <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
          <li>Razorpay's automated reconciliation engine will typically detect the duplicate charge and initiate an automatic refund of the excess transaction.</li>
          <li>Such reversals are routed back to the original source account (UPI account, card, or net banking) within <strong>5 to 7 business days</strong>, subject to your banking institution's processing cycles.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>3. How to Report a Payment Discrepancy</h3>
        <p>
          If your bank account was debited but your dashboard does not show a confirmed status within 24 hours, write to our finance committee with the following details:
        </p>
        <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '16px 20px', margin: '12px 0' }}>
          <p style={{ margin: '0 0 6px', color: 'var(--cream)', fontWeight: 600 }}>Required Verification Details:</p>
          <ul style={{ paddingLeft: 20, margin: 0, color: 'var(--muted)' }}>
            <li>Your registered email address and full name</li>
            <li>Razorpay Payment ID (e.g., <code>pay_XXXXXXXXXXXXXX</code>)</li>
            <li>Bank transaction reference number (UTR / RRN for UPI)</li>
            <li>Date and time of transaction</li>
            <li>Bank account statement or screenshot of debit notification</li>
          </ul>
        </div>
        <p>
          Send these details to <a href="mailto:cerebrexia@igims.edu" style={{ color: 'var(--gold)', textDecoration: 'none' }}>cerebrexia@igims.edu</a> with the subject line: <code>[Payment Discrepancy] &ndash; Your Registered Email</code>.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>4. Event Cancellation or Force Majeure</h3>
        <p>
          In the highly unlikely event that Cerebrexia '26 is canceled in its entirety due to circumstances beyond the control of IGIMS (including but not limited to pandemics, natural disasters, national emergencies, or government directives), the institute management and fest advisory board will announce an institutional resolution regarding partial refunds or automatic transfer of registrations to rescheduled dates.
        </p>
      </section>

      <section>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>5. Disqualification Forfeiture</h3>
        <p>
          Participants evicted from the campus or disqualified from competitive events due to disciplinary infractions, substance violations, or behavioral misconduct shall forfeit all registration fees and accommodation rights with no entitlement to a refund.
        </p>
      </section>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PRICING & SERVICE DELIVERY
// ─────────────────────────────────────────────────────────────────────────────
function PricingContent() {
  return (
    <article style={{ color: 'var(--paper)', lineHeight: 1.75, fontSize: 13.5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <CreditCard size={20} color="#DC2626" />
        <h2 className="crx-display" style={{ fontSize: 24, color: 'var(--cream)', margin: 0 }}>
          PRICING &amp; SERVICE DELIVERY POLICY
        </h2>
      </div>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 28 }}>
        Effective Date: October 2026 &middot; Service Fulfillment Terms
      </p>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>1. Official Fee Schedule</h3>
        <p>All prices on the Cerebrexia '26 portal are listed in Indian Rupees (INR) and are all-inclusive of applicable event participation access:</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, margin: '18px 0' }}>
          <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 12, padding: '20px' }}>
            <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700, letterSpacing: 1 }}>
              Basic Registration (BR)
            </span>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', margin: '6px 0 8px' }}>
              ₹2,000
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
              Official Basic Registration (BR) entry for Cerebrexia '26. Confers admission to star celebrity Pronites and festival credential kit.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '20px' }}>
            <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 700, letterSpacing: 1 }}>
              Hostel Accommodation (Optional)
            </span>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--cream)', margin: '6px 0 8px' }}>
              ₹150
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
              4-day campus stay (27 &ndash; 30 Nov) in secured Boys' Hostel rooms or Girls' Lodgings with 24x7 security, water, and Wi-Fi access.
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>2. Electronic Service Delivery Method</h3>
        <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 10, padding: '14px 18px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#86efac', fontWeight: 600 }}>
            <CheckCircle2 size={16} /> Instant Digital Delivery (No Physical Shipping)
          </div>
        </div>
        <p>
          Cerebrexia '26 provides electronic service delivery. We do not dispatch tangible physical parcels through postal or courier services.
        </p>
        <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
          <li><strong>Immediate Credential Issuance:</strong> Immediately upon successful transaction confirmation through the Razorpay gateway, your digital delegate credential containing your verification QR code is generated and unlocked on your <strong>Participant Dashboard</strong>.</li>
          <li><strong>Email Confirmation:</strong> A transactional confirmation receipt and entry confirmation are dispatched directly to your registered email address within minutes of payment authorization.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>3. Physical Wristband &amp; Badge Collection</h3>
        <p>
          While festival credentials are delivered digitally, security wristbands and event badges must be physically collected upon your arrival at the campus:
        </p>
        <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '14px 18px', margin: '12px 0' }}>
          <p style={{ margin: '0 0 6px', color: 'var(--cream)', fontWeight: 600 }}>Collection Counter Details:</p>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: 12.5 }}>
            Location: Central Registration Counter, Administrative Block, IGIMS Campus, Sheikhpura, Patna.<br />
            Operating Timings: 8:30 AM &ndash; 7:00 PM throughout the festival days (27 &ndash; 30 Nov).<br />
            Requirement: Present your digital QR credential on your mobile screen along with your college identity card.
          </p>
        </div>
      </section>

      <section>
        <h3 style={{ color: 'var(--cream)', fontSize: 16, margin: '0 0 8px' }}>4. Billing Disclosures</h3>
        <p>
          All electronic invoices and transaction notifications are delivered digitally. The organization does not levy hidden booking fees or unadvertised surcharges. If you require an institutional participation receipt for college reimbursement, you may download your invoice directly from your dashboard or email our finance desk.
        </p>
      </section>
    </article>
  );
}
