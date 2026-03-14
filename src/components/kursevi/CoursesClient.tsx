"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { CoursesGrid } from "./CoursesGrid";
import { courses, courseFilters } from "@/data/courses";
import { cn } from "@/utils/cn";

export function CoursesClient() {
  const [filter, setFilter] = useState("Сите");
  const [query, setQuery] = useState("");

  const filtered = courses.filter((c) => {
    const matchesCat = filter === "Сите" || c.category === filter;
    const matchesQuery =
      query === "" ||
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <>
      <div className="w-full max-w-4xl mx-auto px-4 py-12">
        {/* Search */}
        <div className="relative mb-6">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1E424A]/40"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Пребарај курс..."
            className="w-full pl-12 pr-4 py-4 text-base rounded-lg border-2 border-[#1E424A]/10 bg-white focus:border-[#008081] focus:outline-none text-[#1E424A] placeholder:text-[#1E424A]/40 transition-colors"
          />
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-3 justify-center" role="group" aria-label="Filter courses">
          {courseFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={cn(
                "px-6 py-2.5 rounded-lg font-medium transition-colors text-sm",
                filter === f
                  ? "bg-[#008081] text-white shadow-md"
                  : "bg-white text-[#1E424A] hover:bg-[#F2F0E7] border border-[#1E424A]/20"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <CoursesGrid courses={filtered} />
    </>
  );
}
