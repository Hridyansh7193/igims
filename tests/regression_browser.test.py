import http.server, threading, time, json, os, sys
from playwright.sync_api import sync_playwright

PORT = 4174
DIRECTORY = os.path.abspath("dist")

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    def log_message(self, format, *args):
        pass # Suppress server logging

server = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
server_thread = threading.Thread(target=server.serve_forever, daemon=True)
server_thread.start()

BASE_URL = f"http://127.0.0.1:{PORT}"
print(f"=== SERVING dist/ AT {BASE_URL} ===", flush=True)

def test_page(p, path, viewport, is_mobile=False):
    errors = []
    reqs = []
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context(viewport=viewport, is_mobile=is_mobile, has_touch=is_mobile)
    page = ctx.new_page()

    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: errors.append(f"console.{m.type}: {m.text}") if m.type == "error" else None)
    page.on("response", lambda r: reqs.append({"url": r.url, "status": r.status, "type": r.request.resource_type}))

    page.goto(BASE_URL + path, wait_until="domcontentloaded", timeout=15000)
    page.wait_for_timeout(3000)

    # Scroll down to test lazy loading
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    page.wait_for_timeout(1500)

    state = page.evaluate("""() => ({
        title: document.title,
        videos: Array.from(document.querySelectorAll('video')).map(v => ({
            src: v.getAttribute('src'),
            currentSrc: v.currentSrc,
            poster: v.getAttribute('poster'),
        })),
        imgCount: document.querySelectorAll('img').length,
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
    })""")

    browser.close()

    mp4s = [r for r in reqs if ".mp4" in r["url"]]
    http_errors = [r for r in reqs if r["status"] >= 400 and "favicon" not in r["url"]]

    return {
        "path": path,
        "viewport": viewport,
        "is_mobile": is_mobile,
        "mp4_requests_count": len(mp4s),
        "total_requests": len(reqs),
        "http_errors": http_errors,
        "console_errors": errors,
        "has_overflow": state.get("hasHorizontalOverflow", False),
        "state": state,
    }

results = {}
try:
    with sync_playwright() as p:
        routes_to_test = [
            ("desktop_home", "/", {"width": 1365, "height": 768}, False),
            ("mobile_home", "/", {"width": 390, "height": 844}, True),
            ("desktop_events", "/#events", {"width": 1365, "height": 768}, False),
            ("mobile_events", "/#events", {"width": 390, "height": 844}, True),
            ("desktop_pronites", "/#pronites", {"width": 1365, "height": 768}, False),
            ("desktop_about", "/#about", {"width": 1365, "height": 768}, False),
            ("desktop_contact", "/#contact", {"width": 1365, "height": 768}, False),
            ("desktop_accommodation", "/#accommodation", {"width": 1365, "height": 768}, False),
            ("desktop_terms", "/#terms", {"width": 1365, "height": 768}, False),
            ("desktop_privacy", "/#privacy", {"width": 1365, "height": 768}, False),
            ("desktop_refund", "/#refund", {"width": 1365, "height": 768}, False),
            ("desktop_admin", "/#admin", {"width": 1365, "height": 768}, False),
            ("desktop_portal", "/#booking-portal", {"width": 1365, "height": 768}, False),
            ("desktop_dashboard", "/#dashboard", {"width": 1365, "height": 768}, False),
        ]

        for name, path, vp, is_mob in routes_to_test:
            print(f"Testing {name} ({path})...", flush=True)
            results[name] = test_page(p, path, vp, is_mob)
finally:
    server.shutdown()

print("\n=== BROWSER REGRESSION TEST SUMMARY ===", flush=True)
all_passed = True
for name, res in results.items():
    mp4_count = res["mp4_requests_count"]
    http_err_count = len(res["http_errors"])
    console_err_count = len(res["console_errors"])

    # Before authentication, MP4 request count MUST be 0
    passed = (mp4_count == 0) and (http_err_count == 0) and (console_err_count == 0)
    status = "✅ PASS" if passed else "❌ FAIL"
    if not passed:
        all_passed = False
    print(f"{status} [{name}]: MP4s={mp4_count}, HTTP_Errors={http_err_count}, Console_Errors={console_err_count}, Title='{res['state']['title']}'", flush=True)

if not all_passed:
    print(json.dumps(results, indent=2))
    sys.exit(1)
else:
    print("\nAll browser regression checks passed perfectly!", flush=True)
