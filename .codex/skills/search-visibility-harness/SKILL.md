---
name: search-visibility-harness
description: Use when planning, implementing, or reviewing this local-first search visibility diagnosis project end to end, especially when coordinating crawler checks, Google Search Console integration, diagnosis reports, and visibility analysis.
---

# Search Visibility Harness

## Start Here

Read:

- `.codex/HARNESS.md`
- `docs/search-visibility-diagnosis.md`
- `.codex/roles/diagnosis-product-architect.md`

## Routing Rule

Select the narrowest mode that satisfies the user request.

| Request | Mode |
| --- | --- |
| Define or revise diagnosis scope | Product scope mode |
| Build or review public Vercel SEO frontend | Vercel SEO frontend mode |
| Build or review crawler checks | Local diagnostics mode |
| Build or review Google Search Console integration | GSC diagnostics mode |
| Review implementation readiness | Release review mode |
| Analyze Search Console observations | Visibility analysis mode |
| Build the whole tool | Full workflow |

## Full Workflow

1. Create `_workspace/` if it does not exist.
2. Apply `.codex/roles/diagnosis-product-architect.md`.
3. Write `_workspace/01_diagnosis_scope.md` and `_workspace/02_check_matrix.md`.
4. Apply `.codex/skills/vercel-seo-frontend/SKILL.md`.
5. Apply `.codex/skills/local-seo-diagnostics/SKILL.md`.
6. Apply `.codex/skills/gsc-visibility-diagnostics/SKILL.md`.
7. Implement the app according to the approved scope and the repository's existing stack.
8. Apply `.codex/skills/diagnostic-release-review/SKILL.md`.
9. Fix every FAIL before reporting readiness.
10. After real Search Console observations exist, apply `.codex/skills/visibility-growth-analysis/SKILL.md`.

## Product Guardrails

- Search visibility comes before ranking optimization.
- URL-only checks can reveal blockers but cannot prove actual query exposure.
- Actual keyword exposure requires Google Search Console data from a user-authorized property.
- Local crawling belongs in a local backend, not in browser-only code.
- The public Vercel frontend must stay useful and SEO-friendly when the local backend is absent.
- Diagnosis controls must be disabled when the local backend health check fails.
- One-time GSC inspection should not require refresh-token storage.
- Paid-data checks must be marked as Payment required.

## Output Standard

Every report should include:

- target domain or URL
- data source
- check result
- severity
- evidence
- recommendation
- limitation, if the check is partial or unavailable
