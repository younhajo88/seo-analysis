import * as cheerio from "cheerio";
import type { FetchUrlResult } from "../services/fetch-url";
import type { DiagnosisFinding, FindingSeverity, FindingStatus } from "../types";

export function buildHtmlPageFindings(page: FetchUrlResult): DiagnosisFinding[] {
  const $ = cheerio.load(page.bodyText);
  const robotsContent = metaContent($, "robots");
  const googlebotContent = metaContent($, "googlebot");
  const robotsDirectives = normalizeDirectives(`${robotsContent} ${googlebotContent}`);
  const xRobots = page.headers["x-robots-tag"] ?? "";
  const xRobotsDirectives = normalizeDirectives(xRobots);
  const canonicalHref = $("link[rel~='canonical']").first().attr("href")?.trim() ?? "";
  const canonicalUrl = canonicalHref ? absoluteUrl(canonicalHref, page.finalUrl) : null;
  const title = $("title").first().text().trim();
  const description = metaContent($, "description").trim();
  const h1Texts = $("h1")
    .toArray()
    .map((node) => $(node).text().trim())
    .filter(Boolean);
  const images = $("img").toArray();
  const imagesMissingAlt = images.filter((node) => !($(node).attr("alt") ?? "").trim()).length;
  const jsonLdBlocks = $("script[type='application/ld+json']").toArray();
  const invalidJsonLd = jsonLdBlocks.filter((node) => !isValidJson($(node).text())).length;
  const visibleTextLength = visibleText($).length;

  return [
    finding(
      "index.meta_noindex",
      page.finalUrl,
      robotsDirectives.includes("noindex") ? "FAIL" : "PASS",
      "critical",
      { content: robotsContent || googlebotContent || null },
      robotsDirectives.includes("noindex") ? "Remove noindex from indexable pages." : "No action required."
    ),
    finding(
      "index.meta_nofollow",
      page.finalUrl,
      robotsDirectives.includes("nofollow") ? "WARN" : "PASS",
      "medium",
      { content: robotsContent || googlebotContent || null },
      robotsDirectives.includes("nofollow")
        ? "Avoid nofollow on pages whose internal links should help discovery."
        : "No action required."
    ),
    finding(
      "index.x_robots_noindex",
      page.finalUrl,
      xRobotsDirectives.includes("noindex") ? "FAIL" : "PASS",
      "critical",
      { header: xRobots || null },
      xRobotsDirectives.includes("noindex")
        ? "Remove the X-Robots-Tag noindex header from indexable pages."
        : "No action required."
    ),
    finding(
      "index.canonical_exists",
      page.finalUrl,
      canonicalUrl ? "PASS" : "FAIL",
      "critical",
      { canonicalUrl },
      canonicalUrl ? "No action required." : "Add a canonical link element for the indexable page."
    ),
    finding(
      "index.canonical_accessible",
      page.finalUrl,
      canonicalUrl ? "MANUAL" : "UNAVAILABLE",
      "medium",
      { canonicalUrl },
      canonicalUrl ? "Fetch the canonical URL in a follow-up check to confirm it returns 2xx." : "Add a canonical URL first.",
      canonicalUrl
        ? "The canonical URL syntax is present, but this phase does not fetch it separately."
        : "Canonical accessibility cannot be evaluated because canonical is missing."
    ),
    finding(
      "index.canonical_expected",
      page.finalUrl,
      canonicalUrl && normalizeComparableUrl(canonicalUrl) === normalizeComparableUrl(page.finalUrl) ? "PASS" : "WARN",
      "medium",
      { canonicalUrl, finalUrl: page.finalUrl },
      canonicalUrl && normalizeComparableUrl(canonicalUrl) === normalizeComparableUrl(page.finalUrl)
        ? "No action required."
        : "Point the canonical URL at the intended indexable final URL."
    ),
    finding(
      "render.initial_content_present",
      page.finalUrl,
      visibleTextLength >= 80 ? "PASS" : "WARN",
      "high",
      { visibleTextLength },
      visibleTextLength >= 80
        ? "No action required."
        : "Render enough meaningful content in the initial HTML for crawlers and users."
    ),
    finding("page.title_exists", page.finalUrl, title ? "PASS" : "FAIL", "high", { title }, title ? "No action required." : "Add a title element."),
    finding(
      "page.title_length",
      page.finalUrl,
      title && title.length >= 10 && title.length <= 65 ? "PASS" : "WARN",
      "medium",
      { title, length: title.length },
      "Keep the title descriptive and roughly 10-65 characters."
    ),
    finding(
      "page.description_exists",
      page.finalUrl,
      description ? "PASS" : "WARN",
      "medium",
      { description },
      description ? "No action required." : "Add a meta description for better search result snippets."
    ),
    finding(
      "page.description_length",
      page.finalUrl,
      description && description.length >= 50 && description.length <= 160 ? "PASS" : "WARN",
      "low",
      { description, length: description.length },
      "Keep the meta description concise and useful, roughly 50-160 characters."
    ),
    finding(
      "page.h1_exists",
      page.finalUrl,
      h1Texts.length > 0 ? "PASS" : "FAIL",
      "high",
      { h1Count: h1Texts.length, h1Texts },
      h1Texts.length > 0 ? "No action required." : "Add one descriptive H1."
    ),
    finding(
      "page.h1_count",
      page.finalUrl,
      h1Texts.length === 1 ? "PASS" : h1Texts.length === 0 ? "FAIL" : "WARN",
      "medium",
      { h1Count: h1Texts.length, h1Texts },
      h1Texts.length === 1 ? "No action required." : "Use one primary H1 for the page."
    ),
    finding(
      "page.image_alt",
      page.finalUrl,
      imagesMissingAlt === 0 ? "PASS" : "WARN",
      "low",
      { imageCount: images.length, imagesMissingAlt },
      imagesMissingAlt === 0 ? "No action required." : "Add useful alt text to informative images."
    ),
    finding(
      "page.structured_data_exists",
      page.finalUrl,
      jsonLdBlocks.length > 0 ? "PASS" : "WARN",
      "low",
      { jsonLdBlockCount: jsonLdBlocks.length },
      jsonLdBlocks.length > 0 ? "No action required." : "Add JSON-LD structured data when it matches the page type."
    ),
    finding(
      "page.schema_valid_jsonld",
      page.finalUrl,
      jsonLdBlocks.length === 0 ? "UNAVAILABLE" : invalidJsonLd === 0 ? "PASS" : "FAIL",
      "medium",
      { jsonLdBlockCount: jsonLdBlocks.length, invalidJsonLd },
      invalidJsonLd === 0 ? "No action required." : "Fix invalid JSON-LD blocks.",
      jsonLdBlocks.length === 0 ? "No JSON-LD blocks were present." : null
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
    category: checkId.startsWith("index.") || checkId.startsWith("render.") ? "indexability" : "page",
    source: "local-crawler",
    status,
    severity,
    target,
    evidence,
    recommendation,
    limitation
  };
}

function metaContent($: cheerio.CheerioAPI, name: string) {
  return $(`meta[name='${name}']`).attr("content") ?? "";
}

function normalizeDirectives(value: string) {
  return value
    .toLowerCase()
    .split(/[,\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function absoluteUrl(input: string, base: string) {
  try {
    return new URL(input, base).toString();
  } catch {
    return null;
  }
}

function normalizeComparableUrl(input: string) {
  const url = new URL(input);
  url.hash = "";
  return url.toString();
}

function visibleText($: cheerio.CheerioAPI) {
  $("script,style,noscript,template").remove();
  return $("body").text().replace(/\s+/g, " ").trim();
}

function isValidJson(input: string) {
  try {
    JSON.parse(input);
    return true;
  } catch {
    return false;
  }
}
