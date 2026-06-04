import { describe, expect, it } from "vitest";
import { buildReachFindings } from "../../server/checks/reach";
import type { FetchUrlResult } from "../../server/services/fetch-url";

function result(overrides: Partial<FetchUrlResult>): FetchUrlResult {
  return {
    targetUrl: "https://example.com/",
    finalUrl: "https://example.com/",
    statusCode: 200,
    redirects: [],
    bodyText: "",
    truncated: false,
    ...overrides
  };
}

describe("reach findings", () => {
  it("passes http status for successful responses", () => {
    const findings = buildReachFindings(result({ statusCode: 200 }));

    expect(findings.find((finding) => finding.checkId === "reach.http_status")).toMatchObject({
      status: "PASS",
      severity: "critical",
      evidence: { statusCode: 200 }
    });
  });

  it("fails http status for not found and server errors", () => {
    const findings = buildReachFindings(result({ statusCode: 404 }));

    expect(findings.find((finding) => finding.checkId === "reach.http_status")).toMatchObject({
      status: "FAIL",
      severity: "critical"
    });
  });

  it("warns when the final URL differs from the requested URL", () => {
    const findings = buildReachFindings(
      result({
        targetUrl: "https://example.com/old",
        finalUrl: "https://example.com/new",
        redirects: [{ from: "https://example.com/old", to: "https://example.com/new", statusCode: 301 }]
      })
    );

    expect(findings.find((finding) => finding.checkId === "reach.redirect_chain")).toMatchObject({
      status: "WARN",
      evidence: { redirectCount: 1 }
    });
    expect(findings.find((finding) => finding.checkId === "reach.final_url_expected")).toMatchObject({
      status: "WARN"
    });
  });

  it("passes https availability and http to https redirects", () => {
    const findings = buildReachFindings(
      result({
        targetUrl: "http://example.com/",
        finalUrl: "https://example.com/",
        redirects: [{ from: "http://example.com/", to: "https://example.com/", statusCode: 301 }]
      })
    );

    expect(findings.find((finding) => finding.checkId === "reach.https_available")).toMatchObject({
      status: "PASS"
    });
    expect(findings.find((finding) => finding.checkId === "reach.http_to_https")).toMatchObject({
      status: "PASS"
    });
  });

  it("warns when an http URL does not upgrade to https", () => {
    const findings = buildReachFindings(
      result({
        targetUrl: "http://example.com/",
        finalUrl: "http://example.com/"
      })
    );

    expect(findings.find((finding) => finding.checkId === "reach.https_available")).toMatchObject({
      status: "FAIL"
    });
    expect(findings.find((finding) => finding.checkId === "reach.http_to_https")).toMatchObject({
      status: "WARN"
    });
  });
});
