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
  const dir = mkdtempSync(join(tmpdir(), "seo-analysis-oauth-route-"));
  tempDirs.push(dir);
  return join(dir, "test.sqlite");
}

const googleOAuth = {
  clientId: "client-id.apps.googleusercontent.com",
  clientSecret: "secret-value",
  authUri: "https://accounts.google.com/o/oauth2/auth",
  tokenUri: "https://oauth2.googleapis.com/token",
  redirectUri: "http://127.0.0.1:4317/oauth/google/callback"
};

describe("Google OAuth routes", () => {
  it("redirects to Google with Search Console readonly scope", async () => {
    const app = buildApp({ databasePath: tempDbPath(), googleOAuth });

    const response = await app.inject({ method: "GET", url: "/oauth/google/start" });
    await app.close();

    const location = response.headers.location;
    expect(response.statusCode).toBe(302);
    expect(location).toContain("https://accounts.google.com/o/oauth2/auth");
    expect(location).toContain("client_id=client-id.apps.googleusercontent.com");
    expect(location).toContain("scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fwebmasters.readonly");
    expect(location).toContain("redirect_uri=http%3A%2F%2F127.0.0.1%3A4317%2Foauth%2Fgoogle%2Fcallback");
  });

  it("stores the access token returned by Google", async () => {
    const app = buildApp({
      databasePath: tempDbPath(),
      googleOAuth,
      googleTokenExchange: async () => ({
        accessToken: "access-token",
        expiresAt: Date.now() + 3_600_000
      })
    });

    const callback = await app.inject({ method: "GET", url: "/oauth/google/callback?code=abc" });
    const status = await app.inject({ method: "GET", url: "/integrations/google/status" });
    await app.close();

    expect(callback.statusCode).toBe(200);
    expect(callback.body).toContain("Google Search Console 연결 완료");
    expect(status.json()).toMatchObject({
      configured: true,
      connected: true
    });
  });
});
