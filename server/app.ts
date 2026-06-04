import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import { join } from "node:path";
import {
  buildCrawlPolicyFindings,
  buildUnavailableCrawlPolicyFindings,
  robotsUrlForTarget
} from "./checks/crawl-policy";
import { buildReachFindings } from "./checks/reach";
import { defaultAllowedOrigins, serverVersion, type ServerConfig } from "./config";
import { openDatabase } from "./db/connection";
import { migrateDatabase } from "./db/migrate";
import { createDiagnosisRun } from "./services/diagnosis-store";
import { fetchUrl, type FetchUrlOptions } from "./services/fetch-url";
import { UrlSafetyError } from "./services/url-safety";
import type { FindingStatus } from "./types";

export type BuildAppOptions = Partial<Pick<ServerConfig, "allowedOrigins">> &
  Pick<FetchUrlOptions, "assertSafeUrl" | "fetchImpl"> & {
    databasePath?: string;
  };

export function buildApp(options: BuildAppOptions = {}): FastifyInstance {
  const app = Fastify({ logger: false });
  const allowedOrigins = new Set(options.allowedOrigins ?? defaultAllowedOrigins);
  const databasePath = options.databasePath ?? join(process.cwd(), ".data", "seo-analysis.sqlite");
  const db = openDatabase(databasePath);
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
      const crawlFindings = await buildCrawlFindings(fetchResult.finalUrl, robotsUrl, {
        assertSafeUrl: options.assertSafeUrl,
        fetchImpl: options.fetchImpl
      });
      const findings = [...buildReachFindings(fetchResult), ...crawlFindings];
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

async function buildCrawlFindings(targetUrl: string, robotsUrl: string, options: FetchUrlOptions) {
  try {
    const robotsResult = await fetchUrl(robotsUrl, options);
    return buildCrawlPolicyFindings(targetUrl, robotsResult);
  } catch (error) {
    return buildUnavailableCrawlPolicyFindings(
      targetUrl,
      robotsUrl,
      error instanceof Error ? error.message : "robots.txt fetch failed"
    );
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
