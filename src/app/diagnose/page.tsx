import Link from "next/link";
import { BackendStatusPanel } from "@/components/BackendStatusPanel";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/site";
import { faqJsonLd, softwareJsonLd } from "@/lib/structured-data";

export const metadata = pageMetadata("/diagnose");

const faqs = [
  {
    question: "로컬 서버 없이 진단할 수 있나요?",
    answer:
      "공개 설명 페이지는 볼 수 있지만 실제 URL 크롤링, HTML 분석, GSC 조회는 로컬 진단 서버가 연결된 뒤에만 실행됩니다."
  },
  {
    question: "왜 Vercel 프론트에서 바로 크롤링하지 않나요?",
    answer:
      "브라우저는 CORS 제약 때문에 임의 사이트의 HTML, 헤더, robots.txt, sitemap을 안정적으로 읽을 수 없습니다."
  }
];

export default function DiagnosePage() {
  return (
    <>
      <JsonLd data={softwareJsonLd("/diagnose")} />
      <JsonLd data={faqJsonLd(faqs, "/diagnose")} />
      <section className="content-page">
        <p className="eyebrow">Diagnosis runner</p>
        <h1>내 사이트 검색 노출 진단하기</h1>
        <p className="lead">
          이 페이지는 Vercel에서 공개적으로 접속되지만, 실제 진단은 사용자의 PC에서
          실행되는 로컬 진단 서버가 연결된 경우에만 가능합니다.
        </p>

        <div className="diagnosis-layout">
          <div className="article-body">
            <section>
              <h2>로컬 서버가 필요한 이유</h2>
              <p>
                URL 상태, 리디렉션, robots.txt, sitemap, HTML metadata는 브라우저만으로
                안정적으로 읽을 수 없습니다. 로컬 백엔드가 대신 요청하고, 프론트는 그
                결과만 보여줍니다.
              </p>
              <p>
                로컬 서버가 꺼져 있으면 진단 실행은 <strong>로컬 진단 서버 연결 필요</strong>
                상태로 비활성화되며, 공개 설명 콘텐츠만 그대로 제공됩니다.
              </p>
            </section>
            <section>
              <h2>진단 데이터 소스</h2>
              <p>
                로컬 크롤러는 접근성과 색인 차단 요소를 확인하고, Google Search Console
                연동은 실제 색인 상태와 노출 키워드를 확인합니다. GSC 권한이 없으면
                키워드 노출은 진단하지 않았다고 표시합니다.
              </p>
            </section>
            <div className="inline-links">
              <Link href="/guides/local-diagnosis-setup">로컬 진단 서버가 필요한 이유</Link>
              <Link href="/guides/google-search-console-keywords">
                노출 키워드 데이터가 필요한 이유
              </Link>
            </div>
          </div>
          <BackendStatusPanel />
        </div>
      </section>
    </>
  );
}
