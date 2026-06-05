import { describe, expect, it } from "vitest";
import { buildGscFindings } from "../../server/checks/google-search-console";

describe("Google Search Console findings", () => {
  it("reports indexed URLs and observed search queries", () => {
    const findings = buildGscFindings("https://example.com/", {
      propertyConnected: true,
      inspection: {
        coverageState: "Submitted and indexed",
        indexingState: "INDEXING_ALLOWED",
        robotsTxtState: "ALLOWED",
        pageFetchState: "SUCCESSFUL",
        googleCanonical: "https://example.com/",
        userCanonical: "https://example.com/",
        sitemap: ["https://example.com/sitemap.xml"]
      },
      searchAnalytics: {
        rows: [
          {
            keys: ["seo analysis"],
            clicks: 3,
            impressions: 25,
            ctr: 0.12,
            position: 8.4
          }
        ]
      }
    });

    expect(findings.find((finding) => finding.checkId === "gsc.property_connected")).toMatchObject({
      status: "PASS"
    });
    expect(findings.find((finding) => finding.checkId === "gsc.url_index_status")).toMatchObject({
      status: "PASS",
      evidence: { coverageState: "Submitted and indexed" }
    });
    expect(findings.find((finding) => finding.checkId === "exposure.search_queries")).toMatchObject({
      status: "PASS",
      evidence: {
        queryCount: 1,
        topQueries: [{ query: "seo analysis", clicks: 3, impressions: 25, ctr: 0.12, position: 8.4 }]
      }
    });
  });
});
