---
name: visibility-growth-analysis
description: Use when analyzing Google Search Console observations, target keywords, indexed pages, impressions, clicks, CTR, average position, and local crawler findings to recommend evidence-based search visibility improvements.
---

# Visibility Growth Analysis

Read:

- `.codex/roles/visibility-analyst.md`
- `docs/search-visibility-diagnosis.md`

## Inputs

Use supplied or connected data only:

- Search Console query and page data
- URL Inspection results
- local crawler findings
- user-provided target domain and target keywords
- previous `_workspace/11_visibility_baseline.md` or `_workspace/12_visibility_review.md`

## Procedure

1. Stop and request Search Console observations if none are available.
2. Record the observation window and data source.
3. Separate facts from hypotheses.
4. Check for crawl and indexing blockers first.
5. Compare target keywords against actual query exposure.
6. Identify pages with no impressions, low CTR, or weak keyword alignment.
7. Prioritize small fixes before large content or authority work.
8. Write `_workspace/11_visibility_baseline.md` for first observations or `_workspace/12_visibility_review.md` for later reviews.

## Guardrails

- Do not invent impressions, clicks, CTR, or average positions.
- Do not overinterpret tiny datasets.
- Do not recommend backlink or authority work before index and exposure blockers are addressed.
- Label paid-data needs clearly.
