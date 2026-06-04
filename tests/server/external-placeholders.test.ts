import { describe, expect, it } from "vitest";
import {
  buildGscUnavailableFindings,
  buildPaidAndHumanFindings,
  buildPerformanceUnavailableFindings
} from "../../server/checks/external-placeholders";

describe("external and unavailable findings", () => {
  it("reports PageSpeed checks as unavailable until configured", () => {
    const findings = buildPerformanceUnavailableFindings("https://example.com/");

    expect(findings.map((finding) => finding.checkId)).toEqual([
      "perf.pagespeed_available",
      "perf.lcp",
      "perf.inp",
      "perf.cls",
      "perf.lighthouse_seo",
      "perf.lighthouse_accessibility"
    ]);
    expect(findings.every((finding) => finding.status === "UNAVAILABLE")).toBe(true);
  });

  it("reports GSC checks as unavailable until a property is connected", () => {
    const findings = buildGscUnavailableFindings("https://example.com/");

    expect(findings.map((finding) => finding.checkId)).toEqual([
      "gsc.property_connected",
      "gsc.url_index_status",
      "gsc.google_canonical",
      "gsc.crawl_verdict",
      "gsc.indexing_verdict",
      "exposure.search_queries"
    ]);
    expect(findings.every((finding) => finding.status === "UNAVAILABLE")).toBe(true);
  });

  it("marks paid data as payment required and human judgment as manual", () => {
    const findings = buildPaidAndHumanFindings("https://example.com/");

    expect(findings.find((finding) => finding.checkId === "authority.backlinks")).toMatchObject({
      status: "UNAVAILABLE",
      limitation: "Payment required."
    });
    expect(findings.find((finding) => finding.checkId === "page.intent_match")).toMatchObject({
      status: "MANUAL"
    });
  });
});
