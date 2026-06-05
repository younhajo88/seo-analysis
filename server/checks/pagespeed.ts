import type { DiagnosisFinding, FindingStatus } from "../types";

export type PageSpeedResult = {
  lighthouseResult?: {
    categories?: Record<string, { score?: number }>;
    audits?: Record<string, { numericValue?: number }>;
  };
};

export function buildPageSpeedFindings(targetUrl: string, result: PageSpeedResult): DiagnosisFinding[] {
  const categories = result.lighthouseResult?.categories ?? {};
  const audits = result.lighthouseResult?.audits ?? {};
  const lcp = audits["largest-contentful-paint"]?.numericValue ?? null;
  const cls = audits["cumulative-layout-shift"]?.numericValue ?? null;
  const interactive = audits.interactive?.numericValue ?? null;
  const seo = scorePercent(categories.seo?.score);
  const accessibility = scorePercent(categories.accessibility?.score);

  return [
    finding("perf.pagespeed_available", targetUrl, "PASS", { available: true }, "No action required."),
    finding(
      "perf.lcp",
      targetUrl,
      lcp === null ? "UNAVAILABLE" : lcp <= 2500 ? "PASS" : lcp <= 4000 ? "WARN" : "FAIL",
      { milliseconds: lcp },
      lcp === null ? "Connect PageSpeed Insights or CrUX data to evaluate LCP." : "Review Largest Contentful Paint."
    ),
    finding(
      "perf.inp",
      targetUrl,
      interactive === null ? "UNAVAILABLE" : interactive <= 3800 ? "PASS" : "WARN",
      { lighthouseInteractiveMs: interactive },
      "Use field INP data when available; Lighthouse interactive timing is only a lab proxy."
    ),
    finding(
      "perf.cls",
      targetUrl,
      cls === null ? "UNAVAILABLE" : cls <= 0.1 ? "PASS" : cls <= 0.25 ? "WARN" : "FAIL",
      { score: cls },
      cls === null ? "Connect PageSpeed Insights or CrUX data to evaluate CLS." : "Review Cumulative Layout Shift."
    ),
    finding(
      "perf.lighthouse_seo",
      targetUrl,
      seo === null ? "UNAVAILABLE" : seo >= 90 ? "PASS" : seo >= 70 ? "WARN" : "FAIL",
      { score: seo },
      seo === null ? "Connect PageSpeed Insights to evaluate Lighthouse SEO." : "Review Lighthouse SEO audits."
    ),
    finding(
      "perf.lighthouse_accessibility",
      targetUrl,
      accessibility === null ? "UNAVAILABLE" : accessibility >= 90 ? "PASS" : accessibility >= 70 ? "WARN" : "FAIL",
      { score: accessibility },
      accessibility === null
        ? "Connect PageSpeed Insights to evaluate Lighthouse accessibility."
        : "Review Lighthouse accessibility audits."
    )
  ];
}

function scorePercent(score: number | undefined) {
  return typeof score === "number" ? Math.round(score * 100) : null;
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
    category: "performance",
    source: "system",
    status,
    severity: "info",
    target,
    evidence,
    recommendation,
    limitation: null
  };
}
