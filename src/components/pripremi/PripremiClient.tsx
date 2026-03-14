"use client";

import { useState } from "react";
import {
  Search,
  Calendar as CalendarIcon,
  User,
  Clock,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { prepSessions, eventColors } from "@/data/prepSessions";
import type { PrepSession } from "@/types";
import { cn } from "@/utils/cn";

const MONTH_NAME = "Март 2026";
const MONTH = 2; // March (0-indexed)
const YEAR = 2026;

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(month: number, year: number) {
  return new Date(year, month, 1).getDay();
}

function buildCalendarWeeks(): (number | null)[][] {
  const daysInMonth = getDaysInMonth(MONTH, YEAR);
  const firstDay = getFirstDayOfMonth(MONTH, YEAR);
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

const calendarWeeks = buildCalendarWeeks();

function getEventsForWeek(weekDays: (number | null)[]) {
  const seen = new Set<string>();
  const result: { session: PrepSession; startCol: number; endCol: number }[] = [];

  weekDays.forEach((day) => {
    if (!day) return;
    prepSessions.forEach((session) => {
      if (!session.calendarDates.includes(day) || seen.has(session.id)) return;
      seen.add(session.id);
      const startDay = Math.min(...session.calendarDates);
      const endDay = Math.max(...session.calendarDates);
      const startCol = weekDays.findIndex((d) => d === startDay);
      const endCol = weekDays.findIndex((d) => d === endDay);
      result.push({
        session,
        startCol: startCol !== -1 ? startCol : 0,
        endCol: endCol !== -1 ? endCol : 6,
      });
    });
  });
  return result;
}

export function PripremiClient() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Сите Припреми");
  const [selectedEvent, setSelectedEvent] = useState<PrepSession | null>(
    prepSessions[0]
  );

  const filters = ["Сите Припреми", "ФИНКИ", "ФЕИТ", "МФС"];

  const filtered = prepSessions.filter((s) => {
    const matchesQuery =
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.faculty.toLowerCase().includes(query.toLowerCase());
    const matchesFilter =
      activeFilter === "Сите Припреми" || s.faculty === activeFilter;
    return matchesQuery && matchesFilter;
  });

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
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter prep sessions">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                aria-pressed={activeFilter === f}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-colors text-sm",
                  activeFilter === f
                    ? "bg-[#008081] text-white shadow-md"
                    : "bg-white text-[#1E424A] border border-[#1E424A]/20 hover:border-[#008081]"
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
          {filtered.length === 0 ? (
            <p className="text-center text-[#1E424A]/60 py-12">
              Нема пронајдени припреми.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((session) => (
                <article
                  key={session.id}
                  className="bg-white border-2 border-[#1E424A]/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col h-[480px]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-[#008081]/10 text-[#008081] text-xs font-medium rounded-full">
                      {session.status}
                    </span>
                    <span className="px-3 py-1 bg-[#FACC0B]/20 text-[#1E424A] text-xs font-bold rounded">
                      {session.faculty}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1E424A] mb-2">
                    {session.title}
                  </h3>
                  <p className="text-sm text-[#1E424A]/70 mb-4 leading-relaxed">
                    {session.description}
                  </p>
                  <div className="space-y-2 mb-5 pb-5 border-b border-[#1E424A]/10 flex-grow">
                    {[
                      { Icon: User, label: "Инструктор", value: session.instructor },
                      { Icon: CalendarIcon, label: "Почнува", value: session.startDate },
                      { Icon: Clock, label: "Траење", value: session.duration },
                      { Icon: GraduationCap, label: "Ниво", value: session.level },
                    ].map(({ Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-2 text-sm text-[#1E424A]/80">
                        <Icon className="w-4 h-4 text-[#008081] flex-shrink-0" aria-hidden="true" />
                        <span className="font-medium">{label}:</span>
                        <span className="truncate">{value}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full bg-[#008081] hover:bg-[#006566] text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md mt-auto text-sm">
                    Пријави се
                  </button>
                </article>
              ))}
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

          <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8">
            {/* Calendar */}
            <div className="bg-white border-2 border-[#1E424A]/10 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#1E424A]">{MONTH_NAME}</h3>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg border border-[#1E424A]/20 hover:bg-[#008081]/10 transition-colors" aria-label="Previous month">
                    <ChevronLeft className="w-5 h-5 text-[#1E424A]" />
                  </button>
                  <button className="p-2 rounded-lg border border-[#1E424A]/20 hover:bg-[#008081]/10 transition-colors" aria-label="Next month">
                    <ChevronRight className="w-5 h-5 text-[#1E424A]" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Нед", "Пон", "Вто", "Сре", "Чет", "Пет", "Саб"].map((d) => (
                    <div key={d} className="text-center text-xs font-semibold text-[#1E424A]/60 py-2">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Weeks */}
                {calendarWeeks.map((week, wi) => {
                  const weekEvents = getEventsForWeek(week);
                  return (
                    <div key={wi} className="relative mb-1">
                      <div className="grid grid-cols-7 gap-1" style={{ minHeight: 100 }}>
                        {week.map((day, di) => (
                          <div
                            key={di}
                            className={cn(
                              "relative rounded-lg border min-h-[100px]",
                              !day
                                ? "bg-transparent border-transparent"
                                : "bg-white border-[#1E424A]/10"
                            )}
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
                            const color = eventColors[ev.session.id];
                            return (
                              <button
                                key={ev.session.id}
                                onClick={() => setSelectedEvent(ev.session)}
                                className="pointer-events-auto cursor-pointer hover:opacity-75 transition-opacity text-left truncate rounded"
                                style={{
                                  position: "absolute",
                                  left: `calc(${ev.startCol} / 7 * 100% + ${ev.startCol} * 0.25rem)`,
                                  right: `calc((6 - ${ev.endCol}) / 7 * 100% + (6 - ${ev.endCol}) * 0.25rem)`,
                                  top: `${28 + ei * 20}px`,
                                  height: 18,
                                  background: color.bg,
                                  color: color.text,
                                  fontSize: 11,
                                  fontWeight: 500,
                                  padding: "1px 6px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  border: "none",
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
                  <span className="inline-block px-3 py-1 bg-[#FACC0B]/20 text-[#1E424A] text-xs font-bold rounded">
                    {selectedEvent.faculty}
                  </span>
                  <h4 className="text-2xl font-bold text-[#1E424A]">
                    {selectedEvent.title}
                  </h4>
                  <p className="text-sm text-[#1E424A]/70 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                  <div className="space-y-3 py-4 border-t border-b border-[#1E424A]/10">
                    {[
                      { Icon: CalendarIcon, label: "Датум", value: selectedEvent.dateRange },
                      { Icon: Clock, label: "Траење", value: selectedEvent.duration },
                      { Icon: User, label: "Инструктор", value: selectedEvent.instructor },
                      { Icon: GraduationCap, label: "Формат", value: selectedEvent.format },
                    ].map(({ Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-3">
                        <Icon className="w-5 h-5 text-[#008081] flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <p className="text-xs font-medium text-[#1E424A]/60 mb-0.5">{label}</p>
                          <p className="text-sm font-semibold text-[#1E424A]">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full bg-[#008081] hover:bg-[#006566] text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md text-sm">
                    Пријави се
                  </button>
                </div>
              ) : (
                <p className="text-sm text-[#1E424A]/60">
                  Избери датум од календарот за да ги видиш деталите.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
