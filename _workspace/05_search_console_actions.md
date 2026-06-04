# Search Console Actions

## Current Production URL

```text
https://seo-analysis-two.vercel.app
```

## Sitemap URL

```text
https://seo-analysis-two.vercel.app/sitemap.xml
```

## What Codex Can Do

Codex can:

- add a Google Search Console verification meta tag if the user provides the token;
- add a Google verification HTML file if the user provides the required filename and content;
- redeploy the site after verification assets are added;
- verify that the verification file or meta tag is publicly reachable;
- submit sitemap through Search Console API if the user provides a short-lived OAuth access token for an already verified property.

Codex cannot:

- log into the user's Google account;
- click the Search Console verification button on behalf of the user;
- create DNS TXT records without the user's registrar or Vercel domain access;
- inspect Search Console data for an unverified property.

## Recommended Manual Flow

1. Open Google Search Console.
2. Add a URL-prefix property:

```text
https://seo-analysis-two.vercel.app/
```

3. Choose HTML tag verification or HTML file verification.
4. Send the verification token or file details to Codex.
5. Codex adds the verification asset and redeploys.
6. User clicks Verify in Search Console.
7. After verification succeeds, submit:

```text
https://seo-analysis-two.vercel.app/sitemap.xml
```

8. Use URL Inspection for:

```text
https://seo-analysis-two.vercel.app/
https://seo-analysis-two.vercel.app/diagnose
https://seo-analysis-two.vercel.app/guides/search-visibility
https://seo-analysis-two.vercel.app/guides/crawlability-indexability
https://seo-analysis-two.vercel.app/guides/google-search-console-keywords
https://seo-analysis-two.vercel.app/guides/robots-sitemap-checks
https://seo-analysis-two.vercel.app/guides/local-diagnosis-setup
```

## Optional API-Assisted Flow

If the property is already verified and the user provides a short-lived OAuth access token with this scope:

```text
https://www.googleapis.com/auth/webmasters
```

Codex can submit the sitemap through the Search Console API.

For read-only checks, this scope is enough:

```text
https://www.googleapis.com/auth/webmasters.readonly
```

Do not provide refresh tokens unless background monitoring is intentionally being implemented.
