import assert from 'node:assert/strict';

// Lightweight in-memory Supabase query mock supporting select/insert/upsert/update chains
function createMockDb(initial = {}) {
  const store = {
    participants: [...(initial.participants || [])],
    basic_registrations: [...(initial.basic_registrations || [])],
    tickets: [...(initial.tickets || [])],
    payment_reconciliations: [...(initial.payment_reconciliations || [])],
  };
  let seq = 1;

  function makeBuilder(table) {
    const state = { filters: [], op: 'select', payload: null, conflict: null };
    const exec = async () => {
      const rows = store[table] || [];
      const match = (r) =>
        state.filters.every((f) => {
          if (f.kind === 'eq') return r[f.col] === f.val;
          if (f.kind === 'ilike') return String(r[f.col] || '').toLowerCase() === String(f.val || '').toLowerCase();
          if (f.kind === 'contains') {
            const obj = r[f.col] || {};
            return Object.entries(f.val).every(([k, v]) => obj[k] === v);
          }
          return true;
        });

      if (state.op === 'select') {
        const matched = rows.filter(match);
        return { data: state.single ? (matched[0] || null) : matched, error: null };
      }

      if (state.op === 'insert') {
        const items = Array.isArray(state.payload) ? state.payload : [state.payload];
        const inserted = items.map((item) => {
          const rec = { id: item.id || `${table}_${seq++}`, ...item };
          rows.push(rec);
          return rec;
        });
        return { data: state.single ? inserted[0] : inserted, error: null };
      }

      if (state.op === 'upsert') {
        const items = Array.isArray(state.payload) ? state.payload : [state.payload];
        const out = [];
        for (const item of items) {
          const idx = state.conflict
            ? rows.findIndex((r) => r[state.conflict] && r[state.conflict] === item[state.conflict])
            : -1;
          if (idx >= 0) {
            rows[idx] = { ...rows[idx], ...item };
            out.push(rows[idx]);
          } else {
            const rec = { id: item.id || `${table}_${seq++}`, ...item };
            rows.push(rec);
            out.push(rec);
          }
        }
        return { data: state.single ? out[0] : out, error: null };
      }

      if (state.op === 'update') {
        const updated = [];
        for (let i = 0; i < rows.length; i++) {
          if (match(rows[i])) {
            rows[i] = { ...rows[i], ...state.payload };
            updated.push(rows[i]);
          }
        }
        return { data: state.single ? (updated[0] || null) : updated, error: null };
      }

      return { data: null, error: null };
    };

    const b = {
      select() { return b; },
      insert(p) { state.op = 'insert'; state.payload = p; return b; },
      upsert(p, opts = {}) { state.op = 'upsert'; state.payload = p; state.conflict = opts.onConflict || null; return b; },
      update(p) { state.op = 'update'; state.payload = p; return b; },
      eq(col, val) { state.filters.push({ kind: 'eq', col, val }); return b; },
      ilike(col, val) { state.filters.push({ kind: 'ilike', col, val }); return b; },
      contains(col, val) { state.filters.push({ kind: 'contains', col, val }); return b; },
      limit() { return b; },
      maybeSingle() { state.single = true; return exec(); },
      single() { state.single = true; return exec(); },
      then(resolve, reject) { return exec().then(resolve, reject); },
    };
    return b;
  }

  return {
    store,
    from(table) {
      return makeBuilder(table);
    },
  };
}

console.log('=== RUNNING BASIC REGISTRATION FINALIZATION & RECOVERY TESTS ===\n');

const origEnv = { ...process.env };
function resetEnv(overrides = {}) {
  for (const k of Object.keys(process.env)) {
    if (!(k in origEnv)) delete process.env[k];
  }
  Object.assign(process.env, origEnv);
  process.env.VERCEL_ENV = 'production';
  process.env.SUPABASE_URL = 'https://staging-mock.supabase.co';
  process.env.GMAIL_USER = 'fest@example.com';
  process.env.GMAIL_APP_PASSWORD = 'abcdefghijklmnop';
  delete process.env.EMAIL_ENABLED;
  Object.assign(process.env, overrides);
}

let idx = 0;
async function runAsyncTest(name, fn) {
  idx += 1;
  try {
    await fn(idx);
    console.log(`  ✅ PASS: ${name}`);
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

await runAsyncTest('Recovers pending participant (Sohani case): updates participant, creates basic_registration, issues ticket, reconciles & emails QR', async () => {
  resetEnv();
  const emailMod = await import('../api/_email.js');
  const sentEmails = [];
  emailMod.setTestTransportFactory(() => ({
    sendMail: async (opts) => {
      sentEmails.push(opts);
      return { messageId: `<msg_${sentEmails.length}@gmail.com>` };
    },
  }));

  const db = createMockDb({
    participants: [
      {
        id: 'part_1',
        user_id: 'uid_sohani',
        first_name: 'Sohani',
        last_name: 'Bhagat',
        email: 'sohanibhagat07@gmail.com',
        phone_number: '9541986084',
        college_name: 'Igims patna',
        college_city: 'Patna',
        college_state: 'Bihar',
        payment_status: 'PENDING',
      },
    ],
  });

  const { finalizeBasicRegistration } = await import('../api/_finalizeBasicRegistration.js');
  const res = await finalizeBasicRegistration(db, {
    payment: {
      id: 'pay_TestSohani123',
      order_id: 'order_TestSohani123',
      amount: 200000,
      email: 'sohanibhagat07@gmail.com',
      contact: '+919541986084',
      status: 'captured',
    },
    sendEmail: true,
  });

  emailMod.setTestTransportFactory(null);

  assert.equal(res.alreadyRecorded, false);
  assert.equal(res.userId, 'uid_sohani');
  assert.equal(db.store.participants[0].payment_status, 'PAID');
  assert.equal(db.store.basic_registrations.length, 1);
  assert.equal(db.store.basic_registrations[0].payment_status, 'PAID');
  assert.equal(db.store.tickets.length, 1);
  assert.equal(db.store.tickets[0].user_id, 'uid_sohani');
  assert.equal(db.store.payment_reconciliations.length, 1);
  assert.equal(res.emailsSent, 1);
  assert.equal(sentEmails[0].to, 'sohanibhagat07@gmail.com');
});

await runAsyncTest('Recovers user with ZERO prior DB rows (payment link / dropped registration): inserts participant, ticket, reconciliation & emails QR', async () => {
  resetEnv();
  const emailMod = await import('../api/_email.js');
  const sentEmails = [];
  emailMod.setTestTransportFactory(() => ({
    sendMail: async (opts) => {
      sentEmails.push(opts);
      return { messageId: `<msg_${sentEmails.length}@gmail.com>` };
    },
  }));

  const db = createMockDb();
  const { finalizeBasicRegistration } = await import('../api/_finalizeBasicRegistration.js');
  const res = await finalizeBasicRegistration(db, {
    payment: {
      id: 'pay_TestNoDb999',
      amount: 200000,
      email: 'newpayer@example.com',
      contact: '+919876543210',
      notes: { name: 'Rohan Kumar', college: 'PMCH Patna' },
      status: 'captured',
    },
    sendEmail: true,
  });

  emailMod.setTestTransportFactory(null);

  assert.equal(db.store.participants.length, 1);
  assert.equal(db.store.participants[0].payment_status, 'PAID');
  assert.equal(db.store.participants[0].first_name, 'Rohan');
  assert.equal(db.store.tickets.length, 1);
  assert.equal(db.store.payment_reconciliations.length, 1);
  assert.equal(res.emailsSent, 1);
  assert.equal(sentEmails[0].to, 'newpayer@example.com');
});

await runAsyncTest('Idempotent on webhook replay: does NOT create duplicate tickets or send duplicate emails', async () => {
  resetEnv();
  const emailMod = await import('../api/_email.js');
  const sentEmails = [];
  emailMod.setTestTransportFactory(() => ({
    sendMail: async (opts) => {
      sentEmails.push(opts);
      return { messageId: '<dup@gmail.com>' };
    },
  }));

  const db = createMockDb({
    tickets: [
      {
        id: 'tkt_1',
        ticket_number: 'CRX26-BR-1111',
        user_id: 'uid_dup',
        attendee_email: 'dup@example.com',
        qr_token: 'CRX26_DUP',
        pass_type: 'BASIC_REGISTRATION_PRONITES',
        metadata: { razorpay_payment_id: 'pay_DupCheck777' },
      },
    ],
  });

  const { finalizeBasicRegistration } = await import('../api/_finalizeBasicRegistration.js');
  const res = await finalizeBasicRegistration(db, {
    payment: { id: 'pay_DupCheck777', amount: 200000, email: 'dup@example.com', status: 'captured' },
    sendEmail: true,
  });

  emailMod.setTestTransportFactory(null);
  assert.equal(res.alreadyRecorded, true);
  assert.equal(db.store.tickets.length, 1);
  assert.equal(sentEmails.length, 0);
});

await runAsyncTest('Blocks finalization writes on Preview pointing to production Supabase', async () => {
  resetEnv({
    VERCEL_ENV: 'preview',
    SUPABASE_URL: 'https://dgkubrwfrwcfpkgjoxmu.supabase.co',
  });
  const { finalizeBasicRegistration } = await import('../api/_finalizeBasicRegistration.js');
  const db = createMockDb();
  await assert.rejects(
    () => finalizeBasicRegistration(db, { payment: { id: 'pay_Blocked', amount: 200000, email: 'a@b.com' } }),
    /Security Isolation Violation/
  );
});

await runAsyncTest('buildAuthUserEmailMap preloads users once and reuses shared transporter in batch mode', async () => {
  resetEnv();
  const { buildAuthUserEmailMap, finalizeBasicRegistration } = await import('../api/_finalizeBasicRegistration.js');
  let listCalls = 0;
  const mockDb = createMockDb();
  mockDb.auth = {
    admin: {
      listUsers: async () => {
        listCalls += 1;
        return { data: { users: [{ id: 'uid_batch_1', email: 'batch@example.com' }] }, error: null };
      },
    },
  };
  const authMap = await buildAuthUserEmailMap(mockDb);
  assert.equal(listCalls, 1);
  assert.equal(authMap.get('batch@example.com'), 'uid_batch_1');

  const sentViaShared = [];
  const sharedTransporter = {
    sendMail: async (opts) => {
      sentViaShared.push(opts.to);
      return { messageId: '<shared@gmail.com>' };
    },
  };

  const res = await finalizeBasicRegistration(mockDb, {
    payment: { id: 'pay_Batch1', amount: 200000, email: 'batch@example.com', status: 'captured' },
    authUserEmailMap: authMap,
    transporter: sharedTransporter,
    sendEmail: true,
  });

  assert.equal(listCalls, 1, 'Should use preloaded authUserEmailMap without extra listUsers calls');
  assert.equal(res.userId, 'uid_batch_1');
  assert.deepEqual(sentViaShared, ['batch@example.com']);
});

await runAsyncTest('Issues a separate fresh ticket when a second DIFFERENT razorpay_payment_id shares the same user_id', async () => {
  resetEnv();
  const emailMod = await import('../api/_email.js');
  const sentEmails = [];
  emailMod.setTestTransportFactory(() => ({
    sendMail: async (opts) => {
      sentEmails.push(opts.to);
      return { messageId: `<multi_${sentEmails.length}@gmail.com>` };
    },
  }));

  const db = createMockDb({
    tickets: [
      {
        id: 'tkt_first',
        ticket_number: 'CRX26-BR-6004',
        user_id: 'uid_shared',
        attendee_name: 'Saurav Singh',
        attendee_email: 'saurav@example.com',
        qr_token: 'CRX26_FIRST',
        pass_type: 'BASIC_REGISTRATION_PRONITES',
        metadata: { razorpay_payment_id: 'pay_FirstPayment' },
      },
    ],
  });

  const { finalizeBasicRegistration } = await import('../api/_finalizeBasicRegistration.js');
  const res = await finalizeBasicRegistration(db, {
    userIdHint: 'uid_shared',
    payment: {
      id: 'pay_SecondPayment',
      amount: 200000,
      email: 'lav@example.com',
      notes: { name: 'Lav Kumar', college: 'PMCH' },
      status: 'captured',
    },
    sendEmail: true,
  });

  emailMod.setTestTransportFactory(null);
  assert.equal(res.alreadyRecorded, false);
  assert.equal(db.store.tickets.length, 2, 'Second payment should create its own ticket row');
  assert.notEqual(db.store.tickets[1].ticket_number, 'CRX26-BR-6004');
  assert.deepEqual(sentEmails, ['lav@example.com']);
});

Object.assign(process.env, origEnv);
console.log('\n=== ALL BR FINALIZATION TESTS COMPLETED ===');
