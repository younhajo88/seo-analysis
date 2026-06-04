# Search Visibility Diagnosis Harness

## Mission

Build and maintain a Vercel-deployable SEO-friendly public frontend plus a local-first SEO diagnosis tool for site owners and developers who need to know whether their own site can appear in Google Search, which keywords already expose it, and what must be fixed before ranking work matters.

The public frontend should itself be crawlable, indexable, and useful in Google Search. Diagnosis execution requires a running local backend. The harness prioritizes search visibility over generic SEO scoring.

## Team Pattern

Use a supervisor workflow:

1. Product scope and diagnosis model
2. Public Vercel SEO frontend
3. Local crawler and technical checks
4. Google Search Console visibility checks
5. Release review and evidence validation
6. Post-observation visibility analysis

## Roles

| Role | File | Purpose |
| --- | --- | --- |
| Diagnosis Product Architect | `.codex/roles/diagnosis-product-architect.md` | Preserve the product scope and diagnostic taxonomy |
| Public Frontend SEO Architect | `.codex/roles/public-frontend-seo-architect.md` | Design the crawlable Vercel frontend and no-backend diagnosis disabled state |
| Next.js SEO Builder | `.codex/roles/nextjs-seo-builder.md` | Implement the public frontend using Next.js App Router SEO rules |
| Local Crawler Engineer | `.codex/roles/local-crawler-engineer.md` | Design and implement local URL, robots, sitemap, HTML, and crawl checks |
| GSC Integration Engineer | `.codex/roles/gsc-integration-engineer.md` | Implement Google OAuth, Search Console API, and URL Inspection workflows |
| Diagnostic Reviewer | `.codex/roles/diagnostic-reviewer.md` | Review implemented checks before readiness is claimed |
| Visibility Analyst | `.codex/roles/visibility-analyst.md` | Interpret Search Console observations and recommend next actions |

## Skills

| Skill | File | Use |
| --- | --- | --- |
| Search Visibility Harness | `.codex/skills/search-visibility-harness/SKILL.md` | Run the full local-first diagnosis product workflow |
| Vercel SEO Frontend | `.codex/skills/vercel-seo-frontend/SKILL.md` | Build or review the public Vercel frontend for search visibility |
| Local SEO Diagnostics | `.codex/skills/local-seo-diagnostics/SKILL.md` | Build or review local crawler-based checks |
| GSC Visibility Diagnostics | `.codex/skills/gsc-visibility-diagnostics/SKILL.md` | Build or review Search Console and URL Inspection checks |
| Diagnostic Release Review | `.codex/skills/diagnostic-release-review/SKILL.md` | Validate implementation before calling it ready |
| Visibility Growth Analysis | `.codex/skills/visibility-growth-analysis/SKILL.md` | Analyze collected GSC observations after a site has data |

## Core References

Always preserve alignment with:

- `_workspace/00_implementation_status.md`
- `docs/search-visibility-diagnosis.md`
- `docs/search-visibility-diagnosis.ko.md`

## Guardrails

- Do not turn the product into a generic SEO score checker.
- Do not claim keyword exposure from URL-only crawling.
- Do not claim Search Console data without a user-authorized property.
- Do not store refresh tokens unless the user explicitly asks for background monitoring or scheduled checks.
- Do not make diagnosis execution depend on the Vercel server. Diagnosis requires the user's local backend.
- Do keep the Vercel frontend useful, crawlable, and indexable even when diagnosis is disabled.
- Do not treat backlink, domain authority, SERP rank tracking, or competitor comparison as core visibility checks.
- Separate observed facts from hypotheses.
- Separate crawl/index blockers from ranking-support recommendations.
- Update `_workspace/00_implementation_status.md` whenever a phase, verification result, deployment, Search Console state, or implementation status changes.
