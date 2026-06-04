import { describe, expect, it } from "vitest";
import { buildApp } from "../../server/app";

describe("server app", () => {
  it("returns health status with version", async () => {
    const app = buildApp();

    const response = await app.inject({ method: "GET", url: "/health" });
    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      ok: true,
      service: "seo-analysis-local",
      version: "0.1.0"
    });
  });

  it("allows configured browser origins", async () => {
    const app = buildApp({ allowedOrigins: ["https://seo-analysis-two.vercel.app"] });

    const response = await app.inject({
      method: "GET",
      url: "/health",
      headers: { origin: "https://seo-analysis-two.vercel.app" }
    });
    await app.close();

    expect(response.statusCode).toBe(200);
    expect(response.headers["access-control-allow-origin"]).toBe("https://seo-analysis-two.vercel.app");
  });

  it("rejects unconfigured browser origins", async () => {
    const app = buildApp({ allowedOrigins: ["https://seo-analysis-two.vercel.app"] });

    const response = await app.inject({
      method: "GET",
      url: "/health",
      headers: { origin: "https://evil.example" }
    });
    await app.close();

    expect(response.statusCode).toBe(403);
  });
});
