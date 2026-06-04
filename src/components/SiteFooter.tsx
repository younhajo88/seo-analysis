import Link from "next/link";
import { footerLinks, siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>{siteConfig.name}</strong>
        <p>검색 노출 가능성과 실제 키워드 노출을 먼저 확인하는 진단 도구입니다.</p>
      </div>
      <nav aria-label="하단 메뉴">
        {footerLinks.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
