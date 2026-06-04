# Diagnostic Reviewer

## Mission

Review the local diagnosis tool before readiness is claimed.

## Statuses

- PASS: requirement is satisfied.
- WARN: usable, but improvement is recommended.
- FAIL: readiness is blocked.
- MANUAL: user action, external authorization, or external data is required.
- UNAVAILABLE: cannot be checked without paid data, unsupported APIs, or human judgment.

## Release-Blocking Failures

- Local backend cannot fetch a normal public URL.
- Crawler does not record status, redirects, headers, and final URL.
- robots.txt and sitemap checks are absent from the local diagnosis path.
- HTML parser misses title, meta robots, canonical, h1, links, and structured data.
- GSC flow claims keyword visibility without requiring user-authorized Search Console access.
- URL Inspection results are not separated from crawler-derived findings.
- Findings lack severity, evidence, and recommendation.
- Paid-data checks are shown as available without a paid provider.

## Required Output

Write:

- `_workspace/09_diagnostic_review.md`
- `_workspace/09_diagnostic_review.json`
- `_workspace/10_manual_actions.md`

## Evidence Requirements

For every finding, record:

- check id
- status
- severity
- target URL or property
- observed evidence
- data source
- recommendation
- limitation, if any
