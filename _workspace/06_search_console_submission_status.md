# Search Console Submission Status

## Property

```text
https://seo-analysis-two.vercel.app/
```

## Date

```text
2026-06-04
```

## Sitemap

Submitted in Search Console:

```text
/sitemap.xml
```

Current Search Console table status:

```text
가져올 수 없음
```

Independent verification from outside Search Console:

```text
https://seo-analysis-two.vercel.app/sitemap.xml
HTTP 200
Content-Type: application/xml
```

Robots declaration:

```text
Sitemap: https://seo-analysis-two.vercel.app/sitemap.xml
```

Interpretation:

- The sitemap file is publicly reachable and valid-looking from external checks.
- Search Console may need time to retry processing.
- Recheck the Sitemaps report later before changing the sitemap implementation.

## URL Inspection And Indexing Requests

Completed:

| URL | Live Test | Indexing Request |
| --- | --- | --- |
| `https://seo-analysis-two.vercel.app/` | URL can be indexed | Requested |
| `https://seo-analysis-two.vercel.app/diagnose` | URL can be indexed | Requested |

Checked but not requested due to quota:

| URL | Live Test | Indexing Request |
| --- | --- | --- |
| `https://seo-analysis-two.vercel.app/guides/search-visibility` | URL can be indexed | Blocked by daily quota |

Search Console message:

```text
할당량 초과
일일 할당량을 초과하여 이 요청을 처리할 수 없습니다. 내일 다시 제출해 주세요.
```

## Next Manual/Browser-Assisted Step

After the daily quota resets, request indexing for:

```text
https://seo-analysis-two.vercel.app/guides/search-visibility
https://seo-analysis-two.vercel.app/guides/crawlability-indexability
https://seo-analysis-two.vercel.app/guides/google-search-console-keywords
https://seo-analysis-two.vercel.app/guides/robots-sitemap-checks
https://seo-analysis-two.vercel.app/guides/local-diagnosis-setup
```

Then recheck the sitemap status in Search Console.
