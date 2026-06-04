import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f7f5ef",
          color: "#1f2520",
          padding: 72,
          fontFamily: "Arial, sans-serif"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 58,
                height: 58,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: siteConfig.themeColor,
                color: "white",
                borderRadius: 12,
                fontSize: 28,
                fontWeight: 800
              }}
            >
              S
            </div>
            <div style={{ fontSize: 30, fontWeight: 800 }}>{siteConfig.name}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                color: siteConfig.themeColor,
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: 3
              }}
            >
              SEARCH VISIBILITY FIRST
            </div>
            <div style={{ fontSize: 86, lineHeight: 1.08, fontWeight: 900 }}>
              검색 노출부터 확인하는 SEO 진단 도구
            </div>
            <div style={{ maxWidth: 880, color: "#59645b", fontSize: 30, lineHeight: 1.45 }}>
              크롤링, 색인, Search Console 키워드 노출을 먼저 확인합니다.
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
