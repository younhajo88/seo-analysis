# Diagnosis Check Matrix

## Matrix Fields

| Field | Meaning |
| --- | --- |
| `checkId` | Stable id for code, reports, and tests |
| `Category` | Diagnosis group |
| `Check` | Human-readable check name |
| `Source` | Data source |
| `Implementation` | local-backend, free-api, gsc-required, user-input-required, partial, payment-required, human-required |
| `Default Status` | Expected status when the check cannot yet run |
| `Severity` | Critical, High, Medium, Low, Unavailable |
| `Visibility Impact` | Why this matters |

## Priority 1: Reachability, Crawlability, And Indexability

| checkId | Category | Check | Source | Implementation | Default Status | Severity | Visibility Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `reach.http_status` | Reachability | Target URL resolves to HTTP 200 | local-fetch | local-backend | FAIL | Critical | Non-200 pages may not be indexable |
| `reach.redirect_chain` | Reachability | Redirect chain is short and stable | local-fetch | local-backend | WARN | High | Long or unstable redirects waste crawl signals |
| `reach.redirect_loop` | Reachability | No redirect loop | local-fetch | local-backend | FAIL | Critical | Loops prevent crawling |
| `reach.final_url_expected` | Reachability | Final URL matches expected canonical host/protocol | local-fetch | local-backend | WARN | High | Wrong final host can split signals |
| `reach.https_available` | Reachability | HTTPS URL is available | local-fetch | local-backend | FAIL | Critical | HTTPS is expected for modern public sites |
| `reach.http_to_https` | Reachability | HTTP redirects to HTTPS | local-fetch | local-backend | WARN | High | Protocol split can confuse canonical access |
| `crawl.robots_exists` | Crawlability | `robots.txt` is available | robots | local-backend | WARN | Medium | Missing robots is not fatal but reduces explicit crawler policy |
| `crawl.robots_googlebot_allowed` | Crawlability | Googlebot is allowed for target URL | robots | local-backend | FAIL | Critical | Blocked URLs may not be crawled |
| `crawl.robots_sitemap_declared` | Crawlability | robots.txt declares sitemap when available | robots | local-backend | WARN | Medium | Helps discovery but is not strictly required |
| `index.meta_noindex` | Indexability | Page does not include meta robots `noindex` | html | local-backend | FAIL | Critical | `noindex` blocks indexing |
| `index.meta_nofollow` | Indexability | Page does not unintentionally include meta robots `nofollow` | html | local-backend | WARN | High | `nofollow` can weaken link discovery |
| `index.x_robots_noindex` | Indexability | Headers do not include X-Robots-Tag `noindex` | local-fetch | local-backend | FAIL | Critical | Header-level noindex blocks indexing |
| `index.canonical_exists` | Indexability | Canonical URL exists | html | local-backend | WARN | High | Missing canonical can increase duplicate ambiguity |
| `index.canonical_accessible` | Indexability | Canonical URL resolves successfully | local-fetch + html | local-backend | FAIL | Critical | Broken canonical can prevent correct indexing |
| `index.canonical_expected` | Indexability | Canonical matches expected final URL or intentional alternate | html | local-backend | WARN | High | Wrong canonical can send Google to another URL |
| `render.initial_content_present` | Crawlability | Important content is present in initial HTML | html | partial | WARN | Critical | Heavy JS rendering can hide content from crawlers |

## Priority 2: Sitemap And Discovery

| checkId | Category | Check | Source | Implementation | Default Status | Severity | Visibility Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `sitemap.exists` | Discovery | XML sitemap is discoverable | sitemap | local-backend | WARN | High | Sitemap helps Google discover important URLs |
| `sitemap.fetchable` | Discovery | Sitemap URL returns 200 and valid XML | sitemap | local-backend | FAIL | High | Broken sitemap weakens discovery |
| `sitemap.index_supported` | Discovery | Sitemap index files are parsed | sitemap | local-backend | WARN | Medium | Large sites often use sitemap indexes |
| `sitemap.urls_status` | Discovery | Sitemap URLs are not 404, 5xx, or broken | sitemap + local-fetch | local-backend | WARN | High | Invalid sitemap URLs waste crawl budget and signals |
| `sitemap.urls_redirect` | Discovery | Sitemap avoids redirected URLs | sitemap + local-fetch | local-backend | WARN | Medium | Final URLs should be submitted directly |
| `sitemap.lastmod_present` | Discovery | Sitemap `lastmod` exists where useful | sitemap | local-backend | WARN | Low | Helps freshness hints when accurate |
| `sitemap.canonical_consistency` | Discovery | Sitemap URLs agree with page canonical URLs | sitemap + html | local-backend | WARN | High | Sitemap should list canonical indexable URLs |

## Priority 3: Google Index Evidence

| checkId | Category | Check | Source | Implementation | Default Status | Severity | Visibility Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `gsc.property_connected` | GSC Access | User connected a Search Console property | gsc-search-analytics | gsc-required | MANUAL | Critical | Google visibility evidence requires authorized property access |
| `gsc.url_index_status` | Google Index | URL is indexed or eligible according to URL Inspection | gsc-url-inspection | gsc-required | MANUAL | Critical | Confirms Google's actual index state |
| `gsc.google_canonical` | Google Index | Google-selected canonical matches expected URL | gsc-url-inspection | gsc-required | MANUAL | Critical | Google may index a different canonical |
| `gsc.crawl_verdict` | Google Index | URL Inspection crawl verdict is acceptable | gsc-url-inspection | gsc-required | MANUAL | High | Reveals Googlebot access issues |
| `gsc.indexing_verdict` | Google Index | URL Inspection indexing verdict has no blocker | gsc-url-inspection | gsc-required | MANUAL | Critical | Reveals Google-side indexing blockers |
| `gsc.soft_404` | Google Index | URL is not classified as soft 404 | gsc-url-inspection | gsc-required | MANUAL | High | Soft 404 pages may not appear in search |
| `gsc.rich_result_status` | Google Index | Rich result status is available when relevant | gsc-url-inspection | gsc-required | MANUAL | Medium | Supports enhanced search appearance |

## Priority 4: Search Exposure And Keyword Diagnosis

| checkId | Category | Check | Source | Implementation | Default Status | Severity | Visibility Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `exposure.site_impressions` | Search Exposure | Site has Google Search impressions in selected period | gsc-search-analytics | gsc-required | MANUAL | Critical | Proves actual search exposure |
| `exposure.query_list` | Search Exposure | Queries generating impressions are available | gsc-search-analytics | gsc-required | MANUAL | Critical | Reveals which keywords expose the site |
| `exposure.query_impressions` | Search Exposure | Query-level impressions are measured | gsc-search-analytics | gsc-required | MANUAL | Critical | Measures keyword visibility scale |
| `exposure.query_clicks` | Search Exposure | Query-level clicks are measured | gsc-search-analytics | gsc-required | MANUAL | High | Measures actual search traffic |
| `exposure.query_ctr` | Search Exposure | Query-level CTR is measured | gsc-search-analytics | gsc-required | MANUAL | High | Identifies impressions without clicks |
| `exposure.query_position` | Search Exposure | Query average position is measured | gsc-search-analytics | gsc-required | MANUAL | Medium | Shows current ranking context |
| `exposure.page_impressions` | Search Exposure | Page-level impressions are available | gsc-search-analytics | gsc-required | MANUAL | Critical | Identifies exposed pages |
| `exposure.page_clicks` | Search Exposure | Page-level clicks are available | gsc-search-analytics | gsc-required | MANUAL | High | Identifies traffic-driving pages |
| `exposure.page_query_map` | Search Exposure | Pages are mapped to impression-generating queries | gsc-search-analytics | gsc-required | MANUAL | Critical | Connects content to actual keywords |
| `exposure.country_device` | Search Exposure | Country and device dimensions are available | gsc-search-analytics | gsc-required | MANUAL | Medium | Reveals regional or device-specific visibility |
| `exposure.date_trend` | Search Exposure | Date trend is available | gsc-search-analytics | gsc-required | MANUAL | Medium | Shows visibility changes over time |
| `exposure.indexed_no_impressions` | Search Exposure | Indexed URLs with no impressions are identified | gsc-search-analytics + gsc-url-inspection + sitemap | gsc-required | MANUAL | High | Finds pages that exist but do not show |
| `exposure.impressions_no_clicks` | Search Exposure | Pages or queries with impressions but no clicks are identified | gsc-search-analytics | gsc-required | MANUAL | Medium | Highlights snippet, intent, or rank problems |
| `exposure.target_keyword_match` | Search Exposure | Target keywords are compared with actual GSC queries | gsc-search-analytics + user-input | user-input-required | MANUAL | High | Shows whether desired keywords actually expose the site |

## Priority 5: On-Page Ranking Support

| checkId | Category | Check | Source | Implementation | Default Status | Severity | Visibility Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `page.title_exists` | On-Page | Title tag exists | html | local-backend | WARN | High | Title helps Google understand topic |
| `page.title_length` | On-Page | Title length is reasonable | html | local-backend | WARN | Medium | Supports snippet readability |
| `page.title_unique` | On-Page | Title is unique across crawled pages | site-crawl + html | local-backend | WARN | Medium | Reduces duplicate targeting |
| `page.description_exists` | On-Page | Meta description exists | html | local-backend | WARN | Medium | Supports snippet candidate text |
| `page.description_length` | On-Page | Meta description length is reasonable | html | local-backend | WARN | Low | Supports snippet readability |
| `page.h1_exists` | On-Page | H1 exists | html | local-backend | WARN | High | Clarifies visible page topic |
| `page.h1_count` | On-Page | H1 count is reasonable | html | local-backend | WARN | Medium | Avoids ambiguous primary headings |
| `page.title_h1_consistency` | On-Page | Title and H1 are topically aligned | html | partial | WARN | Medium | Helps topic consistency |
| `page.body_text_length` | On-Page | Main text is not thin by simple length heuristic | html | partial | WARN | Medium | Thin pages often struggle to rank |
| `page.keyword_presence` | On-Page | Target keywords appear in meaningful locations | html + user-input | user-input-required | MANUAL | High | Shows target keyword alignment |
| `page.image_alt` | On-Page | Important images have alt text | html | local-backend | WARN | Low | Supports accessibility and image understanding |
| `page.structured_data_exists` | On-Page | Structured data exists where appropriate | html | local-backend | WARN | Medium | Helps page type understanding |
| `page.schema_valid_jsonld` | On-Page | JSON-LD parses successfully | html | local-backend | WARN | Medium | Broken schema cannot be understood reliably |
| `page.eeat_visible_signals` | On-Page | Author, organization, contact, source, or policy signals exist | html | partial | WARN | Medium | Supports trust review but is not definitive |
| `page.intent_match` | On-Page | Page satisfies target search intent | human-review | human-required | UNAVAILABLE | Unavailable | Requires editorial judgment |
| `page.information_completeness` | On-Page | Page sufficiently answers the topic | human-review | human-required | UNAVAILABLE | Unavailable | Requires domain/context judgment |

## Priority 6: Technical Quality And Performance

| checkId | Category | Check | Source | Implementation | Default Status | Severity | Visibility Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `perf.pagespeed_available` | Performance | PageSpeed Insights result is available | pagespeed | free-api | MANUAL | Medium | Provides Lighthouse and performance evidence |
| `perf.lcp` | Performance | LCP is within acceptable range | pagespeed + crux | free-api | WARN | Medium | Loading speed supports user experience |
| `perf.inp` | Performance | INP is within acceptable range | pagespeed + crux | free-api | WARN | Medium | Responsiveness supports user experience |
| `perf.cls` | Performance | CLS is within acceptable range | pagespeed + crux | free-api | WARN | Medium | Layout stability supports user experience |
| `perf.lighthouse_seo` | Performance | Lighthouse SEO checks pass | pagespeed | free-api | WARN | Medium | Catches basic SEO issues |
| `perf.lighthouse_accessibility` | Performance | Lighthouse accessibility checks pass | pagespeed | free-api | WARN | Low | Accessibility supports quality |
| `perf.render_blocking` | Performance | Render-blocking resources are limited | pagespeed | free-api | WARN | Low | Improves rendering speed |
| `perf.unused_js_css` | Performance | Unused JavaScript/CSS is limited | pagespeed | free-api | WARN | Low | Reduces page weight |
| `tech.html_size` | Technical Quality | HTML response size is not excessive | local-fetch | local-backend | WARN | Low | Large HTML can slow parsing |
| `tech.mobile_viewport` | Technical Quality | Mobile viewport meta tag exists | html | local-backend | WARN | Medium | Supports mobile rendering |
| `tech.mixed_content` | Technical Quality | HTTPS page does not reference insecure resources | html | local-backend | WARN | Medium | Mixed content weakens security and UX |
| `tech.hreflang_presence` | Technical Quality | hreflang exists for multilingual sites | html | local-backend | MANUAL | Medium | Required only when multilingual targeting exists |
| `tech.hreflang_validity` | Technical Quality | hreflang values and return links are plausible | html + site-crawl | partial | WARN | Medium | Helps international targeting |

## Priority 7: Site Structure

| checkId | Category | Check | Source | Implementation | Default Status | Severity | Visibility Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `structure.internal_links` | Site Structure | Page has crawlable internal links | html | local-backend | WARN | High | Internal links help discovery |
| `structure.anchor_text` | Site Structure | Internal anchor text is descriptive | html | partial | WARN | Medium | Anchor text helps context |
| `structure.click_depth` | Site Structure | Important pages are within reasonable click depth | site-crawl | local-backend | WARN | High | Deep pages may be discovered slowly |
| `structure.broken_internal_links` | Site Structure | Internal links do not return 404 or 5xx | site-crawl + local-fetch | local-backend | WARN | High | Broken links weaken crawl paths |
| `structure.orphan_candidates` | Site Structure | Sitemap URLs not found in crawl are identified | sitemap + site-crawl | local-backend | WARN | High | Orphans may be undiscovered without sitemap |
| `structure.navigation_exposes_key_pages` | Site Structure | Key pages appear in navigation or crawl paths | html + user-input | user-input-required | MANUAL | High | Important pages should be discoverable |
| `structure.pagination` | Site Structure | Pagination paths are crawlable and not wasteful | html + site-crawl | partial | WARN | Medium | List pages can create discovery or duplication issues |
| `structure.filtered_pages_index_control` | Site Structure | Filter/search pages are controlled when present | html + site-crawl | partial | WARN | Medium | Prevents crawl waste and duplicate indexation |

## Priority 8: SERP And CTR Support

| checkId | Category | Check | Source | Implementation | Default Status | Severity | Visibility Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `serp.title_truncation` | SERP/CTR | Title truncation risk is checked | html | local-backend | WARN | Medium | Supports search result readability |
| `serp.description_truncation` | SERP/CTR | Meta description truncation risk is checked | html | local-backend | WARN | Low | Supports snippet readability |
| `serp.favicon` | SERP/CTR | Favicon exists | html + local-fetch | local-backend | WARN | Low | Supports brand display in search |
| `serp.og_tags` | SERP/CTR | Open Graph tags exist | html | local-backend | WARN | Low | Social display, not core Google visibility |
| `serp.twitter_card` | SERP/CTR | Twitter Card tags exist | html | local-backend | WARN | Low | Social display, not core Google visibility |
| `serp.title_click_appeal` | SERP/CTR | Title is compelling for target query | human-review | human-required | UNAVAILABLE | Unavailable | Requires editorial judgment |
| `serp.description_click_appeal` | SERP/CTR | Description is compelling for target query | human-review | human-required | UNAVAILABLE | Unavailable | Requires editorial judgment |
| `serp.sitelinks_presence` | SERP/CTR | Sitelinks presence is checked | paid-provider | payment-required | UNAVAILABLE | Unavailable | Requires SERP data or manual check |
| `serp.competitor_differentiation` | SERP/CTR | SERP messaging is compared with competitors | paid-provider | payment-required | UNAVAILABLE | Unavailable | Requires SERP collection or manual review |

## Priority 9: External Authority

| checkId | Category | Check | Source | Implementation | Default Status | Severity | Visibility Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `authority.backlink_count` | External Authority | Backlink count is available | paid-provider | payment-required | UNAVAILABLE | Unavailable | Reliable backlink index requires paid data |
| `authority.backlink_quality` | External Authority | Backlink quality is available | paid-provider | payment-required | UNAVAILABLE | Unavailable | Reliable quality metrics require paid data |
| `authority.toxic_backlinks` | External Authority | Toxic backlink risk is available | paid-provider | payment-required | UNAVAILABLE | Unavailable | Requires paid backlink/spam metrics |
| `authority.domain_authority` | External Authority | Domain authority metric is available | paid-provider | payment-required | UNAVAILABLE | Unavailable | Third-party authority scores are paid/proprietary |
| `authority.anchor_distribution` | External Authority | Backlink anchor text distribution is available | paid-provider | payment-required | UNAVAILABLE | Unavailable | Requires backlink index |
| `authority.brand_mentions` | External Authority | Brand/news mentions are approximated | free API / human-review | partial | WARN | Low | Free sources are incomplete and not definitive |
| `authority.local_nap` | External Authority | NAP consistency is checked for local business | paid-provider | payment-required | UNAVAILABLE | Unavailable | Citation data usually requires paid provider |

## Initial Implementation Slice

Implement checks in this order:

1. `reach.*`
2. `crawl.*`
3. `index.*`
4. `sitemap.*`
5. `page.title_exists`, `page.description_exists`, `page.h1_exists`, `page.structured_data_exists`
6. `structure.internal_links`, `structure.broken_internal_links`
7. `gsc.property_connected`, `gsc.url_index_status`, `exposure.*`
8. `perf.*`
9. `serp.*`
10. `authority.*` as unavailable/payment-required placeholders

## Report Grouping

Reports should group findings as:

1. Critical blockers
2. Google evidence
3. Search exposure and target keyword match
4. Technical and on-page improvements
5. Structure and crawl path improvements
6. SERP/CTR improvements
7. Unavailable or payment-required checks
