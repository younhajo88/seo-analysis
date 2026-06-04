import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { buildApp } from "../../server/app";

let tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
  tempDirs = [];
});

function tempDbPath() {
  const dir = mkdtempSync(join(tmpdir(), "seo-analysis-api-"));
  tempDirs.push(dir);
  return join(dir, "test.sqlite");
}

describe("POST /diagnose/url", () => {
  it("rejects malformed payloads", async () => {
    const app = buildApp({ databasePath: tempDbPath() });

    const response = await app.inject({
      method: "POST",
      url: "/diagnose/url",
      payload: { url: "not-a-url" }
    });
    await app.close();

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({ code: "INVALID_URL" });
  });

  it("rejects unsafe targets", async () => {
    const app = buildApp({ databasePath: tempDbPath() });

    const response = await app.inject({
      method: "POST",
      url: "/diagnose/url",
      payload: { url: "http://127.0.0.1:3000" }
    });
    await app.close();

    expect(response.statusCode).toBe(403);
    expect(response.json()).toMatchObject({ code: "UNSAFE_IP" });
  });

  it("returns a persisted run with fetch detail and reach findings", async () => {
    const app = buildApp({
      databasePath: tempDbPath(),
      assertSafeUrl: async (input) => new URL(input),
      fetchImpl: async (url) => {
        if (url.toString().endsWith("/robots.txt")) {
          return new Response("User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml\n", { status: 200 });
        }

        return new Response("ok", { status: 200 });
      }
    });

    const response = await app.inject({
      method: "POST",
      url: "/diagnose/url",
      payload: { url: "https://example.com/" }
    });
    await app.close();

    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.run).toMatchObject({
      id: expect.any(Number),
      overallStatus: "PASS",
      summary: {
        PASS: expect.any(Number),
        FAIL: 0
      }
    });
    expect(body.fetch).toMatchObject({
      targetUrl: "https://example.com/",
      finalUrl: "https://example.com/",
      statusCode: 200,
      redirects: []
    });
    expect(body.findings.map((finding: { checkId: string }) => finding.checkId)).toContain("reach.http_status");
    expect(body.findings.map((finding: { checkId: string }) => finding.checkId)).toContain("crawl.robots_exists");
    expect(body.findings.map((finding: { checkId: string }) => finding.checkId)).toContain(
      "crawl.robots_googlebot_allowed"
    );
    expect(body.findings.map((finding: { checkId: string }) => finding.checkId)).toContain(
      "crawl.robots_sitemap_declared"
    );
  });

  it("reports crawl failures when robots.txt blocks Googlebot", async () => {
    const app = buildApp({
      databasePath: tempDbPath(),
      assertSafeUrl: async (input) => new URL(input),
      fetchImpl: async (url) => {
        if (url.toString().endsWith("/robots.txt")) {
          return new Response("User-agent: Googlebot\nDisallow: /\n", { status: 200 });
        }

        return new Response("ok", { status: 200 });
      }
    });

    const response = await app.inject({
      method: "POST",
      url: "/diagnose/url",
      payload: { url: "https://example.com/" }
    });
    await app.close();

    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.run.overallStatus).toBe("FAIL");
    expect(body.findings.find((finding: { checkId: string }) => finding.checkId === "crawl.robots_googlebot_allowed"))
      .toMatchObject({
        status: "FAIL"
      });
  });

  it("keeps reach findings when robots.txt cannot be fetched", async () => {
    const app = buildApp({
      databasePath: tempDbPath(),
      assertSafeUrl: async (input) => new URL(input),
      fetchImpl: async (url) => {
        if (url.toString().endsWith("/robots.txt")) {
          throw new Error("robots fetch failed");
        }

        return new Response("ok", { status: 200 });
      }
    });

    const response = await app.inject({
      method: "POST",
      url: "/diagnose/url",
      payload: { url: "https://example.com/" }
    });
    await app.close();

    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.findings.find((finding: { checkId: string }) => finding.checkId === "reach.http_status")).toMatchObject({
      status: "PASS"
    });
    expect(body.findings.find((finding: { checkId: string }) => finding.checkId === "crawl.robots_exists")).toMatchObject({
      status: "UNAVAILABLE"
    });
  });
});
