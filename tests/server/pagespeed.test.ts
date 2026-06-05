import { describe, expect, it } from "vitest";
import { buildPageSpeedFindings } from "../../server/checks/pagespeed";

describe("PageSpeed findings", () => {
  it("reports Lighthouse and Core Web Vitals values", () => {
    const findings = buildPageSpeedFindings("https://example.com/", {
      lighthouseResult: {
        categories: {
          performance: { score: 0.91 },
          seo: { score: 1 },
          accessibility: { score: 0.86 }
        },
        audits: {
          "largest-contentful-paint": { numericValue: 1800 },
          "cumulative-layout-shift": { numericValue: 0.04 },
          "interactive": { numericValue: 2500 }
        }
      }
    });

    expect(findings.find((finding) => finding.checkId === "perf.pagespeed_available")).toMatchObject({
      status: "PASS"
    });
    expect(findings.find((finding) => finding.checkId === "perf.lcp")).toMatchObject({
      status: "PASS",
      evidence: { milliseconds: 1800 }
    });
    expect(findings.find((finding) => finding.checkId === "perf.cls")).toMatchObject({
      status: "PASS",
      evidence: { score: 0.04 }
    });
    expect(findings.find((finding) => finding.checkId === "perf.lighthouse_seo")).toMatchObject({
      status: "PASS",
      evidence: { score: 100 }
    });
  });
});
