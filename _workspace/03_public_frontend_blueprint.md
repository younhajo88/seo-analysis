# Public Frontend Blueprint

## Goal

Build a Vercel-hosted public frontend that can itself be indexed and exposed in Google Search while acting as the entry point for a local-first search visibility diagnosis tool.

The public site must be useful even when the local backend is not running. Diagnosis execution is disabled unless the user's local backend health check succeeds.

## Primary Audience

- Developers preparing to publish a site
- Indie makers and site owners checking whether their domain appears in Google
- Teams that need to understand Search Console exposure before investing in ranking work

## Core Message

Before optimizing ranking, verify search visibility:

1. Can Google reach the site?
2. Is crawling or indexing blocked?
3. Is Google actually indexing the pages?
4. Which queries and pages receive impressions?
5. What should be fixed before content or authority work?

## Product Shape

The public frontend has two layers:

| Layer | Purpose | Backend Required |
| --- | --- | --- |
| Public indexable content | Explain search visibility diagnosis, setup, concepts, and safe workflow | No |
| Diagnosis runner | Run URL, crawler, GSC, PageSpeed, and report checks through the local backend | Yes |

When the backend is absent, the tool page should show:

- backend connection status: disconnected;
- disabled diagnosis form;
- setup command placeholder;
- explanation that crawler/GSC checks require a local diagnosis server;
- no fabricated result panels.

## Routing Plan

| Route | Indexable | Render Mode | Purpose |
| --- | --- | --- | --- |
| `/` | Yes | SSG | Home page explaining the product and search visibility workflow |
| `/diagnose` | Yes | SSG + client interaction island | Tool landing page with static explanation and backend-gated diagnosis form |
| `/guides/search-visibility` | Yes | SSG | Explain search exposure vs ranking optimization |
| `/guides/crawlability-indexability` | Yes | SSG | Explain crawl, robots, noindex, canonical, sitemap blockers |
| `/guides/google-search-console-keywords` | Yes | SSG | Explain why keyword exposure requires GSC and how to read query data |
| `/guides/robots-sitemap-checks` | Yes | SSG | Explain robots.txt and sitemap diagnosis |
| `/guides/local-diagnosis-setup` | Yes | SSG | Explain why local backend is required and how local diagnosis works |
| `/privacy` | Yes | SSG | Explain local-first token/data handling and privacy posture |
| `/terms` | Yes | SSG | Basic usage terms for the public site |
| `/diagnose/session` | No | CSR island or noindex page | Optional local-only diagnostic session UI if a separate route is needed |
| `/oauth/callback` | No | CSR/noindex | Optional OAuth callback helper route if browser OAuth flow needs it |

## Page Requirements

### `/`

Purpose:

- Establish that this is a search visibility diagnosis tool, not a generic SEO score checker.
- Explain the difference between visibility diagnosis and ranking optimization.
- Link to the diagnosis tool and core guides.

Initial HTML should include:

- clear h1;
- short explanation of crawlability, indexability, and Search Console exposure;
- static step-by-step workflow;
- links to `/diagnose` and guide pages.

Structured data:

- `WebSite`
- `SoftwareApplication` if the visible content describes the tool clearly

### `/diagnose`

Purpose:

- Serve as the public tool landing page.
- Explain what diagnosis can check.
- Host a client-side interaction island that checks local backend availability.

Initial HTML should include:

- what the tool diagnoses;
- why local backend is required;
- what data sources are used;
- what cannot be checked without GSC, paid APIs, or human judgment.

Client interaction island:

- health check configured local backend URL;
- disabled form when disconnected;
- enabled form when connected;
- no fake results;
- no browser-only crawler fallback.

Structured data:

- `SoftwareApplication`
- `FAQPage` only if visible FAQ content exists.

### Guide Pages

Each guide page should:

- focus on one search visibility concept;
- include practical diagnostic interpretation;
- link back to `/diagnose`;
- link to related guides with descriptive anchor text;
- avoid thin content and keyword stuffing.

Recommended structured data:

- `Article`
- `BreadcrumbList`
- `FAQPage` only when visible FAQ sections exist.

### `/privacy`

Purpose:

- Explain the local-first model.
- Explain that diagnosis requires a local backend.
- Explain that Search Console access should use short-lived access tokens by default.
- Explain that refresh tokens are not required unless the user explicitly enables scheduled/background checks.

Structured data:

- Omit unless there is a clear visible organization/site schema.

## Navigation

Primary navigation:

- Home: `/`
- Diagnose: `/diagnose`
- Guides: `/guides/search-visibility`
- Setup: `/guides/local-diagnosis-setup`
- Privacy: `/privacy`

Footer navigation:

- Search visibility guide
- Crawlability and indexability guide
- Search Console keyword guide
- Robots and sitemap guide
- Local setup guide
- Privacy
- Terms

## Backend Availability UX

Backend state should have explicit UI states:

| State | Meaning | UI Behavior |
| --- | --- | --- |
| `checking` | Health check is running | Show passive connection check |
| `connected` | Local backend responded successfully | Enable diagnosis controls |
| `disconnected` | Local backend is absent or unreachable | Disable diagnosis controls and show setup guidance |
| `misconfigured` | Backend URL is invalid or wrong version | Disable diagnosis and show configuration guidance |
| `error` | Backend returned unexpected error | Disable diagnosis and show retry option |

The disconnected state should not be a full-page failure. It is a normal state for public visitors.

## Local Backend Contract Placeholder

The frontend should expect a configurable local backend base URL.

Suggested default:

```text
http://localhost:4317
```

Suggested endpoints:

| Endpoint | Purpose |
| --- | --- |
| `GET /health` | Backend availability and version |
| `POST /diagnose/url` | Run local URL/crawler checks |
| `POST /diagnose/pagespeed` | Run PageSpeed checks if configured |
| `GET /auth/google/start` | Start GSC OAuth flow if backend owns OAuth helper |
| `POST /gsc/search-analytics` | Query GSC Search Analytics |
| `POST /gsc/url-inspection` | Query URL Inspection |

The exact API can change during implementation, but frontend behavior must keep diagnosis disabled until `/health` succeeds.

## SEO Implementation Requirements

- Use Next.js App Router.
- Keep public content in Server Components.
- Use Client Components for backend health check, form state, OAuth buttons, and result interactions only.
- Define `metadataBase` from production site URL.
- Use page-specific title, description, alternates canonical, and open graph metadata.
- Add `app/sitemap.ts`.
- Add `app/robots.ts`.
- Add Korean `lang` by default if the first public site is Korean-first.
- Add future English route compatibility if localization is added later.
- Add favicon and OG image.
- Use crawlable `<Link>` navigation.
- Use structured data only when it matches visible content.
- Return `notFound()` for missing content.

## Noindex Rules

Noindex:

- OAuth callback helper pages;
- diagnostic session state pages if they contain user-specific results;
- local-only setup or callback pages that should not appear in Google;
- preview deployment URLs through robots or environment-aware metadata where practical.

Index:

- home;
- diagnose landing page;
- guide pages;
- privacy and terms pages.

## Success Criteria

The public frontend is ready when:

- Vercel-hosted pages are accessible without the local backend;
- indexable pages have useful initial HTML;
- diagnosis controls are disabled when the local backend is absent;
- no fake diagnostic data is shown;
- sitemap and robots expose only intended public pages;
- internal links connect home, diagnose, guides, privacy, and terms;
- each indexable page has unique title, description, canonical, and h1.
