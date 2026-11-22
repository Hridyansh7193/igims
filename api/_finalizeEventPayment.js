// Shared by api/verify-event-payment.js (browser path) and api/razorpay-webhook.js
// (works even if the user closed the tab). Fully idempotent.

const SPORT_WORDS = ['cricket', 'football', 'volleyball', 'badminton', 'kabaddi', 'tug of war', 'chess',
  'table tennis', 'carrom', 'athletics', 'kho kho', 'bgmi', 'rubik'];

/**
 * @param db        supabase client created with the SERVICE ROLE key
 * @param order     Razorpay order object (already confirmed paid)
 * @param paymentId razorpay payment id
 * @returns { recorded, registered }
 */
export async function finalizeEventPayment(db, order, paymentId) {
  const notes = order.notes || {};
  const userId = notes.user_id;
  const eventName = notes.event_name || null;
  const slug = notes.slug || null;
  const amountInr = order.amount / 100;

  // 1. Mark PAID (the row was created with status CREATED in create-event-order)
  let { data: row } = await db
    .from('event_payments')
    .update({ status: 'PAID', razorpay_payment_id: paymentId, paid_at: new Date().toISOString() })
    .eq('razorpay_order_id', order.id)
    .select('*')
    .maybeSingle();

  if (!row) {
    // No pending row (e.g. service key was missing at order time): insert from order notes
    const ins = await db.from('event_payments').insert({
      user_id: userId, event_name: eventName, form_slug: slug, selection: notes.selection || null,
      amount_inr: amountInr, razorpay_order_id: order.id, razorpay_payment_id: paymentId,
      status: 'PAID', paid_at: new Date().toISOString(),
    }).select('*').maybeSingle();
    if (ins.error && ins.error.code !== '23505') {
      console.error('[finalize] insert failed:', ins.error);
      return { recorded: false, registered: false };
    }
    row = ins.data || null;
  }

  // 2. Save the form answers + registration rows if we hold the pending payload
  const payload = row?.payload;
  if (!payload || !userId || !eventName) return { recorded: true, registered: false };

  try {
    const { data: part } = await db.from('participants').select('id').eq('user_id', userId).maybeSingle();
    const participantId = part?.id != null ? part.id : null;

    const answers = Array.isArray(payload.answers) ? [...payload.answers] : [];
    if (!answers.some((a) => a?.id === 'payment')) {
      answers.push({
        id: 'payment', label: 'Payment (Razorpay)', type: 'payment',
        value: `PAID \u20B9${amountInr} | ${paymentId}`,
      });
    }

    const { error: respErr } = await db.from('event_form_responses').upsert({
      user_id: userId,
      participant_id: participantId != null ? String(participantId) : null,
      event_name: eventName,
      category: payload.categoryKey || null,
      form_slug: slug,
      form_label: payload.formLabel || null,
      form_title: payload.formTitle || null,
      answers,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,event_name' });
    if (respErr) throw respErr;

    const isSport = String(payload.categoryKey || '').toLowerCase() === 'sports' ||
      SPORT_WORDS.some((w) => eventName.toLowerCase().includes(w));
    const { error: regErr } = await db.from(isSport ? 'sports_registrations' : 'cultural_registrations').upsert({
      user_id: userId,
      participant_id: participantId,
      event_name: eventName,
      category: isSport ? 'Sports' : (payload.categoryKey || 'Cultural'),
    }, { onConflict: 'user_id,event_name' });
    if (regErr) throw regErr;

    return { recorded: true, registered: true };
  } catch (err) {
    console.error('[finalize] registration write failed:', err);
    return { recorded: true, registered: false };
  }
}
