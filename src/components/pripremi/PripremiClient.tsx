"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Calendar as CalendarIcon,
  User,
  Users,
  Clock,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { eventColors } from "@/data/prepSessions";
import { loadPrepSessions } from "@/data/prepSessionsApi";
import type { PrepSession } from "@/types";
import { cn } from "@/utils/cn";
import { PrepPrice } from "./PrepPrice";

function SessionCardSkeleton() {
  return (
    <div className="bg-white border-2 border-[#1E424A]/10 rounded-2xl p-6 shadow-lg min-h-[540px] animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-28 rounded-full bg-[#008081]/10" />
        <div className="h-6 w-20 rounded bg-[#FACC0B]/20" />
      </div>
      <div className="h-7 w-3/4 rounded bg-[#1E424A]/10 mb-3" />
      <div className="space-y-2 mb-5">
        <div className="h-4 w-full rounded bg-[#1E424A]/10" />
        <div className="h-4 w-5/6 rounded bg-[#1E424A]/10" />
        <div className="h-4 w-2/3 rounded bg-[#1E424A]/10" />
      </div>
      <div className="space-y-3 mb-5 pb-5 border-b border-[#1E424A]/10">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-4 w-4/5 rounded bg-[#1E424A]/10" />
        ))}
      </div>
      <div className="h-11 w-full rounded-lg bg-[#008081]/15 mt-auto" />
    </div>
  );
}

function CalendarSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8">
      <div className="bg-white border-2 border-[#1E424A]/10 rounded-2xl p-6 shadow-lg animate-pulse">
        <div className="h-8 w-40 rounded bg-[#1E424A]/10 mb-6" />
        <div className="grid grid-cols-7 gap-1 mb-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="h-6 rounded bg-[#1E424A]/10" />
          ))}
        </div>
        <div className="space-y-1">
          {Array.from({ length: 5 }).map((_, row) => (
            <div key={row} className="grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }).map((__, col) => (
                <div
                  key={`${row}-${col}`}
                  className="h-[100px] rounded-lg border border-[#1E424A]/10 bg-[#F2F0E7]/30"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border-2 border-[#1E424A]/10 rounded-2xl p-6 shadow-lg animate-pulse">
        <div className="h-7 w-48 rounded bg-[#1E424A]/10 mb-5" />
        <div className="h-6 w-20 rounded bg-[#FACC0B]/20 mb-4" />
        <div className="h-8 w-3/4 rounded bg-[#1E424A]/10 mb-4" />
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full rounded bg-[#1E424A]/10" />
          <div className="h-4 w-5/6 rounded bg-[#1E424A]/10" />
        </div>
        <div className="space-y-3 py-4 border-t border-b border-[#1E424A]/10 mb-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-10 w-full rounded bg-[#1E424A]/10" />
          ))}
        </div>
        <div className="h-11 w-full rounded-lg bg-[#008081]/15" />
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

function getStableEventColorIndex(session: PrepSession) {
  const key = `${session.id}-${session.title}`;
  let hash = 0;

  for (let index = 0; index < key.length; index++) {
    hash = (hash * 31 + key.charCodeAt(index)) % defaultEventPalette.length;
  }

  return hash;
}

function getEventColor(session: PrepSession) {
  return (
    eventColors[session.id] ??
    defaultEventPalette[getStableEventColorIndex(session)]
  );
}

function getEventsForWeek(
  weekDays: (number | null)[],
  sessions: PrepSession[],
  month: number,
  year: number,
) {
  const seen = new Set<string>();
  const result: { session: PrepSession; startCol: number; endCol: number }[] =
    [];

  weekDays.forEach((day) => {
    if (!day) return;
    sessions.forEach((session) => {
      const range = getSessionRangeForMonth(session, month, year);
      if (
        !range ||
        day < range.startDay ||
        day > range.endDay ||
        seen.has(session.id)
      ) {
        return;
      }
      seen.add(session.id);
      const startCol = weekDays.findIndex((d) => d === range.startDay);
      const endCol = weekDays.findIndex((d) => d === range.endDay);
      result.push({
        session,
        startCol: startCol !== -1 ? startCol : 0,
        endCol: endCol !== -1 ? endCol : 6,
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
        badgeClass: "bg-[#FACC0B]/20 text-[#1E424A] border-[#FACC0B]/60",
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

function getUrgencyRank(session: PrepSession) {
  const daysUntilStart = getDaysUntilStart(session);
  if (daysUntilStart >= 1 && daysUntilStart <= 3) return daysUntilStart;
  return Number.POSITIVE_INFINITY;
}

function formatSpots(session: PrepSession) {
  if (session.spotsLeft === 0) return "Нема слободни места";
  if (session.spotsLeft === 1) return "Последно слободно место";
  if (session.spotsLeft <= 3) {
    return `Последни ${session.spotsLeft} слободни места`;
  }
  return `${session.spotsLeft} слободни места`;
}

function getSpotsClass(spotsLeft: number) {
  if (spotsLeft <= 1) return "text-[#DC2626]";
  if (spotsLeft <= 3) return "text-[#EA580C]";
  return "text-[#D4A400]";
}

function toMonthKey(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function formatMonthLabel(year: number, month: number) {
  const label = new Intl.DateTimeFormat("mk-MK", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function getSessionRangeForMonth(
  session: PrepSession,
  month: number,
  year: number,
) {
  const start = parseIsoDate(session.startDateIso);
  const end = parseIsoDate(session.endDateIso ?? session.startDateIso);
  if (!start || !end) return null;

  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  if (end < monthStart || start > monthEnd) return null;

  const visibleStart = start < monthStart ? monthStart : start;
  const visibleEnd = end > monthEnd ? monthEnd : end;

  return {
    startDay: visibleStart.getDate(),
    endDay: visibleEnd.getDate(),
  };
}

function getSessionMonthKeys(session: PrepSession) {
  const start = parseIsoDate(session.startDateIso);
  const end = parseIsoDate(session.endDateIso ?? session.startDateIso);
  if (!start || !end) return [];

  const keys: { key: string; year: number; month: number; label: string }[] =
    [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  const limit = new Date(end.getFullYear(), end.getMonth(), 1);

  while (cursor <= limit) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    keys.push({
      key: toMonthKey(year, month),
      year,
      month,
      label: formatMonthLabel(year, month),
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return keys;
}

export function PripremiClient() {
  const [sessions, setSessions] = useState<PrepSession[]>([]);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Сите Припреми");
  const [selectedEvent, setSelectedEvent] = useState<PrepSession | null>(null);
  const [selectedMonthKey, setSelectedMonthKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFallbackData, setIsFallbackData] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const run = async () => {
      setIsLoading(true);
      const result = await loadPrepSessions(controller.signal);
      if (controller.signal.aborted) return;

      setSessions(result.sessions);
      setErrorMessage(result.errorMessage ?? null);
      setIsFallbackData(result.source === "fallback");
      setIsLoading(false);
    };

    void run();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const filters = useMemo(() => {
    const facultySet = new Set(sessions.map((session) => session.faculty));
    return ["Сите Припреми", ...Array.from(facultySet)];
  }, [sessions]);

  useEffect(() => {
    if (!filters.includes(activeFilter)) {
      setActiveFilter("Сите Припреми");
    }
  }, [activeFilter, filters]);

  const filtered = sessions
    .filter((s) => {
      const matchesQuery =
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.faculty.toLowerCase().includes(query.toLowerCase());
      const matchesFilter =
        activeFilter === "Сите Припреми" || s.faculty === activeFilter;
      return matchesQuery && matchesFilter;
    })
    .sort((a, b) => {
      const urgencyDiff = getUrgencyRank(a) - getUrgencyRank(b);
      if (urgencyDiff !== 0) return urgencyDiff;
      return getDaysUntilStart(a) - getDaysUntilStart(b);
    });

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

  useEffect(() => {
    if (!availableMonths.length) {
      setSelectedMonthKey("");
      return;
    }

    if (!availableMonths.some((month) => month.key === selectedMonthKey)) {
      setSelectedMonthKey(availableMonths[0].key);
    }
  }, [availableMonths, selectedMonthKey]);

  const activeMonth =
    availableMonths.find((month) => month.key === selectedMonthKey) ?? null;
  const selectedEventNotice = selectedEvent
    ? getRegistrationNotice(selectedEvent)
    : null;

  const calendarWeeks = useMemo(() => {
    if (!activeMonth) return [];
    return buildCalendarWeeks(activeMonth.month, activeMonth.year);
  }, [activeMonth]);

  const monthSessions = useMemo(() => {
    if (!activeMonth) return [];
    return filtered.filter((session) =>
      getSessionRangeForMonth(session, activeMonth.month, activeMonth.year),
    );
  }, [activeMonth, filtered]);

  const activeMonthIndex = activeMonth
    ? availableMonths.findIndex((month) => month.key === activeMonth.key)
    : -1;

  useEffect(() => {
    if (
      !selectedEvent ||
      !filtered.some((session) => session.id === selectedEvent.id)
    ) {
      setSelectedEvent(filtered[0] ?? null);
    }
  }, [filtered, selectedEvent]);

  return (
    <>
      {/* Search + filter bar */}
      <div className="bg-[#F2F0E7]/30 py-6 px-4 sm:px-6 lg:px-8 border-b border-[#1E424A]/10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1E424A]/40"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Пребарај припрема, предмет или факултет..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#1E424A]/20 text-[#1E424A] placeholder:text-[#1E424A]/40 focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 transition-all bg-white text-sm"
            />
          </div>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter prep sessions"
          >
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                aria-pressed={activeFilter === f}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-colors text-sm",
                  activeFilter === f
                    ? "bg-[#008081] text-white shadow-md"
                    : "bg-white text-[#1E424A] border border-[#1E424A]/20 hover:border-[#008081]",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Session cards grid */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {errorMessage && (
            <div className="mb-4 rounded-lg border border-[#FACC0B]/50 bg-[#FACC0B]/15 px-4 py-3 text-sm text-[#1E424A]">
              {errorMessage}
              {isFallbackData && " "}
              {isFallbackData && "Користиме резервни локални податоци."}
            </div>
          )}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <SessionCardSkeleton key={index} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-[#1E424A]/60 py-12">
              Нема пронајдени припреми.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((session) => {
                const notice = getRegistrationNotice(session);
                const spotsLabel = formatSpots(session);

                return (
                  <Link
                    key={session.id}
                    href={session.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-analytics-subject={session.title}
                    data-analytics-cta="booking"
                    className={cn(
                      "bg-white border-2 border-[#1E424A]/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col min-h-[540px]",
                      notice?.cardClass,
                    )}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-[#008081]/10 text-[#008081] text-xs font-medium rounded-full">
                        {session.status}
                      </span>
                      <span className="px-3 py-1 bg-[#FACC0B]/20 text-[#1E424A] text-xs font-bold rounded">
                        {session.faculty}
                      </span>
                    </div>
                    {notice && (
                      <div
                        className={cn(
                          "mb-3 rounded-lg border px-3 py-2 text-xs font-bold",
                          notice.badgeClass,
                        )}
                      >
                        {notice.text}
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-[#1E424A] mb-2">
                      {session.title}
                    </h3>
                    <p className="text-sm text-[#1E424A]/70 mb-4 leading-relaxed">
                      {session.description}
                    </p>
                    <div className="space-y-2 mb-5 pb-5 border-b border-[#1E424A]/10 flex-grow">
                      {[
                        {
                          Icon: User,
                          label: "Инструктор",
                          value: session.instructor,
                        },
                        {
                          Icon: CalendarIcon,
                          label: "Почнува",
                          value: session.startDate,
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
                        .filter((item) => item.value !== null)
                        .map(({ Icon, label, value }) => (
                          <div
                            key={label}
                            className="flex items-center gap-2 text-sm text-[#1E424A]/80"
                          >
                            <Icon
                              className="w-4 h-4 text-[#008081] flex-shrink-0"
                              aria-hidden="true"
                            />
                            <span className="font-medium">{label}:</span>
                            <span className="truncate">{value}</span>
                          </div>
                        ))}
                    </div>
                    <div
                      className={cn(
                        "mb-3 mt-auto flex items-center gap-2 text-lg font-bold",
                        getSpotsClass(session.spotsLeft),
                      )}
                    >
                      <Users
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                      {spotsLabel}
                    </div>
                    <PrepPrice price={session.price} className="mb-3" />
                    <div className="w-full bg-[#008081] hover:bg-[#006566] text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md text-lg text-center">
                      Пријави се
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Calendar section */}
      <div className="bg-[#F2F0E7]/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E424A] mb-3">
              Календар
            </h2>
            <p className="text-lg text-[#1E424A]/70">
              Прелистај ги сите идни припремни сесии по датум.
            </p>
          </div>

          {isLoading ? (
            <CalendarSkeleton />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8">
              {/* Calendar */}
              <div className="bg-white border-2 border-[#1E424A]/10 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-[#1E424A]">
                    {activeMonth?.label ?? "Нема датум"}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (activeMonthIndex > 0) {
                          setSelectedMonthKey(
                            availableMonths[activeMonthIndex - 1].key,
                          );
                        }
                      }}
                      className="p-2 rounded-lg border border-[#1E424A]/20 hover:bg-[#008081]/10 transition-colors"
                      aria-label="Previous month"
                      disabled={activeMonthIndex <= 0}
                    >
                      <ChevronLeft className="w-5 h-5 text-[#1E424A]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (activeMonthIndex < availableMonths.length - 1) {
                          setSelectedMonthKey(
                            availableMonths[activeMonthIndex + 1].key,
                          );
                        }
                      }}
                      className="p-2 rounded-lg border border-[#1E424A]/20 hover:bg-[#008081]/10 transition-colors"
                      aria-label="Next month"
                      disabled={
                        activeMonthIndex === -1 ||
                        activeMonthIndex >= availableMonths.length - 1
                      }
                    >
                      <ChevronRight className="w-5 h-5 text-[#1E424A]" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Пон", "Вто", "Сре", "Чет", "Пет", "Саб", "Нед"].map(
                      (d) => (
                        <div
                          key={d}
                          className="text-center text-xs font-semibold text-[#1E424A]/60 py-2"
                        >
                          {d}
                        </div>
                      ),
                    )}
                  </div>

                  {/* Weeks */}
                  {calendarWeeks.map((week, wi) => {
                    const weekEvents = activeMonth
                      ? getEventsForWeek(
                          week,
                          monthSessions,
                          activeMonth.month,
                          activeMonth.year,
                        )
                      : [];
                    const weekHeight = Math.max(
                      100,
                      34 + weekEvents.length * 22,
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
                                "relative rounded-lg border",
                                !day
                                  ? "bg-transparent border-transparent"
                                  : "bg-white border-[#1E424A]/10",
                              )}
                              style={{ minHeight: weekHeight }}
                            >
                              {day && (
                                <div className="absolute top-1.5 left-2 text-sm font-medium text-[#1E424A] z-10">
                                  {day}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Event bars overlay */}
                        {weekEvents.length > 0 && (
                          <div className="absolute inset-0 pointer-events-none">
                            {weekEvents.map((ev, ei) => {
                              const color = getEventColor(ev.session);
                              const isSelected =
                                selectedEvent?.id === ev.session.id;
                              return (
                                <button
                                  key={ev.session.id}
                                  onClick={() => setSelectedEvent(ev.session)}
                                  aria-pressed={isSelected}
                                  className="pointer-events-auto cursor-pointer hover:opacity-85 transition-opacity text-left truncate rounded"
                                  style={{
                                    position: "absolute",
                                    left: `calc(${ev.startCol} / 7 * 100% + ${ev.startCol} * 0.25rem)`,
                                    right: `calc((6 - ${ev.endCol}) / 7 * 100% + (6 - ${ev.endCol}) * 0.25rem)`,
                                    top: `${28 + ei * 20}px`,
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

              {/* Event detail panel */}
              <div className="bg-white border-2 border-[#1E424A]/10 rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-[#1E424A] mb-5">
                  Детали за припремата
                </h3>
                {selectedEvent ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block px-3 py-1 bg-[#FACC0B]/20 text-[#1E424A] text-xs font-bold rounded">
                        {selectedEvent.faculty}
                      </span>
                      {selectedEventNotice && (
                        <span
                          className={cn(
                            "inline-block rounded border px-3 py-1 text-xs font-bold",
                            selectedEventNotice.badgeClass,
                          )}
                        >
                          {selectedEventNotice.text}
                        </span>
                      )}
                    </div>
                    <h4 className="text-2xl font-bold text-[#1E424A]">
                      {selectedEvent.title}
                    </h4>
                    <p className="text-sm text-[#1E424A]/70 leading-relaxed">
                      {selectedEvent.description}
                    </p>
                    <div className="space-y-3 py-4 border-t border-b border-[#1E424A]/10">
                      {[
                        {
                          Icon: CalendarIcon,
                          label: "Датум",
                          value: selectedEvent.dateRange,
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
                          Icon: Users,
                          label: "Места",
                          value: formatSpots(selectedEvent),
                        },
                        {
                          Icon: GraduationCap,
                          label: "Формат",
                          value: selectedEvent.format,
                        },
                      ]
                        .filter((item) => item.value !== null)
                        .map(({ Icon, label, value }) => (
                          <div key={label} className="flex items-start gap-3">
                            <Icon
                              className="w-5 h-5 text-[#008081] flex-shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <div>
                              <p className="text-xs font-medium text-[#1E424A]/60 mb-0.5">
                                {label}
                              </p>
                              <p className="text-sm font-semibold text-[#1E424A]">
                                {value}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                    <Link
                      href={selectedEvent.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-analytics-subject={selectedEvent.title}
                      data-analytics-cta="booking"
                      className="w-full bg-[#008081] hover:bg-[#006566] text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md text-lg text-center"
                    >
                      Пријави се
                    </Link>
                  </div>
                ) : (
                  <p className="text-sm text-[#1E424A]/60">
                    Избери датум од календарот за да ги видиш деталите.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
