import * as cheerio from "cheerio";
import type { FetchUrlResult } from "../services/fetch-url";
import type { DiagnosisFinding, FindingSeverity, FindingStatus } from "../types";

export type InternalLinkStatus = {
  url: string;
  statusCode: number;
  finalUrl: string;
};

export function extractInternalLinks(page: FetchUrlResult) {
  const $ = cheerio.load(page.bodyText);
  const origin = new URL(page.finalUrl).origin;
  const links = new Set<string>();

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href")?.trim();

    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
      return;
    }

    try {
      const url = new URL(href, page.finalUrl);

      if (url.origin !== origin) {
        return;
      }

      url.hash = "";
      links.add(url.toString());
    } catch {
      // Ignore invalid hrefs in this structural pass.
    }
  });

  return [...links].sort();
}

export function buildSiteStructureFindings(page: FetchUrlResult, checkedLinks: InternalLinkStatus[]): DiagnosisFinding[] {
  const internalLinks = extractInternalLinks(page);
  const brokenLinks = checkedLinks.filter((link) => link.statusCode < 200 || link.statusCode >= 400);

  return [
    finding(
      "structure.internal_links",
      page.finalUrl,
      internalLinks.length > 0 ? "PASS" : "WARN",
      "medium",
      { internalLinkCount: internalLinks.length, sample: internalLinks.slice(0, 20) },
      internalLinks.length > 0 ? "No action required." : "Add contextual internal links to important related pages."
    ),
    finding(
      "structure.broken_internal_links",
      page.finalUrl,
      brokenLinks.length === 0 ? "PASS" : "WARN",
      "high",
      { checkedLinkCount: checkedLinks.length, brokenLinkCount: brokenLinks.length, brokenLinks },
      brokenLinks.length === 0 ? "No action required." : "Fix or remove internal links that return error status codes."
    ),
    finding(
      "structure.click_depth",
      page.finalUrl,
      "MANUAL",
      "medium",
      { checkedFrom: page.finalUrl },
      "Run a bounded multi-page crawl to calculate click depth from the home page.",
      "Single URL diagnosis cannot calculate site-wide click depth."
    ),
    finding(
      "structure.orphan_candidates",
      page.finalUrl,
      "UNAVAILABLE",
      "medium",
      { checkedFrom: page.finalUrl },
      "Compare a bounded crawl against sitemap URLs to identify orphan candidates.",
      "Single URL diagnosis cannot identify orphan pages without a site crawl and sitemap comparison."
    )
  ];
}

function finding(
  checkId: string,
  target: string,
  status: FindingStatus,
  severity: FindingSeverity,
  evidence: Record<string, unknown>,
  recommendation: string,
  limitation: string | null = null
): DiagnosisFinding {
  return {
    checkId,
    category: "structure",
    source: "local-crawler",
    status,
    severity,
    target,
    evidence,
    recommendation,
    limitation
  };
}
