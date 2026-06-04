import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("/privacy");

export default function PrivacyPage() {
  return (
    <section className="content-page article-body">
      <p className="eyebrow">Privacy</p>
      <h1>개인정보와 로컬 진단 원칙</h1>
      <p className="lead">
        SEO Analysis는 공개 프론트와 로컬 진단 서버를 분리합니다. 공개 사이트는
        설명과 진입점을 제공하고, 실제 진단은 사용자의 PC에서 실행되는 로컬 서버가
        담당합니다.
      </p>
      <section>
        <h2>Search Console 권한</h2>
        <p>
          Search Console 데이터는 연결된 사용자가 접근 가능한 property에 대해서만
          조회합니다. 일회성 진단은 짧게 유지되는 access token 사용을 기본으로 하며,
          refresh token 저장은 예약 진단 같은 별도 기능이 필요할 때만 고려합니다.
        </p>
      </section>
      <section>
        <h2>로컬 데이터 처리</h2>
        <p>
          URL 크롤링 결과와 진단 리포트는 중앙 서버가 아니라 로컬 실행 환경에서
          처리하는 것을 기본 방향으로 합니다. 공개 프론트는 로컬 서버가 없을 때
          진단을 실행하지 않습니다.
        </p>
      </section>
    </section>
  );
}
