import type { PrepSession } from "@/types";
import { fallbackPrepSessions } from "@/data/prepSessions";

const STRAPI_BASE_URL = `${process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337"}/api`;
const PREP_SOURCE = process.env.NEXT_PUBLIC_PREP_DATA_SOURCE ?? "strapi";

// populate[faculty]=* causes 400 in Strapi 5 due to circular back-relation on faculty.prepSessions
// Use field-level syntax to select only the fields we need
const PREP_SESSIONS_QUERY =
  "populate[faculty][fields][0]=name&populate[faculty][fields][1]=slug&populate[faculty][fields][2]=shortCode&populate[faculty][fields][3]=color" +
  "&populate[instructor][fields][0]=name&populate[instructor][fields][1]=slug&populate[instructor][fields][2]=title&populate[instructor][fields][3]=bio" +
  "&sort=startDate:asc&pagination[page]=1&pagination[pageSize]=25&pagination[withCount]=true";
const NO_MORE_REGISTRATIONS_STATUS = "Нема повеќе пријавувања";

type StrapiListResponse<T> = {
  data?: T[];
  meta?: unknown;
};

type StrapiEntity = {
  id?: number;
  documentId?: string;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  dateRange?: string;
  duration?: string;
  price?: number;
  spotsLeft?: number;
  totalSpots?: number;
  level?: string;
  status?: string;
  registrationStatus?: string;
  format?: string;
  registrationUrl?: string;
  calendarDates?: unknown;
  faculty?: StrapiRelation;
  instructor?: StrapiRelation;
  attributes?: Record<string, unknown>;
};

type StrapiRelation = {
  id?: number;
  documentId?: string;
  name?: string;
  shortCode?: string;
  slug?: string;
  color?: string;
  attributes?: Record<string, unknown>;
  data?: StrapiRelation | null;
} | null;

export type PrepSessionsLoadResult = {
  sessions: PrepSession[];
  source: "strapi" | "fallback";
  errorMessage?: string;
};

function getEntityField<T>(
  entity: StrapiEntity | StrapiRelation,
  key: string,
): T | undefined {
  if (!entity) return undefined;
  const direct = (entity as Record<string, unknown>)[key] as T | undefined;
  if (direct !== undefined) return direct;
  const attrs = (entity as { attributes?: Record<string, unknown> }).attributes;
  if (!attrs) return undefined;
  return attrs[key] as T | undefined;
}

function getRelationEntity(relation: StrapiRelation): StrapiRelation {
  if (!relation) return null;
  const nested = (relation as { data?: StrapiRelation }).data;
  return nested ?? relation;
}

function sanitizeCalendarDates(input: unknown): number[] {
  if (!Array.isArray(input)) return [];
  const numbers = input
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value >= 1 && value <= 31);
  return Array.from(new Set(numbers)).sort((a, b) => a - b);
}

function toMkDateLabel(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return "";
  const formatted = new Intl.DateTimeFormat("mk-MK", {
    day: "numeric",
    month: "long",
  }).format(parsed);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function deriveCalendarDates(startDate?: string, endDate?: string): number[] {
  if (!startDate || !endDate) return [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end < start
  ) {
    return [];
  }

  const days: number[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    days.push(cursor.getDate());
    cursor.setDate(cursor.getDate() + 1);
  }
  return Array.from(new Set(days));
}

function deriveDateRange(startDate?: string, endDate?: string): string {
  if (!startDate) return "";
  if (!endDate) return toMkDateLabel(startDate);
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "";

  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = toMkDateLabel(startDate).split(" ")[1] ?? "";
  const endMonth = toMkDateLabel(endDate).split(" ")[1] ?? "";

  if (startMonth && endMonth && startMonth === endMonth) {
    return `${startDay} - ${endDay} ${startMonth}`;
  }

  return `${toMkDateLabel(startDate)} - ${toMkDateLabel(endDate)}`;
}

function isUsefulDateRange(value?: string): value is string {
  if (!value) return false;
  const trimmed = value.trim();
  return /[а-шa-z]/i.test(trimmed);
}

function mapLevel(level?: string): string {
  switch (level) {
    case "Beginner":
      return "Почетник";
    case "Intermediate":
      return "Среден";
    case "Advanced":
      return "Напредно";
    default:
      return level ?? "Непознато";
  }
}

function mapStatus(status?: string): string {
  switch (status) {
    case "Registration Open":
      return "Запишување во тек";
    case "Registration Closed":
      return "Запишување затворено";
    case "Draft":
      return "Во подготовка";
    case "Completed":
      return "Завршено";
    default:
      return status ?? "Непознато";
  }
}

function mapFormat(format?: string): string {
  switch (format) {
    case "Hybrid":
      return "Хибрид";
    case "In person":
      return "Во живо";
    case "Online":
      return "Онлајн";
    default:
      return format ?? "Непознато";
  }
}

function normalizePrice(price: unknown): number | undefined {
  const parsed = Number(price);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : undefined;
}

function normalizeSpotsLeft(spotsLeft: unknown): number {
  const parsed = Number(spotsLeft);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed) : 7;
}

function normalizeTotalSpots(totalSpots: unknown): number {
  const parsed = Number(totalSpots);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : 10;
}

function parseIsoDateLocal(value?: string) {
  if (!value) return null;
  const parts = value.split("-").map(Number);
  const parsed =
    parts.length === 3 && parts.every(Number.isFinite)
      ? new Date(parts[0], parts[1] - 1, parts[2])
      : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function applyPrepSessionDateRules(sessions: PrepSession[]): PrepSession[] {
  const today = startOfLocalDay(new Date());

  return sessions
    .filter((session) => {
      const end = parseIsoDateLocal(session.endDateIso ?? session.startDateIso);
      return !end || startOfLocalDay(end) >= today;
    })
    .map((session) => {
      const start = parseIsoDateLocal(session.startDateIso);
      const end = parseIsoDateLocal(session.endDateIso ?? session.startDateIso);

      if (!start || !end) return session;

      const startDay = startOfLocalDay(start);
      const endDay = startOfLocalDay(end);
      if (startDay <= today && today <= endDay) {
        return {
          ...session,
          status: NO_MORE_REGISTRATIONS_STATUS,
        };
      }

      return session;
    });
}

function normalizePrepSession(entity: StrapiEntity): PrepSession | null {
  const relationFaculty = getRelationEntity(entity.faculty ?? null);
  const relationInstructor = getRelationEntity(entity.instructor ?? null);

  const title = getEntityField<string>(entity, "title")?.trim();
  const description = getEntityField<string>(entity, "description")?.trim();
  const duration = getEntityField<string>(entity, "duration")?.trim();
  const price = normalizePrice(getEntityField<number>(entity, "price"));
  const spotsLeft = normalizeSpotsLeft(
    getEntityField<number>(entity, "spotsLeft"),
  );
  const totalSpots = normalizeTotalSpots(
    getEntityField<number>(entity, "totalSpots"),
  );
  const registrationUrl = getEntityField<string>(
    entity,
    "registrationUrl",
  )?.trim();

  if (!title || !description || !duration) return null;

  const startDateIso = getEntityField<string>(entity, "startDate");
  const endDateIso = getEntityField<string>(entity, "endDate");
  const dateRangeStored = getEntityField<string>(entity, "dateRange")?.trim();
  const calendarDatesRaw = getEntityField<unknown>(entity, "calendarDates");
  const calendarDates = sanitizeCalendarDates(calendarDatesRaw);

  const documentId = getEntityField<string>(entity, "documentId");
  const numericId = getEntityField<number>(entity, "id");

  const facultyName =
    getEntityField<string>(relationFaculty, "shortCode") ||
    getEntityField<string>(relationFaculty, "name") ||
    "Непознат факултет";

  const instructorName =
    getEntityField<string>(relationInstructor, "name") || "Непознат инструктор";

  const startDateLabel = startDateIso ? toMkDateLabel(startDateIso) : "";

  return {
    id: documentId ?? String(numericId ?? title),
    title,
    description,
    faculty: facultyName,
    instructor: instructorName,
    startDateIso,
    endDateIso,
    startDate: startDateLabel || "Непознат датум",
    dateRange: isUsefulDateRange(dateRangeStored)
      ? dateRangeStored
      : deriveDateRange(startDateIso, endDateIso) || startDateLabel,
    duration,
    price,
    spotsLeft,
    totalSpots,
    level: mapLevel(getEntityField<string>(entity, "level")),
    status: mapStatus(
      getEntityField<string>(entity, "status") ??
        getEntityField<string>(entity, "registrationStatus"),
    ),
    format: mapFormat(getEntityField<string>(entity, "format")),
    registrationUrl:
      registrationUrl ||
      "https://docs.google.com/forms/d/e/1FAIpQLScxb4pyK4RWKZ3HyDqeyJkUacK7od1odn5UPO3tKNbLYCjagQ/viewform?usp=send_form",
    calendarDates:
      calendarDates.length > 0
        ? calendarDates
        : deriveCalendarDates(startDateIso, endDateIso),
  };
}

function normalizeStrapiList(payload: unknown): PrepSession[] {
  if (!payload || typeof payload !== "object") return [];
  const response = payload as StrapiListResponse<StrapiEntity>;
  if (!Array.isArray(response.data)) return [];

  return response.data
    .map((item) => normalizePrepSession(item))
    .filter((item): item is PrepSession => item !== null);
}

export function getPrepDataSourcePreference(): "strapi" | "mock" {
  return PREP_SOURCE === "mock" ? "mock" : "strapi";
}

export async function fetchPrepSessionsFromStrapi(
  signal?: AbortSignal,
): Promise<PrepSession[]> {
  const url = `${STRAPI_BASE_URL}/prep-sessions?${PREP_SESSIONS_QUERY}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error(`Strapi request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as unknown;
  const sessions = normalizeStrapiList(payload);

  if (sessions.length === 0) {
    throw new Error("Strapi returned no valid prep sessions");
  }

  return applyPrepSessionDateRules(sessions);
}

export async function loadPrepSessions(
  signal?: AbortSignal,
): Promise<PrepSessionsLoadResult> {
  if (getPrepDataSourcePreference() === "mock") {
    return {
      sessions: applyPrepSessionDateRules(fallbackPrepSessions),
      source: "fallback",
    };
  }

  try {
    const sessions = await fetchPrepSessionsFromStrapi(signal);
    return {
      sessions,
      source: "strapi",
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        sessions: applyPrepSessionDateRules(fallbackPrepSessions),
        source: "fallback",
        errorMessage:
          "Вчитувањето на CMS податоците истече. Прикажуваме резервна верзија.",
      };
    }

    if (process.env.NODE_ENV !== "production") {
      console.warn("Failed to load prep sessions from Strapi", {
        error,
        endpoint: `${STRAPI_BASE_URL}/prep-sessions`,
        baseUrl: STRAPI_BASE_URL,
      });
    }

    return {
      sessions: applyPrepSessionDateRules(fallbackPrepSessions),
      source: "fallback",
      errorMessage:
        "Не можевме да ги вчитаме најновите податоци од CMS. Прикажуваме резервна верзија.",
    };
  }
}
