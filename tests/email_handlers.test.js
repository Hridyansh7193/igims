import assert from 'node:assert/strict';

// Helper to create mock Express/Vercel req/res objects
function createMockReqRes({ method = 'POST', headers = {}, body = {} } = {}) {
  const req = {
    method,
    headers: { 'x-forwarded-for': '203.0.113.42', ...headers },
    socket: { remoteAddress: '203.0.113.42' },
    body,
  };
  const res = {
    statusCode: 200,
    headers: {},
    payload: null,
    ended: false,
    setHeader(k, v) {
      this.headers[k] = v;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.payload = data;
      return this;
    },
    end() {
      this.ended = true;
      return this;
    },
  };
  return { req, res };
}

console.log('=== RUNNING GMAIL SMTP EMAIL HANDLER TESTS ===\n');

const origEnv = { ...process.env };
function resetEnv(overrides = {}) {
  for (const k of Object.keys(process.env)) {
    if (!(k in origEnv)) delete process.env[k];
  }
  Object.assign(process.env, origEnv);
  // Clear mail/env flags for deterministic test isolation
  delete process.env.RESEND_API_KEY;
  delete process.env.EMAIL_ENABLED;
  delete process.env.GMAIL_USER;
  delete process.env.GMAIL_APP_PASSWORD;
  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASS;
  delete process.env.GMAIL_COPY_EMAIL;
  delete process.env.GMAIL_ARCHIVE_EMAIL;
  delete process.env.CRON_SECRET;
  delete process.env.VERCEL_ENV;
  Object.assign(process.env, overrides);
}

let testIdx = 0;
async function runAsyncTest(name, fn) {
  testIdx += 1;
  try {
    await fn(testIdx);
    console.log(`  ✅ PASS: ${name}`);
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

// Note: Some handlers capture top-level env constants at import time, so we pass cache-busting query params
// when testing env variations across modules!
const loadFresh = async (relPath, tag) => import(`${relPath}?t=${tag}_${Date.now()}`);

await runAsyncTest('api/_email.js resolves Gmail credentials and strips spaces from App Password', async (i) => {
  resetEnv({
    GMAIL_USER: 'fest@example.com',
    GMAIL_APP_PASSWORD: 'abcd efgh ijkl mnop',
  });
  const { getGmailConfig, createGmailTransporter, setTestTransportFactory } = await loadFresh('../api/_email.js', i);
  const cfg = getGmailConfig();
  assert.equal(cfg.user, 'fest@example.com');
  assert.equal(cfg.pass, 'abcdefghijklmnop');
  assert.equal(cfg.configured, true);

  let capturedConfig = null;
  setTestTransportFactory((c) => {
    capturedConfig = c;
    return { sendMail: async () => ({ messageId: 'mock' }) };
  });
  createGmailTransporter({ pool: true });
  assert.equal(capturedConfig.host, 'smtp.gmail.com');
  assert.equal(capturedConfig.port, 465);
  assert.equal(capturedConfig.secure, true);
  assert.equal(capturedConfig.pool, true);
  assert.equal(capturedConfig.auth.pass, 'abcdefghijklmnop');
  setTestTransportFactory(null);
});

await runAsyncTest('send-ticket-email.js suppresses emails on Preview without calling SMTP', async (i) => {
  resetEnv({
    VERCEL_ENV: 'preview',
    GMAIL_USER: 'fest@example.com',
    GMAIL_APP_PASSWORD: 'abcdefghijklmnop',
  });
  const emailMod = await import('../api/_email.js');
  let smtpCalled = false;
  emailMod.setTestTransportFactory(() => ({
    sendMail: async () => {
      smtpCalled = true;
      return { messageId: 'should-not-send' };
    },
  }));

  const { default: handler } = await loadFresh('../api/send-ticket-email.js', i);
  const { req, res } = createMockReqRes({
    headers: { 'x-forwarded-for': `198.51.100.${i}` },
    body: {
      ticket: {
        ticket_number: 'CRX26-BR-1001',
        attendee_name: 'Test Student',
        attendee_email: 'student@example.com',
        qr_token: 'CRX26_TEST_TOKEN',
      },
    },
  });
  await handler(req, res);
  emailMod.setTestTransportFactory(null);

  assert.equal(res.statusCode, 200);
  assert.equal(res.payload?.suppressed, true);
  assert.equal(smtpCalled, false);
});

await runAsyncTest('send-ticket-email.js fails cleanly with 500 when Gmail SMTP credentials are missing in Production', async (i) => {
  resetEnv({ VERCEL_ENV: 'production' });
  const { default: handler } = await loadFresh('../api/send-ticket-email.js', i);
  const { req, res } = createMockReqRes({
    headers: { 'x-forwarded-for': `198.51.100.${i}` },
    body: { ticket: { attendee_email: 'a@b.com', qr_token: 'tok' } },
  });
  await handler(req, res);
  assert.equal(res.statusCode, 500);
  assert.match(res.payload?.error, /Gmail SMTP credentials/);
});

await runAsyncTest('send-ticket-email.js sends QR pass, preserves BCC, and escapes HTML via Gmail SMTP', async (i) => {
  resetEnv({
    VERCEL_ENV: 'production',
    GMAIL_USER: 'fest@example.com',
    GMAIL_APP_PASSWORD: 'abcd efgh ijkl mnop',
    GMAIL_COPY_EMAIL: 'copy@example.com',
    GMAIL_ARCHIVE_EMAIL: 'archive@example.com',
  });

  const emailMod = await import('../api/_email.js');
  let sentMail = null;
  emailMod.setTestTransportFactory(() => ({
    sendMail: async (opts) => {
      sentMail = opts;
      return { messageId: '<ticket-msg-1@gmail.com>' };
    },
  }));

  const { default: handler } = await loadFresh('../api/send-ticket-email.js', i);
  const { req, res } = createMockReqRes({
    headers: { 'x-forwarded-for': `198.51.100.${i}` },
    body: {
      group_size: 2,
      ticket: {
        ticket_number: 'CRX26-BR-9999',
        attendee_name: 'Aarav <Test>',
        attendee_college: 'IGIMS Patna',
        attendee_email: 'AARAV@EXAMPLE.COM',
        qr_token: 'CRX26_MOCK_QR_9999',
        pass_type: 'BASIC_REGISTRATION_PRONITES',
      },
    },
  });
  await handler(req, res);
  emailMod.setTestTransportFactory(null);

  assert.equal(res.statusCode, 200);
  assert.equal(res.payload?.success, true);
  assert.equal(res.payload?.provider, 'gmail_smtp');
  assert.equal(sentMail.to, 'aarav@example.com');
  assert.deepEqual(sentMail.bcc, ['copy@example.com', 'archive@example.com']);
  assert.match(sentMail.from, /fest@example\.com/);
  assert.match(sentMail.html, /Aarav &lt;Test&gt;/);
  assert.match(sentMail.html, /cid:gate_pass_qr/);
  assert.equal(sentMail.attachments.length, 1);
  assert.equal(sentMail.attachments[0].cid, 'gate_pass_qr');
  assert.ok(Buffer.isBuffer(sentMail.attachments[0].content));
});

await runAsyncTest('send-contact-query.js suppresses on Preview and dispatches via Gmail SMTP in Production', async (i) => {
  resetEnv({
    VERCEL_ENV: 'preview',
    GMAIL_USER: 'fest@example.com',
    GMAIL_APP_PASSWORD: 'abcdefghijklmnop',
  });
  const { default: previewHandler } = await loadFresh('../api/send-contact-query.js', `${i}_prev`);
  const prevMock = createMockReqRes({
    headers: { 'x-forwarded-for': `198.51.100.${i}` },
    body: { name: 'Visitor', email: 'visitor@example.com', message: 'Hello!' },
  });
  await previewHandler(prevMock.req, prevMock.res);
  assert.equal(prevMock.res.statusCode, 200);
  assert.equal(prevMock.res.payload?.suppressed, true);

  resetEnv({
    VERCEL_ENV: 'production',
    GMAIL_USER: 'fest@example.com',
    GMAIL_APP_PASSWORD: 'abcdefghijklmnop',
    CONTACT_INBOX_EMAIL: 'desk@example.com',
  });
  const emailMod = await import('../api/_email.js');
  let sentMail = null;
  emailMod.setTestTransportFactory(() => ({
    sendMail: async (opts) => {
      sentMail = opts;
      return { messageId: '<contact-msg-1@gmail.com>' };
    },
  }));
  const { default: prodHandler } = await loadFresh('../api/send-contact-query.js', `${i}_prod`);
  const prodMock = createMockReqRes({
    headers: { 'x-forwarded-for': `198.51.101.${i}` },
    body: { name: 'Riya', email: 'riya@example.com', message: 'Schedule query <script>' },
  });
  await prodHandler(prodMock.req, prodMock.res);
  emailMod.setTestTransportFactory(null);

  assert.equal(prodMock.res.statusCode, 200);
  assert.equal(prodMock.res.payload?.provider, 'gmail_smtp');
  assert.equal(sentMail.to, 'desk@example.com');
  assert.equal(sentMail.replyTo, 'riya@example.com');
  assert.match(sentMail.html, /&lt;script&gt;/);
});

await runAsyncTest('send-reminders.js enforces CRON_SECRET, suppresses on Preview, blocks prod DB mutation on Preview, and requires Gmail SMTP', async (i) => {
  // 1. Unauthenticated cron call -> 401
  resetEnv({
    VERCEL_ENV: 'production',
    CRON_SECRET: 'super_secret_cron_token_2026',
  });
  const { default: authHandler } = await loadFresh('../api/send-reminders.js', `${i}_auth`);
  const badAuth = createMockReqRes({ method: 'GET', headers: { authorization: 'Bearer wrong_secret' } });
  await authHandler(badAuth.req, badAuth.res);
  assert.equal(badAuth.res.statusCode, 401);

  // 2. Preview suppresses reminders cleanly
  resetEnv({
    VERCEL_ENV: 'preview',
    CRON_SECRET: 'super_secret_cron_token_2026',
  });
  const { default: prevHandler } = await loadFresh('../api/send-reminders.js', `${i}_prev`);
  const prevCall = createMockReqRes({
    method: 'GET',
    headers: { authorization: 'Bearer super_secret_cron_token_2026' },
  });
  await prevHandler(prevCall.req, prevCall.res);
  assert.equal(prevCall.res.statusCode, 200);
  assert.equal(prevCall.res.payload?.suppressed, true);

  // 3. Even if EMAIL_ENABLED=true on Preview, prod DB mutation is blocked with 403
  resetEnv({
    VERCEL_ENV: 'preview',
    EMAIL_ENABLED: 'true',
    CRON_SECRET: 'super_secret_cron_token_2026',
    SUPABASE_URL: 'https://dgkubrwfrwcfpkgjoxmu.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'sb_secret_mock',
    GMAIL_USER: 'fest@example.com',
    GMAIL_APP_PASSWORD: 'abcdefghijklmnop',
  });
  const { default: isoHandler } = await loadFresh('../api/send-reminders.js', `${i}_iso`);
  const isoCall = createMockReqRes({
    method: 'GET',
    headers: { authorization: 'Bearer super_secret_cron_token_2026' },
  });
  await isoHandler(isoCall.req, isoCall.res);
  assert.equal(isoCall.res.statusCode, 403);
  assert.match(isoCall.res.payload?.error, /Security Isolation Violation/);

  // 4. Production without Gmail SMTP credentials -> 500 (no Resend key needed or checked)
  resetEnv({
    VERCEL_ENV: 'production',
    CRON_SECRET: 'super_secret_cron_token_2026',
    SUPABASE_URL: 'https://dgkubrwfrwcfpkgjoxmu.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'sb_secret_mock',
  });
  const { default: noMailHandler } = await loadFresh('../api/send-reminders.js', `${i}_nomail`);
  const noMailCall = createMockReqRes({
    method: 'GET',
    headers: { authorization: 'Bearer super_secret_cron_token_2026' },
  });
  await noMailHandler(noMailCall.req, noMailCall.res);
  assert.equal(noMailCall.res.statusCode, 500);
  assert.match(noMailCall.res.payload?.error, /Missing Gmail SMTP credentials/);
});

Object.assign(process.env, origEnv);
console.log('\n=== ALL GMAIL SMTP EMAIL HANDLER TESTS COMPLETED ===');
