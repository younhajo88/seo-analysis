import type { MetadataRoute } from "next";
import { absoluteUrl, requiredNoindexRoutes } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";

  if (!isProduction) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/"
      }
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: requiredNoindexRoutes
    },
    sitemap: absoluteUrl("/sitemap.xml")
  };
}
