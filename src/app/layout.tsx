import type { Metadata } from "next";
import "./globals.css";
import { Layout as RootLayout } from "@/components/layouts/root";
import { ToastContainer } from "react-toastify";
import Head from "next/head";
import Script from "next/script";
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: "CP Cheats - FAANG Interview Analyzer, Live & AI Interviews, and Competitive Programming Hub",
  description:
    "Master coding contests and interviews with CP Cheats! Analyze year-wise and topic-wise FAANG interview questions, participate in live and AI mock interviews, explore popular coding sheets (Striver, Love Babbar, NeetCode 150), learn algorithm explanations, track progress, and compare with friends.",
  keywords:
    "CP Cheats, FAANG interview questions, live coding interviews, AI interview preparation, topic-wise coding sheets, algorithm explanations, progress tracking, competitive programming, coding editor, interview experience sharing, coding challenge platform",
  openGraph: {
    title: "CP Cheats - Live & AI Interviews, FAANG Question Analysis, and Coding Challenges",
    description:
      "Ace FAANG and top tech interviews with CP Cheats! Engage in live and AI-driven mock interviews, analyze past interview questions, explore top coding sheets, learn algorithm explanations, track progress, and compare with friends.",
    url: "https://www.cpcheats.in/",
    siteName: "CP Cheats",
    images: [
      {
        url: "https://www.cpcheats.in/img/Cpcheats.svg",
        width: 1200,
        height: 630,
        alt: "CP Cheats - Live & AI Interviews, FAANG Interview Questions, and Progress Tracker",
      },
    ],
    type: "website",
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      
      <Head>
        {/* JSON-LD Schema Markup */}
        <script id="structured-data" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "CP Cheats",
            "url": "https://www.cpcheats.in/",
            "alternateName": "CP Cheats",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.cpcheats.in/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
        
      </Head>
      <body>
        <RootLayout>
          {children}
          <ToastContainer />
        </RootLayout>
        <GoogleAnalytics gaId="G-2MDE01J59G" />
        <Script async
         src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9592770542633066"
         crossOrigin="anonymous"
        strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
