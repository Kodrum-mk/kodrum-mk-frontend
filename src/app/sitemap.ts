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
  const lastModified = new Date("2025-06-01");

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
