# AGENTS.md

## Project Identity

This project is a public SEO-friendly frontend plus local-first search visibility diagnosis tool.

Its primary purpose is to help a site owner or developer diagnose:

- whether their own site can be discovered, crawled, indexed, and exposed in Google Search;
- which pages and keywords already receive Google Search impressions;
- what must be fixed before ranking optimization matters.

The public frontend should be deployable to Vercel and should itself be crawlable, indexable, and useful in Google Search. The diagnosis engine should require a running local backend. If the local backend is not running, the public frontend must remain available and SEO-friendly, but diagnosis execution must be disabled with a clear connection-state message.

Do not treat this as a generic SEO score checker. Search visibility comes first. Ranking improvement comes second.

## Required Context

Before planning or implementing substantial work, read:

- `docs/search-visibility-diagnosis.md`
- `docs/search-visibility-diagnosis.ko.md`
- `.codex/HARNESS.md`

Use the `.codex` harness resources when relevant:

- `.codex/roles/`
- `.codex/skills/`

## Core Product Rules

- URL-only crawling can find technical blockers, but it cannot prove actual Google keyword exposure.
- Actual query, page, impression, click, CTR, and average-position data requires Google Search Console data from a user-authorized property.
- Search Console integration must only inspect properties the connected user can access.
- One-time local inspection should prefer short-lived access tokens. Do not store refresh tokens unless the user explicitly asks for scheduled checks or background monitoring.
- Local crawler checks should run through the local backend, not browser-only code, because browser-only crawling is limited by CORS.
- The Vercel-hosted public frontend must not attempt local crawler diagnosis by itself. It should detect local backend availability and disable diagnosis when the backend is absent.
- Public indexable pages must render useful content in initial HTML. Use Client Components only for interaction islands or non-indexable diagnostic UI.
- Public indexable pages must have production-aware metadata, canonical URLs, sitemap, robots, language settings, structured data where appropriate, favicon, OG images, and crawlable internal links.
- Paid-data areas such as backlinks, domain authority, SERP rank tracking, local citation data, and competitor SERP comparison must be labeled as payment required or unavailable unless a paid provider is explicitly configured.
- Separate observed facts from hypotheses.
- Separate crawl/index blockers from ranking-support recommendations.

## Diagnosis Priority

Present and implement diagnosis in this order:

1. Can the URL be reached?
2. Is crawling blocked?
3. Is indexing blocked?
4. Does Google actually index the URL?
5. Does the site receive search impressions?
6. Which pages and queries receive impressions?
7. Which pages are indexed but not exposed?
8. Which exposed pages are not receiving clicks?
9. Which technical, content, and structure issues should be reinforced?
10. Which ranking or authority checks require paid data or human judgment?

## Result Standards

Every diagnostic finding should include:

- check id;
- data source;
- target URL or Search Console property;
- status;
- severity;
- evidence;
- recommendation;
- limitation, if any.

Use these statuses where applicable:

- `PASS`
- `WARN`
- `FAIL`
- `MANUAL`
- `UNAVAILABLE`

Use these severities where applicable:

- `Critical`: can prevent crawling, indexing, or search exposure;
- `High`: strongly affects discoverability, index quality, or query matching;
- `Medium`: supports ranking, CTR, structure, or technical quality;
- `Low`: nice-to-have or secondary optimization;
- `Unavailable`: requires payment, authorization, or human judgment.

## Harness Skills

When the user asks for coordinated work on this project, prefer the local harness skill:

- `.codex/skills/search-visibility-harness/SKILL.md`

For narrower work:

- public Vercel SEO frontend: `.codex/skills/vercel-seo-frontend/SKILL.md`
- local crawler and technical checks: `.codex/skills/local-seo-diagnostics/SKILL.md`
- Google Search Console integration: `.codex/skills/gsc-visibility-diagnostics/SKILL.md`
- readiness review: `.codex/skills/diagnostic-release-review/SKILL.md`
- Search Console observation analysis: `.codex/skills/visibility-growth-analysis/SKILL.md`

## Implementation Guardrails

- Preserve user changes. Do not revert unrelated work.
- Prefer the repository's existing stack and patterns once implementation begins.
- Keep crawler limits explicit: max URLs, max depth, timeout, same-site boundaries, and URL normalization.
- Respect `robots.txt` by default. Allow diagnostic override only when the user owns the site and explicitly requests it.
- Never invent Search Console, PageSpeed, CrUX, backlink, SERP, or analytics data.
- Never claim readiness while a release-review `FAIL` remains.
