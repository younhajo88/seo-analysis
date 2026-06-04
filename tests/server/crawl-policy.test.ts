import { describe, expect, it } from "vitest";
import { buildCrawlPolicyFindings } from "../../server/checks/crawl-policy";
import type { FetchUrlResult } from "../../server/services/fetch-url";

function robotsResult(overrides: Partial<FetchUrlResult>): FetchUrlResult {
  return {
    targetUrl: "https://example.com/robots.txt",
    finalUrl: "https://example.com/robots.txt",
    statusCode: 200,
    redirects: [],
    bodyText: "User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml\n",
    truncated: false,
    ...overrides
  };
}

describe("crawl policy findings", () => {
  it("passes when robots.txt exists, allows Googlebot, and declares a sitemap", () => {
    const findings = buildCrawlPolicyFindings("https://example.com/page", robotsResult({}));

    expect(findings.find((finding) => finding.checkId === "crawl.robots_exists")).toMatchObject({
      status: "PASS",
      severity: "critical"
    });
    expect(findings.find((finding) => finding.checkId === "crawl.robots_googlebot_allowed")).toMatchObject({
      status: "PASS",
      evidence: { googlebotAllowed: true }
    });
    expect(findings.find((finding) => finding.checkId === "crawl.robots_sitemap_declared")).toMatchObject({
      status: "PASS",
      evidence: { sitemapUrls: ["https://example.com/sitemap.xml"] }
    });
  });

  it("fails when robots.txt is missing", () => {
    const findings = buildCrawlPolicyFindings(
      "https://example.com/page",
      robotsResult({ statusCode: 404, bodyText: "Not found" })
    );

    expect(findings.find((finding) => finding.checkId === "crawl.robots_exists")).toMatchObject({
      status: "FAIL",
      evidence: { statusCode: 404 }
    });
    expect(findings.find((finding) => finding.checkId === "crawl.robots_googlebot_allowed")).toMatchObject({
      status: "UNAVAILABLE"
    });
  });

  it("fails when Googlebot is disallowed for the target path", () => {
    const findings = buildCrawlPolicyFindings(
      "https://example.com/private/page",
      robotsResult({
        bodyText: "User-agent: Googlebot\nDisallow: /private/\nSitemap: https://example.com/sitemap.xml\n"
      })
    );

    expect(findings.find((finding) => finding.checkId === "crawl.robots_googlebot_allowed")).toMatchObject({
      status: "FAIL",
      evidence: { googlebotAllowed: false, matchedRule: { directive: "disallow", path: "/private/" } }
    });
  });

  it("warns when robots.txt does not declare a sitemap", () => {
    const findings = buildCrawlPolicyFindings(
      "https://example.com/page",
      robotsResult({ bodyText: "User-agent: *\nAllow: /\n" })
    );

    expect(findings.find((finding) => finding.checkId === "crawl.robots_sitemap_declared")).toMatchObject({
      status: "WARN",
      evidence: { sitemapUrls: [] }
    });
  });
});
