# Public SEO Map

## Site Assumptions

The first public site is Korean-first.

Working product name:

```text
SEO Analysis
```

Working category:

```text
검색 노출 진단 도구
```

Production domain is not fixed yet. Use an environment-driven `metadataBase` until the Vercel domain or custom domain is selected.

## Global Metadata Rules

| Field | Rule |
| --- | --- |
| Language | `ko` by default |
| Title template | `%s | SEO Analysis` |
| Default title | `SEO Analysis - 검색 노출 진단 도구` |
| Default description | `내 사이트가 Google 검색에 노출될 수 있는지, 어떤 키워드로 노출되는지, 무엇을 먼저 보강해야 하는지 확인하는 로컬 기반 검색 노출 진단 도구입니다.` |
| Canonical | Absolute production URL per route |
| Robots | Index public pages, noindex private/local/session/helper pages |
| Open Graph | `website` for home/tool pages, `article` for guides |
| Twitter Card | `summary_large_image` |

## Indexable URL Map

| Route | H1 | Title | Description | Primary Intent | Secondary Intent | Render | Schema | Canonical |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | `검색 노출부터 확인하는 SEO 진단 도구` | `검색 노출 진단 도구` | `내 사이트가 Google에 노출될 수 있는 상태인지, 실제로 어떤 키워드와 페이지에서 노출되는지 확인하는 로컬 기반 SEO 진단 도구입니다.` | 검색 노출 진단 도구 이해 | SEO 점수보다 색인/노출을 먼저 확인 | SSG | `WebSite`, `SoftwareApplication` | `/` |
| `/diagnose` | `내 사이트 검색 노출 진단하기` | `사이트 검색 노출 진단` | `로컬 진단 서버와 Google Search Console 데이터를 통해 크롤링, 색인, 키워드 노출 상태를 점검합니다. 서버가 꺼져 있으면 진단은 비활성화됩니다.` | 사이트 SEO 진단 실행 | 로컬 서버 기반 진단 방식 이해 | SSG + client island | `SoftwareApplication`, optional `FAQPage` | `/diagnose` |
| `/guides/search-visibility` | `검색 노출 진단이란 무엇인가` | `검색 노출 진단 가이드` | `상위노출을 고민하기 전에 Google이 사이트를 발견하고 색인하며 실제 검색어에서 노출하는지 확인해야 하는 이유를 설명합니다.` | 검색 노출 개념 학습 | 상위노출과 노출 가능성 차이 이해 | SSG | `Article`, `BreadcrumbList` | `/guides/search-visibility` |
| `/guides/crawlability-indexability` | `크롤링과 색인을 막는 SEO 문제` | `크롤링·색인 문제 진단 가이드` | `robots.txt, noindex, canonical, HTTP 상태 코드처럼 Google 검색 노출을 막을 수 있는 핵심 기술 요소를 정리합니다.` | 색인 차단 문제 이해 | robots/noindex/canonical 확인 | SSG | `Article`, `BreadcrumbList` | `/guides/crawlability-indexability` |
| `/guides/google-search-console-keywords` | `Search Console로 노출 키워드 확인하기` | `Search Console 노출 키워드 진단 가이드` | `사이트가 어떤 검색어와 페이지에서 노출되는지는 URL 분석만으로 알 수 없으며 Google Search Console 데이터가 필요한 이유를 설명합니다.` | GSC 키워드 노출 이해 | impressions/clicks/CTR/position 해석 | SSG | `Article`, `BreadcrumbList` | `/guides/google-search-console-keywords` |
| `/guides/robots-sitemap-checks` | `robots.txt와 sitemap으로 발견성 점검하기` | `robots.txt·sitemap 진단 가이드` | `검색엔진이 사이트의 중요한 URL을 발견하고 접근할 수 있도록 robots.txt와 XML sitemap을 점검하는 방법을 설명합니다.` | robots/sitemap 점검 학습 | URL 발견성 개선 | SSG | `Article`, `BreadcrumbList` | `/guides/robots-sitemap-checks` |
| `/guides/local-diagnosis-setup` | `로컬 서버로 SEO 진단을 실행하는 이유` | `로컬 SEO 진단 서버 설정 가이드` | `브라우저 CORS 제약 때문에 URL 크롤링과 HTML 분석은 로컬 진단 서버가 필요합니다. 서버가 없을 때 진단이 비활성화되는 이유를 설명합니다.` | 로컬 진단 서버 필요성 이해 | 설치/실행 흐름 파악 | SSG | `Article`, `BreadcrumbList`, optional `FAQPage` | `/guides/local-diagnosis-setup` |
| `/privacy` | `개인정보와 로컬 진단 원칙` | `개인정보 처리와 로컬 진단 원칙` | `SEO Analysis가 로컬 서버와 Google Search Console 권한을 어떻게 다루는지, 기본적으로 refresh token 저장 없이 일회성 진단을 권장하는 이유를 설명합니다.` | 개인정보 처리 이해 | GSC 권한과 토큰 처리 이해 | SSG | Omit | `/privacy` |
| `/terms` | `서비스 이용 안내` | `서비스 이용 안내` | `SEO Analysis 공개 사이트와 로컬 진단 도구 사용 시 알아야 할 기본 이용 조건과 한계를 안내합니다.` | 이용 조건 확인 | 진단 결과 한계 이해 | SSG | Omit | `/terms` |

## Noindex URL Map

| Route | Reason | Required Handling |
| --- | --- | --- |
| `/diagnose/session` | User-specific diagnostic results should not be indexed | `noindex`, client/session-only content |
| `/oauth/callback` | OAuth helper route, not useful search content | `noindex`, no sitemap entry |
| `/api/*` if present in Next.js | API routes are not content pages | No sitemap entry |
| Preview deployment URLs | Not canonical production pages | Environment-aware robots/meta where practical |

## Internal Link Map

| From | To | Anchor Text |
| --- | --- | --- |
| `/` | `/diagnose` | `사이트 검색 노출 진단 시작하기` |
| `/` | `/guides/search-visibility` | `검색 노출 진단 개념 보기` |
| `/` | `/guides/google-search-console-keywords` | `Search Console 노출 키워드 이해하기` |
| `/diagnose` | `/guides/local-diagnosis-setup` | `로컬 진단 서버가 필요한 이유` |
| `/diagnose` | `/guides/crawlability-indexability` | `크롤링과 색인 차단 요소 알아보기` |
| `/diagnose` | `/guides/google-search-console-keywords` | `노출 키워드 데이터가 필요한 이유` |
| `/guides/search-visibility` | `/diagnose` | `내 사이트 검색 노출 진단하기` |
| `/guides/search-visibility` | `/guides/crawlability-indexability` | `크롤링과 색인 문제 확인하기` |
| `/guides/crawlability-indexability` | `/guides/robots-sitemap-checks` | `robots.txt와 sitemap 점검하기` |
| `/guides/crawlability-indexability` | `/diagnose` | `기술 차단 요소 진단하기` |
| `/guides/google-search-console-keywords` | `/diagnose` | `Search Console 기반 노출 진단하기` |
| `/guides/google-search-console-keywords` | `/privacy` | `Google 권한과 데이터 처리 방식 보기` |
| `/guides/robots-sitemap-checks` | `/diagnose` | `URL 발견성 진단하기` |
| `/guides/local-diagnosis-setup` | `/diagnose` | `로컬 서버 연결 상태 확인하기` |
| `/privacy` | `/guides/google-search-console-keywords` | `Search Console 데이터가 필요한 이유` |

## Structured Data Plan

| Route Type | Schema | Required Visible Content |
| --- | --- | --- |
| Home | `WebSite` | Site name, description, canonical URL |
| Home / Diagnose | `SoftwareApplication` | Tool name, category, description, operating environment |
| Guides | `Article` | Headline, description, date, body content |
| Guides | `BreadcrumbList` | Visible breadcrumb or equivalent navigational hierarchy |
| FAQ sections | `FAQPage` | Visible question-and-answer content |

Do not add schema that contradicts visible content.

## Sitemap Plan

Include:

- `/`
- `/diagnose`
- `/guides/search-visibility`
- `/guides/crawlability-indexability`
- `/guides/google-search-console-keywords`
- `/guides/robots-sitemap-checks`
- `/guides/local-diagnosis-setup`
- `/privacy`
- `/terms`

Exclude:

- `/diagnose/session`
- `/oauth/callback`
- API routes
- preview/local-only routes

## Robots Plan

Production:

```text
User-agent: *
Allow: /
Disallow: /diagnose/session
Disallow: /oauth/callback
Sitemap: https://<production-domain>/sitemap.xml
```

Preview or non-production:

```text
User-agent: *
Disallow: /
```

Use environment-aware `robots.ts` when implementing.

## Backend-Disconnected Copy Requirements

The `/diagnose` page should include static, indexable copy explaining:

- the public page is available without the local backend;
- actual diagnosis needs the local diagnosis server;
- browser-only requests cannot reliably crawl arbitrary sites because of CORS;
- Search Console data requires Google authorization for a property the user can access;
- no results are generated until the backend responds.

The disabled action label should be direct:

```text
로컬 진단 서버 연결 필요
```

## Keyword Targets

Primary Korean keyword themes:

- 검색 노출 진단
- 사이트 검색 노출 확인
- 구글 검색 노출 확인
- Search Console 키워드 확인
- robots.txt sitemap 진단
- 색인 문제 진단
- SEO 진단 로컬 도구

Avoid keyword stuffing. Use these as topic anchors for page intent, headings, and internal links.

## Future Localization

If English pages are added later:

- use `/en/...` routes;
- add localized canonical and hreflang;
- keep Korean pages canonical to Korean URLs;
- do not auto-translate thin pages just to increase URL count.
