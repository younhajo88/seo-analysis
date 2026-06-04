# Local Backend Implementation Plan

## Purpose

Implement the local diagnosis backend for Phase 1 of the check matrix.

The backend runs on the user's PC and performs URL reachability checks that the Vercel-hosted frontend cannot safely or reliably perform from the browser.

## Confirmed Decisions

| Area | Decision |
| --- | --- |
| Runtime | Node.js |
| Server framework | Fastify |
| Server location | `server/` |
| Execution | Separate process via `npm run server:dev` |
| Default port | `4317` |
| Database | SQLite |
| SQLite library | `better-sqlite3` |
| Query style | Raw SQL |
| Default DB file | `.data/seo-analysis.sqlite` |
| Migrations | SQL files under `server/db/migrations/` |
| Frontend connection | Existing `/diagnose` page calls the local backend from the browser |

## Phase Plan

### Phase 1: Reachability

Implement first:

```text
GET /health
POST /diagnose/url
```

Checks:

```text
reach.http_status
reach.redirect_chain
reach.redirect_loop
reach.final_url_expected
reach.https_available
reach.http_to_https
```

Phase 1 must include frontend connection:

- `/diagnose` health check detects local backend.
- URL input appears in the diagnosis panel.
- Diagnosis button is enabled only when backend is connected.
- Form submits to `POST /diagnose/url`.
- UI renders run summary, redirect detail, and findings.
- If backend is disconnected, current disabled state remains.

### Phase 2: Crawl Policy

Next checks:

```text
crawl.robots_exists
crawl.robots_googlebot_allowed
crawl.robots_sitemap_declared
```

### Phase 3: Indexability HTML/Header

Next checks:

```text
index.meta_noindex
index.meta_nofollow
index.x_robots_noindex
index.canonical_exists
index.canonical_accessible
index.canonical_expected
render.initial_content_present
```

### Phase 4: Sitemap Discovery

Next checks:

```text
sitemap.exists
sitemap.fetchable
sitemap.index_supported
sitemap.urls_status
sitemap.urls_redirect
sitemap.lastmod_present
sitemap.canonical_consistency
```

### Phase 5: Page Basics

Next checks:

```text
page.title_exists
page.title_length
page.description_exists
page.description_length
page.h1_exists
page.h1_count
page.image_alt
page.structured_data_exists
page.schema_valid_jsonld
```

### Phase 6: Site Structure

Next checks:

```text
structure.internal_links
structure.broken_internal_links
structure.click_depth
structure.orphan_candidates
```

### Phase 7: Free API Performance

Next checks:

```text
perf.pagespeed_available
perf.lcp
perf.inp
perf.cls
perf.lighthouse_seo
perf.lighthouse_accessibility
```

### Phase 8: Google Search Console

Next checks:

```text
gsc.property_connected
gsc.url_index_status
gsc.google_canonical
gsc.crawl_verdict
gsc.indexing_verdict
exposure.*
```

### Phase 9: Unavailable, Paid, Human

Represent explicitly as unavailable/manual findings:

```text
serp.*
authority.*
page.intent_match
page.information_completeness
```

## Server Directory Structure

Create:

```text
server/
├─ index.ts
├─ app.ts
├─ config.ts
├─ db/
│  ├─ connection.ts
│  ├─ migrate.ts
│  └─ migrations/
│     └─ 001_initial.sql
├─ routes/
│  ├─ health.ts
│  └─ diagnose-url.ts
├─ services/
│  ├─ url-safety.ts
│  ├─ fetch-url.ts
│  └─ diagnosis-store.ts
├─ checks/
│  └─ reach.ts
└─ types.ts
```

## Package Scripts

Add:

```json
{
  "server:dev": "tsx server/index.ts",
  "server:test": "vitest run tests/server/**/*.test.ts"
}
```

The frontend and backend remain separate:

```text
npm run dev
npm run server:dev
```

Do not add a combined `dev:all` script for now.

## Dependencies

Add runtime dependencies:

```text
@fastify/cors
better-sqlite3
fastify
```

Add dev dependencies:

```text
@types/better-sqlite3
tsx
```

## CORS Policy

Allow only configured origins.

Default allowed origins:

```text
https://seo-analysis-two.vercel.app
http://localhost:3000
http://127.0.0.1:3000
```

Additional origins:

```text
SEO_ANALYSIS_ALLOWED_ORIGINS
```

Rules:

- Do not allow `*`.
- Reject browser origins that are not explicitly allowed.
- Keep CORS logic centralized in `server/config.ts` or `server/app.ts`.

## URL Fetch Safety Policy

Allow:

```text
http:
https:
```

Block:

```text
file:
ftp:
localhost
127.0.0.0/8
::1
10.0.0.0/8
172.16.0.0/12
192.168.0.0/16
169.254.0.0/16
IPv6 private and link-local ranges
```

Safety requirements:

- Parse and validate the user-provided URL before fetching.
- Resolve DNS before fetch.
- Reject private, loopback, link-local, multicast, unspecified, and reserved IPs.
- Re-run safety checks for every redirect destination.
- Do not implement an override flag in Phase 1.

## Fetch Limits

Use:

```text
timeoutMs: 10000
maxRedirects: 10
maxResponseBytes: 2097152
userAgent: SEOAnalysisBot/0.1 (+https://seo-analysis-two.vercel.app)
```

Behavior:

- Follow redirects manually so each destination can be safety-checked.
- Preserve redirect chain evidence.
- Stop with a FAIL finding if redirect limit is exceeded.
- Stop with a FAIL finding if a redirect loops.
- Read at most `maxResponseBytes`.
- Phase 1 does not need full HTML parsing, but limited body capture is acceptable for future phases.

## SQLite Phase 1 Schema

Create:

```text
diagnosis_runs
diagnosis_findings
```

`diagnosis_runs`:

```text
id
target_url
final_url
started_at
completed_at
overall_status
summary_pass
summary_warn
summary_fail
summary_manual
summary_unavailable
fetch_json
created_at
```

`diagnosis_findings`:

```text
id
run_id
check_id
category
source
status
severity
target
evidence_json
recommendation
limitation
created_at
```

Future tables:

```text
crawl_pages
sitemap_urls
gsc_properties
gsc_query_metrics
gsc_page_metrics
url_inspection_results
```

## Phase 1 Implementation Order

1. Add dependencies and scripts.
2. Add server type definitions.
3. Add config and CORS allowlist.
4. Add SQLite connection and migration runner.
5. Add initial migration for runs and findings.
6. Add `GET /health`.
7. Add URL safety service with tests.
8. Add redirect-aware fetch service with tests.
9. Add reach findings generator with tests.
10. Add persistence service with temp DB tests.
11. Add `POST /diagnose/url`.
12. Connect `/diagnose` frontend form and result UI.
13. Run unit tests, lint, frontend build, server smoke checks.
14. Record results in `_workspace/09_phase1_verification_plan.md` or a follow-up verification report.

## Completion Criteria

Phase 1 is complete when:

- `npm run server:dev` starts Fastify on port `4317`.
- `GET /health` returns version and ok status.
- Vercel or local frontend detects backend as connected.
- `POST /diagnose/url` rejects unsafe URLs.
- `POST /diagnose/url` follows safe redirects and returns `run`, `fetch`, and `findings`.
- SQLite stores the run and findings.
- `/diagnose` renders URL input, summary, redirect detail, and findings.
- Tests, lint, and build pass.
