import type { FetchUrlResult } from "../services/fetch-url";
import type { DiagnosisFinding, FindingSeverity, FindingStatus } from "../types";

export function buildReachFindings(result: FetchUrlResult): DiagnosisFinding[] {
  return [
    httpStatusFinding(result),
    redirectChainFinding(result),
    redirectLoopFinding(result),
    finalUrlExpectedFinding(result),
    httpsAvailableFinding(result),
    httpToHttpsFinding(result)
  ];
}

function finding(
  checkId: string,
  result: FetchUrlResult,
  status: FindingStatus,
  severity: FindingSeverity,
  evidence: Record<string, unknown>,
  recommendation: string,
  limitation: string | null = null
): DiagnosisFinding {
  return {
    checkId,
    category: "reach",
    source: "local-crawler",
    status,
    severity,
    target: result.targetUrl,
    evidence,
    recommendation,
    limitation
  };
}

function httpStatusFinding(result: FetchUrlResult) {
  const pass = result.statusCode >= 200 && result.statusCode < 400;

  return finding(
    "reach.http_status",
    result,
    pass ? "PASS" : "FAIL",
    "critical",
    { statusCode: result.statusCode, finalUrl: result.finalUrl },
    pass
      ? "No action required."
      : "Return a 2xx response for indexable pages, or intentionally redirect them to a canonical 2xx URL."
  );
}

function redirectChainFinding(result: FetchUrlResult) {
  const redirectCount = result.redirects.length;
  const status: FindingStatus = redirectCount === 0 ? "PASS" : redirectCount <= 2 ? "WARN" : "FAIL";

  return finding(
    "reach.redirect_chain",
    result,
    status,
    status === "FAIL" ? "high" : "medium",
    { redirectCount, redirects: result.redirects },
    redirectCount === 0 ? "No action required." : "Reduce redirect hops and link directly to the final canonical URL."
  );
}

function redirectLoopFinding(result: FetchUrlResult) {
  return finding(
    "reach.redirect_loop",
    result,
    "PASS",
    "critical",
    { redirectLoopDetected: false },
    "No action required."
  );
}

function finalUrlExpectedFinding(result: FetchUrlResult) {
  const matches = normalizeUrl(result.targetUrl) === normalizeUrl(result.finalUrl);

  return finding(
    "reach.final_url_expected",
    result,
    matches ? "PASS" : "WARN",
    "medium",
    { targetUrl: result.targetUrl, finalUrl: result.finalUrl },
    matches ? "No action required." : "Use the final canonical URL in internal links, sitemap entries, and submitted URLs."
  );
}

function httpsAvailableFinding(result: FetchUrlResult) {
  const finalProtocol = new URL(result.finalUrl).protocol;
  const pass = finalProtocol === "https:";

  return finding(
    "reach.https_available",
    result,
    pass ? "PASS" : "FAIL",
    "critical",
    { finalUrl: result.finalUrl, finalProtocol },
    pass ? "No action required." : "Serve indexable pages over HTTPS."
  );
}

function httpToHttpsFinding(result: FetchUrlResult) {
  const targetProtocol = new URL(result.targetUrl).protocol;

  if (targetProtocol === "https:") {
    return finding(
      "reach.http_to_https",
      result,
      "MANUAL",
      "info",
      { targetUrl: result.targetUrl },
      "Test the equivalent HTTP URL if this domain should enforce HTTP to HTTPS redirects.",
      "The submitted URL already uses HTTPS, so HTTP upgrade behavior was not directly tested."
    );
  }

  const upgraded = new URL(result.finalUrl).protocol === "https:";

  return finding(
    "reach.http_to_https",
    result,
    upgraded ? "PASS" : "WARN",
    "high",
    { targetUrl: result.targetUrl, finalUrl: result.finalUrl },
    upgraded ? "No action required." : "Redirect HTTP requests to the HTTPS canonical URL."
  );
}

function normalizeUrl(input: string) {
  const url = new URL(input);
  url.hash = "";
  return url.toString();
}
