import type { MetadataRoute } from "next";

const BASE_URL = "https://kodrum.mk";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Array<{
    path: string;
    priority: number;
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  }> = [
    { path: "", priority: 1.0, changeFrequency: "daily" },
    // { path: "/privatni-casovi-finki", priority: 1.0, changeFrequency: "daily" },
    { path: "/pripremi", priority: 0.9, changeFrequency: "daily" },
    { path: "/promo-paketi", priority: 0.8, changeFrequency: "weekly" },
    { path: "/kontakt", priority: 0.8, changeFrequency: "weekly" },
    { path: "/cpp", priority: 0.7, changeFrequency: "monthly" },
    { path: "/help", priority: 0.6, changeFrequency: "monthly" },
    { path: "/privatnost", priority: 0.3, changeFrequency: "yearly" },
    { path: "/uslovi", priority: 0.3, changeFrequency: "yearly" },
  ];

  const now = new Date();

  return routes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
