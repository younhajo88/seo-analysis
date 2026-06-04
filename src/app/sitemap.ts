import type { MetadataRoute } from "next";
import { absoluteUrl, publicPages } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPages
    .filter((page) => page.indexable)
    .map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: new Date(),
      changeFrequency: page.path.startsWith("/guides/") ? "monthly" : "weekly",
      priority: page.path === "/" ? 1 : page.path === "/diagnose" ? 0.9 : 0.7
    }));
}
