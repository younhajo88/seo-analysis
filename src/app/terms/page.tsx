import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("/terms");

export default function TermsPage() {
  return (
    <section className="content-page article-body">
      <p className="eyebrow">Terms</p>
      <h1>서비스 이용 안내</h1>
      <p className="lead">
        SEO Analysis의 진단 결과는 검색 노출 상태를 이해하고 개선 우선순위를 정하기
        위한 보조 자료입니다.
      </p>
      <section>
        <h2>진단 결과의 한계</h2>
        <p>
          URL 기반 검사는 기술적 차단 요소를 찾을 수 있지만 실제 검색어 노출 여부는
          Search Console 데이터 없이는 확인할 수 없습니다. 백링크, 도메인 권위,
          경쟁사 SERP 비교는 별도의 유료 데이터가 필요할 수 있습니다.
        </p>
      </section>
      <section>
        <h2>사용자 책임</h2>
        <p>
          사용자는 자신이 소유하거나 진단 권한을 가진 사이트를 대상으로 도구를 사용해야
          합니다. robots.txt 진단 override 같은 기능은 사이트 소유자가 명시적으로
          선택한 경우에만 다뤄야 합니다.
        </p>
      </section>
    </section>
  );
}
