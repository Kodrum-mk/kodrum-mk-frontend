import type { PromoPackage } from "@/types";
import { fallbackPromoPackages } from "@/data/promoPackages";

const STRAPI_BASE_URL = `${process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337"}/api`;

type StrapiListResponse<T> = {
  data?: T[];
};

type PromoPackageEntity = {
  id?: number;
  documentId?: string;
  title?: string;
  description?: string;
  badge?: string;
  featured?: boolean;
  originalPrice?: string;
  discount?: string;
  savings?: string;
  courses?: unknown;
  includes?: unknown;
  noteText?: string;
  registrationUrl?: string;
  attributes?: Record<string, unknown>;
};

type PromoPackagesLoadResult = {
  packages: PromoPackage[];
  source: "strapi" | "fallback";
  errorMessage?: string;
};

function getEntityField<T>(entity: PromoPackageEntity, key: string): T | undefined {
  const direct = (entity as Record<string, unknown>)[key] as T | undefined;
  if (direct !== undefined) return direct;
  return entity.attributes?.[key] as T | undefined;
}

function sanitizeStringArray(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function normalizePromoPackage(entity: PromoPackageEntity): PromoPackage | null {
  const title = getEntityField<string>(entity, "title")?.trim();
  const description = getEntityField<string>(entity, "description")?.trim();
  const originalPrice = getEntityField<string>(entity, "originalPrice")?.trim();
  const discount = getEntityField<string>(entity, "discount")?.trim();
  const savings = getEntityField<string>(entity, "savings")?.trim();
  const registrationUrl = getEntityField<string>(entity, "registrationUrl")?.trim();
  const courses = sanitizeStringArray(getEntityField<unknown>(entity, "courses"));
  const includes = sanitizeStringArray(getEntityField<unknown>(entity, "includes"));

  if (
    !title
    || !description
    || !originalPrice
    || !discount
    || !savings
    || !registrationUrl
    || courses.length === 0
    || includes.length === 0
  ) {
    return null;
  }

  return {
    id: getEntityField<string>(entity, "documentId") ?? String(getEntityField<number>(entity, "id") ?? title),
    badge: getEntityField<string>(entity, "badge")?.trim(),
    featured: Boolean(getEntityField<boolean>(entity, "featured")),
    title,
    description,
    originalPrice,
    discount,
    savings,
    courses,
    includes,
    noteText: getEntityField<string>(entity, "noteText")?.trim(),
    registrationUrl,
  };
}

export async function loadPromoPackages(signal?: AbortSignal): Promise<PromoPackagesLoadResult> {
  try {
    const response = await fetch(`${STRAPI_BASE_URL}/promo-packages?sort[0]=featured:desc&sort[1]=title:asc`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      signal,
    });

    if (!response.ok) {
      throw new Error(`Strapi request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as StrapiListResponse<PromoPackageEntity>;
    const packages = Array.isArray(payload.data)
      ? payload.data
        .map((item) => normalizePromoPackage(item))
        .filter((item): item is PromoPackage => item !== null)
      : [];

    if (packages.length === 0) {
      throw new Error("Strapi returned no valid promo packages");
    }

    return { packages, source: "strapi" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Неуспешно вчитување на промо пакетите.";
    return {
      packages: fallbackPromoPackages,
      source: "fallback",
      errorMessage: message,
    };
  }
}
