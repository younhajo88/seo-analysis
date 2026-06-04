import type { DiagnosisFinding, FindingSeverity, FindingStatus } from "../types";

export function buildPerformanceUnavailableFindings(targetUrl: string): DiagnosisFinding[] {
  return [
    unavailable("perf.pagespeed_available", "performance", targetUrl, "Configure PageSpeed Insights API access before running performance checks."),
    unavailable("perf.lcp", "performance", targetUrl, "Connect PageSpeed Insights or CrUX data to evaluate LCP."),
    unavailable("perf.inp", "performance", targetUrl, "Connect PageSpeed Insights or CrUX data to evaluate INP."),
    unavailable("perf.cls", "performance", targetUrl, "Connect PageSpeed Insights or CrUX data to evaluate CLS."),
    unavailable("perf.lighthouse_seo", "performance", targetUrl, "Connect PageSpeed Insights to evaluate Lighthouse SEO."),
    unavailable(
      "perf.lighthouse_accessibility",
      "performance",
      targetUrl,
      "Connect PageSpeed Insights to evaluate Lighthouse accessibility."
    )
  ];
}

export function buildGscUnavailableFindings(targetUrl: string): DiagnosisFinding[] {
  return [
    unavailable("gsc.property_connected", "gsc", targetUrl, "Connect a verified Google Search Console property."),
    unavailable("gsc.url_index_status", "gsc", targetUrl, "Connect Search Console URL Inspection API access."),
    unavailable("gsc.google_canonical", "gsc", targetUrl, "Connect Search Console URL Inspection API access."),
    unavailable("gsc.crawl_verdict", "gsc", targetUrl, "Connect Search Console URL Inspection API access."),
    unavailable("gsc.indexing_verdict", "gsc", targetUrl, "Connect Search Console URL Inspection API access."),
    unavailable("exposure.search_queries", "gsc", targetUrl, "Connect Search Console Search Analytics API access.")
  ];
}

export function buildPaidAndHumanFindings(targetUrl: string): DiagnosisFinding[] {
  return [
    unavailable("authority.backlinks", "unavailable", targetUrl, "Use a paid backlink data provider.", "Payment required."),
    unavailable("authority.domain", "unavailable", targetUrl, "Use a paid authority metric provider.", "Payment required."),
    unavailable("serp.rank_tracking", "unavailable", targetUrl, "Use a SERP rank tracking provider.", "Payment required."),
    manual("page.intent_match", targetUrl, "Review whether the page satisfies the target search intent."),
    manual("page.information_completeness", targetUrl, "Compare the page with the user's target query and competing results.")
  ];
}

function unavailable(
  checkId: string,
  category: DiagnosisFinding["category"],
  target: string,
  recommendation: string,
  limitation = "Requires external API configuration or unavailable data source."
) {
  return finding(checkId, category, target, "UNAVAILABLE", "info", recommendation, limitation);
}

function manual(checkId: string, target: string, recommendation: string) {
  return finding(checkId, "manual", target, "MANUAL", "info", recommendation, "Requires human review.");
}

function finding(
  checkId: string,
  category: DiagnosisFinding["category"],
  target: string,
  status: FindingStatus,
  severity: FindingSeverity,
  recommendation: string,
  limitation: string
): DiagnosisFinding {
  return {
    checkId,
    category,
    source: "system",
    status,
    severity,
    target,
    evidence: { automated: false },
    recommendation,
    limitation
  };
}
