import type { GscDiagnosisData, GscInspectionResult, GscSearchAnalyticsResult } from "../checks/google-search-console";

type FetchImpl = typeof fetch;

export type FetchGscDiagnosisDataOptions = {
  accessToken: string;
  targetUrl: string;
  fetchImpl?: FetchImpl;
};

type SitesResponse = {
  siteEntry?: Array<{ siteUrl?: string }>;
};

type UrlInspectionResponse = {
  inspectionResult?: {
    indexStatusResult?: GscInspectionResult;
  };
};

export async function fetchGscDiagnosisData(options: FetchGscDiagnosisDataOptions): Promise<GscDiagnosisData> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const siteUrl = await findMatchingSiteUrl(options.targetUrl, options.accessToken, fetchImpl);

  if (!siteUrl) {
    return {
      propertyConnected: false,
      inspection: null,
      searchAnalytics: null
    };
  }

  const [inspection, searchAnalytics] = await Promise.all([
    fetchUrlInspection(siteUrl, options.targetUrl, options.accessToken, fetchImpl),
    fetchSearchAnalytics(siteUrl, options.accessToken, fetchImpl)
  ]);

  return {
    propertyConnected: true,
    inspection,
    searchAnalytics
  };
}

async function findMatchingSiteUrl(targetUrl: string, accessToken: string, fetchImpl: FetchImpl) {
  const response = await googleFetch("https://www.googleapis.com/webmasters/v3/sites", accessToken, fetchImpl);
  const body = (await response.json()) as SitesResponse;
  const target = new URL(targetUrl);
  const candidates = body.siteEntry?.map((entry) => entry.siteUrl).filter((siteUrl): siteUrl is string => Boolean(siteUrl)) ?? [];

  return candidates.find((siteUrl) => siteMatchesTarget(siteUrl, target)) ?? null;
}

async function fetchUrlInspection(siteUrl: string, inspectionUrl: string, accessToken: string, fetchImpl: FetchImpl) {
  const response = await googleFetch(
    "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
    accessToken,
    fetchImpl,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        inspectionUrl,
        siteUrl
      })
    }
  );
  const body = (await response.json()) as UrlInspectionResponse;
  return body.inspectionResult?.indexStatusResult ?? null;
}

async function fetchSearchAnalytics(siteUrl: string, accessToken: string, fetchImpl: FetchImpl) {
  const endDate = new Date();
  endDate.setUTCDate(endDate.getUTCDate() - 2);
  const startDate = new Date(endDate);
  startDate.setUTCDate(startDate.getUTCDate() - 28);

  const response = await googleFetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    accessToken,
    fetchImpl,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: ["query"],
        rowLimit: 10
      })
    }
  );

  return (await response.json()) as GscSearchAnalyticsResult;
}

async function googleFetch(url: string, accessToken: string, fetchImpl: FetchImpl, init: RequestInit = {}) {
  const response = await fetchImpl(url, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`Google API request failed with ${response.status}.`);
  }

  return response;
}

function siteMatchesTarget(siteUrl: string, target: URL) {
  if (siteUrl.startsWith("sc-domain:")) {
    return target.hostname === siteUrl.replace("sc-domain:", "") || target.hostname.endsWith(`.${siteUrl.replace("sc-domain:", "")}`);
  }

  try {
    return new URL(siteUrl).origin === target.origin;
  } catch {
    return false;
  }
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
