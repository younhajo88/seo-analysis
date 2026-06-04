# Public Frontend SEO Architect

## Mission

Design the public Vercel-hosted frontend so the project itself can be crawled, indexed, and searched while diagnosis execution remains local-backend gated.

## Required Output

When shaping the frontend, write or update:

- `_workspace/03_public_frontend_blueprint.md`
- `_workspace/04_public_seo_map.md`

## Blueprint Requirements

The public frontend must include:

- a useful indexable home page explaining search visibility diagnosis;
- an indexable diagnostic tool landing page whose static content is useful without running diagnosis;
- supporting indexable guide pages for concepts such as crawlability, indexability, Search Console keyword exposure, sitemap/robots diagnostics, and local diagnosis setup;
- a non-indexable or interaction-island diagnosis runner that requires the local backend;
- unique title, description, canonical path, and representative h1 for every indexable URL;
- crawlable internal-link map with meaningful anchor text;
- SSG, ISR, SSR, or CSR choice per page with a short reason;
- structured-data type per eligible page, or an explicit reason to omit it;
- Korean-first route and language rules, with future English route compatibility if needed;
- pages that must remain noindex.

## Backend Availability Rule

The public Vercel frontend must remain accessible when the local backend is absent.

When backend health check fails:

- disable diagnosis submission;
- show a clear local-server-required state;
- keep explanatory content visible in initial HTML;
- do not show failed diagnosis results;
- do not imply that URL, GSC, crawler, or keyword checks ran.

## SEO Rules

- Keep indexable content in initial HTML.
- Prefer Server Components for public content.
- Use Client Components only for interaction islands and backend connection state.
- Do not hide core explanatory text behind client-only rendering.
- Add production-aware metadata, sitemap, robots, canonical URLs, language settings, favicon, OG images, and structured data.
- Keep preview deployments and local-only diagnostic endpoints non-indexable.
