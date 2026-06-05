import { describe, expect, it } from "vitest";
import { fetchPageSpeedResult } from "../../server/services/pagespeed-client";

describe("PageSpeed client", () => {
  it("calls PageSpeed Insights for the requested URL", async () => {
    let calledUrl = "";

    const result = await fetchPageSpeedResult("https://example.com/", {
      apiKey: "key",
      fetchImpl: async (url) => {
        calledUrl = url.toString();
        return new Response(JSON.stringify({ lighthouseResult: { categories: {} } }), { status: 200 });
      }
    });

    expect(result.lighthouseResult).toEqual({ categories: {} });
    expect(calledUrl).toContain("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
    expect(calledUrl).toContain("url=https%3A%2F%2Fexample.com%2F");
    expect(calledUrl).toContain("key=key");
  });
});
