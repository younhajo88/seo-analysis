---
name: vercel-seo-frontend
description: Use when designing, implementing, or reviewing the public Vercel-hosted frontend for this search visibility diagnosis project, including Next.js App Router SEO, indexable content, sitemap, robots, canonical URLs, structured data, and the disabled diagnosis state when the local backend is not running.
---

# Vercel SEO Frontend

Read:

- `.codex/roles/public-frontend-seo-architect.md`
- `.codex/roles/nextjs-seo-builder.md`
- `docs/search-visibility-diagnosis.md`
- `_workspace/01_diagnosis_scope.md` when present

## Preconditions

- If public frontend scope is absent, write `_workspace/03_public_frontend_blueprint.md` and `_workspace/04_public_seo_map.md` before implementation.
- If the user asks to implement diagnosis without a local backend, keep diagnosis disabled and explain that crawler/GSC execution requires the local backend.

## Public Frontend Checklist

- Define indexable public URLs and private/noindex URLs.
- Keep useful public content in initial HTML.
- Add root metadataBase, title template, description, robots, and Korean language setting when Korean-first.
- Add unique page-level title, description, canonical path, and one representative h1.
- Add crawlable Link-based internal navigation with descriptive anchor text.
- Add production-aware `sitemap.ts` and `robots.ts`.
- Add structured data only when it matches visible content.
- Add favicon, OG image, meaningful alt text, and explicit image dimensions.
- Return proper 404 for missing public content.
- Keep preview deployments and local-only diagnosis routes non-indexable.

## Local Backend Gating

The diagnosis UI must:

- run a backend health check against the configured local backend;
- disable diagnosis submission when health check fails;
- show a local-server-required state;
- keep static explanatory content visible and indexable;
- never show fabricated diagnosis results;
- avoid claiming GSC, URL Inspection, PageSpeed, or crawler checks ran unless they actually returned data.

## Quality Rules

- Do not keyword-stuff.
- Do not hide keywords.
- Do not mass-generate thin guide pages.
- Do not make the tool page empty without the local backend.
- Do not treat SSR as an automatic ranking improvement.
