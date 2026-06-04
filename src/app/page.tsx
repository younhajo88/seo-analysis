import Link from "next/link";
import { ArrowRight, CheckCircle2, Search, ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/site";
import { softwareJsonLd, websiteJsonLd } from "@/lib/structured-data";

export const metadata = pageMetadata("/");

export default function HomePage() {
  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={softwareJsonLd("/")} />
      <section className="hero">
        <div>
          <p className="eyebrow">Search visibility first</p>
          <h1>검색 노출부터 확인하는 SEO 진단 도구</h1>
          <p>
            SEO Analysis는 사이트가 Google에 노출될 수 있는 상태인지, 실제로
            어떤 키워드와 페이지에서 노출되는지 먼저 확인합니다. 상위노출은 그
            다음 문제로 분리합니다.
          </p>
          <div className="inline-links">
            <Link className="primary-button" href="/diagnose">
              사이트 검색 노출 진단 시작하기
              <ArrowRight size={16} />
            </Link>
            <Link className="secondary-button" href="/guides/search-visibility">
              검색 노출 진단 개념 보기
            </Link>
          </div>
        </div>
        <aside className="hero-visual" aria-label="진단 핵심 신호">
          <ul className="signal-list">
            <li>
              <Search size={20} />
              <span>
                <strong>Google 접근 가능성</strong>
                HTTP 상태, robots.txt, noindex, canonical을 먼저 확인합니다.
              </span>
            </li>
            <li>
              <CheckCircle2 size={20} />
              <span>
                <strong>실제 색인 증거</strong>
                Search Console URL Inspection으로 Google의 판단을 분리합니다.
              </span>
            </li>
            <li>
              <ShieldCheck size={20} />
              <span>
                <strong>노출 키워드</strong>
                GSC 쿼리 데이터로 어떤 검색어에서 보이는지 확인합니다.
              </span>
            </li>
          </ul>
        </aside>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Diagnosis order</p>
            <h2>노출을 막는 문제부터 정리합니다</h2>
          </div>
          <Link href="/guides/crawlability-indexability">크롤링과 색인 문제 확인하기</Link>
        </div>
        <div className="steps">
          <div className="step">
            <strong>1. 접근과 크롤링</strong>
            <p>URL 상태, 리디렉션, robots.txt, sitemap을 로컬 서버로 검사합니다.</p>
          </div>
          <div className="step">
            <strong>2. 색인과 canonical</strong>
            <p>noindex와 canonical 문제를 확인하고 GSC 색인 증거와 비교합니다.</p>
          </div>
          <div className="step">
            <strong>3. 키워드 노출</strong>
            <p>Search Console 쿼리, 페이지, CTR 데이터를 목표 키워드와 비교합니다.</p>
          </div>
        </div>
      </section>
    </>
  );
}
