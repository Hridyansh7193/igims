import assert from 'node:assert/strict';

function createMockReqRes({ method = 'POST', headers = {}, body = {} } = {}) {
  const req = {
    method,
    headers: { 'x-forwarded-for': '203.0.113.55', ...headers },
    socket: { remoteAddress: '203.0.113.55' },
    body,
  };
  const res = {
    statusCode: 200,
    headers: {},
    payload: null,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(data) { this.payload = data; return this; },
    end() { return this; },
  };
  return { req, res };
}

console.log('=== RUNNING PORTAL AUTH (CerebrexiaAdmin) TESTS ===\n');

const origEnv = { ...process.env };
function resetEnv(overrides = {}) {
  for (const k of Object.keys(process.env)) {
    if (!(k in origEnv)) delete process.env[k];
  }
  Object.assign(process.env, origEnv);
  delete process.env.ADMIN_USERNAME;
  delete process.env.ADMIN_PASSWORD;
  delete process.env.ADMIN_JWT_SECRET;
  delete process.env.BOOKING_PORTAL_USERNAME;
  delete process.env.BOOKING_PORTAL_PASSWORD;
  delete process.env.BOOKING_PORTAL_JWT_SECRET;
  delete process.env.GATE_SCANNER_USERNAME;
  delete process.env.GATE_SCANNER_PASSWORD;
  delete process.env.GATE_SCANNER_JWT_SECRET;
  Object.assign(process.env, overrides);
}

const loadFresh = async (relPath, tag) => import(`${relPath}?t=${tag}_${Date.now()}`);

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

await runAsyncTest('admin-promo-codes.js accepts CerebrexiaAdmin when ADMIN_PASSWORD is set and rejects wrong password', async (i) => {
  resetEnv({
    SUPABASE_URL: 'https://example.supabase.co',
    SUPABASE_ANON_KEY: 'sb_publishable_mock_key',
    ADMIN_PASSWORD: 'TestSharedPassword@123',
  });
  const { default: handler } = await loadFresh('../api/admin-promo-codes.js', i);

  const ok = createMockReqRes({ body: { action: 'login', username: 'CerebrexiaAdmin', password: 'TestSharedPassword@123' } });
  await handler(ok.req, ok.res);
  assert.equal(ok.res.statusCode, 200);
  assert.equal(ok.res.payload?.success, true);
  assert.ok(ok.res.payload?.token);

  const bad = createMockReqRes({ body: { action: 'login', username: 'CerebrexiaAdmin', password: 'WrongPassword' } });
  await handler(bad.req, bad.res);
  assert.equal(bad.res.statusCode, 401);
});

await runAsyncTest('portal-booking.js accepts CerebrexiaAdmin using ADMIN_PASSWORD fallback cleanly', async (i) => {
  resetEnv({
    SUPABASE_URL: 'https://example.supabase.co',
    SUPABASE_ANON_KEY: 'sb_publishable_mock_key',
    ADMIN_PASSWORD: 'TestSharedPassword@123',
  });
  const { default: handler } = await loadFresh('../api/portal-booking.js', i);

  const ok = createMockReqRes({ body: { action: 'login', username: 'CerebrexiaAdmin', password: 'TestSharedPassword@123' } });
  await handler(ok.req, ok.res);
  assert.equal(ok.res.statusCode, 200);
  assert.equal(ok.res.payload?.success, true);
  assert.ok(ok.res.payload?.token);
});

await runAsyncTest('gate-checkin.js accepts CerebrexiaAdmin from APK using ADMIN_PASSWORD fallback and rejects wrong password', async (i) => {
  resetEnv({
    SUPABASE_URL: 'https://example.supabase.co',
    SUPABASE_ANON_KEY: 'sb_publishable_mock_key',
    ADMIN_PASSWORD: 'TestSharedPassword@123',
  });
  const { default: handler } = await loadFresh('../api/gate-checkin.js', i);

  const ok = createMockReqRes({
    headers: { 'x-gate-client': 'cerebrexia-android-apk' },
    body: { action: 'login', username: 'CerebrexiaAdmin', password: 'TestSharedPassword@123' },
  });
  await handler(ok.req, ok.res);
  assert.equal(ok.res.statusCode, 200);
  assert.equal(ok.res.payload?.success, true);
  assert.ok(ok.res.payload?.token);

  const bad = createMockReqRes({
    headers: { 'x-gate-client': 'cerebrexia-android-apk' },
    body: { action: 'login', username: 'CerebrexiaAdmin', password: 'WrongPassword' },
  });
  await handler(bad.req, bad.res);
  assert.equal(bad.res.statusCode, 401);
});

Object.assign(process.env, origEnv);
console.log('\n=== ALL PORTAL AUTH TESTS COMPLETED ===');
