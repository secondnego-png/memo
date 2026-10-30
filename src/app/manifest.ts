import type { MetadataRoute } from "next";

// 휴대폰 홈 화면에 추가하면 주소창 없이 앱처럼 열린다 (PWA).
// manifest에는 CSS 변수를 쓸 수 없어 토큰 값을 직접 적는다: surface/page(Light) #F2F4F6
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "메모",
    short_name: "메모",
    description: "메모 앱",
    lang: "ko",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F2F4F6",
    theme_color: "#F2F4F6",
    // 아이콘 원본: public/icons/app-icon.svg (배경을 끝까지 채워서 maskable로도 쓴다)
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
