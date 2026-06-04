# Diagnosis Scope

## Objective

This project is a public SEO-friendly frontend plus local-first search visibility diagnosis tool for people who own, build, or operate websites.

The tool should answer three questions before it talks about ranking optimization:

1. Can Google discover, crawl, index, and expose this site?
2. Is this site actually receiving Google Search impressions?
3. Which pages and keywords are responsible for those impressions?

If the site is not exposed, or is exposed weakly, the tool should explain which crawl, index, content, or visibility evidence should be reinforced first.

## Primary User

The primary user is a developer or site owner who can visit the public frontend and run the diagnosis engine from their own PC.

They provide:

- a domain or URL;
- optional target keywords;
- optional Google Search Console access for a property they own or can access.

The public frontend should be deployable to Vercel and indexable by Google. The diagnosis engine should not depend on a central SaaS server; it should require a local backend running on the user's PC.

## Product Position

This is not a generic SEO score checker.

It is a search visibility diagnostic tool. It should prioritize:

- crawlability;
- indexability;
- Google Search Console index evidence;
- Google Search Console query and page exposure;
- clear next actions for blocked or weak visibility.

Ranking support, CTR improvement, backlinks, domain authority, and competitor analysis are secondary.

## Execution Model

The intended execution model is:

```text
Vercel
└─ Public SEO frontend
   ├─ indexable marketing/product pages
   ├─ indexable guides
   └─ diagnosis UI shell

User PC
└─ Local backend
   ├─ URL fetch and redirect checks
   ├─ robots.txt and sitemap parsing
   ├─ HTML metadata and link extraction
   ├─ bounded same-site crawling
   ├─ PageSpeed Insights / CrUX calls when configured
   └─ Google Search Console calls after user OAuth
```

If the local backend is not running, the public frontend must remain available and SEO-friendly, but diagnosis execution must be disabled.

The disabled state should:

- clearly say that the local diagnosis server is required;
- keep educational/static content visible;
- avoid showing failed or fake diagnosis results;
- provide setup guidance for starting the local backend.

## Data Source Classes

| Source | Label | Use |
| --- | --- | --- |
| Local URL fetch | `local-fetch` | status, redirects, headers, final URL, HTTPS |
| Local robots parser | `robots` | crawler allow/disallow evaluation |
| Local sitemap parser | `sitemap` | sitemap discovery, URL health, freshness |
| Local HTML parser | `html` | title, metadata, canonical, headings, links, structured data |
| Local crawler | `site-crawl` | internal links, click depth, broken links, orphan candidates |
| Google Search Console Search Analytics | `gsc-search-analytics` | queries, pages, clicks, impressions, CTR, position |
| Google URL Inspection API | `gsc-url-inspection` | Google index status, Google-selected canonical, crawl result |
| PageSpeed Insights API | `pagespeed` | Lighthouse, performance, accessibility, Core Web Vitals where available |
| Chrome UX Report API | `crux` | field performance data where available |
| User input | `user-input` | target keywords, expected important pages, ownership context |
| Human review | `human-review` | intent match, content completeness, editorial quality |
| Paid data provider | `paid-provider` | backlinks, authority, SERP rank tracking, competitor data |

## Implementation Labels

| Label | Meaning |
| --- | --- |
| `local-backend` | Implementable from the user's local backend without a paid provider |
| `free-api` | Implementable through a free API, usually with key, quota, or availability limits |
| `gsc-required` | Requires user-authorized Google Search Console access |
| `user-input-required` | Requires the user to provide target keywords, expected URLs, or context |
| `partial` | Can be estimated but should not be treated as a definitive result |
| `payment-required` | Requires paid data provider for reliable implementation |
| `human-required` | Requires subjective review or business context |

## Statuses

| Status | Meaning |
| --- | --- |
| `PASS` | The check is satisfied |
| `WARN` | The check is not blocking, but improvement is recommended |
| `FAIL` | The check reveals a likely visibility blocker or serious issue |
| `MANUAL` | User authorization, user action, or manual verification is required |
| `UNAVAILABLE` | The check cannot be performed with available local/free data |

## Severities

| Severity | Meaning |
| --- | --- |
| `Critical` | Can prevent crawling, indexing, or search exposure |
| `High` | Strongly affects discoverability, index quality, or query matching |
| `Medium` | Supports ranking, CTR, structure, or technical quality |
| `Low` | Nice-to-have or secondary optimization |
| `Unavailable` | Requires payment, authorization, or human judgment |

## Diagnosis Flow

The UI and report should present checks in this order:

1. Reachability and canonical access
2. Crawl permission
3. Index permission
4. Sitemap and URL discovery
5. Google index evidence
6. Google search exposure evidence
7. Page and query mapping
8. No-impression and no-click diagnosis
9. On-page ranking support
10. Technical quality and performance
11. SERP and CTR support
12. Site structure
13. Paid or human-required external authority checks

## Search Console Policy

Search Console integration should use user authorization.

Default scope:

```text
https://www.googleapis.com/auth/webmasters.readonly
```

For one-time local diagnosis:

- use short-lived access tokens;
- do not store refresh tokens by default;
- do not log tokens;
- do not claim data from properties the connected user cannot access.

Refresh-token storage is only appropriate if the user explicitly asks for scheduled checks, background monitoring, or historical snapshots.

## Output Contract

Every finding should include:

| Field | Description |
| --- | --- |
| `checkId` | Stable identifier from the check matrix |
| `category` | Diagnosis group |
| `source` | Data source label |
| `target` | URL, domain, property, query, or page |
| `status` | PASS, WARN, FAIL, MANUAL, or UNAVAILABLE |
| `severity` | Critical, High, Medium, Low, or Unavailable |
| `evidence` | Observed data supporting the result |
| `recommendation` | Next action |
| `limitation` | Missing permission, partial heuristic, quota, paid data need, or human judgment need |

## Non-Goals

The following should not be treated as core visibility blockers:

- backlink count;
- domain authority;
- competitor SERP comparison;
- social share metadata;
- generic SEO score aggregation;
- long-term rank tracking;
- local citation/NAP consistency unless the site is explicitly a local business.

These may appear as secondary or unavailable checks, but they must not block the core search visibility diagnosis.
