import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "제이씨드 | JEONGSEED",
  description: "콘텐츠 크리에이터를 위한 올인원 AI 도구. 릴스 대본, 숏폼 자동화, AI 영상 스튜디오.",
  openGraph: {
    title: "제이씨드 | JEONGSEED",
    description: "솔로프리너를 위한 AI 도구",
    url: "https://jeongseed.com",
    siteName: "JEONGSEED",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
