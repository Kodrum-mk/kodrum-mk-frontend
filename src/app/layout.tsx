import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { GoogleAnalytics } from "@/components/shared/GoogleAnalytics";
import { AnalyticsEvents } from "@/components/shared/AnalyticsEvents";
import { CookieNotice } from "@/components/shared/CookieNotice";
import ContactMenu from "@/components/contact/ContactMenu";
import JsonLd from "@/components/seo/JsonLd";
import { OG_SIZE } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
import { organizationLd } from "@/lib/structured";
import Backdrop from "@/components/ui/Backdrop";

// Manrope has Cyrillic; Inter's latin subset left Macedonian text in the fallback font.
const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});
const gaMeasurementId =
  process.env.NEXT_PUBLIC_GA_ID ?? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  // every relative URL in metadata (canonical, Open Graph, images) resolves against SITE_URL
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "приватни часови финки",
    "privatni casovi finki",
    "часови финки",
    "casovi finki",
    "приватни часови за финки",
    "испитна подготовка финки",
    "кодрум",
    "кодрум мк",
    "испити",
    "подготовка",
    "ФИНКИ",
    "ФЕИТ",
    "МФС",
    "Економски",
    "студенти",
    "курсеви",
    "програмирање",
    "математика",
    "структурно програмирање",
    "објектно програмирање",
    "алгоритми и структури на податоци",
    "приватни часови скопје",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-round.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  // each page sets its own canonical, title and Open Graph through pageMeta(); these are the fallbacks
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "mk_MK",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: "/opengraph-image", ...OG_SIZE, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#008081",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mk" className={manrope.variable}>
      <head>
        <noscript>
          <style>{".reveal{opacity:1}"}</style>
        </noscript>
        <link
          rel="alternate"
          type="text/plain"
          href="/llms.txt"
          title="LLM Context"
        />
        <JsonLd data={organizationLd()} />
      </head>
      <body>
        {gaMeasurementId && (
          <Suspense fallback={null}>
            <GoogleAnalytics measurementId={gaMeasurementId} />
          </Suspense>
        )}
        <AnalyticsEvents />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#008081] focus:text-white focus:rounded-lg"
        >
          Скокни до главната содржина
        </a>
        <Navbar />
        <main id="main-content" className="relative overflow-x-clip">
          <Backdrop />
          {children}
        </main>
        <Footer />
        <ContactMenu />
        <CookieNotice />
      </body>
    </html>
  );
}
