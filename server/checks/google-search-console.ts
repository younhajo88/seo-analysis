import type { DiagnosisFinding, FindingStatus } from "../types";

export type GscInspectionResult = {
  coverageState?: string;
  indexingState?: string;
  robotsTxtState?: string;
  pageFetchState?: string;
  googleCanonical?: string;
  userCanonical?: string;
  sitemap?: string[];
};

export type GscSearchAnalyticsResult = {
  rows?: Array<{
    keys?: string[];
    clicks?: number;
    impressions?: number;
    ctr?: number;
    position?: number;
  }>;
};

export type GscDiagnosisData = {
  propertyConnected: boolean;
  inspection: GscInspectionResult | null;
  searchAnalytics: GscSearchAnalyticsResult | null;
};

export function buildGscFindings(targetUrl: string, data: GscDiagnosisData): DiagnosisFinding[] {
  const inspection = data.inspection;
  const analyticsRows = data.searchAnalytics?.rows ?? [];
  const topQueries = analyticsRows.slice(0, 10).map((row) => ({
    query: row.keys?.[0] ?? "",
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: row.ctr ?? 0,
    position: row.position ?? 0
  }));

  return [
    finding(
      "gsc.property_connected",
      targetUrl,
      data.propertyConnected ? "PASS" : "UNAVAILABLE",
      { propertyConnected: data.propertyConnected },
      data.propertyConnected ? "No action required." : "Connect a verified Google Search Console property."
    ),
    finding(
      "gsc.url_index_status",
      targetUrl,
      inspection ? statusForCoverage(inspection.coverageState) : "UNAVAILABLE",
      {
        coverageState: inspection?.coverageState ?? null,
        indexingState: inspection?.indexingState ?? null
      },
      inspection ? "Review the URL Inspection verdict." : "Connect Search Console URL Inspection API access."
    ),
    finding(
      "gsc.google_canonical",
      targetUrl,
      inspection?.googleCanonical ? "PASS" : "UNAVAILABLE",
      {
        googleCanonical: inspection?.googleCanonical ?? null,
        userCanonical: inspection?.userCanonical ?? null
      },
      inspection?.googleCanonical ? "No action required." : "Connect Search Console URL Inspection API access."
    ),
    finding(
      "gsc.crawl_verdict",
      targetUrl,
      inspection ? statusForPositiveVerdict(inspection.robotsTxtState === "ALLOWED" && inspection.pageFetchState === "SUCCESSFUL") : "UNAVAILABLE",
      {
        robotsTxtState: inspection?.robotsTxtState ?? null,
        pageFetchState: inspection?.pageFetchState ?? null
      },
      inspection ? "Review crawl verdict details." : "Connect Search Console URL Inspection API access."
    ),
    finding(
      "gsc.indexing_verdict",
      targetUrl,
      inspection ? statusForPositiveVerdict(inspection.indexingState === "INDEXING_ALLOWED") : "UNAVAILABLE",
      { indexingState: inspection?.indexingState ?? null },
      inspection ? "Review indexing verdict details." : "Connect Search Console URL Inspection API access."
    ),
    finding(
      "exposure.search_queries",
      targetUrl,
      topQueries.length > 0 ? "PASS" : "WARN",
      { queryCount: topQueries.length, topQueries },
      topQueries.length > 0
        ? "No action required."
        : "Search Console has no query rows for this URL and date range yet."
    )
  ];
}

function statusForCoverage(coverageState: string | undefined): FindingStatus {
  if (!coverageState) {
    return "UNAVAILABLE";
  }

  return /indexed/i.test(coverageState) && !/not indexed/i.test(coverageState) ? "PASS" : "WARN";
}

function statusForPositiveVerdict(positive: boolean): FindingStatus {
  return positive ? "PASS" : "WARN";
}

function finding(
  checkId: string,
  target: string,
  status: FindingStatus,
  evidence: Record<string, unknown>,
  recommendation: string
): DiagnosisFinding {
  return {
    checkId,
    category: "gsc",
    source: "gsc",
    status,
    severity: "info",
    target,
    evidence,
    recommendation,
    limitation: null
  };
}
