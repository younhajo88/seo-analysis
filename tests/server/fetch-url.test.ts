import { describe, expect, it } from "vitest";
import { fetchUrl } from "../../server/services/fetch-url";

const okSafety = async (input: string) => new URL(input);

function fakeFetch(routes: Record<string, Response>) {
  return async (url: string | URL) => {
    const key = url.toString();
    const response = routes[key];

    if (!response) {
      throw new Error(`No fake response for ${key}`);
    }

    return response;
  };
}

describe("fetch url", () => {
  it("captures final status code and body bytes", async () => {
    const result = await fetchUrl("https://example.com/", {
      assertSafeUrl: okSafety,
      fetchImpl: fakeFetch({
        "https://example.com/": new Response("hello", { status: 200 })
      })
    });

    expect(result.statusCode).toBe(200);
    expect(result.finalUrl).toBe("https://example.com/");
    expect(result.redirects).toEqual([]);
    expect(result.bodyText).toBe("hello");
  });

  it("follows redirects manually and records the chain", async () => {
    const result = await fetchUrl("http://example.com/", {
      assertSafeUrl: okSafety,
      fetchImpl: fakeFetch({
        "http://example.com/": new Response(null, {
          status: 301,
          headers: { location: "https://example.com/" }
        }),
        "https://example.com/": new Response("secure", { status: 200 })
      })
    });

    expect(result.finalUrl).toBe("https://example.com/");
    expect(result.statusCode).toBe(200);
    expect(result.redirects).toEqual([
      {
        from: "http://example.com/",
        to: "https://example.com/",
        statusCode: 301
      }
    ]);
  });

  it("detects redirect loops", async () => {
    await expect(
      fetchUrl("https://example.com/a", {
        assertSafeUrl: okSafety,
        fetchImpl: fakeFetch({
          "https://example.com/a": new Response(null, {
            status: 302,
            headers: { location: "https://example.com/b" }
          }),
          "https://example.com/b": new Response(null, {
            status: 302,
            headers: { location: "https://example.com/a" }
          })
        })
      })
    ).rejects.toMatchObject({ code: "REDIRECT_LOOP" });
  });

  it("stops after the max redirect count", async () => {
    await expect(
      fetchUrl("https://example.com/0", {
        assertSafeUrl: okSafety,
        maxRedirects: 1,
        fetchImpl: fakeFetch({
          "https://example.com/0": new Response(null, {
            status: 302,
            headers: { location: "https://example.com/1" }
          }),
          "https://example.com/1": new Response(null, {
            status: 302,
            headers: { location: "https://example.com/2" }
          })
        })
      })
    ).rejects.toMatchObject({ code: "MAX_REDIRECTS" });
  });

  it("limits captured response body bytes", async () => {
    const result = await fetchUrl("https://example.com/", {
      assertSafeUrl: okSafety,
      maxResponseBytes: 4,
      fetchImpl: fakeFetch({
        "https://example.com/": new Response("abcdef", { status: 200 })
      })
    });

    expect(result.bodyText).toBe("abcd");
    expect(result.truncated).toBe(true);
  });
});
