import type { PrepDateBlock, PrepSession } from "@/types";

const STRAPI_BASE_URL = `${process.env.STRAPI_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337"}/api`;
const PREP_SOURCE = process.env.NEXT_PUBLIC_PREP_DATA_SOURCE ?? "strapi";

const ACTIVE_PREP_SESSION_QUERY =
  "filters[active][$eq]=true" +
  "&populate[subjects][populate][0]=faculty" +
  "&populate[subjects][populate][1]=instructors" +
  "&populate[subjects][populate][2]=scheduleBlocks" +
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

type StrapiScheduleBlock = {
  id?: number;
  startDate?: string | null;
  durationDays?: number | null;
  note?: string | null;
};

type StrapiSubject = {
  id?: number;
  documentId?: string;
  name?: string;
  slug?: string;
  startDate?: string;
  examDate?: string;
  duration?: string;
  hasGapDays?: boolean;
  scheduleBlocks?: StrapiScheduleBlock[] | null;
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

const MACEDONIAN_MONTHS = [
  "Јануари",
  "Февруари",
  "Март",
  "Април",
  "Мај",
  "Јуни",
  "Јули",
  "Август",
  "Септември",
  "Октомври",
  "Ноември",
  "Декември",
];

function extractDaysFromDuration(duration: string): number {
  const match = duration.match(/(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 1;
}

/**
 * Parses a `YYYY-MM-DD` day into a UTC-anchored date. Every date derived here
 * stays in UTC so adding days and formatting never shift across a timezone or
 * DST boundary.
 */
function parseIsoDay(value: string | null | undefined): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value).trim());
  if (!match) return null;
  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
  );
  return Number.isNaN(date.getTime()) ? null : date;
}

function toIsoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(iso: string, days: number): string {
  const date = parseIsoDay(iso);
  if (!date) return iso;
  date.setUTCDate(date.getUTCDate() + days);
  return toIsoDay(date);
}

function macedonianOrdinal(day: number): string {
  if ([1, 21, 31].includes(day)) return "ви";
  if ([2, 22].includes(day)) return "ри";
  if ([7, 8, 27, 28].includes(day)) return "ми";
  return "ти";
}

function formatMacedonianDate(dateStr: string): string {
  const date = parseIsoDay(dateStr);
  if (!date) return dateStr;
  const day = date.getUTCDate();
  return `${day}${macedonianOrdinal(day)} ${MACEDONIAN_MONTHS[date.getUTCMonth()]}`;
}

function daysBetween(startIso: string, endIso: string): number {
  const start = parseIsoDay(startIso);
  const end = parseIsoDay(endIso);
  if (!start || !end) return 1;
  return Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
}

/** "11ти Септември", "11ти – 12ти Септември", "30ти Август – 2ри Септември". */
function formatDateRange(startIso: string, endIso: string): string {
  const start = parseIsoDay(startIso);
  const end = parseIsoDay(endIso);
  if (!start || !end || startIso === endIso) {
    return formatMacedonianDate(startIso);
  }
  if (
    start.getUTCFullYear() === end.getUTCFullYear() &&
    start.getUTCMonth() === end.getUTCMonth()
  ) {
    const startDay = start.getUTCDate();
    return `${startDay}${macedonianOrdinal(startDay)} – ${formatMacedonianDate(endIso)}`;
  }
  return `${formatMacedonianDate(startIso)} – ${formatMacedonianDate(endIso)}`;
}

function blockLabel(startIso: string, endIso: string, note?: string): string {
  const range = formatDateRange(startIso, endIso);
  if (!note) return range;
  // The joined label list is rendered by splitting on commas, so a note may not
  // introduce one of its own.
  const safeNote = note.replace(/,/g, " ").replace(/\s+/g, " ").trim();
  return safeNote ? `${range} (${safeNote})` : range;
}

/**
 * Collapses blocks that overlap in time — an admin typo such as "11 Sep for 5
 * days" next to "13 Sep for 2 days" — so the calendar draws one bar and the
 * total day count does not double-count the shared days.
 */
function mergeOverlappingBlocks(
  blocks: { startIso: string; endIso: string; note?: string }[],
) {
  const merged: { startIso: string; endIso: string; note?: string }[] = [];

  blocks.forEach((block) => {
    const previous = merged[merged.length - 1];
    if (previous && block.startIso <= previous.endIso) {
      merged[merged.length - 1] = {
        startIso: previous.startIso,
        endIso: block.endIso > previous.endIso ? block.endIso : previous.endIso,
        note: previous.note ?? block.note,
      };
      return;
    }
    merged.push(block);
  });

  return merged;
}

function formatDays(days: number): string {
  return days === 1 ? "1 ден" : `${days} дена`;
}

function formatBlockCount(count: number): string {
  if (count === 1) return "1 термин";
  if (count < 5) return `${count} термина`;
  return `${count} термини`;
}

/**
 * Keeps only the descriptive half of a free-text duration
 * ("3 дена, 2 часа дневно" -> "2 часа дневно") so a derived block summary can
 * carry it along without repeating the day count.
 */
function extraDurationInfo(duration: string | undefined): string | null {
  if (!duration) return null;
  const commaIndex = duration.indexOf(",");
  const remainder =
    commaIndex === -1 ? duration : duration.slice(commaIndex + 1);
  const trimmed = remainder.trim();
  if (!trimmed) return null;
  if (/^\d+\s*(ден|дена|денови)?$/i.test(trimmed)) return null;
  return trimmed;
}

/**
 * Turns the repeatable `scheduleBlocks` component into chronologically sorted
 * blocks of consecutive class days. Rows with a missing or malformed date drop
 * out rather than poisoning the derived start and end dates.
 */
function buildDateBlocks(subject: StrapiSubject): PrepDateBlock[] {
  if (!subject.hasGapDays) return [];

  const rows = Array.isArray(subject.scheduleBlocks)
    ? subject.scheduleBlocks
    : [];

  const spans = rows
    .map((row) => {
      const start = parseIsoDay(row?.startDate);
      if (!start) return null;

      const rawDays = Number(row?.durationDays ?? 1);
      const days =
        Number.isFinite(rawDays) && rawDays >= 1 ? Math.floor(rawDays) : 1;
      const startIso = toIsoDay(start);

      return {
        startIso,
        endIso: addDays(startIso, days - 1),
        note: row?.note?.trim() || undefined,
      };
    })
    .filter((span): span is NonNullable<typeof span> => span !== null)
    // The admin can drag repeatable entries into any order, so chronology is
    // established here rather than trusted from the payload.
    .sort((a, b) => a.startIso.localeCompare(b.startIso));

  return mergeOverlappingBlocks(spans).map((span) => ({
    startIso: span.startIso,
    endIso: span.endIso,
    days: daysBetween(span.startIso, span.endIso),
    label: blockLabel(span.startIso, span.endIso, span.note),
    note: span.note,
  }));
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

  // Subjects that run in several blocks with gap days derive their dates and
  // duration from the blocks; every other subject keeps the legacy single
  // startDate + free-text duration behaviour untouched.
  const dateBlocks = buildDateBlocks(subject);
  const usesBlocks = dateBlocks.length > 0;

  let durationStr: string;
  let startDateIso: string | undefined;
  let endDateIso: string | undefined;

  if (usesBlocks) {
    const totalDays = dateBlocks.reduce((sum, block) => sum + block.days, 0);
    let summary = formatDays(totalDays);
    if (dateBlocks.length > 1) {
      summary += ` (${formatBlockCount(dateBlocks.length)})`;
    }
    const extra = extraDurationInfo(subject.duration?.trim());
    durationStr = extra ? `${summary}, ${extra}` : summary;

    startDateIso = dateBlocks[0].startIso;
    endDateIso = dateBlocks[dateBlocks.length - 1].endIso;
  } else {
    let legacyDuration = subject.duration?.trim();
    if (legacyDuration && /^\d+$/.test(legacyDuration)) {
      legacyDuration += " денови";
    }
    durationStr = legacyDuration || "По договор";

    startDateIso = subject.startDate?.trim() || undefined;
    endDateIso = startDateIso;
    if (startDateIso) {
      const days = extractDaysFromDuration(durationStr);
      if (days > 1) {
        endDateIso = addDays(startDateIso, days - 1);
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
    startDateIso,
    endDateIso,
    startDate: startDateIso
      ? formatMacedonianDate(startDateIso)
      : "Непознат датум",
    dateBlocks: usesBlocks ? dateBlocks : undefined,
    datesLabel: usesBlocks
      ? dateBlocks.map((block) => block.label).join(", ")
      : undefined,
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

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal,
    });
  } catch (error) {
    if (isAbortError(error)) throw error;
    // A cross-origin block, DNS failure or unreachable host all surface as a
    // bare TypeError here, with no response to inspect. Tag it while we still
    // know it came from the request itself and not from parsing the payload.
    throw new Error(
      `Network request to Strapi failed, likely CORS or an unreachable host (${
        error instanceof Error ? error.message : String(error)
      })`,
      { cause: error },
    );
  }

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

// fetch rejects with a DOMException rather than an Error, so match on the name
// instead of the constructor. AbortSignal.timeout() names its reason TimeoutError.
function isAbortError(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("name" in error)) {
    return false;
  }
  const name = (error as { name: unknown }).name;
  return name === "AbortError" || name === "TimeoutError";
}

function describeLoadFailure(error: unknown): string {
  if (isAbortError(error)) {
    return "Request to Strapi was aborted — it timed out or the page navigated away";
  }

  return error instanceof Error ? error.message : String(error);
}

export async function loadPrepSessions(
  signal?: AbortSignal,
): Promise<PrepSessionsLoadResult> {
  if (getPrepDataSourcePreference() === "mock") {
    return {
      sessions: [],
      source: "fallback",
      errorMessage: "System is in mock mode and data has not been loaded.",
    };
  }

  try {
    const sessions = await fetchPrepSessionsFromStrapi(signal);
    return {
      sessions,
      source: "strapi",
    };
  } catch (error) {
    console.error("Failed to load active prep session from Strapi", {
      detail: describeLoadFailure(error),
      endpoint: `${STRAPI_BASE_URL}/prep-sessions`,
      baseUrl: STRAPI_BASE_URL,
      error,
    });

    return {
      sessions: [],
      source: "strapi",
      errorMessage:
        "Моментално не можеме да ги вчитаме активните припреми. Обиди се повторно за неколку минути.",
    };
  }
}
