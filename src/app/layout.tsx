import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

// 가변 글꼴이라 400(Regular), 500(Medium), 700(Bold)을 모두 쓸 수 있다.
// 한글 글자는 Google Fonts가 필요한 만큼 나눠서 내려준다.
const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "메모",
  description: "메모 앱",
  applicationName: "메모",
  // 아이폰 홈 화면에 추가했을 때의 이름과 상태 표시줄. 아이콘은 app/apple-icon.png
  appleWebApp: {
    capable: true,
    title: "메모",
    statusBarStyle: "default",
  },
};

// 앱처럼 열렸을 때 상태 표시줄 색. 화면 배경(surface/page)과 맞춘다.
// meta 태그에는 CSS 변수를 쓸 수 없어 토큰 값을 직접 적는다.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2F4F6" },
    { media: "(prefers-color-scheme: dark)", color: "#101014" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // [scrollbar-gutter:stable]: 스크롤 막대 자리를 늘 비워 둔다.
    // 글 길이에 따라 막대가 생기고 없어져도 화면이 좌우로 밀리지 않는다.
    <html lang="ko" className={`${notoSansKR.variable} h-full antialiased [scrollbar-gutter:stable]`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
