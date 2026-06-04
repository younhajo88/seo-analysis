---
name: gsc-visibility-diagnostics
description: Use when designing, implementing, or reviewing Google Search Console OAuth, Search Analytics, URL Inspection, property selection, and keyword visibility diagnosis for user-owned sites.
---

# GSC Visibility Diagnostics

Read:

- `.codex/roles/gsc-integration-engineer.md`
- `docs/search-visibility-diagnosis.md`

## Core Flow

1. Request Google OAuth access with the read-only Search Console scope.
2. List available Search Console properties.
3. Let the user select a property.
4. Pull Search Analytics data for queries, pages, countries, devices, dates, clicks, impressions, CTR, and average position.
5. Pull URL Inspection data for selected URLs when available.
6. Merge GSC findings with local crawler findings without collapsing their data sources.

## One-Time Local Use

For local, one-time inspection:

- Prefer short-lived access tokens.
- Do not store refresh tokens unless the user explicitly asks for scheduled or background monitoring.
- Keep tokens out of logs and reports.
- Store no Google data persistently unless the user asks for saved reports.

## Report Contract

Each GSC finding must contain:

- `checkId`
- `source: "google-search-console"` or `source: "url-inspection"`
- `property`
- `dateRange`
- `dimensions`
- `status`
- `severity`
- `evidence`
- `recommendation`
- `limitation`

## Guardrails

- Never claim query exposure without GSC data.
- Never inspect competitor properties.
- Treat missing permission, missing property, quota exhaustion, and unsupported inspection states as MANUAL or UNAVAILABLE.
- Keep Search Analytics data separate from URL Inspection data.
