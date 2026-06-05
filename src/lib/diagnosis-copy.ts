import type { DiagnosisApiFinding } from "@/lib/diagnosis-client";

export type { DiagnosisApiFinding };

type FindingStatus = DiagnosisApiFinding["status"];

type FindingCopy = {
  title: string;
  meaning: string;
  action: string;
};

const statusCopy: Record<FindingStatus, { label: string; description: string }> = {
  PASS: {
    label: "통과",
    description: "검색 노출을 막는 문제가 발견되지 않았습니다."
  },
  WARN: {
    label: "주의",
    description: "즉시 색인을 막지는 않지만 개선하면 더 안정적입니다."
  },
  FAIL: {
    label: "실패",
    description: "검색 노출 또는 크롤링에 직접적인 문제가 될 수 있습니다."
  },
  MANUAL: {
    label: "수동 확인",
    description: "자동 진단만으로는 확정할 수 없어 사람이 확인해야 합니다."
  },
  UNAVAILABLE: {
    label: "진단 불가",
    description: "권한, 외부 API, 유료 데이터, 또는 추가 크롤링이 필요합니다."
  }
};

const severityCopy: Record<string, string> = {
  critical: "매우 중요",
  high: "중요",
  medium: "보통",
  low: "낮음",
  info: "정보"
};

const categoryCopy: Record<string, string> = {
  reach: "접속 가능성",
  crawl: "크롤링 정책",
  sitemap: "사이트맵",
  indexability: "색인 가능성",
  page: "페이지 기본 SEO",
  structure: "사이트 구조",
  performance: "성능",
  gsc: "Search Console",
  unavailable: "외부 데이터",
  manual: "수동 검토"
};

const findingCopy: Record<string, FindingCopy> = {
  "reach.http_status": {
    title: "페이지 HTTP 상태",
    meaning: "검색엔진과 사용자가 페이지에 정상 접속할 수 있는지 확인합니다.",
    action: "색인할 페이지는 200번대 응답을 반환하거나 의도한 canonical URL로 리디렉션해야 합니다."
  },
  "reach.redirect_chain": {
    title: "리디렉션 단계",
    meaning: "URL이 최종 페이지에 도달하기까지 거치는 리디렉션 수를 확인합니다.",
    action: "리디렉션 단계를 줄이고 내부 링크와 사이트맵에는 최종 canonical URL을 사용하세요."
  },
  "reach.redirect_loop": {
    title: "리디렉션 루프",
    meaning: "페이지가 끝없이 리디렉션되어 접근할 수 없는 상태인지 확인합니다.",
    action: "리디렉션 규칙이 순환하지 않도록 서버/호스팅 설정을 수정하세요."
  },
  "reach.final_url_expected": {
    title: "최종 URL 일치",
    meaning: "입력한 URL과 실제 도착 URL이 같은지 확인합니다.",
    action: "내부 링크, 사이트맵, 제출 URL에는 최종 canonical URL을 사용하세요."
  },
  "reach.https_available": {
    title: "HTTPS 제공",
    meaning: "색인 대상 페이지가 HTTPS로 제공되는지 확인합니다.",
    action: "색인할 페이지는 HTTPS로 제공하세요."
  },
  "reach.http_to_https": {
    title: "HTTP에서 HTTPS 전환",
    meaning: "HTTP 요청이 HTTPS canonical URL로 이동하는지 확인합니다.",
    action: "HTTP 접근은 HTTPS URL로 리디렉션되도록 설정하세요."
  },
  "crawl.robots_exists": {
    title: "robots.txt 접근 가능",
    meaning: "검색엔진이 크롤링 정책 파일을 읽을 수 있는지 확인합니다.",
    action: "사이트 루트에서 robots.txt가 정상 응답하도록 제공하세요."
  },
  "crawl.robots_googlebot_allowed": {
    title: "Googlebot 크롤링 허용",
    meaning: "robots.txt가 Googlebot의 대상 페이지 접근을 막는지 확인합니다.",
    action: "색인할 페이지를 막는 Disallow 규칙을 제거하거나 범위를 좁히세요."
  },
  "crawl.robots_sitemap_declared": {
    title: "robots.txt의 sitemap 선언",
    meaning: "robots.txt에 XML sitemap 위치가 선언되어 있는지 확인합니다.",
    action: "대표 XML sitemap을 Sitemap 지시어로 선언하세요."
  },
  "sitemap.exists": {
    title: "사이트맵 존재",
    meaning: "robots.txt 또는 사이트 설정에서 XML sitemap을 찾을 수 있는지 확인합니다.",
    action: "검색엔진에 제출할 canonical XML sitemap을 제공하세요."
  },
  "sitemap.fetchable": {
    title: "사이트맵 접근 가능",
    meaning: "XML sitemap URL이 정상적으로 응답하는지 확인합니다.",
    action: "사이트맵은 200번대 응답과 XML 형식으로 제공하세요."
  },
  "sitemap.index_supported": {
    title: "사이트맵 XML 형식",
    meaning: "사이트맵이 urlset 또는 sitemapindex 형식인지 확인합니다.",
    action: "표준 sitemap XML 구조를 사용하세요."
  },
  "sitemap.urls_status": {
    title: "사이트맵 URL 응답 상태",
    meaning: "사이트맵에 포함된 URL들이 정상 응답하는지 표본 검사합니다.",
    action: "오류 상태 코드를 반환하는 URL은 수정하거나 사이트맵에서 제거하세요."
  },
  "sitemap.urls_redirect": {
    title: "사이트맵 URL 리디렉션",
    meaning: "사이트맵 URL이 다시 다른 URL로 이동하는지 확인합니다.",
    action: "사이트맵에는 리디렉션 전 URL이 아니라 최종 canonical URL을 넣으세요."
  },
  "sitemap.lastmod_present": {
    title: "사이트맵 lastmod",
    meaning: "사이트맵 URL에 수정일 정보가 있는지 확인합니다.",
    action: "콘텐츠 갱신 추적이 중요한 페이지에는 lastmod 값을 넣으세요."
  },
  "sitemap.canonical_consistency": {
    title: "현재 URL의 사이트맵 포함",
    meaning: "진단 대상 최종 URL이 사이트맵에 포함되어 있는지 확인합니다.",
    action: "색인시키려는 최종 canonical URL을 XML sitemap에 포함하세요."
  },
  "index.meta_noindex": {
    title: "meta noindex 차단",
    meaning: "페이지 HTML에 색인을 막는 noindex 지시어가 있는지 확인합니다.",
    action: "검색에 노출할 페이지라면 noindex를 제거하세요."
  },
  "index.meta_nofollow": {
    title: "meta nofollow 사용",
    meaning: "페이지 링크 탐색을 제한하는 nofollow 지시어가 있는지 확인합니다.",
    action: "중요 내부 링크 탐색이 필요하다면 nofollow를 제거하세요."
  },
  "index.x_robots_noindex": {
    title: "X-Robots-Tag noindex 헤더",
    meaning: "HTTP 헤더에서 색인을 막는 noindex가 내려오는지 확인합니다.",
    action: "검색에 노출할 페이지라면 X-Robots-Tag noindex 헤더를 제거하세요."
  },
  "index.canonical_exists": {
    title: "canonical 태그 존재",
    meaning: "검색엔진에 대표 URL을 알려주는 canonical 태그가 있는지 확인합니다.",
    action: "색인 대상 페이지에는 canonical link 태그를 추가하세요."
  },
  "index.canonical_accessible": {
    title: "canonical URL 접근성",
    meaning: "canonical URL이 실제로 접근 가능한지 확인해야 합니다.",
    action: "canonical URL을 별도로 요청해 200번대 응답인지 확인하세요."
  },
  "index.canonical_expected": {
    title: "canonical URL 일치",
    meaning: "canonical URL이 실제 최종 URL을 가리키는지 확인합니다.",
    action: "canonical은 의도한 색인 대상 최종 URL을 가리키게 하세요."
  },
  "render.initial_content_present": {
    title: "초기 HTML 콘텐츠",
    meaning: "JavaScript 실행 전 HTML에 의미 있는 본문이 있는지 확인합니다.",
    action: "검색엔진과 사용자에게 필요한 핵심 콘텐츠를 초기 HTML에 렌더링하세요."
  },
  "page.title_exists": {
    title: "title 태그 존재",
    meaning: "페이지 제목이 HTML title로 제공되는지 확인합니다.",
    action: "페이지마다 고유하고 설명적인 title을 추가하세요."
  },
  "page.title_length": {
    title: "title 길이",
    meaning: "검색 결과에서 이해하기 좋은 제목 길이인지 확인합니다.",
    action: "title은 대략 10-65자 범위에서 핵심 키워드와 페이지 의미를 담으세요."
  },
  "page.description_exists": {
    title: "meta description 존재",
    meaning: "검색 결과 설명 후보가 되는 meta description이 있는지 확인합니다.",
    action: "클릭 전에 페이지 내용을 이해할 수 있는 설명을 추가하세요."
  },
  "page.description_length": {
    title: "meta description 길이",
    meaning: "설명이 너무 짧거나 길지 않은지 확인합니다.",
    action: "description은 대략 50-160자 안에서 간결하고 유용하게 작성하세요."
  },
  "page.h1_exists": {
    title: "H1 존재",
    meaning: "페이지의 주제를 나타내는 H1이 있는지 확인합니다.",
    action: "페이지마다 주제를 분명히 말하는 H1을 추가하세요."
  },
  "page.h1_count": {
    title: "H1 개수",
    meaning: "페이지의 주요 제목 구조가 명확한지 확인합니다.",
    action: "한 페이지에는 대표 H1 하나를 사용하는 것을 권장합니다."
  },
  "page.image_alt": {
    title: "이미지 alt 텍스트",
    meaning: "정보성 이미지에 대체 텍스트가 빠져 있는지 확인합니다.",
    action: "의미 있는 이미지에는 내용을 설명하는 alt 텍스트를 추가하세요."
  },
  "page.structured_data_exists": {
    title: "구조화 데이터 존재",
    meaning: "페이지 유형에 맞는 JSON-LD 구조화 데이터가 있는지 확인합니다.",
    action: "페이지 성격에 맞는 구조화 데이터를 추가하면 검색엔진 이해에 도움이 됩니다."
  },
  "page.schema_valid_jsonld": {
    title: "JSON-LD 유효성",
    meaning: "구조화 데이터가 올바른 JSON 형식인지 확인합니다.",
    action: "잘못된 JSON-LD 블록이 있다면 문법을 수정하세요."
  },
  "structure.internal_links": {
    title: "내부 링크 존재",
    meaning: "페이지에서 같은 사이트의 주요 페이지로 이동할 수 있는지 확인합니다.",
    action: "관련 핵심 페이지로 이어지는 문맥형 내부 링크를 추가하세요."
  },
  "structure.broken_internal_links": {
    title: "깨진 내부 링크",
    meaning: "내부 링크가 오류 페이지로 이어지는지 표본 검사합니다.",
    action: "오류 상태를 반환하는 내부 링크를 수정하거나 제거하세요."
  },
  "structure.click_depth": {
    title: "클릭 깊이",
    meaning: "홈에서 주요 페이지까지 몇 번의 클릭이 필요한지 확인해야 합니다.",
    action: "사이트 전체 제한 크롤링을 실행해 주요 페이지가 너무 깊지 않은지 확인하세요."
  },
  "structure.orphan_candidates": {
    title: "고립 페이지 후보",
    meaning: "사이트맵에는 있지만 내부 링크로 발견되지 않는 페이지 후보를 확인해야 합니다.",
    action: "사이트 크롤링 결과와 사이트맵 URL을 비교해 고립 페이지를 찾으세요."
  },
  "perf.pagespeed_available": {
    title: "PageSpeed API 연결",
    meaning: "성능 진단을 위한 PageSpeed Insights 연결 상태입니다.",
    action: "실측 성능을 보려면 PageSpeed Insights API를 설정하세요."
  },
  "perf.lcp": {
    title: "LCP 측정",
    meaning: "가장 큰 콘텐츠가 얼마나 빨리 보이는지 확인하는 Core Web Vitals 항목입니다.",
    action: "PageSpeed Insights 또는 CrUX 데이터를 연결해 LCP를 확인하세요."
  },
  "perf.inp": {
    title: "INP 측정",
    meaning: "사용자 입력에 대한 반응성을 확인하는 Core Web Vitals 항목입니다.",
    action: "PageSpeed Insights 또는 CrUX 데이터를 연결해 INP를 확인하세요."
  },
  "perf.cls": {
    title: "CLS 측정",
    meaning: "페이지 로딩 중 레이아웃이 흔들리는 정도를 확인하는 항목입니다.",
    action: "PageSpeed Insights 또는 CrUX 데이터를 연결해 CLS를 확인하세요."
  },
  "perf.lighthouse_seo": {
    title: "Lighthouse SEO 점수",
    meaning: "Lighthouse 기준의 기본 SEO 점수를 확인합니다.",
    action: "PageSpeed Insights API를 연결해 Lighthouse SEO 점수를 가져오세요."
  },
  "perf.lighthouse_accessibility": {
    title: "Lighthouse 접근성 점수",
    meaning: "Lighthouse 기준의 접근성 점수를 확인합니다.",
    action: "PageSpeed Insights API를 연결해 접근성 점수를 가져오세요."
  },
  "gsc.property_connected": {
    title: "Search Console 속성 연결",
    meaning: "실제 Google 색인/노출 데이터를 보려면 검증된 속성 연결이 필요합니다.",
    action: "Google OAuth와 검증된 Search Console 속성을 연결하세요."
  },
  "gsc.url_index_status": {
    title: "Google 색인 상태",
    meaning: "URL이 실제 Google 색인에 등록되어 있는지 확인하는 항목입니다.",
    action: "Search Console URL Inspection API 연결 후 확인하세요."
  },
  "gsc.google_canonical": {
    title: "Google 선택 canonical",
    meaning: "Google이 실제로 어떤 URL을 대표 URL로 선택했는지 확인하는 항목입니다.",
    action: "Search Console URL Inspection API 연결 후 확인하세요."
  },
  "gsc.crawl_verdict": {
    title: "Google 크롤링 판정",
    meaning: "Google이 페이지를 크롤링할 수 있다고 판단했는지 확인합니다.",
    action: "Search Console URL Inspection API 연결 후 확인하세요."
  },
  "gsc.indexing_verdict": {
    title: "Google 색인 가능 판정",
    meaning: "Google이 페이지 색인 가능 여부를 어떻게 판단했는지 확인합니다.",
    action: "Search Console URL Inspection API 연결 후 확인하세요."
  },
  "exposure.search_queries": {
    title: "실제 노출 키워드",
    meaning: "Search Console에 기록된 검색어 노출 데이터를 확인하는 항목입니다.",
    action: "Search Console Search Analytics API를 연결해 노출 검색어를 가져오세요."
  },
  "authority.backlinks": {
    title: "백링크 데이터",
    meaning: "외부 사이트에서 이 도메인으로 연결되는 링크 품질을 확인하는 항목입니다.",
    action: "무료 자동 진단 범위를 벗어나므로 유료 백링크 데이터 제공자가 필요합니다."
  },
  "authority.domain": {
    title: "도메인 권위 지표",
    meaning: "도메인의 외부 신뢰도/권위 지표를 확인하는 항목입니다.",
    action: "무료 자동 진단 범위를 벗어나므로 유료 권위 지표 제공자가 필요합니다."
  },
  "serp.rank_tracking": {
    title: "검색 순위 추적",
    meaning: "특정 키워드에서 실제 검색 결과 순위를 추적하는 항목입니다.",
    action: "정확한 순위 추적은 유료 SERP 데이터 제공자가 필요합니다."
  },
  "page.intent_match": {
    title: "검색 의도 일치",
    meaning: "페이지 내용이 목표 키워드의 검색 의도와 맞는지 확인해야 합니다.",
    action: "목표 키워드와 상위 노출 페이지를 비교해 사람이 검토하세요."
  },
  "page.information_completeness": {
    title: "정보 완성도",
    meaning: "경쟁 페이지 대비 필요한 정보가 충분한지 확인해야 합니다.",
    action: "가격, 방법, 비교, FAQ, 신뢰 정보 등 부족한 내용을 사람이 검토하세요."
  }
};

export function getStatusCopy(status: FindingStatus) {
  return statusCopy[status];
}

export function getSeverityLabel(severity: string) {
  return severityCopy[severity] ?? severity;
}

export function getCategoryLabel(category: string) {
  return categoryCopy[category] ?? category;
}

export function getFindingCopy(finding: DiagnosisApiFinding): FindingCopy {
  return (
    findingCopy[finding.checkId] ?? {
      title: finding.checkId,
      meaning: "이 진단 항목의 표시 문구가 아직 정의되지 않았습니다.",
      action: translateRecommendation(finding.recommendation)
    }
  );
}

export function translateRecommendation(recommendation: string) {
  if (recommendation === "No action required.") {
    return "별도 조치가 필요하지 않습니다.";
  }

  return recommendation;
}

export function translateLimitation(limitation: string | null) {
  if (!limitation) {
    return null;
  }

  if (limitation === "Payment required.") {
    return "결제 필요";
  }

  if (limitation === "Requires human review.") {
    return "사람이 직접 검토해야 합니다.";
  }

  if (limitation === "Requires external API configuration or unavailable data source.") {
    return "외부 API 설정 또는 별도 데이터 소스가 필요합니다.";
  }

  if (limitation === "The submitted URL already uses HTTPS, so HTTP upgrade behavior was not directly tested.") {
    return "입력한 URL이 이미 HTTPS라서 HTTP에서 HTTPS로 전환되는지는 직접 검사하지 않았습니다.";
  }

  if (limitation === "The canonical URL syntax is present, but this phase does not fetch it separately.") {
    return "canonical URL 형식은 확인했지만, 이번 단계에서는 해당 URL을 별도로 요청하지 않습니다.";
  }

  if (limitation === "Canonical accessibility cannot be evaluated because canonical is missing.") {
    return "canonical이 없어서 접근 가능 여부를 평가할 수 없습니다.";
  }

  if (limitation === "Single URL diagnosis cannot calculate site-wide click depth.") {
    return "단일 URL 진단만으로는 사이트 전체 클릭 깊이를 계산할 수 없습니다.";
  }

  if (limitation === "Single URL diagnosis cannot identify orphan pages without a site crawl and sitemap comparison.") {
    return "사이트 크롤링 결과와 사이트맵 비교 없이는 고립 페이지 후보를 식별할 수 없습니다.";
  }

  if (limitation === "Sitemap checks require a sitemap URL.") {
    return "사이트맵 진단에는 sitemap URL이 필요합니다.";
  }

  if (limitation === "Sitemap content could not be evaluated.") {
    return "사이트맵 내용을 평가할 수 없습니다.";
  }

  if (limitation === "No JSON-LD blocks were present.") {
    return "JSON-LD 블록이 없습니다.";
  }

  if (limitation === "robots.txt could not be fetched during this diagnosis run.") {
    return "이번 진단 실행에서 robots.txt를 가져오지 못했습니다.";
  }

  if (limitation === "robots.txt could not be fetched, so Googlebot policy could not be evaluated.") {
    return "robots.txt를 가져오지 못해 Googlebot 정책을 평가할 수 없습니다.";
  }

  if (limitation === "robots.txt could not be fetched, so sitemap declarations could not be evaluated.") {
    return "robots.txt를 가져오지 못해 sitemap 선언을 평가할 수 없습니다.";
  }

  if (limitation === "robots.txt was not fetchable, so Googlebot policy could not be evaluated.") {
    return "robots.txt에 접근할 수 없어 Googlebot 정책을 평가할 수 없습니다.";
  }

  if (limitation === "robots.txt was not fetchable, so sitemap declarations could not be evaluated.") {
    return "robots.txt에 접근할 수 없어 sitemap 선언을 평가할 수 없습니다.";
  }

  return limitation;
}

export function summarizeEvidence(evidence: Record<string, unknown>) {
  const labels: Record<string, string> = {
    statusCode: "상태 코드",
    finalUrl: "최종 URL",
    targetUrl: "진단 URL",
    redirectCount: "리디렉션 수",
    redirectLoopDetected: "리디렉션 루프",
    finalProtocol: "최종 프로토콜",
    robotsUrl: "robots.txt URL",
    googlebotAllowed: "Googlebot 허용",
    sitemapUrls: "사이트맵 URL",
    sitemapUrl: "사이트맵 URL",
    kind: "사이트맵 형식",
    urlCount: "URL 수",
    checkedUrlCount: "검사 URL 수",
    problemCount: "문제 URL 수",
    missingLastmod: "lastmod 누락",
    targetInSitemap: "사이트맵 포함",
    content: "지시어",
    header: "헤더",
    canonicalUrl: "canonical URL",
    visibleTextLength: "초기 본문 길이",
    title: "title",
    length: "길이",
    description: "description",
    h1Count: "H1 수",
    imageCount: "이미지 수",
    imagesMissingAlt: "alt 누락 이미지",
    jsonLdBlockCount: "JSON-LD 수",
    invalidJsonLd: "잘못된 JSON-LD",
    internalLinkCount: "내부 링크 수",
    checkedLinkCount: "확인한 링크 수",
    brokenLinkCount: "깨진 링크 수",
    automated: "자동 진단",
    available: "사용 가능",
    milliseconds: "밀리초",
    score: "점수",
    lighthouseInteractiveMs: "Lighthouse 상호작용 시간",
    propertyConnected: "속성 연결",
    coverageState: "색인 상태",
    indexingState: "색인 허용 상태",
    robotsTxtState: "robots.txt 상태",
    pageFetchState: "페이지 가져오기 상태",
    googleCanonical: "Google 선택 canonical",
    userCanonical: "사용자 선언 canonical",
    queryCount: "검색어 수",
    topQueries: "상위 검색어"
  };

  return Object.entries(evidence)
    .filter(([, value]) => value !== null && value !== undefined)
    .slice(0, 4)
    .map(([key, value]) => `${labels[key] ?? key}: ${formatEvidenceValue(value)}`);
}

function formatEvidenceValue(value: unknown): string {
  if (typeof value === "boolean") {
    return value ? "예" : "아니오";
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "없음";
    }

    return value
      .slice(0, 3)
      .map((item) => formatEvidenceValue(item))
      .join(", ");
  }

  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  }

  return String(value);
}
