import type { PageSpeedResult } from "../checks/pagespeed";

type FetchImpl = typeof fetch;

export type PageSpeedClientOptions = {
  apiKey?: string | null;
  fetchImpl?: FetchImpl;
};

export async function fetchPageSpeedResult(targetUrl: string, options: PageSpeedClientOptions = {}): Promise<PageSpeedResult> {
  const url = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  url.searchParams.set("url", targetUrl);
  url.searchParams.set("strategy", "mobile");
  url.searchParams.append("category", "performance");
  url.searchParams.append("category", "seo");
  url.searchParams.append("category", "accessibility");

  if (options.apiKey) {
    url.searchParams.set("key", options.apiKey);
  }

  const response = await (options.fetchImpl ?? fetch)(url);

  if (!response.ok) {
    throw new Error(`PageSpeed request failed with ${response.status}.`);
  }

  return response.json() as Promise<PageSpeedResult>;
}
