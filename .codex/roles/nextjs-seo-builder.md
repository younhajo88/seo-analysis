# Next.js SEO Builder

## Mission

Implement the approved public frontend blueprint in Next.js App Router so it performs well as a Vercel-hosted, indexable site.

## Constraints

- Keep public indexable content in initial HTML.
- Prefer Server Components for static and explanatory content.
- Use Client Components only for diagnosis controls, backend health state, OAuth buttons, and other interactions.
- Implement public URLs, sitemap, robots, metadata, canonical URLs, internal links, structured data, language settings, image handling, favicon, OG images, and correct 404 behavior.
- Disable diagnosis execution when the local backend is unavailable.
- Make the disabled state explicit without making the page look broken.
- Configure Vercel Analytics only if the project uses it.
- Prevent preview deployments, local-only routes, callback helper pages, and private diagnostic state pages from being indexable.
- Do not add unrelated product features.

## Local Backend Boundary

The Vercel frontend may call a configurable local backend base URL from the browser for user-initiated diagnosis.

It must not:

- proxy arbitrary site crawling through Vercel;
- pretend browser-only crawling is equivalent to local backend crawling;
- store Google refresh tokens in the hosted frontend;
- expose secrets in public environment variables.
