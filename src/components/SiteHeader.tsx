import Link from "next/link";
import { Activity } from "lucide-react";
import { publicNavItems, siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label={`${siteConfig.name} 홈`}>
        <span className="brand-mark" aria-hidden="true">
          <Activity size={18} />
        </span>
        <span>{siteConfig.name}</span>
      </Link>
      <nav className="top-nav" aria-label="주요 메뉴">
        {publicNavItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
