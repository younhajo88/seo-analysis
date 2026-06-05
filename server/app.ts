import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import { join } from "node:path";
import {
  buildGscUnavailableFindings,
  buildPaidAndHumanFindings,
  buildPerformanceUnavailableFindings
} from "./checks/external-placeholders";
import { buildGscFindings } from "./checks/google-search-console";
import { buildPageSpeedFindings } from "./checks/pagespeed";
import {
  buildCrawlPolicyFindings,
  buildUnavailableCrawlPolicyFindings,
  extractSitemapUrlsFromRobots,
  robotsUrlForTarget
} from "./checks/crawl-policy";
import { buildHtmlPageFindings } from "./checks/html-page";
import { buildReachFindings } from "./checks/reach";
import { buildSitemapFindings, parseSitemap, type SitemapUrlStatus } from "./checks/sitemap";
import { buildSiteStructureFindings, extractInternalLinks, type InternalLinkStatus } from "./checks/site-structure";
import { defaultAllowedOrigins, serverVersion, type ServerConfig } from "./config";
import { openDatabase } from "./db/connection";
import { migrateDatabase } from "./db/migrate";
import { createDiagnosisRun } from "./services/diagnosis-store";
import { fetchUrl, type FetchUrlOptions } from "./services/fetch-url";
import { fetchGscDiagnosisData } from "./services/google-api-client";
import type { GoogleOAuthConfig } from "./services/google-oauth-config";
import {
  buildGoogleAuthUrl,
  exchangeGoogleCodeForToken,
  type GoogleToken,
  type GoogleTokenExchange
} from "./services/google-oauth";
import { fetchPageSpeedResult } from "./services/pagespeed-client";
import { UrlSafetyError } from "./services/url-safety";
import type { FindingStatus } from "./types";

export type BuildAppOptions = Partial<Pick<ServerConfig, "allowedOrigins">> &
  Pick<FetchUrlOptions, "assertSafeUrl" | "fetchImpl"> & {
    databasePath?: string;
    googleOAuth?: GoogleOAuthConfig | null;
    googleTokenExchange?: GoogleTokenExchange;
    pageSpeedApiKey?: string | null;
  };

export function buildApp(options: BuildAppOptions = {}): FastifyInstance {
  const app = Fastify({ logger: false });
  const allowedOrigins = new Set(options.allowedOrigins ?? defaultAllowedOrigins);
  const databasePath = options.databasePath ?? join(process.cwd(), ".data", "seo-analysis.sqlite");
  const db = openDatabase(databasePath);
  const googleOAuth = options.googleOAuth ?? null;
  const googleTokenExchange = options.googleTokenExchange ?? exchangeGoogleCodeForToken;
  const pageSpeedApiKey = options.pageSpeedApiKey ?? null;
  let googleToken: GoogleToken | null = null;
  migrateDatabase(db);

  app.addHook("onClose", async () => {
    db.close();
  });

  app.addHook("onRequest", async (request, reply) => {
    const origin = request.headers.origin;

    if (!origin) {
      return;
    }

    if (!allowedOrigins.has(origin)) {
      reply.code(403).send({
        error: "Origin is not allowed.",
        code: "CORS_ORIGIN_REJECTED"
      });
      return reply;
    }

    reply.header("Access-Control-Allow-Origin", origin);
    reply.header("Vary", "Origin");
    reply.header("Access-Control-Allow-Headers", "content-type");
    reply.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

    if (request.method === "OPTIONS") {
      reply.code(204).send();
      return reply;
    }
  });

  app.get("/health", async () => ({
    ok: true,
    service: "seo-analysis-local",
    version: serverVersion
  }));

  app.get("/integrations/google/status", async () => ({
    configured: Boolean(googleOAuth),
    connected: Boolean(googleToken && googleToken.expiresAt > Date.now())
  }));

  app.get("/oauth/google/start", async (_request, reply) => {
    if (!googleOAuth) {
      reply.code(503);
      return { error: "Google OAuth is not configured.", code: "GOOGLE_OAUTH_NOT_CONFIGURED" };
    }

    reply.redirect(buildGoogleAuthUrl(googleOAuth));
  });

  app.get("/oauth/google/callback", async (request, reply) => {
    if (!googleOAuth) {
      reply.code(503);
      return { error: "Google OAuth is not configured.", code: "GOOGLE_OAUTH_NOT_CONFIGURED" };
    }

    const query = request.query as { code?: unknown; error?: unknown };

    if (typeof query.error === "string") {
      reply.code(400);
      return `Google Search Console 연결 실패: ${query.error}`;
    }

    if (typeof query.code !== "string") {
      reply.code(400);
      return "Google Search Console 연결 실패: code가 없습니다.";
    }

    googleToken = await googleTokenExchange(query.code, googleOAuth);
    reply.type("text/html; charset=utf-8");
    return "<!doctype html><html><body><h1>Google Search Console 연결 완료</h1><p>이 창을 닫고 진단을 다시 실행하세요.</p></body></html>";
  });

  app.post("/diagnose/url", async (request, reply) => {
    const payload = request.body as { url?: unknown } | null;

    if (!payload || typeof payload.url !== "string") {
      reply.code(400);
      return { error: "A URL string is required.", code: "INVALID_URL" };
    }

    try {
      const fetchResult = await fetchUrl(payload.url, {
        assertSafeUrl: options.assertSafeUrl,
        fetchImpl: options.fetchImpl
      });
      const robotsUrl = robotsUrlForTarget(fetchResult.finalUrl);
      const crawlResult = await buildCrawlResult(fetchResult.finalUrl, robotsUrl, {
        assertSafeUrl: options.assertSafeUrl,
        fetchImpl: options.fetchImpl
      });
      const sitemapFindings = await buildSitemapResult(fetchResult.finalUrl, crawlResult.sitemapUrls, {
        assertSafeUrl: options.assertSafeUrl,
        fetchImpl: options.fetchImpl
      });
      const structureFindings = await buildStructureResult(fetchResult, {
        assertSafeUrl: options.assertSafeUrl,
        fetchImpl: options.fetchImpl
      });
      const gscFindings = await buildGscDiagnosisResult(fetchResult.finalUrl, googleToken, options.fetchImpl);
      const performanceFindings = await buildPageSpeedDiagnosisResult(
        fetchResult.finalUrl,
        pageSpeedApiKey,
        options.fetchImpl
      );
      const findings = [
        ...buildReachFindings(fetchResult),
        ...crawlResult.findings,
        ...sitemapFindings,
        ...buildHtmlPageFindings(fetchResult),
        ...structureFindings,
        ...performanceFindings,
        ...gscFindings,
        ...buildPaidAndHumanFindings(fetchResult.finalUrl)
      ];
      const overallStatus = summarizeOverallStatus(findings.map((finding) => finding.status));
      const stored = createDiagnosisRun(db, {
        targetUrl: fetchResult.targetUrl,
        finalUrl: fetchResult.finalUrl,
        overallStatus,
        fetch: {
          targetUrl: fetchResult.targetUrl,
          finalUrl: fetchResult.finalUrl,
          statusCode: fetchResult.statusCode,
          redirects: fetchResult.redirects,
          truncated: fetchResult.truncated
        },
        findings
      });

      return {
        run: {
          id: stored.id,
          overallStatus,
          summary: stored.summary
        },
        fetch: {
          targetUrl: fetchResult.targetUrl,
          finalUrl: fetchResult.finalUrl,
          statusCode: fetchResult.statusCode,
          redirects: fetchResult.redirects,
          truncated: fetchResult.truncated
        },
        findings
      };
    } catch (error) {
      if (error instanceof UrlSafetyError) {
        reply.code(error.code === "UNSAFE_HOST" || error.code === "UNSAFE_IP" ? 403 : 400);
        return { error: error.message, code: error.code };
      }

      reply.code(502);
      return {
        error: error instanceof Error ? error.message : "Diagnosis request failed.",
        code: "FETCH_FAILED"
      };
    }
  });

  return app;
}

async function buildCrawlResult(targetUrl: string, robotsUrl: string, options: FetchUrlOptions) {
  try {
    const robotsResult = await fetchUrl(robotsUrl, options);
    return {
      findings: buildCrawlPolicyFindings(targetUrl, robotsResult),
      sitemapUrls: extractSitemapUrlsFromRobots(robotsResult.bodyText)
    };
  } catch (error) {
    return {
      findings: buildUnavailableCrawlPolicyFindings(
        targetUrl,
        robotsUrl,
        error instanceof Error ? error.message : "robots.txt fetch failed"
      ),
      sitemapUrls: []
    };
  }
}

async function buildSitemapResult(targetUrl: string, sitemapUrls: string[], options: FetchUrlOptions) {
  const sitemapUrl = sitemapUrls[0];

  if (!sitemapUrl) {
    return buildSitemapFindings(targetUrl, null, []);
  }

  try {
    const sitemapResult = await fetchUrl(sitemapUrl, options);
    const parsed = parseSitemap(sitemapResult.bodyText);
    const checkedUrls: SitemapUrlStatus[] = [];

    for (const entry of parsed.urls.slice(0, 10)) {
      try {
        const checked = await fetchUrl(entry.loc, options);
        checkedUrls.push({
          loc: entry.loc,
          statusCode: checked.statusCode,
          finalUrl: checked.finalUrl
        });
      } catch {
        checkedUrls.push({
          loc: entry.loc,
          statusCode: 0,
          finalUrl: entry.loc
        });
      }
    }

    return buildSitemapFindings(targetUrl, sitemapResult, checkedUrls);
  } catch (error) {
    return buildSitemapFindings(
      targetUrl,
      {
        targetUrl: sitemapUrl,
        finalUrl: sitemapUrl,
        statusCode: 0,
        redirects: [],
        headers: {},
        bodyText: error instanceof Error ? error.message : "sitemap fetch failed",
        truncated: false
      },
      []
    );
  }
}

async function buildStructureResult(pageResult: Awaited<ReturnType<typeof fetchUrl>>, options: FetchUrlOptions) {
  const checkedLinks: InternalLinkStatus[] = [];

  for (const url of extractInternalLinks(pageResult).slice(0, 10)) {
    try {
      const checked = await fetchUrl(url, options);
      checkedLinks.push({
        url,
        statusCode: checked.statusCode,
        finalUrl: checked.finalUrl
      });
    } catch {
      checkedLinks.push({
        url,
        statusCode: 0,
        finalUrl: url
      });
    }
  }

  return buildSiteStructureFindings(pageResult, checkedLinks);
}

async function buildGscDiagnosisResult(
  targetUrl: string,
  googleToken: GoogleToken | null,
  fetchImpl: FetchUrlOptions["fetchImpl"]
) {
  if (!googleToken || googleToken.expiresAt <= Date.now()) {
    return buildGscUnavailableFindings(targetUrl);
  }

  try {
    const data = await fetchGscDiagnosisData({
      accessToken: googleToken.accessToken,
      targetUrl,
      fetchImpl
    });
    return buildGscFindings(targetUrl, data);
  } catch {
    return buildGscUnavailableFindings(targetUrl);
  }
}

async function buildPageSpeedDiagnosisResult(
  targetUrl: string,
  pageSpeedApiKey: string | null,
  fetchImpl: FetchUrlOptions["fetchImpl"]
) {
  try {
    const data = await fetchPageSpeedResult(targetUrl, {
      apiKey: pageSpeedApiKey,
      fetchImpl
    });
    return buildPageSpeedFindings(targetUrl, data);
  } catch {
    return buildPerformanceUnavailableFindings(targetUrl);
  }
}

function summarizeOverallStatus(statuses: FindingStatus[]): FindingStatus {
  if (statuses.includes("FAIL")) {
    return "FAIL";
  }

  if (statuses.includes("WARN")) {
    return "WARN";
  }

  return "PASS";
}
