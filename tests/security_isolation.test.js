import assert from 'node:assert/strict';
import {
  isPreviewDeployment,
  isProductionDeployment,
  isProductionSupabaseUrl,
  assertSafeDatabaseMutation,
  isEmailEnabled,
  isSheetsSyncEnabled,
  isPaymentsEnabled,
  getCleanRazorpayKeys,
  getCleanSupabaseKey,
  signToken,
  verifyToken,
} from '../api/_security.js';

console.log('=== RUNNING SECURITY & ENVIRONMENT ISOLATION TESTS ===\n');

// Backup original env
const origEnv = { ...process.env };

function runTest(name, fn) {
  try {
    // Reset env
    for (const k of Object.keys(process.env)) {
      if (!(k in origEnv)) delete process.env[k];
    }
    Object.assign(process.env, origEnv);

    fn();
    console.log(`  ✅ PASS: ${name}`);
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

// 1. Supabase key cleaner
runTest('getCleanSupabaseKey returns null when key is missing or placeholder', () => {
  assert.equal(getCleanSupabaseKey(undefined), null);
  assert.equal(getCleanSupabaseKey(''), null);
  assert.equal(getCleanSupabaseKey('your_placeholder_key'), null);
  assert.equal(getCleanSupabaseKey('sb_publishable_valid_test_key_123'), 'sb_publishable_valid_test_key_123');
});

// 2. Token signing fails closed when secret is missing
runTest('signToken fails closed when ADMIN_PASSWORD/JWT_SECRET is unset', () => {
  delete process.env.ADMIN_JWT_SECRET;
  delete process.env.ADMIN_PASSWORD;
  assert.throws(() => signToken({ test: 1 }), /Authentication signing failed/);
});

// 3. Token signing works when secret is explicitly set
runTest('signToken and verifyToken work when secret is explicitly configured', () => {
  process.env.ADMIN_JWT_SECRET = 'my_super_secret_test_key_2026';
  const token = signToken({ role: 'ADMIN' });
  const verified = verifyToken(token);
  assert.equal(verified?.role, 'ADMIN');

  // Verify wrong secret fails
  const failed = verifyToken(token, 'wrong_secret_12345678');
  assert.equal(failed, null);
});

// 4. Razorpay key validation in Preview: Live key must be blocked!
runTest('getCleanRazorpayKeys rejects live keys on Preview deployments', () => {
  process.env.VERCEL_ENV = 'preview';
  process.env.RAZORPAY_KEY_ID = 'rzp_live_SyntheticTestKey123';
  process.env.RAZORPAY_KEY_SECRET = 'synthetic_live_secret_456';

  const res = getCleanRazorpayKeys();
  assert.equal(res.keyId, null);
  assert.equal(res.keySecret, null);
  assert.match(res.error, /Security Isolation Violation: Preview deployment accepts only Razorpay test keys/);
});

// 5. Razorpay key validation in Preview: Test key accepted
runTest('getCleanRazorpayKeys accepts test keys on Preview deployments', () => {
  process.env.VERCEL_ENV = 'preview';
  process.env.RAZORPAY_KEY_ID = 'rzp_test_StagingKey123';
  process.env.RAZORPAY_KEY_SECRET = 'staging_secret_123456';

  const res = getCleanRazorpayKeys();
  assert.equal(res.error, null);
  assert.equal(res.keyId, 'rzp_test_StagingKey123');
  assert.equal(res.keySecret, 'staging_secret_123456');
});

// 6. Razorpay key validation in Production: Test key rejected
runTest('getCleanRazorpayKeys rejects test keys on Production deployments', () => {
  process.env.VERCEL_ENV = 'production';
  process.env.RAZORPAY_KEY_ID = 'rzp_test_StagingKey123';
  process.env.RAZORPAY_KEY_SECRET = 'staging_secret_123456';

  const res = getCleanRazorpayKeys();
  assert.equal(res.keyId, null);
  assert.match(res.error, /Configuration Error: Test Razorpay key.*detected in Production/);
});

// 7. Razorpay keys missing: returns error, no fallback to hardcoded keys
runTest('getCleanRazorpayKeys returns error when unconfigured (no hardcoded fallback)', () => {
  delete process.env.RAZORPAY_KEY_ID;
  delete process.env.VITE_RAZORPAY_KEY_ID;
  delete process.env.RAZORPAY_KEY_SECRET;

  const res = getCleanRazorpayKeys();
  assert.equal(res.keyId, null);
  assert.equal(res.keySecret, null);
  assert.match(res.error, /are not configured in environment/);
});

// 8. Database mutation safety: blocks prod database mutations on Preview
runTest('assertSafeDatabaseMutation blocks mutations on prod Supabase during Preview', () => {
  process.env.VERCEL_ENV = 'preview';
  const prodUrl = 'https://dgkubrwfrwcfpkgjoxmu.supabase.co';

  assert.throws(
    () => assertSafeDatabaseMutation(prodUrl),
    /Security Isolation Violation: Database mutation blocked on Preview deployment/
  );
});

// 9. Database mutation safety: allows staging database mutations on Preview
runTest('assertSafeDatabaseMutation allows staging database mutations on Preview', () => {
  process.env.VERCEL_ENV = 'preview';
  const stagingUrl = 'https://staging-project-xyz.supabase.co';

  assert.doesNotThrow(() => assertSafeDatabaseMutation(stagingUrl));
});

// 10. Database mutation safety: allows prod database mutations on Production
runTest('assertSafeDatabaseMutation allows mutations on Production', () => {
  process.env.VERCEL_ENV = 'production';
  const prodUrl = 'https://dgkubrwfrwcfpkgjoxmu.supabase.co';

  assert.doesNotThrow(() => assertSafeDatabaseMutation(prodUrl));
});

// 11. Email safety in Preview: disabled by default
runTest('isEmailEnabled defaults to false in Preview unless EMAIL_ENABLED=true', () => {
  process.env.VERCEL_ENV = 'preview';
  delete process.env.EMAIL_ENABLED;
  assert.equal(isEmailEnabled(), false);

  process.env.EMAIL_ENABLED = 'false';
  assert.equal(isEmailEnabled(), false);

  process.env.EMAIL_ENABLED = 'true';
  assert.equal(isEmailEnabled(), true);
});

// 12. Email in Production: enabled by default
runTest('isEmailEnabled defaults to true in Production unless EMAIL_ENABLED=false', () => {
  process.env.VERCEL_ENV = 'production';
  delete process.env.EMAIL_ENABLED;
  assert.equal(isEmailEnabled(), true);

  process.env.EMAIL_ENABLED = 'false';
  assert.equal(isEmailEnabled(), false);
});

// 13. Sheets sync safety in Preview: disabled by default
runTest('isSheetsSyncEnabled defaults to false in Preview unless GOOGLE_SHEETS_SYNC_ENABLED=true', () => {
  process.env.VERCEL_ENV = 'preview';
  delete process.env.GOOGLE_SHEETS_SYNC_ENABLED;
  assert.equal(isSheetsSyncEnabled(), false);

  process.env.GOOGLE_SHEETS_SYNC_ENABLED = 'true';
  assert.equal(isSheetsSyncEnabled(), true);
});

// 14. Payment safety in Preview: disabled by default
runTest('isPaymentsEnabled defaults to false in Preview unless PAYMENTS_ENABLED=true', () => {
  process.env.VERCEL_ENV = 'preview';
  delete process.env.PAYMENTS_ENABLED;
  assert.equal(isPaymentsEnabled(), false);

  process.env.PAYMENTS_ENABLED = 'false';
  assert.equal(isPaymentsEnabled(), false);

  process.env.PAYMENTS_ENABLED = 'true';
  assert.equal(isPaymentsEnabled(), true);
});

// 15. Payment in Production: enabled by default
runTest('isPaymentsEnabled defaults to true in Production unless PAYMENTS_ENABLED=false', () => {
  process.env.VERCEL_ENV = 'production';
  delete process.env.PAYMENTS_ENABLED;
  assert.equal(isPaymentsEnabled(), true);

  process.env.PAYMENTS_ENABLED = 'false';
  assert.equal(isPaymentsEnabled(), false);
});

// 16. Razorpay key validation in Preview: Non-test key rejected
runTest('getCleanRazorpayKeys rejects arbitrary non-test keys in Preview', () => {
  process.env.VERCEL_ENV = 'preview';
  process.env.RAZORPAY_KEY_ID = 'custom_key_123';
  process.env.RAZORPAY_KEY_SECRET = 'test_secret_123456';

  const res = getCleanRazorpayKeys();
  assert.equal(res.keyId, null);
  assert.match(res.error, /Security Isolation Violation: Preview deployment accepts only Razorpay test keys/);
});

// Reset env at end
Object.assign(process.env, origEnv);
console.log('\n=== ALL SECURITY & ISOLATION TESTS COMPLETED ===');
