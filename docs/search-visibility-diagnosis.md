# Search Visibility Diagnosis Scope

## Purpose

This project is a diagnostic service for site owners, developers, and teams who are preparing to publish or operate a website.

The primary goal is to answer:

- Can this site be discovered, crawled, indexed, and shown in Google Search?
- If it is not being exposed in search, what is blocking or weakening visibility?
- If it is being exposed, which pages and keywords are generating impressions?
- What should be reinforced before working on ranking improvements?

This project is not primarily a generic SEO score checker. Its first concern is search visibility: whether a site can appear in search results at all, and what evidence exists from Search Console data.

Ranking improvement, competitor comparison, backlink authority, and SERP persuasion are secondary concerns.

## Core Diagnosis Model

The diagnosis should separate SEO items into five groups.

| Group | Meaning |
| --- | --- |
| Search visibility essentials | Issues that can prevent crawling, indexing, or search exposure |
| Search exposure data | Evidence from Google Search Console about impressions, clicks, queries, and indexed status |
| Ranking support | Items that help ranking after the page is crawlable and indexable |
| SERP and CTR support | Items that affect search result appearance and click-through rate |
| External authority | Backlinks, brand signals, and third-party authority data |

## Implementation Labels

Each diagnostic item should be labeled by implementation feasibility.

| Label | Meaning |
| --- | --- |
| URL automatic | Can be checked from a submitted URL by crawling, fetching headers, parsing HTML, or crawling linked resources |
| Free API available | Can be checked through a free public API, usually with API key or quota limits |
| GSC connection required | Requires the user to connect a Google Search Console property through OAuth |
| Partially possible | Can be approximated with heuristics but should not be treated as a definitive pass/fail result |
| Payment required | Requires paid SEO, SERP, backlink, or local data providers |
| Human judgment required | Requires subjective review, business context, or editorial judgment |

## Priority 1: Search Visibility Essentials

These items determine whether a site can be crawled, indexed, and considered for search exposure.

| Item | Purpose | Feasibility | Priority |
| --- | --- | --- | --- |
| HTTP 200 status | Verify that the page is reachable | URL automatic | Essential |
| 3xx redirect chain | Detect excessive redirects, loops, or unstable canonical paths | URL automatic | Essential |
| 404 and 5xx errors | Detect pages that cannot be indexed | URL automatic | Essential |
| HTTPS availability | Confirm secure access and canonical protocol | URL automatic | Essential |
| HTTP to HTTPS redirect | Verify that insecure access resolves cleanly | URL automatic | Important |
| robots.txt existence | Check crawler policy availability | URL automatic | Essential |
| robots.txt blocking | Detect whether the submitted URL or major paths are blocked | URL automatic | Essential |
| meta robots noindex | Detect page-level indexing blocks | URL automatic | Essential |
| meta robots nofollow | Detect page-level link-following blocks | URL automatic | Important |
| X-Robots-Tag noindex | Detect header-level indexing blocks | URL automatic | Essential |
| canonical tag existence | Understand the declared representative URL | URL automatic | Essential |
| canonical target accessibility | Check whether the canonical URL resolves successfully | URL automatic | Essential |
| canonical points to another page | Detect possible self-canonical or consolidation issues | URL automatic | Important |
| sitemap existence | Help search engines discover URLs | URL automatic | Important |
| sitemap declared in robots.txt | Improve sitemap discovery | URL automatic | Important |
| sitemap URL accessibility | Verify sitemap can be fetched | URL automatic | Important |
| sitemap contains error URLs | Detect 404, 5xx, or redirected URLs inside sitemap | URL automatic | Important |
| sitemap freshness | Check `lastmod` presence and plausibility | URL automatic | Important |
| excessive JavaScript rendering dependency | Detect whether content may be hidden from simple crawlers | Partially possible | Essential |
| Google actual index status | Confirm whether Google indexed the URL | GSC connection required | Essential |
| Google-selected canonical | See which URL Google treats as canonical | GSC connection required | Essential |
| Google crawl status | Check Google's last crawl and access result | GSC connection required | Important |
| soft 404 classification | Detect pages Google treats as low-value or error-like | GSC connection required | Important |
| duplicate indexed pages | Detect index duplication or canonical conflicts | GSC connection required plus crawl comparison | Important |

## Priority 2: Search Exposure and Keyword Diagnosis

These items are central to the product purpose. They cannot be reliably obtained from a submitted URL alone. They require the user to connect their own Google Search Console property.

| Item | Purpose | Feasibility | Priority |
| --- | --- | --- | --- |
| Whether the site has Google impressions | Determine if the site is exposed in Google Search | GSC connection required | Essential |
| Query list | Identify which keywords expose the site | GSC connection required | Essential |
| Query impressions | Measure search exposure volume per keyword | GSC connection required | Essential |
| Query clicks | Measure actual search traffic per keyword | GSC connection required | Important |
| Query CTR | Detect keywords that show but do not get clicks | GSC connection required | Important |
| Query average position | Understand current search position before ranking work | GSC connection required | Important |
| Page impressions | Identify which pages are exposed | GSC connection required | Essential |
| Page clicks | Identify which pages receive search traffic | GSC connection required | Important |
| Page-query mapping | Understand which pages match which search terms | GSC connection required | Essential |
| Country-level exposure | Diagnose regional visibility | GSC connection required | Important |
| Device-level exposure | Diagnose mobile and desktop exposure differences | GSC connection required | Important |
| Date trend | Detect drops, improvements, and indexing changes over time | GSC connection required | Important |
| Indexed pages with no impressions | Find pages that exist in Google but are not being shown | GSC connection required plus sitemap/crawl data | Important |
| Pages with impressions but no clicks | Find title, snippet, intent, or ranking problems | GSC connection required plus HTML analysis | Important |
| Queries with many impressions and low CTR | Find SERP snippet improvement opportunities | GSC connection required | Important |
| Queries with average position 8 to 20 | Find near-opportunity keywords | GSC connection required | Ranking support |

## Priority 3: On-Page Ranking Support

These items usually do not determine whether Google can expose the page at all, but they strongly affect how well the page can rank and how clearly Google understands it.

| Item | Purpose | Feasibility | Priority |
| --- | --- | --- | --- |
| title tag exists | Provide the main page topic signal | URL automatic | Important |
| title length | Detect truncation or weak title patterns | URL automatic | Important |
| duplicate title | Detect repeated page targeting | Partially possible via crawl | Important |
| meta description exists | Provide snippet candidate text | URL automatic | Important |
| meta description length | Detect overly short or long descriptions | URL automatic | Important |
| H1 exists | Confirm visible primary heading | URL automatic | Important |
| H1 count | Detect missing, duplicated, or excessive primary headings | URL automatic | Important |
| title and H1 consistency | Check whether title and heading align | URL automatic | Important |
| URL readability | Detect unclear or overly parameterized URLs | URL automatic | Normal |
| body text length | Detect thin content candidates | URL automatic | Important |
| main content extraction | Separate meaningful text from layout/navigation | Partially possible | Important |
| target keyword presence | Check whether declared target keywords appear in key locations | Requires user-provided keywords | Important |
| title and body topic match | Detect mismatched or misleading pages | Partially possible | Important |
| image alt text | Improve image and accessibility signals | URL automatic | Normal |
| internal link count | Understand page connectivity | URL automatic | Important |
| internal anchor text quality | Understand link context | URL automatic plus heuristics | Important |
| breadcrumb presence | Help page hierarchy and rich result eligibility | URL automatic | Normal |
| structured data presence | Help search engines understand page type | URL automatic | Normal |
| schema type detection | Identify Article, Product, FAQ, Organization, Breadcrumb, and other schema | URL automatic | Normal |
| content uniqueness | Detect possible duplicate content | Partially possible | Important |
| search intent match | Determine whether page answers the likely query intent | Human judgment required, AI-assisted only | Important |
| information completeness | Determine whether content sufficiently answers the topic | Human judgment required, AI-assisted only | Important |
| E-E-A-T signals | Check visible author, company, source, policy, and trust signals | Partially possible | Important |

## Priority 4: Technical Quality and Performance

These items support crawl efficiency, user experience, and ranking quality after the site is accessible and indexable.

| Item | Purpose | Feasibility | Priority |
| --- | --- | --- | --- |
| Core Web Vitals | Measure field or lab user experience signals | Free API available via PageSpeed Insights and CrUX | Important |
| LCP | Diagnose loading experience | Free API available | Important |
| INP | Diagnose interaction responsiveness | Free API available | Important |
| CLS | Diagnose visual stability | Free API available | Important |
| Lighthouse SEO score | Get basic automated SEO checks | Free API available via PageSpeed Insights | Normal |
| Lighthouse accessibility score | Detect accessibility quality issues | Free API available via PageSpeed Insights | Normal |
| render-blocking resources | Detect resources delaying rendering | Free API available | Normal |
| unused JavaScript and CSS | Detect unnecessary client-side weight | Free API available | Normal |
| page load time | Measure basic response and render speed | URL automatic plus free API | Important |
| HTML response size | Detect unusually heavy documents | URL automatic | Normal |
| image count and size | Detect heavy media usage | URL automatic | Normal |
| modern image formats | Detect WebP or AVIF adoption | URL automatic | Normal |
| lazy loading | Detect lazy image behavior | URL automatic | Normal |
| mobile viewport meta | Check mobile readiness baseline | URL automatic | Important |
| mixed content | Detect insecure resources on HTTPS pages | URL automatic | Important |
| hreflang presence | Diagnose international targeting when relevant | URL automatic | Important for multilingual sites |
| hreflang validity | Detect return-tag and language-region issues | Partially possible | Important for multilingual sites |

## Priority 5: SERP and Click-Through Support

These items matter after the site is exposed in search. They help improve click-through rate and search result presentation.

| Item | Purpose | Feasibility | Priority |
| --- | --- | --- | --- |
| title truncation risk | Improve search result readability | URL automatic | Important |
| title click appeal | Improve CTR | Human judgment required, AI-assisted only | Important |
| meta description truncation risk | Improve snippet readability | URL automatic | Important |
| meta description click appeal | Improve CTR | Human judgment required, AI-assisted only | Important |
| favicon existence | Improve search result brand display | URL automatic | Normal |
| Open Graph tags | Improve social sharing presentation | URL automatic | Low |
| Twitter Card tags | Improve social sharing presentation | URL automatic | Low |
| rich result candidate schema | Identify structured data that may produce rich results | URL automatic | Normal |
| actual rich result eligibility | Check Google's interpretation where available | GSC connection required | Normal |
| sitelinks presence | Understand branded search appearance | Payment required or manual SERP check | Low |
| SERP competitor differentiation | Compare search result messaging against competitors | Payment required or manual review | Normal |

## Priority 6: Site Structure

These items help search engines discover and prioritize important pages.

| Item | Purpose | Feasibility | Priority |
| --- | --- | --- | --- |
| important page accessibility | Ensure key pages are reachable from the site | Crawl-based | Important |
| click depth | Detect pages buried too deeply | Crawl-based | Important |
| orphan pages | Find sitemap URLs not linked from crawled pages | Sitemap plus crawl comparison | Important |
| navigation links | Detect whether important pages are in primary navigation | URL automatic plus crawl | Important |
| footer links | Detect supplemental sitewide links | URL automatic plus crawl | Normal |
| pagination handling | Check list/archive crawl paths | URL automatic plus crawl | Normal |
| filtered/search result index control | Detect crawl waste and duplicate index risks | Partially possible | Normal |
| tag/archive page management | Detect low-value indexable page groups | Partially possible | Normal |
| HTML sitemap | Check optional human-readable sitemap availability | Partially possible | Low |
| category structure logic | Judge whether site taxonomy makes sense | Human judgment required | Normal |

## Priority 7: External Authority

These items are useful for ranking diagnosis but are not essential for answering whether the site can be exposed in search. Accurate data usually requires paid third-party providers.

| Item | Purpose | Feasibility | Priority |
| --- | --- | --- | --- |
| backlink count | Measure external authority | Payment required | Ranking support |
| backlink quality | Evaluate value and trust of links | Payment required | Ranking support |
| toxic backlinks | Identify spammy link risk | Payment required | Normal |
| domain authority metrics | Estimate competitive authority | Payment required | Normal |
| anchor text distribution | Understand backlink topic context | Payment required | Normal |
| backlink growth trend | Detect link acquisition pattern | Payment required | Normal |
| brand mention volume | Estimate brand awareness | Partially possible via free sources such as GDELT, but incomplete | Normal |
| directory and platform listings | Check external presence | Payment required or manual review | Normal |
| local SEO and NAP consistency | Diagnose regional business visibility | Payment required or account-specific APIs | Important for local businesses |

## Google Search Console Connection

The project should support a user-authorized Google Search Console connection for visibility data.

The user flow should be:

1. User signs in to the service.
2. User selects "Connect Google Search Console".
3. The service requests Google OAuth access.
4. The user grants Search Console read permission.
5. The service lists Search Console properties available to that Google account.
6. The user selects the property to diagnose.
7. The service combines crawl-based checks with Search Console inspection and search performance data.

Recommended read-only OAuth scope:

```text
https://www.googleapis.com/auth/webmasters.readonly
```

The broader write-capable scope should be avoided unless the product explicitly submits sitemaps or modifies Search Console state:

```text
https://www.googleapis.com/auth/webmasters
```

Important constraints:

- The service can only inspect properties the connected user has access to in Search Console.
- It cannot inspect arbitrary competitor sites through Search Console.
- Public release may require Google OAuth consent screen setup, app verification, privacy policy, authorized domains, and secure token handling.
- Refresh tokens should be stored encrypted and used only from the server side.

## Data Sources

| Source | Use |
| --- | --- |
| Direct URL fetch | Status code, redirects, headers, HTML, meta tags, canonical, links |
| robots.txt | Crawl policy and sitemap discovery |
| XML sitemap | URL discovery, freshness, sitemap health |
| Site crawl | Internal links, click depth, orphan candidates, duplicate metadata |
| Google Search Console API | Search performance: queries, pages, clicks, impressions, CTR, position |
| Google URL Inspection API | Google index status, selected canonical, crawl result, rich result data |
| PageSpeed Insights API | Lighthouse, performance, SEO basics, accessibility, Core Web Vitals where available |
| Chrome UX Report API | Field performance data where origin or URL has enough traffic |
| GDELT | Limited brand/news mention signals |
| Paid SEO providers | Backlinks, authority metrics, SERP rank tracking, competitor comparisons |

## Product Positioning

The product should present its diagnosis in this order:

1. Can Google access the site?
2. Is anything explicitly blocking indexing?
3. Does Google actually index the site?
4. Is the site receiving search impressions?
5. Which keywords and pages are receiving impressions?
6. Which pages are indexed but not exposed?
7. Which exposed pages are not receiving clicks?
8. What technical, content, and structural issues should be reinforced?
9. Which ranking and authority items require external paid data or expert review?

This keeps the diagnosis aligned with the main purpose: search visibility first, ranking improvement second.

## Non-Goals For Initial Classification

These areas should not be treated as core visibility checks:

- Backlink authority as a prerequisite for indexing
- Domain authority scores as a prerequisite for exposure
- Competitor SERP comparisons as a requirement for diagnosing exposure
- Social share metadata as a core search visibility issue
- Generic SEO score aggregation without explaining visibility impact

## Recommended Result Severity

Each finding should map to a severity based on whether it blocks visibility.

| Severity | Meaning |
| --- | --- |
| Critical | Can prevent crawling, indexing, or search exposure |
| High | Strongly affects discoverability, index quality, or query matching |
| Medium | Supports ranking, CTR, structure, or technical quality |
| Low | Nice-to-have, social display, polish, or secondary optimization |
| Unavailable | Requires payment, user authorization, or human judgment |

## Summary

The project should diagnose search visibility before ranking. The most important signals are crawlability, indexability, Search Console index evidence, and Search Console query exposure.

URL-only checks can reveal many technical blockers, but they cannot prove which keywords expose the site. Keyword exposure requires Google Search Console connection from a user who owns or has access to the property.

Paid SEO APIs are useful for backlink and competitive ranking analysis, but they should be clearly separated from the core visibility diagnosis.
