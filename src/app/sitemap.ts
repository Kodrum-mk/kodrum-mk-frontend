import type { MetadataRoute } from "next";

const BASE_URL = "https://kodrum.mk";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
"/pripremi",
    "/promo-paketi",
    "/kontakt",
    "/help",
    "/cpp",
    "/privatnost",
    "/uslovi",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
