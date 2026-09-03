import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { GoogleAnalytics } from "@/components/shared/GoogleAnalytics";
import { AnalyticsEvents } from "@/components/shared/AnalyticsEvents";
import { CookieNotice } from "@/components/shared/CookieNotice";

const inter = Inter({ subsets: ["latin"] });
const gaMeasurementId =
  process.env.NEXT_PUBLIC_GA_ID ?? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL("https://kodrum.mk"),
  title: {
    default: "Кодрум – Приватни часови и испитна подготовка за студенти (ФИНКИ)",
    template: "%s | Кодрум",
  },
  description:
    "Професионални приватни часови и испитна подготовка за студенти од ФИНКИ, ФЕИТ, МФС и Економски. Индивидуални и групни часови за СП, ООП, АПС, Калкулус и програмирање во Скопје и онлајн.",
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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Кодрум – Приватни часови и испитна подготовка за студенти",
    description:
      "Приватни часови и испитна подготовка за студенти од ФИНКИ, ФЕИТ, МФС и Економски во Скопје и онлајн.",
    url: "https://kodrum.mk",
    siteName: "Кодрум",
    locale: "mk_MK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Кодрум – Приватни часови и испитна подготовка за студенти",
    description:
      "Приватни часови и испитна подготовка за студенти од ФИНКИ, ФЕИТ, МФС и Економски во Скопје и онлајн.",
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

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://kodrum.mk/#organization",
      "name": "Кодрум (Kodrum)",
      "url": "https://kodrum.mk",
      "logo": "https://kodrum.mk/logo.png",
      "description":
        "Образовна платформа за приватни часови, колоквиумска и испитна подготовка за студенти на ФИНКИ, ФЕИТ, МФС и Економски во Скопје и онлајн.",
      "telephone": "+38975295582",
      "email": "kodrum.mk@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Skopje",
        "addressCountry": "MK",
      },
      "areaServed": {
        "@type": "Country",
        "name": "North Macedonia",
      },
      "sameAs": [
        "https://www.instagram.com/kodrum.mk/",
        "https://www.facebook.com/61583240054450/",
        "https://discord.gg/FmMjw3Q564",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://kodrum.mk/#website",
      "url": "https://kodrum.mk",
      "name": "Кодрум",
      "publisher": {
        "@id": "https://kodrum.mk/#organization",
      },
      "inLanguage": "mk-MK",
    },
  ],
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
    <html lang="mk">
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Context" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={inter.className}>
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
        <main id="main-content">{children}</main>
        <Footer />
        <CookieNotice />
      </body>
    </html>
  );
}
