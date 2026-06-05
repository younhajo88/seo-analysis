import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadGoogleOAuthConfigFromFile } from "../../server/services/google-oauth-config";

describe("Google OAuth config", () => {
  it("loads a downloaded web client secret JSON", () => {
    const dir = mkdtempSync(join(tmpdir(), "seo-analysis-oauth-"));
    const path = join(dir, "client_secret_test.apps.googleusercontent.com.json");

    writeFileSync(
      path,
      JSON.stringify({
        web: {
          client_id: "client-id.apps.googleusercontent.com",
          client_secret: "secret-value",
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          redirect_uris: ["http://127.0.0.1:4317/oauth/google/callback"]
        }
      })
    );

    expect(loadGoogleOAuthConfigFromFile(path)).toEqual({
      clientId: "client-id.apps.googleusercontent.com",
      clientSecret: "secret-value",
      authUri: "https://accounts.google.com/o/oauth2/auth",
      tokenUri: "https://oauth2.googleapis.com/token",
      redirectUri: "http://127.0.0.1:4317/oauth/google/callback"
    });
  });
});
