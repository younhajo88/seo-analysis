import { describe, expect, it } from "vitest";
import { buildSitemapFindings, parseSitemap } from "../../server/checks/sitemap";
import type { FetchUrlResult } from "../../server/services/fetch-url";

function sitemapResult(bodyText: string, overrides: Partial<FetchUrlResult> = {}): FetchUrlResult {
  return {
    targetUrl: "https://example.com/sitemap.xml",
    finalUrl: "https://example.com/sitemap.xml",
    statusCode: 200,
    redirects: [],
    headers: { "content-type": "application/xml" },
    bodyText,
    truncated: false,
    ...overrides
  };
}

describe("sitemap findings", () => {
  it("parses urlset sitemap URLs and lastmod values", () => {
    const parsed = parseSitemap(`
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>https://example.com/</loc><lastmod>2026-06-04</lastmod></url>
        <url><loc>https://example.com/about</loc></url>
      </urlset>
    `);

    expect(parsed.kind).toBe("urlset");
    expect(parsed.urls).toEqual([
      { loc: "https://example.com/", lastmod: "2026-06-04" },
      { loc: "https://example.com/about", lastmod: null }
    ]);
  });

  it("passes for a fetchable sitemap that includes the target canonical URL", () => {
    const result = sitemapResult(`
      <urlset>
        <url><loc>https://example.com/page</loc><lastmod>2026-06-04</lastmod></url>
      </urlset>
    `);
    const findings = buildSitemapFindings("https://example.com/page", result, [
      { loc: "https://example.com/page", statusCode: 200, finalUrl: "https://example.com/page" }
    ]);

    expect(findings.find((finding) => finding.checkId === "sitemap.exists")).toMatchObject({ status: "PASS" });
    expect(findings.find((finding) => finding.checkId === "sitemap.fetchable")).toMatchObject({ status: "PASS" });
    expect(findings.find((finding) => finding.checkId === "sitemap.index_supported")).toMatchObject({
      status: "PASS"
    });
    expect(findings.find((finding) => finding.checkId === "sitemap.urls_status")).toMatchObject({ status: "PASS" });
    expect(findings.find((finding) => finding.checkId === "sitemap.lastmod_present")).toMatchObject({
      status: "PASS"
    });
    expect(findings.find((finding) => finding.checkId === "sitemap.canonical_consistency")).toMatchObject({
      status: "PASS"
    });
  });

  it("flags URL errors, redirects, missing lastmod, and missing target URL", () => {
    const result = sitemapResult(`
      <urlset>
        <url><loc>https://example.com/old</loc></url>
      </urlset>
    `);
    const findings = buildSitemapFindings("https://example.com/page", result, [
      { loc: "https://example.com/old", statusCode: 301, finalUrl: "https://example.com/new" }
    ]);

    expect(findings.find((finding) => finding.checkId === "sitemap.urls_status")).toMatchObject({ status: "WARN" });
    expect(findings.find((finding) => finding.checkId === "sitemap.urls_redirect")).toMatchObject({ status: "WARN" });
    expect(findings.find((finding) => finding.checkId === "sitemap.lastmod_present")).toMatchObject({
      status: "WARN"
    });
    expect(findings.find((finding) => finding.checkId === "sitemap.canonical_consistency")).toMatchObject({
      status: "WARN"
    });
  });

  it("returns unavailable findings when sitemap is not declared", () => {
    const findings = buildSitemapFindings("https://example.com/page", null, []);

    expect(findings.every((finding) => finding.status === "UNAVAILABLE")).toBe(true);
  });
});
