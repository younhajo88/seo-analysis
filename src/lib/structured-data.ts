import { absoluteUrl, type GuidePage, siteConfig } from "./site";

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl("/"),
    description: siteConfig.defaultDescription,
    inLanguage: "ko"
  };
}

export function softwareJsonLd(path = "/") {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    applicationCategory: "SEOApplication",
    operatingSystem: "Web browser with local diagnosis server",
    url: absoluteUrl(path),
    description: siteConfig.defaultDescription,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW"
    }
  };
}

export function articleJsonLd(page: GuidePage) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1,
    description: page.description,
    url: absoluteUrl(page.path),
    inLanguage: "ko",
    author: {
      "@type": "Organization",
      name: siteConfig.name
    }
  };
}

export function breadcrumbJsonLd(page: GuidePage) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: absoluteUrl("/")
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "가이드",
        item: absoluteUrl("/guides/search-visibility")
      },
      {
        "@type": "ListItem",
        position: 3,
        name: page.h1,
        item: absoluteUrl(page.path)
      }
    ]
  };
}

export function faqJsonLd(
  faqs: NonNullable<GuidePage["faqs"]>,
  path: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: absoluteUrl(path),
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}
