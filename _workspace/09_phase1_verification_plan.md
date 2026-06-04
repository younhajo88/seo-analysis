# Phase 1 Verification Plan

## Scope

Verify Phase 1 local backend implementation:

```text
GET /health
POST /diagnose/url
reach.*
frontend diagnosis form connection
SQLite persistence
```

## Required Commands

Run:

```text
npm test
npm run lint
npm run build
npm run server:test
```

Start backend:

```text
npm run server:dev
```

Smoke check:

```text
curl http://localhost:4317/health
```

## Unit Test Requirements

### URL Safety

Must test:

- rejects non-http protocols;
- rejects localhost;
- rejects loopback IPv4;
- rejects loopback IPv6;
- rejects RFC1918 private IPv4;
- rejects link-local IPv4;
- rejects private/link-local IPv6;
- rejects DNS names resolving to private IPs;
- allows ordinary public HTTPS URL;
- revalidates redirect destinations.

### Fetch URL

Must test:

- captures final status code;
- captures final URL;
- captures redirect chain;
- detects redirect loop;
- stops at max redirects;
- respects timeout;
- limits response bytes.

### Reach Checks

Must test:

- `reach.http_status` PASS for 200;
- `reach.http_status` FAIL for 404/500;
- `reach.redirect_chain` PASS/WARN/FAIL thresholds;
- `reach.redirect_loop` FAIL;
- `reach.final_url_expected` PASS/WARN;
- `reach.https_available` PASS/FAIL;
- `reach.http_to_https` PASS/WARN/MANUAL.

### Persistence

Must test:

- migration creates expected tables;
- a successful run creates one run row;
- findings are linked to the run id;
- evidence JSON can be read back;
- temp test DB does not write to `.data/seo-analysis.sqlite`.

### API Routes

Must test:

- `GET /health` returns `ok: true`;
- `POST /diagnose/url` rejects invalid URL with 400;
- `POST /diagnose/url` rejects unsafe target with 403;
- `POST /diagnose/url` returns `run`, `fetch`, and `findings` for safe target;
- CORS rejects disallowed origins;
- CORS allows configured origins.

## Integration Smoke Scenarios

Use at least these targets:

```text
https://seo-analysis-two.vercel.app/
https://seo-analysis-two.vercel.app/diagnose
http://example.com/
https://example.com/
```

Expected:

- production site returns 200;
- `/diagnose` returns 200;
- `http://example.com/` should show redirect or final HTTP behavior depending on live response;
- `https://example.com/` should be safe and fetchable.

Do not rely on external sites for unit tests. Use local mock servers for deterministic tests.

## Frontend Verification

With backend stopped:

- `/diagnose` shows disconnected state;
- diagnosis submit remains disabled;
- static SEO content remains visible in initial HTML.

With backend running:

- `/diagnose` shows connected state;
- URL input is usable;
- diagnosis submit is enabled;
- submitting `https://seo-analysis-two.vercel.app/` renders summary;
- findings are visible;
- redirect detail area is visible even when there are zero redirects.

## Browser Verification

Use Playwright or Codex browser to capture:

```text
_workspace/screenshots/phase1-diagnose-disconnected.png
_workspace/screenshots/phase1-diagnose-connected.png
_workspace/screenshots/phase1-diagnose-result.png
```

## Verification Result

Completed on 2026-06-04.

Commands:

```text
npm test
npm run server:test
npm run lint
npm run build
```

Smoke checks:

```text
GET http://localhost:4317/health
POST http://localhost:4317/diagnose/url
```

Browser screenshots:

```text
_workspace/screenshots/phase1-diagnose-disconnected.png
_workspace/screenshots/phase1-diagnose-connected.png
_workspace/screenshots/phase1-diagnose-result.png
```

Known note:

```text
npm install reports 3 moderate vulnerabilities. They were not force-fixed because npm audit fix --force can introduce breaking dependency updates.
```

## Completion Checklist

- [x] Server starts on port `4317`.
- [x] Health endpoint returns expected payload.
- [x] Unsafe URLs are blocked.
- [x] Safe URLs produce reachability findings.
- [x] Runs and findings persist in SQLite.
- [x] Frontend connected state works.
- [x] Frontend disconnected state still works.
- [x] Tests pass.
- [x] Lint passes.
- [x] Build passes.
- [x] Verification screenshots are saved.
- [x] Findings and remaining risks are recorded in this file or a follow-up report.
