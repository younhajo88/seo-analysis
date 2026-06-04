import { assertPublicHttpUrl } from "./url-safety";

export type RedirectHop = {
  from: string;
  to: string;
  statusCode: number;
};

export type FetchUrlResult = {
  targetUrl: string;
  finalUrl: string;
  statusCode: number;
  redirects: RedirectHop[];
  headers: Record<string, string>;
  bodyText: string;
  truncated: boolean;
};

export type FetchUrlOptions = {
  assertSafeUrl?: (input: string) => Promise<URL>;
  fetchImpl?: typeof fetch;
  maxRedirects?: number;
  maxResponseBytes?: number;
  timeoutMs?: number;
  userAgent?: string;
};

export class FetchUrlError extends Error {
  constructor(
    public readonly code: "REDIRECT_LOOP" | "MAX_REDIRECTS" | "FETCH_FAILED",
    message: string,
    public readonly redirects: RedirectHop[] = []
  ) {
    super(message);
    this.name = "FetchUrlError";
  }
}

const redirectStatuses = new Set([301, 302, 303, 307, 308]);

export async function fetchUrl(input: string, options: FetchUrlOptions = {}): Promise<FetchUrlResult> {
  const assertSafeUrl = options.assertSafeUrl ?? assertPublicHttpUrl;
  const fetchImpl = options.fetchImpl ?? fetch;
  const maxRedirects = options.maxRedirects ?? 10;
  const maxResponseBytes = options.maxResponseBytes ?? 2_097_152;
  const timeoutMs = options.timeoutMs ?? 10_000;
  const userAgent = options.userAgent ?? "SEOAnalysisBot/0.1 (+https://seo-analysis-two.vercel.app)";

  let currentUrl = (await assertSafeUrl(input)).toString();
  const seen = new Set([currentUrl]);
  const redirects: RedirectHop[] = [];

  for (let step = 0; step <= maxRedirects; step += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let response: Response;
    try {
      response = await fetchImpl(currentUrl, {
        redirect: "manual",
        signal: controller.signal,
        headers: { "user-agent": userAgent }
      });
    } catch (error) {
      throw new FetchUrlError("FETCH_FAILED", error instanceof Error ? error.message : "Fetch failed.", redirects);
    } finally {
      clearTimeout(timer);
    }

    if (redirectStatuses.has(response.status)) {
      const location = response.headers.get("location");

      if (!location) {
        return buildResult(input, currentUrl, response, redirects, maxResponseBytes);
      }

      if (redirects.length >= maxRedirects) {
        throw new FetchUrlError("MAX_REDIRECTS", "Maximum redirect count exceeded.", redirects);
      }

      const nextUrl = new URL(location, currentUrl).toString();
      await assertSafeUrl(nextUrl);

      if (seen.has(nextUrl)) {
        redirects.push({ from: currentUrl, to: nextUrl, statusCode: response.status });
        throw new FetchUrlError("REDIRECT_LOOP", "Redirect loop detected.", redirects);
      }

      redirects.push({ from: currentUrl, to: nextUrl, statusCode: response.status });
      seen.add(nextUrl);
      currentUrl = nextUrl;
      continue;
    }

    return buildResult(input, currentUrl, response, redirects, maxResponseBytes);
  }

  throw new FetchUrlError("MAX_REDIRECTS", "Maximum redirect count exceeded.", redirects);
}

async function buildResult(
  targetUrl: string,
  finalUrl: string,
  response: Response,
  redirects: RedirectHop[],
  maxResponseBytes: number
): Promise<FetchUrlResult> {
  const text = await response.text();
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  const truncated = bytes.length > maxResponseBytes;
  const bodyText = truncated ? new TextDecoder().decode(bytes.slice(0, maxResponseBytes)) : text;

  return {
    targetUrl,
    finalUrl,
    statusCode: response.status,
    redirects,
    headers: Object.fromEntries([...response.headers.entries()].map(([key, value]) => [key.toLowerCase(), value])),
    bodyText,
    truncated
  };
}
