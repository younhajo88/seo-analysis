import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { guidePages, pageMetadata } from "@/lib/site";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/structured-data";

type GuidePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return guidePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: GuidePageProps) {
  const { slug } = await params;
  const page = guidePages.find((item) => item.slug === slug);
  if (!page) {
    return {};
  }
  return pageMetadata(page.path);
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const page = guidePages.find((item) => item.slug === slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <JsonLd data={articleJsonLd(page)} />
      <JsonLd data={breadcrumbJsonLd(page)} />
      {page.faqs ? <JsonLd data={faqJsonLd(page.faqs, page.path)} /> : null}
      <article className="content-page article-body">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.h1}</h1>
        <p className="lead">{page.description}</p>
        {page.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        {page.faqs ? (
          <section>
            <h2>자주 묻는 질문</h2>
            {page.faqs.map((faq) => (
              <div key={faq.question} className="guide-preview">
                <strong>{faq.question}</strong>
                <p>{faq.answer}</p>
              </div>
            ))}
          </section>
        ) : null}
        <div className="guide-preview">
          <h2>다음 단계</h2>
          <p>로컬 서버를 연결하면 이 개념을 실제 URL 진단 결과로 확인할 수 있습니다.</p>
          <Link className="primary-button" href="/diagnose">
            내 사이트 검색 노출 진단하기
          </Link>
        </div>
      </article>
    </>
  );
}
