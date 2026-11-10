import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const STRAPI = `${process.env.STRAPI_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337"}/api`;

// Only when this is Strapi's own `updatedAt`: a made-up date would teach crawlers to ignore lastmod.
async function lastUpdated(endpoint: string): Promise<Date | undefined> {
  try {
    const res = await fetch(
      `${STRAPI}/${endpoint}?sort=updatedAt:desc&pagination[pageSize]=1&fields[0]=updatedAt`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return undefined;
    const value = ((await res.json()) as { data?: { updatedAt?: string }[] })
      .data?.[0]?.updatedAt;
    const date = value ? new Date(value) : undefined;
    return date && !Number.isNaN(date.getTime()) ? date : undefined;
  } catch {
    return undefined;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [preps, promos] = await Promise.all([
    lastUpdated("prep-sessions"),
    lastUpdated("promo-packages"),
  ]);

  const routes: {
    path: string;
    priority: number;
    changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
    lastModified?: Date;
  }[] = [
    { path: "", priority: 1.0, changeFrequency: "daily" },
    // { path: "/privatni-casovi-finki", priority: 1.0, changeFrequency: "daily" },
    {
      path: "/pripremi",
      priority: 0.9,
      changeFrequency: "daily",
      lastModified: preps,
    },
    {
      path: "/promo-paketi",
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: promos,
    },
    { path: "/kontakt", priority: 0.8, changeFrequency: "weekly" },
    { path: "/cpp", priority: 0.7, changeFrequency: "monthly" },
    { path: "/help", priority: 0.6, changeFrequency: "monthly" },
    { path: "/privatnost", priority: 0.3, changeFrequency: "yearly" },
    { path: "/uslovi", priority: 0.3, changeFrequency: "yearly" },
  ];

  return routes.map(({ path, ...rest }) => ({
    url: `${SITE_URL}${path}`,
    ...rest,
  }));
}
