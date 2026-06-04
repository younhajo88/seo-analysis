import type { Metadata } from "next";

export type PublicPage = {
  path: string;
  title: string;
  description: string;
  h1: string;
  primaryIntent: string;
  secondaryIntent: string;
  schema: string[];
  indexable: boolean;
  canonicalPath: string;
};

export type GuidePage = PublicPage & {
  slug: string;
  eyebrow: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
};

export const siteConfig = {
  name: "SEO Analysis",
  language: "ko",
  category: "검색 노출 진단 도구",
  defaultTitle: "SEO Analysis - 검색 노출 진단 도구",
  defaultDescription:
    "내 사이트가 Google 검색에 노출될 수 있는지, 어떤 키워드로 노출되는지, 무엇을 먼저 보강해야 하는지 확인하는 로컬 기반 검색 노출 진단 도구입니다.",
  backendUrl: "http://localhost:4317",
  manifestPath: "/manifest.webmanifest",
  ogImagePath: "/opengraph-image",
  themeColor: "#1f6f5b",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000")
};

export const publicPages: PublicPage[] = [
  {
    path: "/",
    title: "검색 노출 진단 도구",
    description:
      "내 사이트가 Google에 노출될 수 있는 상태인지, 실제로 어떤 키워드와 페이지에서 노출되는지 확인하는 로컬 기반 SEO 진단 도구입니다.",
    h1: "검색 노출부터 확인하는 SEO 진단 도구",
    primaryIntent: "검색 노출 진단 도구 이해",
    secondaryIntent: "SEO 점수보다 색인과 노출을 먼저 확인",
    schema: ["WebSite", "SoftwareApplication"],
    indexable: true,
    canonicalPath: "/"
  },
  {
    path: "/diagnose",
    title: "사이트 검색 노출 진단",
    description:
      "로컬 진단 서버와 Google Search Console 데이터를 통해 크롤링, 색인, 키워드 노출 상태를 점검합니다. 서버가 꺼져 있으면 진단은 비활성화됩니다.",
    h1: "내 사이트 검색 노출 진단하기",
    primaryIntent: "사이트 SEO 진단 실행",
    secondaryIntent: "로컬 서버 기반 진단 방식 이해",
    schema: ["SoftwareApplication", "FAQPage"],
    indexable: true,
    canonicalPath: "/diagnose"
  },
  {
    path: "/guides/search-visibility",
    title: "검색 노출 진단 가이드",
    description:
      "상위노출을 고민하기 전에 Google이 사이트를 발견하고 색인하며 실제 검색어에서 노출하는지 확인해야 하는 이유를 설명합니다.",
    h1: "검색 노출 진단이란 무엇인가",
    primaryIntent: "검색 노출 개념 학습",
    secondaryIntent: "상위노출과 노출 가능성 차이 이해",
    schema: ["Article", "BreadcrumbList"],
    indexable: true,
    canonicalPath: "/guides/search-visibility"
  },
  {
    path: "/guides/crawlability-indexability",
    title: "크롤링·색인 문제 진단 가이드",
    description:
      "robots.txt, noindex, canonical, HTTP 상태 코드처럼 Google 검색 노출을 막을 수 있는 핵심 기술 요소를 정리합니다.",
    h1: "크롤링과 색인을 막는 SEO 문제",
    primaryIntent: "색인 차단 문제 이해",
    secondaryIntent: "robots, noindex, canonical 확인",
    schema: ["Article", "BreadcrumbList"],
    indexable: true,
    canonicalPath: "/guides/crawlability-indexability"
  },
  {
    path: "/guides/google-search-console-keywords",
    title: "Search Console 노출 키워드 진단 가이드",
    description:
      "사이트가 어떤 검색어와 페이지에서 노출되는지는 URL 분석만으로 알 수 없으며 Google Search Console 데이터가 필요한 이유를 설명합니다.",
    h1: "Search Console로 노출 키워드 확인하기",
    primaryIntent: "GSC 키워드 노출 이해",
    secondaryIntent: "impressions, clicks, CTR, position 해석",
    schema: ["Article", "BreadcrumbList"],
    indexable: true,
    canonicalPath: "/guides/google-search-console-keywords"
  },
  {
    path: "/guides/robots-sitemap-checks",
    title: "robots.txt·sitemap 진단 가이드",
    description:
      "검색엔진이 사이트의 중요한 URL을 발견하고 접근할 수 있도록 robots.txt와 XML sitemap을 점검하는 방법을 설명합니다.",
    h1: "robots.txt와 sitemap으로 발견성 점검하기",
    primaryIntent: "robots와 sitemap 점검 학습",
    secondaryIntent: "URL 발견성 개선",
    schema: ["Article", "BreadcrumbList"],
    indexable: true,
    canonicalPath: "/guides/robots-sitemap-checks"
  },
  {
    path: "/guides/local-diagnosis-setup",
    title: "로컬 SEO 진단 서버 설정 가이드",
    description:
      "브라우저 CORS 제약 때문에 URL 크롤링과 HTML 분석은 로컬 진단 서버가 필요합니다. 서버가 없을 때 진단이 비활성화되는 이유를 설명합니다.",
    h1: "로컬 서버로 SEO 진단을 실행하는 이유",
    primaryIntent: "로컬 진단 서버 필요성 이해",
    secondaryIntent: "설치와 실행 흐름 파악",
    schema: ["Article", "BreadcrumbList", "FAQPage"],
    indexable: true,
    canonicalPath: "/guides/local-diagnosis-setup"
  },
  {
    path: "/privacy",
    title: "개인정보 처리와 로컬 진단 원칙",
    description:
      "SEO Analysis가 로컬 서버와 Google Search Console 권한을 어떻게 다루는지, 기본적으로 refresh token 저장 없이 일회성 진단을 권장하는 이유를 설명합니다.",
    h1: "개인정보와 로컬 진단 원칙",
    primaryIntent: "개인정보 처리 이해",
    secondaryIntent: "GSC 권한과 토큰 처리 이해",
    schema: [],
    indexable: true,
    canonicalPath: "/privacy"
  },
  {
    path: "/terms",
    title: "서비스 이용 안내",
    description:
      "SEO Analysis 공개 사이트와 로컬 진단 도구 사용 시 알아야 할 기본 이용 조건과 진단 결과의 한계를 안내합니다.",
    h1: "서비스 이용 안내",
    primaryIntent: "이용 조건 확인",
    secondaryIntent: "진단 결과 한계 이해",
    schema: [],
    indexable: true,
    canonicalPath: "/terms"
  }
];

export const guidePages: GuidePage[] = [
  {
    ...(publicPages.find((page) => page.path === "/guides/search-visibility") as PublicPage),
    slug: "search-visibility",
    eyebrow: "기본 개념",
    sections: [
      {
        title: "검색 노출은 순위보다 앞선 문제입니다",
        body: "상위노출을 논하기 전에 Google이 사이트를 발견하고, 접근하고, 색인하고, 실제 검색어에서 노출하는지 확인해야 합니다. 노출 자체가 없다면 제목을 조금 고치거나 백링크를 고민하기 전에 크롤링과 색인 조건부터 봐야 합니다."
      },
      {
        title: "URL 분석만으로는 키워드 노출을 알 수 없습니다",
        body: "페이지의 title, h1, canonical은 로컬 크롤러로 확인할 수 있지만 실제 어떤 검색어에서 노출되는지는 Search Console 데이터가 필요합니다. 이 도구는 로컬 진단과 GSC 증거를 분리해서 보여주는 것을 목표로 합니다."
      }
    ]
  },
  {
    ...(publicPages.find((page) => page.path === "/guides/crawlability-indexability") as PublicPage),
    slug: "crawlability-indexability",
    eyebrow: "크롤링과 색인",
    sections: [
      {
        title: "크롤링 차단은 가장 먼저 봐야 할 위험입니다",
        body: "robots.txt, HTTP 오류, 리디렉션 루프, JavaScript 의존 콘텐츠는 Google이 페이지를 제대로 가져가지 못하게 만들 수 있습니다. 이 영역은 로컬 서버가 직접 요청해야 정확하게 확인할 수 있습니다."
      },
      {
        title: "색인 차단은 페이지 내부와 헤더 모두에 있습니다",
        body: "meta robots noindex와 X-Robots-Tag noindex는 페이지를 검색 결과에서 제외할 수 있습니다. canonical이 잘못된 URL을 가리켜도 의도한 페이지가 대표로 선택되지 않을 수 있습니다."
      }
    ]
  },
  {
    ...(publicPages.find((page) => page.path === "/guides/google-search-console-keywords") as PublicPage),
    slug: "google-search-console-keywords",
    eyebrow: "Search Console",
    sections: [
      {
        title: "노출 키워드는 Search Console에서 확인합니다",
        body: "어떤 검색어가 사이트를 노출시키는지, 노출수와 클릭수, CTR, 평균 순위가 어떤지는 Search Console Search Analytics 데이터가 필요합니다. 연결된 사용자가 접근 권한을 가진 property만 확인할 수 있습니다."
      },
      {
        title: "목표 키워드와 실제 노출 키워드를 비교합니다",
        body: "사용자가 기대한 키워드가 실제 GSC 쿼리에 없다면 콘텐츠 주제, 내부 링크, 색인 상태, 검색 수요를 분리해서 봐야 합니다. 노출은 있지만 클릭이 없다면 title과 description, 검색 의도 적합성을 봅니다."
      }
    ]
  },
  {
    ...(publicPages.find((page) => page.path === "/guides/robots-sitemap-checks") as PublicPage),
    slug: "robots-sitemap-checks",
    eyebrow: "발견성",
    sections: [
      {
        title: "robots.txt는 크롤링 정책을 보여줍니다",
        body: "robots.txt가 없어도 사이트가 반드시 실패하는 것은 아니지만, 의도치 않게 주요 경로를 막고 있다면 검색 노출이 크게 약해질 수 있습니다. Googlebot 기준의 허용 여부를 별도로 확인해야 합니다."
      },
      {
        title: "sitemap은 중요한 URL을 발견시키는 보조 신호입니다",
        body: "sitemap에는 색인 가능한 canonical URL이 들어가야 합니다. 404, 5xx, 리디렉션 URL이 많으면 검색엔진에 불필요한 URL을 제출하는 셈이 됩니다."
      }
    ]
  },
  {
    ...(publicPages.find((page) => page.path === "/guides/local-diagnosis-setup") as PublicPage),
    slug: "local-diagnosis-setup",
    eyebrow: "로컬 실행",
    sections: [
      {
        title: "브라우저만으로는 임의 사이트를 충분히 진단할 수 없습니다",
        body: "공개 프론트는 Vercel에서 열리지만, 임의 도메인의 HTML과 헤더, robots.txt, sitemap을 읽는 작업은 브라우저 CORS 제약에 막힐 수 있습니다. 그래서 진단 실행은 사용자의 PC에서 실행되는 로컬 서버가 담당합니다."
      },
      {
        title: "서버가 꺼져 있으면 진단은 멈추고 설명은 남습니다",
        body: "로컬 진단 서버가 없을 때도 사이트는 정상적으로 열리고 검색엔진이 읽을 수 있습니다. 다만 진단 버튼은 비활성화되며, 실제 URL 검사나 GSC 조회를 했다고 표시하지 않습니다."
      }
    ],
    faqs: [
      {
        question: "로컬 서버 없이 진단할 수 있나요?",
        answer: "공개 설명 페이지는 볼 수 있지만 URL 크롤링과 GSC 연동 진단은 로컬 서버 연결 후에만 실행됩니다."
      }
    ]
  }
];

export const publicNavItems = [
  { href: "/", label: "홈" },
  { href: "/diagnose", label: "진단" },
  { href: "/guides/search-visibility", label: "가이드" },
  { href: "/guides/local-diagnosis-setup", label: "설정" }
];

export const footerLinks = [
  { href: "/guides/crawlability-indexability", label: "크롤링과 색인" },
  { href: "/guides/google-search-console-keywords", label: "Search Console 키워드" },
  { href: "/guides/robots-sitemap-checks", label: "robots.txt와 sitemap" },
  { href: "/privacy", label: "개인정보" },
  { href: "/terms", label: "이용 안내" }
];

export const requiredNoindexRoutes = ["/diagnose/session", "/oauth/callback"];

export function getPage(path: string) {
  const page = publicPages.find((item) => item.path === path);
  if (!page) {
    throw new Error(`Unknown public page: ${path}`);
  }
  return page;
}

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.siteUrl).toString();
}

export function pageMetadata(path: string): Metadata {
  const page = getPage(path);

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: page.canonicalPath
    },
    openGraph: {
      title: `${page.title} | ${siteConfig.name}`,
      description: page.description,
      url: absoluteUrl(page.path),
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImagePath,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} 검색 노출 진단`
        }
      ],
      locale: "ko_KR",
      type: page.path.startsWith("/guides/") ? "article" : "website"
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} | ${siteConfig.name}`,
      description: page.description,
      images: [siteConfig.ogImagePath]
    }
  };
}
