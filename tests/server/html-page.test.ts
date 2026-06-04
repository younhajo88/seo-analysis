import { describe, expect, it } from "vitest";
import { buildHtmlPageFindings } from "../../server/checks/html-page";
import type { FetchUrlResult } from "../../server/services/fetch-url";

function pageResult(html: string, overrides: Partial<FetchUrlResult> = {}): FetchUrlResult {
  return {
    targetUrl: "https://example.com/page",
    finalUrl: "https://example.com/page",
    statusCode: 200,
    redirects: [],
    headers: {},
    bodyText: html,
    truncated: false,
    ...overrides
  };
}

describe("html page findings", () => {
  it("passes indexability and page basics for a healthy document", () => {
    const findings = buildHtmlPageFindings(
      pageResult(`
        <html>
          <head>
            <title>Search visibility diagnosis guide</title>
            <meta name="description" content="A practical guide for checking whether a site can be crawled, indexed, and exposed in Google Search." />
            <link rel="canonical" href="https://example.com/page" />
            <script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"Guide"}</script>
          </head>
          <body>
            <h1>Search visibility diagnosis guide</h1>
            <p>This page has enough initial HTML content for crawlers and users to understand the primary topic clearly.</p>
            <img src="/preview.png" alt="Search visibility report preview" />
          </body>
        </html>
      `)
    );

    expect(findings.find((finding) => finding.checkId === "index.meta_noindex")).toMatchObject({ status: "PASS" });
    expect(findings.find((finding) => finding.checkId === "index.canonical_exists")).toMatchObject({ status: "PASS" });
    expect(findings.find((finding) => finding.checkId === "index.canonical_expected")).toMatchObject({ status: "PASS" });
    expect(findings.find((finding) => finding.checkId === "render.initial_content_present")).toMatchObject({
      status: "PASS"
    });
    expect(findings.find((finding) => finding.checkId === "page.title_exists")).toMatchObject({ status: "PASS" });
    expect(findings.find((finding) => finding.checkId === "page.h1_count")).toMatchObject({ status: "PASS" });
    expect(findings.find((finding) => finding.checkId === "page.image_alt")).toMatchObject({ status: "PASS" });
    expect(findings.find((finding) => finding.checkId === "page.schema_valid_jsonld")).toMatchObject({
      status: "PASS"
    });
  });

  it("fails indexability when meta robots or x-robots noindex is present", () => {
    const findings = buildHtmlPageFindings(
      pageResult(`<html><head><meta name="robots" content="noindex,nofollow"></head><body></body></html>`, {
        headers: { "x-robots-tag": "noindex" }
      })
    );

    expect(findings.find((finding) => finding.checkId === "index.meta_noindex")).toMatchObject({ status: "FAIL" });
    expect(findings.find((finding) => finding.checkId === "index.meta_nofollow")).toMatchObject({ status: "WARN" });
    expect(findings.find((finding) => finding.checkId === "index.x_robots_noindex")).toMatchObject({
      status: "FAIL"
    });
  });

  it("warns when canonical is missing or points elsewhere", () => {
    const missing = buildHtmlPageFindings(pageResult(`<html><head><title>Short title</title></head><body></body></html>`));
    const different = buildHtmlPageFindings(
      pageResult(`<html><head><link rel="canonical" href="https://example.com/other"></head><body></body></html>`)
    );

    expect(missing.find((finding) => finding.checkId === "index.canonical_exists")).toMatchObject({ status: "FAIL" });
    expect(different.find((finding) => finding.checkId === "index.canonical_expected")).toMatchObject({
      status: "WARN"
    });
  });

  it("flags missing content basics", () => {
    const findings = buildHtmlPageFindings(
      pageResult(`
        <html>
          <head>
            <title></title>
            <meta name="description" content="tiny" />
            <script type="application/ld+json">{bad json</script>
          </head>
          <body>
            <h1>One</h1><h1>Two</h1>
            <img src="/missing-alt.png" />
          </body>
        </html>
      `)
    );

    expect(findings.find((finding) => finding.checkId === "page.title_exists")).toMatchObject({ status: "FAIL" });
    expect(findings.find((finding) => finding.checkId === "page.description_length")).toMatchObject({
      status: "WARN"
    });
    expect(findings.find((finding) => finding.checkId === "page.h1_count")).toMatchObject({ status: "WARN" });
    expect(findings.find((finding) => finding.checkId === "page.image_alt")).toMatchObject({ status: "WARN" });
    expect(findings.find((finding) => finding.checkId === "page.schema_valid_jsonld")).toMatchObject({
      status: "FAIL"
    });
  });
});
