import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";
import { Zen_Old_Mincho } from "next/font/google";

const zenOldMincho = Zen_Old_Mincho({
  weight: ["400", "700", "900"],
  display: "swap",
});

const siteDescription =
  "ギター・エフェクター改造製作、音響実験、電子回路の研究記録を発信する五反田音響波動技術研究所の公式サイト。";
const siteUrl = new URL("https://www.gotanda-onpa.com");
const defaultShareImage = "/social-share-default.png";
const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "五反田音響波動技術研究所",
    template: "%s | 五反田音響波動技術研究所",
  },
  description: siteDescription,
  applicationName: "五反田音響波動技術研究所",
  authors: [{ name: "五反田音響波動技術研究所" }],
  creator: "五反田音響波動技術研究所",
  publisher: "五反田音響波動技術研究所",
  keywords: [
    "五反田音響波動技術研究所",
    "ギター",
    "エフェクター",
    "改造",
    "自作",
    "音響実験",
    "電子回路",
    "guitar",
    "effects pedal",
    "pedal mod",
    "audio experiment",
    "electronics",
  ],
  openGraph: {
    title: "五反田音響波動技術研究所",
    description: siteDescription,
    siteName: "五反田音響波動技術研究所",
    locale: "ja_JP",
    type: "website",
    url: siteUrl,
    images: [
      {
        url: defaultShareImage,
        alt: "五反田音響波動技術研究所のロゴと名称",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "五反田音響波動技術研究所",
    description: siteDescription,
    creator: "@Gotanda_Onpa",
    images: [defaultShareImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${zenOldMincho.className} flex min-h-screen flex-col overflow-x-hidden bg-radial from-zinc-200 to-zinc-50`}
      >
        <Header />
        <main className="flex-1 pt-24">{children}</main>
        <Footer />
        {googleAnalyticsId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            />
            <Script id="google-analytics">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}');
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
