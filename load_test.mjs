/**
 * Supabase Auth Load Test - 500 logins
 * Run: node load_test.mjs
 */

const SUPABASE_URL   = 'https://iylwlivvijddkrxvcyyi.supabase.co';
const ANON_KEY       = 'sb_publishable_2I3dmITx0DuYGb-JhXLQqA_CVQBL3DZ';
const TOTAL_REQUESTS = 500;
const CONCURRENCY    = 10;
const TEST_EMAIL     = 'loadtest@example.com';
const TEST_PASSWORD  = 'wrong_password_load_test_xyz';
const AUTH_URL       = SUPABASE_URL + '/auth/v1/token?grant_type=password';

const results  = [];
let   done     = 0;
let   startTime;

async function loginOnce(id) {
  const t0 = performance.now();
  let status = 0, error = null;
  try {
    const res = await fetch(AUTH_URL, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': ANON_KEY, 'Authorization': 'Bearer ' + ANON_KEY },
      body   : JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
    });
    status = res.status;
  } catch (err) { error = err.message; }
  const durationMs = performance.now() - t0;
  results.push({ id, status, durationMs, timestamp: Date.now(), error });
  done++;
  if (done % 50 === 0 || done === TOTAL_REQUESTS) {
    const pct = Math.round((done / TOTAL_REQUESTS) * 100);
    const bar = '#'.repeat(Math.round(pct / 5)).padEnd(20, '.');
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    process.stdout.write('\r  [' + bar + '] ' + pct + '%  ' + done + '/' + TOTAL_REQUESTS + '  (' + elapsed + 's)');
  }
}

async function runBatch(ids) {
  await Promise.all(ids.map(loginOnce));
}

startTime = Date.now();
console.log('\n=================================================');
console.log('  SUPABASE AUTH LOAD TEST');
console.log('  Target  : ' + AUTH_URL);
console.log('  Requests: ' + TOTAL_REQUESTS + '   Concurrency: ' + CONCURRENCY);
console.log('=================================================\n');

const allIds = Array.from({ length: TOTAL_REQUESTS }, (_, i) => i + 1);
for (let i = 0; i < allIds.length; i += CONCURRENCY) {
  await runBatch(allIds.slice(i, i + CONCURRENCY));
}

const endTime   = Date.now();
const totalSecs = (endTime - startTime) / 1000;

console.log('\n\n=================================================');
console.log('  RESULTS');
console.log('=================================================\n');

const statusCount = {};
for (const r of results) { statusCount[r.status] = (statusCount[r.status] || 0) + 1; }

console.log('HTTP Status Breakdown:');
const labels = { 0:'NETWORK ERROR', 200:'OK (logged in)', 400:'Bad Request (invalid creds - expected)', 401:'Unauthorized', 403:'Forbidden', 422:'Unprocessable (email not confirmed)', 429:'RATE LIMITED', 500:'Internal Server Error', 502:'Bad Gateway', 503:'Service Unavailable' };
for (const [code, count] of Object.entries(statusCount).sort()) {
  const pct = ((count / TOTAL_REQUESTS) * 100).toFixed(1);
  const lbl = labels[Number(code)] || ('HTTP ' + code);
  console.log('   ' + code + ' ' + lbl.padEnd(40) + String(count).padStart(4) + ' (' + pct + '%)');
}

const durations = results.map(r => r.durationMs).sort((a, b) => a - b);
function pct(arr, p) { return arr[Math.max(0, Math.ceil((p / 100) * arr.length) - 1)]; }
const avg = durations.reduce((a,b) => a+b, 0) / durations.length;
console.log('\nLatency (ms):');
console.log('   min  ' + durations[0].toFixed(0));
console.log('   avg  ' + avg.toFixed(0));
console.log('   p50  ' + pct(durations,50).toFixed(0));
console.log('   p90  ' + pct(durations,90).toFixed(0));
console.log('   p95  ' + pct(durations,95).toFixed(0));
console.log('   p99  ' + pct(durations,99).toFixed(0));
console.log('   max  ' + durations[durations.length-1].toFixed(0));

const rps = (TOTAL_REQUESTS / totalSecs).toFixed(2);
console.log('\nThroughput:');
console.log('   Total time : ' + totalSecs.toFixed(2) + 's');
console.log('   RPS        : ' + rps + ' req/sec');

const rateLimited = results.filter(r => r.status === 429);
const netErrors   = results.filter(r => r.status === 0);
const authFail    = results.filter(r => r.status === 400 || r.status === 401 || r.status === 422);
const successReq  = results.filter(r => r.status === 200);
const slow        = results.filter(r => r.durationMs > 3000);

console.log('\nKey Signals:');
console.log('   Successful logins              : ' + successReq.length);
console.log('   Auth failures (bad creds - expected) : ' + authFail.length);
console.log('   Rate limited (429)             : ' + rateLimited.length);
console.log('   Network errors                 : ' + netErrors.length);
console.log('   Slow requests (>3s)            : ' + slow.length);

console.log('\nDiagnosis:');
if (rateLimited.length === 0) {
  console.log('   No rate-limiting hit. GoTrue handled the load fine.');
} else {
  const firstAt = ((rateLimited[0].timestamp - startTime) / 1000).toFixed(1);
  console.log('   RATE LIMITED: ' + rateLimited.length + ' requests got 429.');
  console.log('   First 429 at t+' + firstAt + 's into the test.');
  console.log('   Supabase free tier limits ~30 auth req/min per IP on GoTrue.');
  console.log('   Consider upgrading to Pro for higher auth rate limits.');
}
if (netErrors.length > 0) console.log('   ' + netErrors.length + ' network errors - check connectivity/DNS.');
if (pct(durations,99) > 3000) {
  console.log('   p99 latency is ' + pct(durations,99).toFixed(0) + 'ms (>3s) - DB may be under pressure.');
} else if (pct(durations,90) > 1500) {
  console.log('   p90 latency is ' + pct(durations,90).toFixed(0) + 'ms - auth is slowing under load.');
} else {
  console.log('   Latency looks healthy (p99 = ' + pct(durations,99).toFixed(0) + 'ms).');
}
if (slow.length > 0) {
  console.log('\nSlowest requests (>3s):');
  slow.slice(0, 5).forEach(r => {
    const t = ((r.timestamp - startTime) / 1000).toFixed(1);
    console.log('   req #' + r.id + ' at t+' + t + 's -> ' + r.durationMs.toFixed(0) + 'ms [HTTP ' + r.status + ']');
  });
}
console.log('\n=================================================\n');
