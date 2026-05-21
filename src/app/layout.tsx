import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { GoogleAnalytics } from "@/components/shared/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  title: {
    default: "Кодрум – Испитна подготовка за студенти",
    template: "%s | Кодрум",
  },
  description:
    "Сега е вистинско време да завршите со испитите и да уживате во летото без стрес! 😎🌴 За студенти од ФИНКИ, ФЕИТ, МФС и Економски.",
  keywords: ["кодрум", "испити", "подготовка", "ФИНКИ", "ФЕИТ", "студенти", "курсеви"],
  openGraph: {
    siteName: "Кодрум",
    locale: "mk_MK",
    type: "website",
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
    <html lang="mk">
      <body className={inter.className}>
        {gaMeasurementId && (
          <Suspense fallback={null}>
            <GoogleAnalytics measurementId={gaMeasurementId} />
          </Suspense>
        )}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#008081] focus:text-white focus:rounded-lg"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
