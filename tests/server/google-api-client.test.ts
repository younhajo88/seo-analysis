import { describe, expect, it } from "vitest";
import { fetchGscDiagnosisData } from "../../server/services/google-api-client";

describe("Google API client", () => {
  it("fetches URL inspection and search analytics data for the matching property", async () => {
    const calls: Array<{ url: string; body: unknown }> = [];

    const data = await fetchGscDiagnosisData({
      accessToken: "token",
      targetUrl: "https://example.com/",
      fetchImpl: async (url, init) => {
        calls.push({ url: url.toString(), body: init?.body ? JSON.parse(String(init.body)) : null });

        if (url.toString().includes("urlInspection/index:inspect")) {
          return new Response(
            JSON.stringify({
              inspectionResult: {
                indexStatusResult: {
                  coverageState: "Submitted and indexed",
                  indexingState: "INDEXING_ALLOWED",
                  robotsTxtState: "ALLOWED",
                  pageFetchState: "SUCCESSFUL",
                  googleCanonical: "https://example.com/",
                  userCanonical: "https://example.com/",
                  sitemap: ["https://example.com/sitemap.xml"]
                }
              }
            }),
            { status: 200 }
          );
        }

        if (url.toString().includes("searchAnalytics/query")) {
          return new Response(
            JSON.stringify({
              rows: [{ keys: ["seo analysis"], clicks: 1, impressions: 2, ctr: 0.5, position: 3 }]
            }),
            { status: 200 }
          );
        }

        return new Response(JSON.stringify({ siteEntry: [{ siteUrl: "https://example.com/" }] }), { status: 200 });
      }
    });

    expect(data.propertyConnected).toBe(true);
    expect(data.inspection?.coverageState).toBe("Submitted and indexed");
    expect(data.searchAnalytics?.rows?.[0].keys).toEqual(["seo analysis"]);
    expect(calls.find((call) => call.url.includes("searchAnalytics/query"))?.body).toMatchObject({
      dimensions: ["query"],
      rowLimit: 10
    });
  });
});
