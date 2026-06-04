---
name: local-seo-diagnostics
description: Use when designing, implementing, or reviewing local backend SEO checks for URL fetches, redirects, robots.txt, sitemap parsing, HTML metadata, canonical URLs, internal links, structured data, and crawlability.
---

# Local SEO Diagnostics

Read:

- `.codex/roles/local-crawler-engineer.md`
- `docs/search-visibility-diagnosis.md`

## Preconditions

- If the project scope is unclear, run `.codex/skills/search-visibility-harness/SKILL.md` in product scope mode first.
- If the user asks for browser-only implementation, warn that many URL automatic checks become unavailable because of CORS.

## Check Groups

Implement or review local backend checks for:

- URL status, final URL, redirect chain, HTTPS, and headers
- `robots.txt` discovery and Googlebot allow/disallow evaluation
- sitemap discovery, parsing, status checks, and freshness checks
- HTML title, description, canonical, robots meta, h1, hreflang, structured data, favicon, OG, Twitter Card, images, links, and visible-text candidates
- internal crawl with same-site limits, depth limits, URL normalization, and timeout controls
- sitemap-vs-crawl comparison for orphan candidates

## Report Contract

Each local finding must contain:

- `checkId`
- `source: "local-crawler"`
- `status`
- `severity`
- `url`
- `evidence`
- `recommendation`
- `confidence`

## Guardrails

- Do not present heuristic checks as absolute truth.
- Do not crawl without explicit max URL, depth, timeout, and same-site boundaries.
- Do not use paid SEO data inside local checks.
- Do not claim Google index status from local crawler data.
