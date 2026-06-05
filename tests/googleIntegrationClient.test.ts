import { describe, expect, it } from "vitest";
import { buildGoogleOAuthStartEndpoint, buildGoogleStatusEndpoint } from "../src/lib/google-integration-client";

describe("Google integration client", () => {
  it("builds local backend Google integration endpoints", () => {
    expect(buildGoogleStatusEndpoint("http://localhost:4317/")).toBe("http://localhost:4317/integrations/google/status");
    expect(buildGoogleOAuthStartEndpoint("http://localhost:4317/")).toBe("http://localhost:4317/oauth/google/start");
  });
});
