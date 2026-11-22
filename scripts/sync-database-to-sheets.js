#!/usr/bin/env node
/**
 * =========================================================================
 * CEREBREXIA '26 - FULL DATABASE TO 4 GOOGLE SHEETS BATCH SYNC UTILITY
 * =========================================================================
 * 
 * Usage:
 *   node scripts/sync-database-to-sheets.js [WEBHOOK_URL]
 * 
 * If WEBHOOK_URL is not provided as an argument, it reads from
 * GOOGLE_SHEETS_WEBHOOK_URL in environment or .env.
 * =========================================================================
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://dgkubrwfrwcfpkgjoxmu.supabase.co';
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_v_CcCDqlYXXvx1emJ9U7Cw_2KCpskhS';

const webhookUrl = process.argv[2] || process.env.GOOGLE_SHEETS_WEBHOOK_URL;

if (!webhookUrl) {
  console.error('\n❌ ERROR: Google Sheets Webhook URL is required.');
  console.log('Provide it as an argument or set GOOGLE_SHEETS_WEBHOOK_URL:\n');
  console.log('  node scripts/sync-database-to-sheets.js https://script.google.com/macros/s/...\n');
  process.exit(1);
}

console.log('\n🚀 Starting full database export from Supabase to 4 Google Sheets...');
console.log(`🔗 Target Webhook: ${webhookUrl}\n`);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  try {
    console.log('📦 Fetching all tables from Supabase...');
    
    let participants = [];
    let basicRegs = [];
    let sports = [];
    let cultural = [];
    let formResponses = [];
    let tickets = [];

    // Try RPC first (bypasses RLS safely if function created)
    const { data: rpcData, error: rpcErr } = await supabase.rpc('get_all_fest_data_for_sheets');
    if (!rpcErr && rpcData && typeof rpcData === 'object') {
      participants = rpcData.participants || [];
      basicRegs = rpcData.basic_registrations || [];
      sports = rpcData.sports_registrations || [];
      cultural = rpcData.cultural_registrations || [];
      formResponses = rpcData.event_form_responses || [];
      tickets = rpcData.tickets || [];
      console.log('  ✨ Data fetched via get_all_fest_data_for_sheets RPC.');
    } else {
      const [pRes, brRes, sRes, cRes, efrRes, tktRes] = await Promise.all([
        supabase.from('participants').select('*'),
        supabase.from('basic_registrations').select('*'),
        supabase.from('sports_registrations').select('*'),
        supabase.from('cultural_registrations').select('*'),
        supabase.from('event_form_responses').select('*'),
        supabase.from('tickets').select('*'),
      ]);

      participants = pRes.data || [];
      basicRegs = brRes.data || [];
      sports = sRes.data || [];
      cultural = cRes.data || [];
      formResponses = efrRes.data || [];
      tickets = tktRes.data || [];
    }

    console.log(`  - Participants: ${participants.length}`);
    console.log(`  - Basic Registrations: ${basicRegs.length}`);
    console.log(`  - Sports Registrations: ${sports.length}`);
    console.log(`  - Cultural Registrations: ${cultural.length}`);
    console.log(`  - Form Responses: ${formResponses.length}`);
    console.log(`  - Issued Tickets: ${tickets.length}`);

    // Participant lookup map
    const pMap = new Map();
    participants.forEach((p) => {
      if (p.id) pMap.set(p.id, p);
      if (p.user_id) pMap.set(p.user_id, p);
      if (p.email) pMap.set(p.email.toLowerCase(), p);
    });

    // Form responses lookup
    const formMap = new Map();
    formResponses.forEach((f) => {
      const key = `${f.registration_id || f.user_id}_${f.event_id}`;
      formMap.set(key, f);
    });

    // Tickets lookup
    const ticketsMap = new Map();
    tickets.forEach((t) => {
      const regId = t.registration_id || t.basic_registration_id;
      if (regId) {
        if (!ticketsMap.has(regId)) ticketsMap.set(regId, []);
        ticketsMap.get(regId).push(t.ticket_number || t.id);
      }
    });

    // 1. Build Participants payload
    const batchParticipants = participants.map((p) => {
      const pSports = sports.filter((s) => s.user_id === p.user_id || s.participant_id === p.id);
      const pCultural = cultural.filter((c) => c.user_id === p.user_id || c.participant_id === p.id);
      return {
        id: p.id,
        user_id: p.user_id,
        first_name: p.first_name || '',
        last_name: p.last_name || p.surname || '',
        email: p.email || '',
        phone_number: p.phone_number || '',
        college_name: p.college_name || '',
        college_city: p.college_city || p.city_of_college || '',
        college_state: p.college_state || p.state_of_college || '',
        payment_status: p.payment_status || 'PENDING',
        total_registered_events: pSports.length + pCultural.length,
        sports_events: pSports.map((s) => s.event_id || s.event_title).filter(Boolean).join(', '),
        cultural_events: pCultural.map((c) => c.event_id || c.event_title).filter(Boolean).join(', '),
      };
    });

    // 2. Build Basic Registrations payload
    const batchBR = basicRegs.map((br) => {
      const leadP = pMap.get(br.user_id) || pMap.get(br.participant_id) || {};
      const regTickets = ticketsMap.get(br.id) || [];
      return {
        id: br.id,
        registration_type: br.registration_type || 'SINGLE',
        group_size: br.group_size || 1,
        lead_name: br.lead_name || `${leadP.first_name || ''} ${leadP.last_name || ''}`.trim(),
        lead_email: br.lead_email || leadP.email || '',
        lead_phone: br.lead_phone || leadP.phone_number || '',
        lead_college: br.lead_college || leadP.college_name || '',
        group_members: br.group_members || [],
        promo_code: br.promo_code || '',
        discount_amount: br.discount_amount || 0,
        amount_paid: br.amount_paid || br.final_amount || (br.group_size || 1) * 2000,
        payment_status: br.payment_status || 'COMPLETED',
        razorpay_payment_id: br.razorpay_payment_id || '',
        ticket_number: regTickets.join(', ') || br.ticket_number || '',
      };
    });

    // 3. Build Sports Registrations payload
    const batchSports = sports.map((s) => {
      const p = pMap.get(s.user_id) || pMap.get(s.participant_id) || {};
      const formKey = `${s.id || s.user_id}_${s.event_id}`;
      const form = formMap.get(formKey);
      return {
        id: s.id,
        user_id: s.user_id,
        participant_id: s.participant_id,
        candidate_name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || s.candidate_name || 'N/A',
        email: p.email || s.email || '',
        phone_number: p.phone_number || s.phone_number || '',
        college_name: p.college_name || s.college_name || '',
        event_id: s.event_id || s.sport_id,
        event_name: s.event_name || s.event_title || s.event_id,
        sub_category: s.sub_category || '',
        team_members: form?.responses || s.team_members || '',
        ticket_number: s.ticket_number || '',
        payment_status: s.payment_status || 'CONFIRMED',
      };
    });

    // 4. Build Cultural Registrations payload
    const batchCultural = cultural.map((c) => {
      const p = pMap.get(c.user_id) || pMap.get(c.participant_id) || {};
      const formKey = `${c.id || c.user_id}_${c.event_id}`;
      const form = formMap.get(formKey);
      return {
        id: c.id,
        user_id: c.user_id,
        participant_id: c.participant_id,
        candidate_name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || c.candidate_name || 'N/A',
        email: p.email || c.email || '',
        phone_number: p.phone_number || c.phone_number || '',
        college_name: p.college_name || c.college_name || '',
        event_id: c.event_id,
        event_name: c.event_name || c.event_title || c.event_id,
        sub_category: c.sub_category || '',
        team_members: form?.responses || c.team_members || '',
        ticket_number: c.ticket_number || '',
        payment_status: c.payment_status || 'CONFIRMED',
      };
    });

    console.log('\n📤 Sending batch payloads to Google Apps Script...');
    const payload = {
      action: 'BATCH_SYNC',
      participants: batchParticipants,
      basicRegistrations: batchBR,
      sportsRegistrations: batchSports,
      culturalRegistrations: batchCultural,
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const resText = await res.text();
    console.log(`\n✅ Google Apps Script Response (HTTP ${res.status}):\n${resText}\n`);
    console.log('🎉 Full database batch synchronization completed successfully!');
  } catch (err) {
    console.error('\n❌ Batch sync error:', err);
    process.exit(1);
  }
}

run();
