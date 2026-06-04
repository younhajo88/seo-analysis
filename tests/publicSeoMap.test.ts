import { describe, expect, it } from "vitest";
import {
  publicNavItems,
  publicPages,
  requiredNoindexRoutes,
  siteConfig
} from "../src/lib/site";

describe("public SEO map", () => {
  it("defines the required indexable public routes", () => {
    expect(publicPages.map((page) => page.path)).toEqual([
      "/",
      "/diagnose",
      "/guides/search-visibility",
      "/guides/crawlability-indexability",
      "/guides/google-search-console-keywords",
      "/guides/robots-sitemap-checks",
      "/guides/local-diagnosis-setup",
      "/privacy",
      "/terms"
    ]);
  });

  it("keeps metadata unique and canonical for every indexable page", () => {
    const titles = new Set(publicPages.map((page) => page.title));
    const canonicals = new Set(publicPages.map((page) => page.canonicalPath));

    expect(titles.size).toBe(publicPages.length);
    expect(canonicals.size).toBe(publicPages.length);

    for (const page of publicPages) {
      expect(page.title.length).toBeGreaterThan(8);
      expect(page.description.length).toBeGreaterThan(60);
      expect(page.h1.length).toBeGreaterThan(8);
      expect(page.canonicalPath).toBe(page.path);
      expect(page.indexable).toBe(true);
    }
  });

  it("marks local-only and OAuth helper routes as noindex", () => {
    expect(requiredNoindexRoutes).toEqual(["/diagnose/session", "/oauth/callback"]);
  });

  it("includes a crawlable navigation path to the diagnosis page and guides", () => {
    expect(publicNavItems.some((item) => item.href === "/diagnose")).toBe(true);
    expect(publicNavItems.some((item) => item.href.startsWith("/guides/"))).toBe(true);
    expect(siteConfig.language).toBe("ko");
  });

  it("defines public brand assets for search and social previews", () => {
    expect(siteConfig.manifestPath).toBe("/manifest.webmanifest");
    expect(siteConfig.ogImagePath).toBe("/opengraph-image");
    expect(siteConfig.themeColor).toMatch(/^#[0-9a-f]{6}$/i);
  });
});
