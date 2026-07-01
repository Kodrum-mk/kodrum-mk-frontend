import type { PrepSession } from "@/types";
import { fallbackPrepSessions } from "@/data/prepSessions";

const STRAPI_BASE_URL = `${process.env.STRAPI_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337"}/api`;
const PREP_SOURCE = process.env.NEXT_PUBLIC_PREP_DATA_SOURCE ?? "strapi";

const ACTIVE_PREP_SESSION_QUERY =
  "filters[active][$eq]=true" +
  "&populate[subjects][populate][0]=faculty" +
  "&populate[subjects][populate][1]=instructors" +
  "&sort[0]=title:asc" +
  "&pagination[page]=1" +
  "&pagination[pageSize]=50";

type StrapiListResponse<T> = {
  data?: T[];
};

type StrapiPrepSession = {
  id?: number;
  documentId?: string;
  title?: string;
  subjects?: StrapiSubject[];
};

type StrapiSubject = {
  id?: number;
  documentId?: string;
  name?: string;
  slug?: string;
  startDate?: string;
  examDate?: string;
  duration?: string;
  price?: number;
  spotsLeft?: number;
  faculty?: StrapiFaculty | null;
  instructors?: StrapiInstructor[];
};

type StrapiFaculty = {
  name?: string;
  shortCode?: string;
};

type StrapiInstructor = {
  name?: string;
};

export type PrepSessionsLoadResult = {
  sessions: PrepSession[];
  source: "strapi" | "fallback";
  errorMessage?: string;
};

function extractDaysFromDuration(duration: string): number {
  const match = duration.match(/(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 1;
}

function formatMacedonianDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  
  const day = date.getDate();
  let suffix = "ти";
  if ([1, 21, 31].includes(day)) suffix = "ви";
  else if ([2, 22].includes(day)) suffix = "ри";
  else if ([7, 8, 27, 28].includes(day)) suffix = "ми";
  
  const monthNames = [
    "Јануари", "Февруари", "Март", "Април", "Мај", "Јуни",
    "Јули", "Август", "Септември", "Октомври", "Ноември", "Декември"
  ];
  const month = monthNames[date.getMonth()];
  
  return `${day}${suffix} ${month}`;
}

function mapSubjectToPrepSession(
  subject: StrapiSubject,
  prepSessionId: string | undefined,
  prepSessionTitle: string,
): PrepSession | null {
  const title = subject.name?.trim();
  if (!title) return null;

  const faculty =
    subject.faculty?.shortCode?.trim() ||
    subject.faculty?.name?.trim() ||
    "Непознат факултет";
  const instructorNames = (subject.instructors ?? [])
    .map((instructor) => instructor.name?.trim())
    .filter((name): name is string => Boolean(name));
  let durationStr = subject.duration?.trim();
  if (durationStr && /^\d+$/.test(durationStr)) {
    durationStr += " денови";
  }
  durationStr = durationStr || "По договор";
  
  const startDateStr = subject.startDate?.trim();
  let endDateIso = startDateStr;
  if (startDateStr) {
    const days = extractDaysFromDuration(durationStr);
    if (days > 1) {
      const date = new Date(startDateStr);
      if (!Number.isNaN(date.getTime())) {
        date.setDate(date.getDate() + days - 1);
        endDateIso = date.toISOString().split("T")[0];
      }
    }
  }

  return {
    id: subject.documentId ?? String(subject.id ?? subject.slug ?? title),
    subjectId: subject.documentId ?? String(subject.id ?? ""),
    prepSessionId,
    title,
    description: `Припрема за ${title}.`,
    faculty,
    instructor:
      instructorNames.length > 0
        ? instructorNames.join(", ")
        : "Непознат инструктор",
    startDateIso: startDateStr,
    endDateIso,
    startDate: startDateStr ? formatMacedonianDate(startDateStr) : "Непознат датум",
    examDate: subject.examDate ? formatMacedonianDate(subject.examDate) : undefined,
    duration: durationStr,
    price: subject.price ?? 2500,
    spotsLeft: subject.spotsLeft ?? 10,
    level: "Почетник",
    status: "Запишување во тек",
    format: "Онлајн или физички",
  };
}

function normalizeActivePrepSession(payload: unknown): PrepSession[] {
  if (!payload || typeof payload !== "object") return [];

  const response = payload as StrapiListResponse<StrapiPrepSession>;
  const sessions = (response.data ?? []).flatMap((activePrepSession) => {
    const prepSessionTitle =
      activePrepSession.title?.trim() || "Активна припрема";
    const prepSessionId =
      activePrepSession.documentId ?? String(activePrepSession.id ?? "");

    return (activePrepSession.subjects ?? [])
      .map((subject) =>
        mapSubjectToPrepSession(
          subject,
          prepSessionId,
          prepSessionTitle,
        ),
      )
      .filter((session): session is PrepSession => session !== null);
  });

  return Array.from(
    new Map(sessions.map((session) => [session.id, session])).values(),
  );
}

export function getPrepDataSourcePreference(): "strapi" | "mock" {
  return PREP_SOURCE === "mock" ? "mock" : "strapi";
}

export async function fetchPrepSessionsFromStrapi(
  signal?: AbortSignal,
): Promise<PrepSession[]> {
  const url = `${STRAPI_BASE_URL}/prep-sessions?${ACTIVE_PREP_SESSION_QUERY}`;
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error(`Strapi request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as unknown;
  const sessions = normalizeActivePrepSession(payload);

  if (sessions.length === 0) {
    throw new Error("Strapi returned no subjects for active prep session");
  }

  return sessions;
}

export async function loadPrepSessions(
  signal?: AbortSignal,
): Promise<PrepSessionsLoadResult> {
  if (getPrepDataSourcePreference() === "mock") {
    return {
      sessions: [],
      source: "fallback",
      errorMessage: "Системот е во тест режим и податоците не се вчитани.",
    };
  }

  try {
    const sessions = await fetchPrepSessionsFromStrapi(signal);
    return {
      sessions,
      source: "strapi",
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Failed to load active prep session from Strapi", {
        error,
        endpoint: `${STRAPI_BASE_URL}/prep-sessions`,
        baseUrl: STRAPI_BASE_URL,
      });
    }

    return {
      sessions: [],
      source: "strapi",
      errorMessage:
        "Податоците моментално се освежуваат или системот се редеплоира. Ве молиме обидете се повторно за неколку минути.",
    };
  }
}
