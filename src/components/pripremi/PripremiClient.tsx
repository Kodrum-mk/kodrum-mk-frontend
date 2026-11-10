"use client";

import { eventColors } from "@/data/prepSessions";
import { loadPrepSessions } from "@/data/prepSessionsApi";
import type { PrepSession, ReferralSource, SignupFormState } from "@/types";
import { cn } from "@/utils/cn";
import {
  Calendar as CalendarIcon,
  Clock,
  FileText,
  GraduationCap,
  Search,
  User,
} from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { PrepPrice } from "./PrepPrice";

const referralSourceOptions: { value: ReferralSource; label: string }[] = [
  { value: "social", label: "Содржина на социјални мрежи" },
  { value: "friend", label: "Пријател" },
  { value: "group", label: "Порака во група" },
  { value: "returning", label: "Повторно се пријавувам" },
  { value: "other", label: "Друго" },
];

// The API stores the referral source as free text, so send the human-readable
// label of the picked option — or, for "other", whatever the user typed.
function getReferralSourceLabel(form: SignupFormState) {
  if (form.referralSource === "other") {
    return form.referralSourceOther.trim();
  }
  const option = referralSourceOptions.find(
    (item) => item.value === form.referralSource,
  );
  return option?.label ?? "";
}

const emptySignupForm: SignupFormState = {
  ime: "",
  prezime: "",
  email: "",
  telefon: "",
  discordUsername: "",
  attendancePreference: "physical",
  referralSource: "",
  referralSourceOther: "",
  referredBy: "",
  poraka: "",
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function SessionCardSkeleton() {
  return (
    <div className="rounded-3xl border-2 border-line bg-white p-6 shadow-[0_24px_50px_-40px_rgba(30,66,74,.6)] min-h-[540px] animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-28 rounded-full bg-teal-lt" />
        <div className="h-6 w-20 rounded bg-yellow/30" />
      </div>
      <div className="h-7 w-3/4 rounded bg-paper-3 mb-3" />
      <div className="space-y-2 mb-5">
        <div className="h-4 w-full rounded bg-paper-3" />
        <div className="h-4 w-5/6 rounded bg-paper-3" />
        <div className="h-4 w-2/3 rounded bg-paper-3" />
      </div>
      <div className="space-y-3 mb-5 pb-5 border-b border-line">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-4 w-4/5 rounded bg-paper-3" />
        ))}
      </div>
      <div className="h-11 w-full rounded-lg bg-teal/20 mt-auto" />
    </div>
  );
}

function CalendarSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8">
      <div className="rounded-3xl border-2 border-line bg-white p-6 shadow-[0_24px_50px_-40px_rgba(30,66,74,.6)] animate-pulse">
        <div className="h-8 w-40 rounded bg-paper-3 mb-6" />
        <div className="grid grid-cols-7 gap-1 mb-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="h-6 rounded bg-paper-3" />
          ))}
        </div>
        <div className="space-y-1">
          {Array.from({ length: 5 }).map((_, row) => (
            <div key={row} className="grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }).map((__, col) => (
                <div
                  key={`${row}-${col}`}
                  className="h-[100px] rounded-lg border border-line bg-paper-2"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-3xl border-2 border-line bg-white p-6 shadow-[0_24px_50px_-40px_rgba(30,66,74,.6)] animate-pulse">
        <div className="h-7 w-48 rounded bg-paper-3 mb-5" />
        <div className="h-6 w-20 rounded bg-yellow/30 mb-4" />
        <div className="h-8 w-3/4 rounded bg-paper-3 mb-4" />
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full rounded bg-paper-3" />
          <div className="h-4 w-5/6 rounded bg-paper-3" />
        </div>
        <div className="space-y-4 border-y border-line py-4 mb-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-10 w-full rounded bg-paper-3" />
          ))}
        </div>
        <div className="h-11 w-full rounded-lg bg-teal/20" />
      </div>
    </div>
  );
}

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(month: number, year: number) {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}

function buildCalendarWeeks(month: number, year: number): (number | null)[][] {
  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstDay).fill(null);

  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

const defaultEventPalette = [
  { bg: "rgba(0, 128, 129, 0.15)", text: "#008081" },
  { bg: "rgba(99, 102, 241, 0.15)", text: "#6366F1" },
  { bg: "rgba(34, 197, 94, 0.15)", text: "#22C55E" },
  { bg: "rgba(59, 130, 246, 0.15)", text: "#3B82F6" },
  { bg: "rgba(251, 146, 60, 0.15)", text: "#FB923C" },
  { bg: "rgba(168, 85, 247, 0.15)", text: "#A855F7" },
];

type SessionRange = { key: string; startIso: string; endIso: string };

function rangesOverlap(left: SessionRange[], right: SessionRange[]) {
  return left.some((a) =>
    right.some((b) => a.startIso <= b.endIso && b.startIso <= a.endIso),
  );
}

/**
 * Assigns a palette colour to every subject so that two subjects running on the
 * same days never look alike — the previous hash of the id collided blindly and
 * painted simultaneous sessions the same colour.
 *
 * Colouring is greedy over the subjects in date order: each takes the first
 * palette entry no overlapping subject already uses. Because it runs over the
 * full session list rather than the filtered one, a subject keeps its colour
 * while the visitor searches or switches faculty.
 */
function buildEventColorMap(sessions: PrepSession[]) {
  const ordered = [...sessions].sort((a, b) => {
    const left = a.startDateIso ?? "9999-12-31";
    const right = b.startDateIso ?? "9999-12-31";
    return left === right ? a.id.localeCompare(b.id) : left.localeCompare(right);
  });

  const placed: { ranges: SessionRange[]; colorIndex: number }[] = [];
  const colors = new Map<string, (typeof defaultEventPalette)[number]>();

  ordered.forEach((session) => {
    const ranges = getSessionRanges(session);
    const taken = new Set(
      placed
        .filter((other) => rangesOverlap(ranges, other.ranges))
        .map((other) => other.colorIndex),
    );

    let colorIndex = 0;
    while (colorIndex < defaultEventPalette.length && taken.has(colorIndex)) {
      colorIndex += 1;
    }
    // More mutually overlapping subjects than palette entries: wrap rather than
    // run off the end.
    if (colorIndex === defaultEventPalette.length) {
      colorIndex = placed.length % defaultEventPalette.length;
    }

    placed.push({ ranges, colorIndex });
    colors.set(
      session.id,
      eventColors[session.id] ?? defaultEventPalette[colorIndex],
    );
  });

  return colors;
}

function getEventsForWeek(
  weekDays: (number | null)[],
  sessions: PrepSession[],
  month: number,
  year: number,
) {
  const weekNumbers = weekDays.filter((day): day is number => day !== null);
  if (weekNumbers.length === 0) return [];

  const weekStart = weekNumbers[0];
  const weekEnd = weekNumbers[weekNumbers.length - 1];

  const result: {
    session: PrepSession;
    key: string;
    row: number;
    startCol: number;
    endCol: number;
  }[] = [];
  // One row per session, as before. A session's own gapped blocks share that
  // row whenever they do not overlap, so a subject running Mon-Tue and Thu-Fri
  // reads as two bars on one line rather than two stacked lines.
  const rows: { startCol: number; endCol: number }[][] = [];

  sessions.forEach((session) => {
    const bars = getSessionRangesForMonth(session, month, year).flatMap(
      (range) => {
        const visibleStart = Math.max(range.startDay, weekStart);
        const visibleEnd = Math.min(range.endDay, weekEnd);
        if (visibleStart > visibleEnd) return [];

        const startCol = weekDays.indexOf(visibleStart);
        const endCol = weekDays.indexOf(visibleEnd);

        return [
          {
            key: range.key,
            startCol: startCol === -1 ? 0 : startCol,
            endCol: endCol === -1 ? 6 : endCol,
          },
        ];
      },
    );

    const firstRow = rows.length;
    bars.forEach((bar) => {
      let row = firstRow;
      while (
        rows[row]?.some(
          (placed) =>
            bar.startCol <= placed.endCol && placed.startCol <= bar.endCol,
        )
      ) {
        row += 1;
      }
      if (!rows[row]) rows[row] = [];
      rows[row].push(bar);

      result.push({
        session,
        key: `${session.id}:${bar.key}`,
        row,
        startCol: bar.startCol,
        endCol: bar.endCol,
      });
    });
  });

  return result;
}

function parseIsoDate(value?: string) {
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

function getRegistrationNotice(session: PrepSession) {
  const daysUntilStart = getDaysUntilStart(session);

  switch (daysUntilStart) {
    case 3:
      return {
        text: "Уште 3 дена за пријавување",
        cardClass:
          "border-transparent outline outline-2 outline-offset-2 outline-[#FACC0B]",
        badgeClass: "bg-yellow-lt text-ink border-yellow/60",
      };
    case 2:
      return {
        text: "Уште 2 дена за пријавување",
        cardClass:
          "border-transparent outline outline-2 outline-offset-2 outline-[#FB923C]",
        badgeClass: "bg-[#FB923C]/15 text-[#9A3412] border-[#FB923C]/60",
      };
    case 1:
      return {
        text: "Последна шанса за пријавување",
        cardClass:
          "border-transparent outline outline-2 outline-offset-2 outline-[#DC2626]",
        badgeClass: "bg-[#DC2626]/10 text-[#991B1B] border-[#DC2626]/50",
      };
    default:
      return null;
  }
}

function getDaysUntilStart(session: PrepSession) {
  const start = parseIsoDate(session.startDateIso);
  if (!start) return Number.POSITIVE_INFINITY;
  const today = startOfLocalDay(new Date());
  const startDay = startOfLocalDay(start);
  return Math.round((startDay.getTime() - today.getTime()) / 86_400_000);
}

function hasSessionStarted(session: PrepSession) {
  return getDaysUntilStart(session) <= 0;
}

function getUrgencyRank(session: PrepSession) {
  const daysUntilStart = getDaysUntilStart(session);
  if (daysUntilStart >= 1 && daysUntilStart <= 3) return daysUntilStart;
  return Number.POSITIVE_INFINITY;
}

function formatPaymentDeadline(session: PrepSession) {
  const start = parseIsoDate(session.startDateIso);
  if (!start) return null;

  const deadline = new Date(start.getFullYear(), start.getMonth(), start.getDate() - 1);
  return new Intl.DateTimeFormat("mk-MK", {
    day: "numeric",
    month: "long",
  }).format(deadline);
}

/**
 * The card / detail row describing when a subject runs. A lone block with no
 * note is shown as a plain start date, so subjects that do not use gap days
 * look exactly as they did before blocks existed.
 */
function getScheduleRow(session: PrepSession, singleLabel: string) {
  const blocks = session.dateBlocks;
  if (blocks && session.datesLabel && (blocks.length > 1 || blocks[0]?.note)) {
    return { label: "Термини", value: session.datesLabel };
  }
  return { label: singleLabel, value: session.startDate };
}

/**
 * The schedule as it is stamped onto the application. `attendanceText` is a
 * Strapi string column, so a subject with many blocks falls back to a compact
 * summary rather than overflowing it.
 */
function formatAttendanceSchedule(session: PrepSession) {
  const full = session.datesLabel ?? session.startDate;
  if (full.length <= 180) return full;

  const blockCount = session.dateBlocks?.length ?? 0;
  return `од ${session.startDate}, ${blockCount} термини`;
}

function formatSpots(session: PrepSession) {
  if (session.spotsLeft === 0) return "Нема слободни места";
  if (session.spotsLeft === 1) return "Последно слободно место";
  if (session.spotsLeft <= 3) {
    return `Последни ${session.spotsLeft} слободни места`;
  }
  return `${session.spotsLeft} слободни места`;
}

function toMonthKey(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function formatMonthLabel(year: number, month: number) {
  const label = new Intl.DateTimeFormat("mk-MK", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1)).replace(" г.", "");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/**
 * Every run of consecutive class days for a session. Subjects with gap days
 * yield one entry per block; every other subject yields a single entry, which
 * is exactly what the calendar drew before blocks existed.
 */
function getSessionRanges(session: PrepSession) {
  if (session.dateBlocks && session.dateBlocks.length > 0) {
    return session.dateBlocks.map((block, index) => ({
      key: `block-${index}`,
      startIso: block.startIso,
      endIso: block.endIso,
    }));
  }

  if (!session.startDateIso) return [];

  return [
    {
      key: "block-0",
      startIso: session.startDateIso,
      endIso: session.endDateIso ?? session.startDateIso,
    },
  ];
}

function getSessionRangesForMonth(
  session: PrepSession,
  month: number,
  year: number,
) {
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);

  return getSessionRanges(session).flatMap((range) => {
    const start = parseIsoDate(range.startIso);
    const end = parseIsoDate(range.endIso);
    if (!start || !end || end < monthStart || start > monthEnd) return [];

    const visibleStart = start < monthStart ? monthStart : start;
    const visibleEnd = end > monthEnd ? monthEnd : end;

    return [
      {
        key: range.key,
        startDay: visibleStart.getDate(),
        endDay: visibleEnd.getDate(),
      },
    ];
  });
}

function getSessionMonthKeys(session: PrepSession) {
  const keys = new Map<
    string,
    { key: string; year: number; month: number; label: string }
  >();

  // Only months that actually contain class days are listed, so a gap that
  // spans a whole month does not add an empty calendar page.
  getSessionRanges(session).forEach((range) => {
    const start = parseIsoDate(range.startIso);
    const end = parseIsoDate(range.endIso);
    if (!start || !end) return;

    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    const limit = new Date(end.getFullYear(), end.getMonth(), 1);

    while (cursor <= limit) {
      const year = cursor.getFullYear();
      const month = cursor.getMonth();
      const key = toMonthKey(year, month);
      if (!keys.has(key)) {
        keys.set(key, { key, year, month, label: formatMonthLabel(year, month) });
      }
      cursor.setMonth(cursor.getMonth() + 1);
    }
  });

  return Array.from(keys.values());
}

export function PripremiClient() {
  const [sessions, setSessions] = useState<PrepSession[]>([]);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Сите Припреми");
  const [selectedEvent, setSelectedEvent] = useState<PrepSession | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFallbackData, setIsFallbackData] = useState(false);
  const [signupSession, setSignupSession] = useState<PrepSession | null>(null);
  const [signupForm, setSignupForm] =
    useState<SignupFormState>(emptySignupForm);
  const [isSignupSubmitting, setIsSignupSubmitting] = useState(false);
  const [signupStatus, setSignupStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [globalNotification, setGlobalNotification] = useState<string | null>(null);

  useEffect(() => {
    if (globalNotification) {
      const timer = setTimeout(() => {
        setGlobalNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [globalNotification]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const run = async () => {
      setIsLoading(true);
      const result = await loadPrepSessions(controller.signal);
      if (!isMounted) return;

      setSessions(result.sessions);
      setErrorMessage(result.errorMessage ?? null);
      setIsFallbackData(result.source === "fallback");
      setIsLoading(false);
    };

    void run();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const eventColorMap = useMemo(() => buildEventColorMap(sessions), [sessions]);

  const filters = useMemo(() => {
    const facultySet = new Set(sessions.map((session) => session.faculty));
    return ["Сите Припреми", ...Array.from(facultySet)];
  }, [sessions]);

  useEffect(() => {
    if (!filters.includes(activeFilter)) {
      setActiveFilter("Сите Припреми");
    }
  }, [activeFilter, filters]);

  const filtered = useMemo(() => {
    return sessions
      .filter((s) => {
        if (hasSessionStarted(s)) return false;
        const matchesQuery =
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.faculty.toLowerCase().includes(query.toLowerCase());
        const matchesFilter =
          activeFilter === "Сите Припреми" || s.faculty === activeFilter;
        return matchesQuery && matchesFilter;
      })
      .sort((a, b) => {
        const left = getDaysUntilStart(a);
        const right = getDaysUntilStart(b);
        // Two sessions with no usable date are both Infinity, and subtracting
        // those yields NaN, which leaves the card order unspecified.
        if (left === right) return 0;
        return left - right;
      });
  }, [sessions, query, activeFilter]);

  const availableMonths = useMemo(() => {
    const monthMap = new Map<
      string,
      { key: string; year: number; month: number; label: string }
    >();

    filtered.forEach((session) => {
      getSessionMonthKeys(session).forEach((monthData) => {
        monthMap.set(monthData.key, monthData);
      });
    });

    return Array.from(monthMap.values()).sort((a, b) =>
      a.key.localeCompare(b.key),
    );
  }, [filtered]);

  const selectedEventNotice = selectedEvent
    ? getRegistrationNotice(selectedEvent)
    : null;

  const paymentDeadline = signupSession
    ? formatPaymentDeadline(signupSession)
    : null;

  useEffect(() => {
    if (
      !selectedEvent ||
      !filtered.some((session) => session.id === selectedEvent.id)
    ) {
      setSelectedEvent(filtered[0] ?? null);
    }
  }, [filtered, selectedEvent]);

  function openSignup(session: PrepSession) {
    setSignupSession(session);
    setSignupStatus(null);
    document.body.style.overflow = "hidden";
  }

  function closeSignup() {
    if (isSignupSubmitting) return;
    setSignupSession(null);
    setSignupStatus(null);
    document.body.style.overflow = "";
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && signupSession) {
        closeSignup();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [signupSession, isSignupSubmitting]);

  function updateSignupField<K extends keyof SignupFormState>(
    key: K,
    value: SignupFormState[K],
  ) {
    setSignupForm((current) => ({ ...current, [key]: value }));
  }

  async function submitSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signupSession) return;

    setIsSignupSubmitting(true);
    setSignupStatus(null);

    try {
      if (!isValidEmail(signupForm.email)) {
        throw new Error("Внесете валиден email.");
      }

      if (!signupForm.discordUsername.trim()) {
        throw new Error("Discord корисничко име е задолжително.");
      }

      if (!signupForm.referralSource) {
        throw new Error("Изберете како слушнавте за нас.");
      }

      if (
        signupForm.referralSource === "other" &&
        !signupForm.referralSourceOther.trim()
      ) {
        throw new Error("Напишете како слушнавте за нас.");
      }

      const referralSourceLabel = getReferralSourceLabel(signupForm);
      const referredBy = signupForm.referredBy.trim();

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...signupForm,
          prepSessionId: signupSession.prepSessionId,
          subjectId: signupSession.subjectId ?? signupSession.id,
          subjectName: signupSession.title,
          prepSessionTitle: signupSession.title,
          faculty: signupSession.faculty,
          attendancePreference: signupForm.attendancePreference,
          attendanceText: `${
            signupForm.attendancePreference === "online"
              ? "онлајн"
              : "физичко присуство"
          }, ${formatAttendanceSchedule(signupSession)}`,
          coursePrice: String(signupSession.price ?? 'Цената не е достапна'),
          referralSource: referralSourceLabel,
          referredBy,
          poraka: [
            signupForm.poraka,
            `Припрема: ${signupSession.title}`,
            `Факултет: ${signupSession.faculty}`,
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Неуспешно зачувување.");
      }

      setSignupForm(emptySignupForm);
      setGlobalNotification("Успешно се пријавивте ве молам проверете го вашиот email за наредни инструкции");
      closeSignup();
    } catch (error) {
      setSignupStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Неуспешно зачувување.",
      });
    } finally {
      setIsSignupSubmitting(false);
    }
  }

  return (
    <>
      {/* Search + filter bar */}
      <div className="u-wrap pb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Пребарај припрема, предмет или факултет..."
              className="w-full rounded-full border-2 border-line bg-white py-3.5 pl-12 pr-5 text-[16px] text-ink shadow-[0_12px_32px_-24px_rgba(30,66,74,.5)] outline-none transition placeholder:text-muted/70 focus:border-teal focus:ring-4 focus:ring-teal/20"
            />
          </div>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Филтрирај припреми"
          >
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                aria-pressed={activeFilter === f}
                className={cn(
                  "rounded-full px-4 py-2 text-[15px] font-extrabold transition",
                  activeFilter === f
                    ? "bg-teal text-white shadow-[0_3px_0_var(--color-teal-dk)]"
                    : "border-2 border-line bg-white text-ink hover:border-teal",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Session cards grid */}
      <div className="u-wrap pb-16">
        <div>
          {errorMessage && (
            <div className="mb-6 rounded-2xl border-2 border-yellow bg-yellow-lt px-5 py-4 text-[16px] font-semibold text-ink">
              {errorMessage}
              {isFallbackData && " "}
              {isFallbackData && "Користиме резервни локални податоци."}
            </div>
          )}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <SessionCardSkeleton key={index} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-12 text-center text-[17px] font-semibold text-muted">
              Нема пронајдени припреми.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filtered.map((session) => {
                const notice = getRegistrationNotice(session);

                return (
                  <article
                    key={session.id}
                    data-analytics-subject={session.title}
                    data-analytics-cta="booking"
                    className={cn(
                      "flex min-h-[540px] flex-col rounded-3xl border-2 border-line bg-white p-6 shadow-[0_24px_50px_-40px_rgba(30,66,74,.6)] transition hover:shadow-[0_30px_60px_-34px_rgba(30,66,74,.7)] sm:p-7",
                      notice?.cardClass,
                    )}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="rounded-full bg-teal-lt px-3 py-1 text-[13px] font-bold text-teal-dk">
                        {session.status}
                      </span>
                      <span className="rounded-full border border-yellow/60 bg-yellow-lt px-3 py-1 text-[13px] font-extrabold text-ink">
                        {session.faculty}
                      </span>
                    </div>
                    {notice && (
                      <div
                        className={cn(
                          "mb-3 rounded-xl border px-3 py-2 text-[13px] font-bold",
                          notice.badgeClass,
                        )}
                      >
                        {notice.text}
                      </div>
                    )}
                    <h3 className="mb-2 text-[22px] font-extrabold leading-snug tracking-[-.01em] text-ink">
                      {session.title}
                    </h3>
                    <p className="mb-5 text-[17px] leading-relaxed text-body">
                      {session.description}
                    </p>
                    <div className="mb-5 flex-grow space-y-3 border-b border-line pb-5">
                      {[
                        {
                          Icon: User,
                          label: "Инструктор",
                          value: session.instructor,
                        },
                        {
                          Icon: CalendarIcon,
                          ...getScheduleRow(session, "Почнува"),
                        },
                        {
                          Icon: FileText,
                          label: "Испит",
                          value: session.examDate,
                        },
                        {
                          Icon: Clock,
                          label: "Траење",
                          value: session.duration,
                        },
                        {
                          Icon: GraduationCap,
                          label: "Ниво",
                          value: session.level,
                        },
                      ]
                        .filter((item) => item.value != null)
                        .map(({ Icon, label, value }) => (
                          <div
                            key={label}
                            className="flex items-start gap-3 text-[16px] text-body"
                          >
                            <Icon
                              className="mt-1 h-[18px] w-[18px] shrink-0 text-teal"
                              aria-hidden="true"
                            />
                            {label === "Термини" && typeof value === "string" ? (
                              <div>
                                <span className="block font-bold text-ink">Термини:</span>
                                <ul className="mt-1 list-disc space-y-0.5 pl-4">
                                  {value.split(",").map((v) => (
                                    <li key={v.trim()}>{v.trim()}</li>
                                  ))}
                                </ul>
                              </div>
                            ) : label === "Инструктор" && typeof value === "string" && value.includes(",") ? (
                              <div>
                                <span className="block font-bold text-ink">Инструктори:</span>
                                <ul className="mt-1 list-disc space-y-0.5 pl-4">
                                  {value.split(",").map((v) => (
                                    <li key={v.trim()}>{v.trim()}</li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              <div className="flex flex-wrap items-baseline gap-x-2">
                                <span className="shrink-0 font-bold text-ink">{label}:</span>
                                <span className="min-w-0">{value}</span>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                    <PrepPrice price={session.price} className="mb-3 mt-auto" />
                    <p className="mb-3 text-center text-[14px] font-semibold text-muted">
                      Не мора да платиш сега.
                    </p>
                    <button
                      type="button"
                      onClick={() => openSignup(session)}
                      className="w-full rounded-xl bg-yellow px-6 py-4 text-center text-[17px] font-black tracking-wide text-ink shadow-[0_5px_0_#c99f00] transition hover:translate-y-0.5 hover:shadow-[0_3px_0_#c99f00]"
                    >
                      Пријави се
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Calendar section */}
      <div className="u-wrap pb-20">
        <div>
          <div className="mb-8">
            <h2 className="mb-3 text-[clamp(1.7rem,3.8vw,2.5rem)] font-extrabold tracking-[-.025em] text-ink">
              Календар
            </h2>
            <p className="text-[17px] text-body sm:text-[18px]">
              Прелистај ги сите идни припремни сесии по датум.
            </p>
          </div>

          {isLoading ? (
            <CalendarSkeleton />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 items-start">
              {/* Calendars */}
              <div className="space-y-8">
                {availableMonths.length === 0 && (
                  <div className="rounded-3xl border-2 border-line bg-white p-6 shadow-[0_24px_50px_-40px_rgba(30,66,74,.6)] text-center text-[17px] font-semibold text-body">
                    Нема закажано припреми за овој период.
                  </div>
                )}
                {availableMonths.map((monthData) => {
                  const monthSessions = filtered.filter(
                    (session) =>
                      getSessionRangesForMonth(
                        session,
                        monthData.month,
                        monthData.year,
                      ).length > 0,
                  );
                  const calendarWeeks = buildCalendarWeeks(monthData.month, monthData.year);
                  
                  return (
                    <div key={monthData.key} className="rounded-3xl border-2 border-line bg-white p-6 shadow-[0_24px_50px_-40px_rgba(30,66,74,.6)]">
                      <div className="mb-6">
                        <h3 className="text-[24px] font-extrabold leading-snug text-ink">
                          {monthData.label}
                        </h3>
                      </div>

                      <div className="space-y-1">
                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {["Пон", "Вто", "Сре", "Чет", "Пет", "Саб", "Нед"].map(
                            (d) => (
                              <div
                                key={d}
                                className="py-2 text-center text-[13px] font-extrabold text-muted"
                              >
                                {d}
                              </div>
                            ),
                          )}
                        </div>

                        {/* Weeks */}
                        {calendarWeeks.map((week, wi) => {
                          const weekEvents = getEventsForWeek(
                            week,
                            monthSessions,
                            monthData.month,
                            monthData.year,
                          );
                          const weekRowCount = weekEvents.reduce(
                            (max, event) => Math.max(max, event.row + 1),
                            0,
                          );
                          const weekHeight = Math.max(
                            100,
                            34 + weekRowCount * 22,
                          );
                          return (
                            <div key={wi} className="relative mb-1">
                              <div
                                className="grid grid-cols-7 gap-1"
                                style={{ minHeight: weekHeight }}
                              >
                                {week.map((day, di) => (
                                  <div
                                    key={di}
                                    className={cn(
                                      "relative rounded-xl border",
                                      !day
                                        ? "bg-transparent border-transparent"
                                        : "border-line bg-white",
                                    )}
                                    style={{ minHeight: weekHeight }}
                                  >
                                    {day && (
                                      <div className="absolute left-2 top-1.5 z-10 text-[13px] font-bold text-ink">
                                        {day}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* Event bars overlay */}
                              {weekEvents.length > 0 && (
                                <div className="absolute inset-0 pointer-events-none">
                                  {weekEvents.map((ev) => {
                                    const color =
                                      eventColorMap.get(ev.session.id) ??
                                      defaultEventPalette[0];
                                    const isSelected =
                                      selectedEvent?.id === ev.session.id;
                                    return (
                                      <button
                                        key={ev.key}
                                        onClick={() => setSelectedEvent(ev.session)}
                                        aria-pressed={isSelected}
                                        className="pointer-events-auto cursor-pointer hover:opacity-85 transition-opacity text-left truncate rounded"
                                        style={{
                                          position: "absolute",
                                          left: `calc(${ev.startCol} / 7 * 100% + ${ev.startCol} * 0.25rem)`,
                                          right: `calc((6 - ${ev.endCol}) / 7 * 100% + (6 - ${ev.endCol}) * 0.25rem)`,
                                          top: `${28 + ev.row * 20}px`,
                                          height: 18,
                                          background: isSelected
                                            ? color.text
                                            : color.bg,
                                          color: isSelected ? "#FFFFFF" : color.text,
                                          fontSize: 11,
                                          fontWeight: isSelected ? 700 : 500,
                                          padding: "1px 6px",
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          border: "none",
                                          boxShadow: isSelected
                                            ? `0 0 0 2px ${color.text}`
                                            : "none",
                                        }}
                                      >
                                        {ev.session.title}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Event detail panel */}
              <div className="rounded-3xl border-2 border-line bg-white p-6 shadow-[0_24px_50px_-40px_rgba(30,66,74,.6)] sticky top-28 h-fit">
                <h3 className="mb-5 text-[22px] font-extrabold text-ink">
                  Детали за припремата
                </h3>
                {selectedEvent ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block rounded-full border border-yellow/60 bg-yellow-lt px-3 py-1 text-[13px] font-extrabold text-ink">
                        {selectedEvent.faculty}
                      </span>
                      {selectedEventNotice && (
                        <span
                          className={cn(
                            "inline-block rounded-full border px-3 py-1 text-[13px] font-bold",
                            selectedEventNotice.badgeClass,
                          )}
                        >
                          {selectedEventNotice.text}
                        </span>
                      )}
                    </div>
                    <h4 className="text-[24px] font-extrabold leading-snug text-ink">
                      {selectedEvent.title} - {selectedEvent.price} МКД
                    </h4>
                    <p className="text-[17px] leading-relaxed text-body">
                      {selectedEvent.description}
                    </p>
                    <div className="space-y-4 border-y border-line py-4">
                      {[
                        {
                          Icon: CalendarIcon,
                          ...getScheduleRow(selectedEvent, "Датум"),
                        },
                        {
                          Icon: Clock,
                          label: "Траење",
                          value: selectedEvent.duration,
                        },
                        {
                          Icon: User,
                          label: "Инструктор",
                          value: selectedEvent.instructor,
                        },
                        {
                          Icon: GraduationCap,
                          label: "Формат",
                          value: selectedEvent.format,
                        },
                      ]
                        .filter((item) => item.value != null)
                        .map(({ Icon, label, value }) => (
                          <div key={label} className="flex items-start gap-3">
                            <Icon
                              className="mt-0.5 h-5 w-5 shrink-0 text-teal"
                              aria-hidden="true"
                            />
                            <div>
                              <p className="mb-0.5 text-[13px] font-bold text-muted">
                                {label === "Инструктор" && typeof value === "string" && value.includes(",") ? "Инструктори" : label}
                              </p>
                              {typeof value === "string" &&
                              (label === "Термини" ||
                                (label === "Инструктор" &&
                                  value.includes(","))) ? (
                                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[17px] font-bold text-ink">
                                  {value.split(",").map((v) => (
                                    <li key={v.trim()}>{v.trim()}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-[17px] font-bold text-ink">
                                  {value}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                    <div>
                      <p className="mb-3 text-center text-[14px] font-semibold text-muted">
                        Не мора да платиш сега.
                      </p>
                      <button
                        type="button"
                        onClick={() => openSignup(selectedEvent)}
                        data-analytics-subject={selectedEvent.title}
                        data-analytics-cta="booking"
                        className="w-full rounded-xl bg-yellow px-6 py-4 text-center text-[17px] font-black tracking-wide text-ink shadow-[0_5px_0_#c99f00] transition hover:translate-y-0.5 hover:shadow-[0_3px_0_#c99f00]"
                      >
                        Пријави се
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[16px] text-muted">
                    Избери датум од календарот за да ги видиш деталите.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {signupSession && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="signup-title"
        >
          <div className="max-h-full w-full max-w-xl overflow-y-auto rounded-3xl border border-line bg-white p-6 shadow-[0_40px_90px_-30px_rgba(30,66,74,.6)] sm:p-8">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-[14px] font-black uppercase tracking-[.14em] text-teal">
                  {signupSession.faculty}
                </p>
                <h2
                  id="signup-title"
                  className="text-[24px] font-extrabold leading-snug text-ink"
                >
                  {signupSession.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeSignup}
                className="rounded-full border-2 border-line px-4 py-2 text-[14px] font-extrabold text-ink transition hover:border-teal hover:bg-paper-2"
              >
                Затвори
              </button>
            </div>

            <form className="space-y-4" onSubmit={submitSignup}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="signup-ime"
                    className="mb-1.5 block text-[15px] font-bold text-ink"
                  >
                    Име *
                  </label>
                  <input
                    id="signup-ime"
                    required
                    value={signupForm.ime}
                    onChange={(event) =>
                      updateSignupField("ime", event.target.value)
                    }
                    className="w-full rounded-2xl border-2 border-line bg-white px-4 py-3 text-[16px] text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/20"
                  />
                </div>
                <div>
                  <label
                    htmlFor="signup-prezime"
                    className="mb-1.5 block text-[15px] font-bold text-ink"
                  >
                    Презиме *
                  </label>
                  <input
                    id="signup-prezime"
                    required
                    value={signupForm.prezime}
                    onChange={(event) =>
                      updateSignupField("prezime", event.target.value)
                    }
                    className="w-full rounded-2xl border-2 border-line bg-white px-4 py-3 text-[16px] text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/20"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="signup-email"
                  className="mb-1.5 block text-[15px] font-bold text-ink"
                >
                  Email *
                </label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={signupForm.email}
                  onChange={(event) =>
                    updateSignupField("email", event.target.value)
                  }
                  className="w-full rounded-2xl border-2 border-line bg-white px-4 py-3 text-[16px] text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/20"
                />
                <p className="mt-2 text-[14px] text-muted">
                  Ќе добиете email со информации за уплата или следни чекори.
                </p>
              </div>
              <div>
                <label
                  htmlFor="signup-telefon"
                  className="mb-1.5 block text-[15px] font-bold text-ink"
                >
                  Телефон *
                </label>
                <input
                  id="signup-telefon"
                  required
                  value={signupForm.telefon}
                  onChange={(event) =>
                    updateSignupField("telefon", event.target.value)
                  }
                  className="w-full rounded-2xl border-2 border-line bg-white px-4 py-3 text-[16px] text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/20"
                />
                <p className="mt-2 text-[14px] text-muted">
                  Ќе бидете додадени во Viber група по уплатата.
                </p>
              </div>
              <div>
                <label
                  className="mb-1.5 block text-[15px] font-bold text-ink"
                >
                  Начин на присуство *
                </label>
                <div className="grid grid-cols-2 overflow-hidden rounded-2xl border-2 border-line bg-white p-1">
                  {[
                    { value: "physical", label: "Физичко присуство" },
                    { value: "online", label: "Онлајн" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setSignupForm((current) => ({
                          ...current,
                          attendancePreference:
                            option.value as "online" | "physical",
                        }))
                      }
                      className={cn(
                        "min-h-11 rounded-xl px-3 text-[15px] font-extrabold transition",
                        signupForm.attendancePreference === option.value
                          ? "bg-teal text-white shadow-[0_3px_0_var(--color-teal-dk)]"
                          : "bg-transparent text-body hover:bg-paper-2",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor="signup-discord"
                  className="mb-1.5 block text-[15px] font-bold text-ink"
                >
                  Discord username *
                </label>
                <input
                  id="signup-discord"
                  value={signupForm.discordUsername}
                  onChange={(event) =>
                    updateSignupField("discordUsername", event.target.value)
                  }
                  className="w-full rounded-2xl border-2 border-line bg-white px-4 py-3 text-[16px] text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/20"
                />
              </div>
              <div>
                <span
                  id="signup-referral-source-label"
                  className="mb-1.5 block text-[15px] font-bold text-ink"
                >
                  Како слушна за нас? *
                </span>
                <div
                  role="group"
                  aria-labelledby="signup-referral-source-label"
                  className="flex flex-wrap gap-2"
                >
                  {referralSourceOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setSignupForm((current) => ({
                          ...current,
                          referralSource: option.value,
                          referralSourceOther:
                            option.value === "other"
                              ? current.referralSourceOther
                              : "",
                        }))
                      }
                      aria-pressed={signupForm.referralSource === option.value}
                      className={cn(
                        "min-h-11 rounded-full border-2 px-4 text-[15px] font-extrabold transition",
                        signupForm.referralSource === option.value
                          ? "border-teal bg-teal text-white"
                          : "border-line bg-white text-body hover:border-teal",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {signupForm.referralSource === "other" && (
                  <input
                    id="signup-referral-other"
                    aria-label="Напиши како слушна за нас"
                    placeholder="Напиши како слушна за нас"
                    value={signupForm.referralSourceOther}
                    onChange={(event) =>
                      updateSignupField("referralSourceOther", event.target.value)
                    }
                    className="mt-2 w-full rounded-2xl border-2 border-line bg-white px-4 py-3 text-[16px] text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/20"
                  />
                )}
              </div>
              <div>
                <label
                  htmlFor="signup-referred-by"
                  className="mb-1.5 block text-[15px] font-bold text-ink"
                >
                  Кој те препорача?
                </label>
                <input
                  id="signup-referred-by"
                  placeholder="Име и презиме"
                  value={signupForm.referredBy}
                  onChange={(event) =>
                    updateSignupField("referredBy", event.target.value)
                  }
                  className="w-full rounded-2xl border-2 border-line bg-white px-4 py-3 text-[16px] text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/20"
                />
                <p className="mt-2 text-[14px] text-muted">
                  Ако те препорачал пријател, напиши го неговото име и презиме -
                  двајцата добивате 10% попуст.
                </p>
              </div>
              <div>
                <label
                  htmlFor="signup-poraka"
                  className="mb-1.5 block text-[15px] font-bold text-ink"
                >
                  Белешка
                </label>
                <textarea
                  id="signup-poraka"
                  rows={3}
                  value={signupForm.poraka}
                  onChange={(event) =>
                    updateSignupField("poraka", event.target.value)
                  }
                  className="w-full rounded-2xl border-2 border-line bg-white px-4 py-3 text-[16px] text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/20 resize-none"
                />
              </div>

              {signupSession.price != null && (
                <div className="rounded-2xl border-2 border-yellow bg-yellow-lt px-4 py-3 text-[16px] text-ink">
                  <p className="font-bold">
                    Цената на припремата е {signupSession.price} денари.
                  </p>
                  {paymentDeadline && (
                    <p className="mt-1 text-body">
                      Уплатата треба да се изврши до {paymentDeadline}.
                    </p>
                  )}
                </div>
              )}

              {signupStatus && (
                <div
                  className={cn(
                    "rounded-2xl border-2 px-4 py-3 text-[16px] font-semibold text-ink",
                    signupStatus.type === "success"
                      ? "border-teal/30 bg-teal-lt"
                      : "border-yellow bg-yellow-lt",
                  )}
                >
                  {signupStatus.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSignupSubmitting}
                className="w-full rounded-xl bg-teal px-6 py-4 text-[16px] font-black tracking-wide text-white shadow-[0_4px_0_var(--color-teal-dk)] outline-none transition hover:translate-y-0.5 hover:shadow-[0_2px_0_var(--color-teal-dk)] focus-visible:ring-4 focus-visible:ring-teal/30 disabled:opacity-70"
              >
                {isSignupSubmitting ? "Се зачувува..." : "Испрати пријава"}
              </button>
            </form>
          </div>
        </div>
      )}

      {globalNotification && (
        <div className="step-in fixed right-3 top-3 z-[100] max-w-md rounded-2xl border border-l-4 border-line border-l-teal bg-white p-4 shadow-[0_24px_60px_-20px_rgba(30,66,74,.55)] sm:right-4 sm:top-4">
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-full bg-teal-lt p-2">
              <svg className="h-5 w-5 text-teal-dk" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[16px] font-bold text-ink">
              {globalNotification}
            </p>
            <button
              onClick={() => setGlobalNotification(null)}
              className="ml-auto text-muted hover:text-ink"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
