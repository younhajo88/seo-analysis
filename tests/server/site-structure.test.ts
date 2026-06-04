import { describe, expect, it } from "vitest";
import { buildSiteStructureFindings, extractInternalLinks } from "../../server/checks/site-structure";
import type { FetchUrlResult } from "../../server/services/fetch-url";

function pageResult(html: string): FetchUrlResult {
  return {
    targetUrl: "https://example.com/page",
    finalUrl: "https://example.com/page",
    statusCode: 200,
    redirects: [],
    headers: {},
    bodyText: html,
    truncated: false
  };
}

describe("site structure findings", () => {
  it("extracts normalized same-origin internal links", () => {
    const links = extractInternalLinks(
      pageResult(`
        <a href="/about">About</a>
        <a href="https://example.com/pricing#top">Pricing</a>
        <a href="https://other.example/">External</a>
        <a href="mailto:test@example.com">Email</a>
      `)
    );

    expect(links).toEqual(["https://example.com/about", "https://example.com/pricing"]);
  });

  it("passes when internal links are present and checked links are healthy", () => {
    const findings = buildSiteStructureFindings(
      pageResult(`<a href="/about">About</a><a href="/pricing">Pricing</a>`),
      [
        { url: "https://example.com/about", statusCode: 200, finalUrl: "https://example.com/about" },
        { url: "https://example.com/pricing", statusCode: 200, finalUrl: "https://example.com/pricing" }
      ]
    );

    expect(findings.find((finding) => finding.checkId === "structure.internal_links")).toMatchObject({
      status: "PASS"
    });
    expect(findings.find((finding) => finding.checkId === "structure.broken_internal_links")).toMatchObject({
      status: "PASS"
    });
    expect(findings.find((finding) => finding.checkId === "structure.click_depth")).toMatchObject({
      status: "MANUAL"
    });
    expect(findings.find((finding) => finding.checkId === "structure.orphan_candidates")).toMatchObject({
      status: "UNAVAILABLE"
    });
  });

  it("warns when internal links are missing or broken", () => {
    const findings = buildSiteStructureFindings(pageResult(`<main>No links here</main>`), [
      { url: "https://example.com/missing", statusCode: 404, finalUrl: "https://example.com/missing" }
    ]);

    expect(findings.find((finding) => finding.checkId === "structure.internal_links")).toMatchObject({
      status: "WARN"
    });
    expect(findings.find((finding) => finding.checkId === "structure.broken_internal_links")).toMatchObject({
      status: "WARN"
    });
  });
});
