import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('[Sync] SUPABASE_URL and SUPABASE_KEY environment variables are required.');
}

const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

export async function syncPaymentReconciliations() {
  console.log('[Sync] Fetching all issued BR tickets from Supabase...');
  const { data: tickets, error: tErr } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: true });

  if (tErr) {
    console.error('[Sync] Error fetching tickets:', tErr.message);
    return { success: false, error: tErr.message };
  }

  console.log(`[Sync] Retrieved ${tickets.length} total tickets.`);

  // Group BR tickets by payment ID
  const paymentMap = new Map();

  for (const t of tickets) {
    // Only process BR / Pronites passes
    if (t.pass_type && !t.pass_type.includes('BASIC') && !t.pass_type.includes('CONCERT')) {
      continue;
    }

    const payId = (t.metadata?.razorpay_payment_id || '').trim();
    const groupKey = payId || `unlinked_${t.ticket_number}`;

    if (!paymentMap.has(groupKey)) {
      paymentMap.set(groupKey, {
        razorpay_payment_id: payId || `unlinked_${t.ticket_number}`,
        razorpay_order_id: t.metadata?.razorpay_order_id || null,
        lead_name: t.attendee_name || 'Attendee',
        lead_email: t.attendee_email || '',
        lead_phone: t.attendee_phone || '',
        lead_college: t.attendee_college || '',
        tickets: [],
        attendee_names: [],
        attendee_emails: [],
        promo_code: t.metadata?.promo_code || null,
        source: t.metadata?.source || (payId ? 'RAZORPAY_WEB' : 'UNLINKED'),
        created_at: t.created_at || new Date().toISOString(),
      });
    }

    const group = paymentMap.get(groupKey);
    group.tickets.push(t);
    group.attendee_names.push(t.attendee_name || 'Delegate');
    group.attendee_emails.push(t.attendee_email || '');
    if (!group.promo_code && t.metadata?.promo_code) {
      group.promo_code = t.metadata.promo_code;
    }
    if (!group.razorpay_order_id && t.metadata?.razorpay_order_id) {
      group.razorpay_order_id = t.metadata.razorpay_order_id;
    }
  }

  console.log(`[Sync] Grouped into ${paymentMap.size} distinct payment records.`);

  const recordsToUpsert = [];
  const exportRows = [];

  for (const [key, group] of paymentMap.entries()) {
    const tCount = group.tickets.length;
    const ticketNums = group.tickets.map((t) => t.ticket_number);
    const amount = tCount * 2000; // Estimated gross

    const record = {
      razorpay_payment_id: group.razorpay_payment_id,
      razorpay_order_id: group.razorpay_order_id,
      lead_name: group.lead_name,
      lead_email: group.lead_email,
      lead_phone: group.lead_phone,
      lead_college: group.lead_college,
      ticket_count: tCount,
      ticket_numbers: ticketNums,
      attendee_names: group.attendee_names,
      attendee_emails: group.attendee_emails,
      amount_paid: amount,
      promo_code: group.promo_code,
      payment_status: 'PAID',
      source: group.source,
      created_at: group.created_at,
      updated_at: new Date().toISOString(),
    };

    recordsToUpsert.push(record);

    exportRows.push({
      Payment_ID: record.razorpay_payment_id,
      Order_ID: record.razorpay_order_id || '',
      Lead_Name: record.lead_name,
      Lead_Email: record.lead_email,
      Lead_Phone: record.lead_phone,
      Lead_College: record.lead_college,
      Tickets_Count: record.ticket_count,
      BR_Numbers: ticketNums.join(', '),
      Attendees: group.attendee_names.join(' | '),
      Attendee_Emails: group.attendee_emails.join(' | '),
      Promo_Code: record.promo_code || '',
      Status: record.payment_status,
      Created_At: record.created_at,
    });
  }

  // 1. Save local reconciliation JSON and CSV for offline organizer reference
  const outDir = path.resolve(process.cwd(), 'reports');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const jsonPath = path.join(outDir, 'payment_reconciliation_database.json');
  fs.writeFileSync(jsonPath, JSON.stringify(recordsToUpsert, null, 2));

  const csvHeader = Object.keys(exportRows[0] || {}).join(',');
  const csvBody = exportRows
    .map((r) =>
      Object.values(r)
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\n');
  const csvPath = path.join(outDir, 'payment_reconciliation_database.csv');
  fs.writeFileSync(csvPath, `${csvHeader}\n${csvBody}`);

  console.log(`[Sync] Saved offline reports to:`);
  console.log(`  - ${jsonPath}`);
  console.log(`  - ${csvPath}`);

  // 2. Upsert into Supabase table if it exists
  let dbSuccessCount = 0;
  try {
    const { data: upsertData, error: upsertErr } = await supabase
      .from('payment_reconciliations')
      .upsert(recordsToUpsert, { onConflict: 'razorpay_payment_id' })
      .select();

    if (upsertErr) {
      console.warn('[Sync] Database table upsert notice (table migration may need running in Supabase):', upsertErr.message);
    } else {
      dbSuccessCount = upsertData?.length || recordsToUpsert.length;
      console.log(`[Sync] Successfully synced ${dbSuccessCount} payment reconciliation rows into Supabase table.`);
    }
  } catch (err) {
    console.warn('[Sync] Database exception:', err.message);
  }

  return {
    success: true,
    totalTickets: tickets.length,
    uniquePayments: recordsToUpsert.length,
    dbSuccessCount,
    csvPath,
    jsonPath,
  };
}

if (process.argv[1] && process.argv[1].includes('sync-payment-reconciliations.js')) {
  syncPaymentReconciliations()
    .then((r) => console.log('[Sync] Finished:', r))
    .catch((e) => console.error('[Sync] Fatal:', e));
}
