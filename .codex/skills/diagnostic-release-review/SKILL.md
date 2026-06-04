---
name: diagnostic-release-review
description: Use when reviewing the local search visibility diagnosis tool before claiming it is ready, including crawler checks, GSC checks, report evidence, limitations, and unavailable paid-data boundaries.
---

# Diagnostic Release Review

Read:

- `.codex/roles/diagnostic-reviewer.md`
- `.codex/HARNESS.md`
- `docs/search-visibility-diagnosis.md`

## Preconditions

Create `_workspace/` if it does not exist.

If `_workspace/02_check_matrix.md` is absent, run product scope mode from `.codex/skills/search-visibility-harness/SKILL.md` or create the check matrix before reviewing readiness.

## Review Procedure

1. Inspect the implemented UI, local backend, crawler, GSC integration, and report generation code.
2. Verify local crawler checks cover URL status, redirects, headers, robots, sitemap, HTML metadata, canonical, h1, links, structured data, and basic crawl limits.
3. Verify GSC checks require user OAuth and selected Search Console property.
4. Verify one-time inspection does not require refresh-token storage.
5. Verify findings include severity, source, evidence, recommendation, confidence, and limitation.
6. Verify paid-data checks are marked Payment required or Unavailable.
7. Run available tests, lint, typecheck, and at least one representative local diagnosis fixture when possible.
8. Write `_workspace/09_diagnostic_review.md`, `_workspace/09_diagnostic_review.json`, and `_workspace/10_manual_actions.md`.

## JSON Schema

Write `_workspace/09_diagnostic_review.json` with:

- `reviewDate`
- `target`
- `summary` with `pass`, `warn`, `fail`, `manual`, and `unavailable` counts
- `findings` array with `status`, `severity`, `checkId`, `source`, `evidence`, and `recommendation`
- `manualActions` array
- `limitations` array

## Completion Rule

Do not claim readiness while any FAIL remains.
