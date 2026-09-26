import React, { useState, useEffect } from 'react';
import { LogOut, ShieldCheck, Clock, CheckCircle2, User, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import AuthForm from '../components/auth/AuthForm';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [participant,    setParticipant]    = useState(null);
  const [fetchingReg,    setFetchingReg]    = useState(false);
  const [fetchError,     setFetchError]     = useState(null);
  const [signOutLoading, setSignOutLoading] = useState(false);

  // Fetch and subscribe to participant row in real-time
  useEffect(() => {
    if (!user) return;

    let channel;

    const fetchParticipant = async () => {
      setFetchingReg(true); setFetchError(null);
      try {
        const { data, error } = await supabase
          .from('participants')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        if (error) throw error;
        setParticipant(data);
      } catch (err) {
        console.error('[Dashboard] fetch error:', err);
        setFetchError('Could not load your registration. Check your connection.');
      } finally {
        setFetchingReg(false);
      }
    };

    fetchParticipant();

    // Real-time subscription — payment_status updates live
    channel = supabase
      .channel('participant_' + user.id)
      .on('postgres_changes', {
        event : '*',
        schema: 'public',
        table : 'participants',
        filter: 'user_id=eq.' + user.id,
      }, (payload) => {
        if (payload.eventType === 'DELETE') { setParticipant(null); return; }
        setParticipant(payload.new);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleSignOut = async () => {
    setSignOutLoading(true);
    try { await signOut(); setParticipant(null); }
    catch (err) { console.error('[Dashboard] signOut error:', err); }
    finally { setSignOutLoading(false); }
  };

  if (!user) {
    return (
      <section style={{ padding:'150px 24px 100px', maxWidth:600, margin:'0 auto' }}>
        <AuthForm />
      </section>
    );
  }

  const isPaid       = participant?.payment_status === 'PAID';
  const statusColor  = isPaid ? '#22c55e' : '#f59e0b';
  const StatusIcon   = isPaid ? CheckCircle2 : Clock;

  return (
    <section style={{ padding:'150px 24px 100px', maxWidth:960, margin:'0 auto' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:36, flexWrap:'wrap', gap:16 }}>
        <div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(220,38,38,0.1)', border:'1px solid rgba(220,38,38,0.3)', borderRadius:20, padding:'4px 12px', marginBottom:12 }}>
            <ShieldCheck size={12} color="#DC2626" />
            <span style={{ fontSize:10, color:'#DC2626', letterSpacing:1.5, textTransform:'uppercase', fontWeight:700 }}>Authenticated</span>
          </div>
          <h1 className="crx-display" style={{ fontSize:'clamp(22px,4vw,32px)', color:'var(--cream)', marginBottom:6 }}>
            COMMAND CENTER
          </h1>
          <p style={{ color:'var(--muted)', fontSize:13 }}>
            <span style={{ color:'rgba(255,255,255,0.4)' }}>Logged in as </span>
            <span style={{ color:'var(--cream)' }}>{user.email}</span>
          </p>
        </div>
        <button onClick={handleSignOut} disabled={signOutLoading} className="crx-btn"
          style={{ background:'transparent', border:'1px solid rgba(220,38,38,0.35)', color:'#ff8f8f', gap:8, flexShrink:0 }}>
          <LogOut size={14} />
          {signOutLoading ? 'SIGNING OUT...' : 'SIGN OUT'}
        </button>
      </div>

      {/* Body */}
      {fetchingReg ? (
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'40px 24px', color:'var(--muted)', fontSize:13 }}>
          <RefreshCw size={16} style={{ animation:'spin 1s linear infinite', color:'#DC2626' }} />
          Checking registration status...
        </div>
      ) : fetchError ? (
        <div style={{ padding:'28px 24px', borderRadius:14, border:'1px solid rgba(220,38,38,0.3)', background:'rgba(220,38,38,0.05)', display:'flex', alignItems:'center', gap:12 }}>
          <AlertTriangle size={20} color="#DC2626" />
          <div>
            <p style={{ color:'var(--cream)', margin:'0 0 4px', fontWeight:600 }}>Could not load registration</p>
            <p style={{ color:'var(--muted)', margin:0, fontSize:13 }}>{fetchError}</p>
          </div>
        </div>
      ) : participant ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
          {/* Profile card */}
          <div style={{ padding:'24px', borderRadius:16, border:'1px solid rgba(220,38,38,0.22)', background:'linear-gradient(160deg,#1a0808 0%,#0A0505 100%)', boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(220,38,38,0.12)', border:'1px solid rgba(220,38,38,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <User size={18} color="#DC2626" />
              </div>
              <div>
                <p style={{ margin:0, fontSize:15, color:'var(--cream)', fontWeight:700 }}>{participant.first_name} {participant.surname}</p>
                <p style={{ margin:0, fontSize:12, color:'var(--muted)' }}>{participant.college_name}</p>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                ['City',  participant.city_of_college],
                ['State', participant.state_of_college],
                ['Phone', participant.phone_number],
                ['Email', participant.email],
              ].map(([label, val]) => (
                <div key={label} style={{ display:'flex', justifyContent:'space-between', gap:8, borderBottom:'1px solid rgba(255,255,255,0.05)', paddingBottom:8 }}>
                  <span style={{ fontSize:11, color:'var(--muted)', textTransform:'uppercase', letterSpacing:0.5 }}>{label}</span>
                  <span style={{ fontSize:12, color:'var(--cream)', textAlign:'right', wordBreak:'break-all', maxWidth:'60%' }}>{val || '—'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment status card */}
          <div style={{ padding:'24px', borderRadius:16, border:'1px solid rgba(220,38,38,0.18)', background:'linear-gradient(160deg,#130a05 0%,#0A0505 100%)', boxShadow:'0 8px 32px rgba(0,0,0,0.4)', display:'flex', flexDirection:'column', gap:16 }}>
            <p style={{ margin:0, fontSize:10, textTransform:'uppercase', letterSpacing:1.8, color:'var(--muted)' }}>Registration Status</p>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background: isPaid ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <StatusIcon size={18} color={statusColor} />
              </div>
              <span style={{ fontSize:20, fontWeight:800, color:statusColor, letterSpacing:1 }}>
                {participant.payment_status || 'PENDING'}
              </span>
            </div>
            <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.65, margin:0 }}>
              {isPaid
                ? 'Your payment is confirmed. See you at Cerebrexia!'
                : 'Registration saved. Complete payment to confirm your spot.'}
            </p>
            {!isPaid && (
              <button className="crx-btn gold" style={{ justifyContent:'center' }}
                onClick={() => alert('Payment gateway coming soon!')}>
                PROCEED TO PAYMENT
              </button>
            )}
            <p style={{ fontSize:10, color:'rgba(255,255,255,0.2)', margin:0 }}>
              Status updates live — no refresh needed.
            </p>
          </div>
        </div>
      ) : (
        <div style={{ padding:'48px 32px', borderRadius:16, border:'1px dashed rgba(220,38,38,0.25)', background:'rgba(220,38,38,0.02)', textAlign:'center' }}>
          <ShieldCheck size={40} color="rgba(220,38,38,0.3)" style={{ margin:'0 auto 16px' }} />
          <h3 style={{ color:'var(--cream)', fontSize:18, marginBottom:8 }}>No Registration Found</h3>
          <p style={{ color:'var(--muted)', fontSize:13 }}>
            You haven't registered yet. Head to the Events page to pick your events.
          </p>
        </div>
      )}
    </section>
  );
}
