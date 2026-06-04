import { XMLParser } from "fast-xml-parser";
import type { FetchUrlResult } from "../services/fetch-url";
import type { DiagnosisFinding, FindingSeverity, FindingStatus } from "../types";

export type SitemapEntry = {
  loc: string;
  lastmod: string | null;
};

export type SitemapUrlStatus = {
  loc: string;
  statusCode: number;
  finalUrl: string;
};

export type ParsedSitemap = {
  kind: "urlset" | "sitemapindex" | "unknown";
  urls: SitemapEntry[];
};

const sitemapCheckIds = [
  "sitemap.exists",
  "sitemap.fetchable",
  "sitemap.index_supported",
  "sitemap.urls_status",
  "sitemap.urls_redirect",
  "sitemap.lastmod_present",
  "sitemap.canonical_consistency"
];

export function parseSitemap(xml: string): ParsedSitemap {
  const parser = new XMLParser({
    ignoreAttributes: false,
    removeNSPrefix: true,
    trimValues: true
  });
  const parsed = parser.parse(xml) as {
    urlset?: { url?: unknown };
    sitemapindex?: { sitemap?: unknown };
  };

  if (parsed.urlset) {
    return { kind: "urlset", urls: normalizeEntries(parsed.urlset.url) };
  }

  if (parsed.sitemapindex) {
    return { kind: "sitemapindex", urls: normalizeEntries(parsed.sitemapindex.sitemap) };
  }

  return { kind: "unknown", urls: [] };
}

export function buildSitemapFindings(
  targetUrl: string,
  sitemap: FetchUrlResult | null,
  checkedUrls: SitemapUrlStatus[]
): DiagnosisFinding[] {
  if (!sitemap) {
    return sitemapCheckIds.map((checkId) =>
      finding(
        checkId,
        targetUrl,
        "UNAVAILABLE",
        checkId === "sitemap.exists" || checkId === "sitemap.fetchable" ? "medium" : "low",
        { reason: "No sitemap URL was declared in robots.txt." },
        "Declare a canonical XML sitemap in robots.txt before running sitemap checks.",
        "Sitemap checks require a sitemap URL."
      )
    );
  }

  const fetchable = sitemap.statusCode >= 200 && sitemap.statusCode < 400;

  if (!fetchable) {
    return [
      finding("sitemap.exists", targetUrl, "FAIL", "medium", { sitemapUrl: sitemap.targetUrl, statusCode: sitemap.statusCode }, "Serve a fetchable XML sitemap."),
      finding("sitemap.fetchable", targetUrl, "FAIL", "medium", { sitemapUrl: sitemap.targetUrl, statusCode: sitemap.statusCode }, "Return a 2xx response for the XML sitemap."),
      ...sitemapCheckIds.slice(2).map((checkId) =>
        finding(
          checkId,
          targetUrl,
          "UNAVAILABLE",
          "low",
          { sitemapUrl: sitemap.targetUrl, statusCode: sitemap.statusCode },
          "Make the sitemap fetchable before evaluating its URLs.",
          "Sitemap content could not be evaluated."
        )
      )
    ];
  }

  const parsed = parseSitemap(sitemap.bodyText);
  const statusProblems = checkedUrls.filter((item) => item.statusCode < 200 || item.statusCode >= 300);
  const redirects = checkedUrls.filter((item) => normalizeUrl(item.loc) !== normalizeUrl(item.finalUrl));
  const missingLastmod = parsed.urls.filter((item) => !item.lastmod).length;
  const targetInSitemap = parsed.urls.some((item) => normalizeUrl(item.loc) === normalizeUrl(targetUrl));

  return [
    finding("sitemap.exists", targetUrl, "PASS", "medium", { sitemapUrl: sitemap.finalUrl }, "No action required."),
    finding(
      "sitemap.fetchable",
      targetUrl,
      "PASS",
      "medium",
      { sitemapUrl: sitemap.finalUrl, statusCode: sitemap.statusCode },
      "No action required."
    ),
    finding(
      "sitemap.index_supported",
      targetUrl,
      parsed.kind === "urlset" || parsed.kind === "sitemapindex" ? "PASS" : "FAIL",
      "medium",
      { kind: parsed.kind, urlCount: parsed.urls.length },
      parsed.kind === "urlset" || parsed.kind === "sitemapindex"
        ? "No action required."
        : "Return a valid urlset or sitemapindex XML document."
    ),
    finding(
      "sitemap.urls_status",
      targetUrl,
      statusProblems.length === 0 ? "PASS" : "WARN",
      "medium",
      { checkedUrlCount: checkedUrls.length, problemCount: statusProblems.length, problems: statusProblems },
      statusProblems.length === 0 ? "No action required." : "Remove or fix sitemap URLs returning error status codes."
    ),
    finding(
      "sitemap.urls_redirect",
      targetUrl,
      redirects.length === 0 ? "PASS" : "WARN",
      "low",
      { redirectCount: redirects.length, redirects },
      redirects.length === 0 ? "No action required." : "List final canonical URLs directly in the sitemap."
    ),
    finding(
      "sitemap.lastmod_present",
      targetUrl,
      parsed.urls.length > 0 && missingLastmod === 0 ? "PASS" : "WARN",
      "low",
      { urlCount: parsed.urls.length, missingLastmod },
      missingLastmod === 0 ? "No action required." : "Add lastmod values where update freshness matters."
    ),
    finding(
      "sitemap.canonical_consistency",
      targetUrl,
      targetInSitemap ? "PASS" : "WARN",
      "medium",
      { targetUrl, targetInSitemap },
      targetInSitemap ? "No action required." : "Include the final canonical page URL in the XML sitemap."
    )
  ];
}

function normalizeEntries(input: unknown): SitemapEntry[] {
  const items = Array.isArray(input) ? input : input ? [input] : [];

  return items
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as { loc?: unknown; lastmod?: unknown };
      const loc = typeof record.loc === "string" ? record.loc.trim() : "";

      if (!loc) {
        return null;
      }

      return {
        loc,
        lastmod: typeof record.lastmod === "string" ? record.lastmod : null
      };
    })
    .filter((item): item is SitemapEntry => item !== null);
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
    category: "sitemap",
    source: "local-crawler",
    status,
    severity,
    target,
    evidence,
    recommendation,
    limitation
  };
}

function normalizeUrl(input: string) {
  const url = new URL(input);
  url.hash = "";
  return url.toString();
}
