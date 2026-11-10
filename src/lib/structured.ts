import type { PrepSession } from "@/types";
import {
  ADDRESS,
  EMAIL,
  PHONE,
  SITE_DESCRIPTION,
  SITE_URL,
  SOCIALS,
} from "@/lib/site";

export const ORG_ID = `${SITE_URL}/#organization`;

/**
 * Organization + WebSite for every page, from lib/site.ts. EducationalOrganization only: LocalBusiness needs a
 * street address, and there is none yet (add `street` to ADDRESS, then add "LocalBusiness" to the type).
 */
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": ORG_ID,
        name: "Кодрум (Kodrum)",
        alternateName: "Kodrum",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        image: `${SITE_URL}/opengraph-image`,
        description:
          "Образовна платформа за приватни часови, колоквиумска и испитна подготовка за студенти на ФИНКИ, ФЕИТ, МФС и Економски во Скопје и онлајн.",
        telephone: PHONE.e164,
        ...(EMAIL ? { email: EMAIL } : {}),
        address: {
          "@type": "PostalAddress",
          addressLocality: ADDRESS.city,
          addressCountry: ADDRESS.country,
        },
        areaServed: { "@type": "Country", name: "North Macedonia" },
        availableLanguage: "mk",
        sameAs: SOCIALS.map((s) => s.href),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Кодрум",
        publisher: { "@id": ORG_ID },
        inLanguage: "mk-MK",
      },
    ],
  };
}

/** BreadcrumbList: Home → this page. `name` is the visible page name. */
export function breadcrumbLd(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Почетна", item: SITE_URL },
      { "@type": "ListItem", position: 2, name, item: `${SITE_URL}${path}` },
    ],
  };
}

/** Active prep sessions from Strapi as Course + CourseInstance + Offer. Only fields the data really has. */
export function prepCoursesLd(sessions: PrepSession[]) {
  if (sessions.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: sessions.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Course",
        name: s.title,
        description: s.description,
        inLanguage: "mk",
        provider: { "@id": ORG_ID },
        url: `${SITE_URL}/pripremi`,
        hasCourseInstance: {
          "@type": "CourseInstance",
          ...(s.startDateIso ? { startDate: s.startDateIso } : {}),
          ...(s.endDateIso ? { endDate: s.endDateIso } : {}),
          ...(s.instructor
            ? {
                instructor: s.instructor
                  .split(",")
                  .map((n) => ({ "@type": "Person", name: n.trim() })),
              }
            : {}),
        },
        ...(s.price != null
          ? {
              offers: {
                "@type": "Offer",
                price: s.price,
                priceCurrency: "MKD",
                url: `${SITE_URL}/pripremi`,
                availability:
                  s.spotsLeft > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/SoldOut",
              },
            }
          : {}),
      },
    })),
  };
}
