import type { Metadata } from "next";
import { SITE_NAME, SITE_TITLE } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Per-page metadata: title, description, canonical, Open Graph and Twitter in one call. `path` is relative
 * ("/pripremi"); `metadataBase` in the root layout turns it into an absolute URL. Page titles get the
 * "| Кодрум" suffix from the title template; the home page uses the full site title as it is.
 */
export function pageMeta({
  title,
  description,
  path,
  image = "/opengraph-image",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const home = path === "/";
  const fullTitle = home ? SITE_TITLE : `${title} | ${SITE_NAME}`;
  const images = [{ url: image, ...OG_SIZE, alt: fullTitle }];
  return {
    title: home ? { absolute: SITE_TITLE } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "mk_MK",
      url: path,
      title: fullTitle,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

export const NOINDEX: Metadata = { robots: { index: false, follow: false } };
