import Link from "next/link";

export default function NotFound() {
  return (
    <section className="content-page">
      <p className="eyebrow">404</p>
      <h1>페이지를 찾을 수 없습니다</h1>
      <p className="lead">요청한 공개 페이지가 없거나 이동되었습니다.</p>
      <Link className="primary-button" href="/">
        홈으로 이동
      </Link>
    </section>
  );
}
