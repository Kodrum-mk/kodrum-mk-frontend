import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import { prepSessions } from "@/data/prepSessions";

const bullets = [
  "Подготовка за испит",
  "Може да се следи физички на локација или онлајн преку повик",
  "Се организира на однапред одредени датуми",
  "Најчесто трае 2 до 3 часа дневно",
  "Обично се одвива во неколку дена, зависно од предметот",
  "Фокусот е на решавање испитни задачи и практична подготовка",
];

const upcoming = prepSessions.slice(0, 3);

export function PrepSection() {
  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1E424A] mb-3">
            Припреми
          </h2>
          <p className="text-lg text-[#1E424A]/70 max-w-3xl mx-auto">
            Живи подготовки за испит организирани по факултет и предмет,
            најавени неколку недели пред испитните рокови.
          </p>
        </div>

        <div className="grid lg:grid-cols-[45%_55%] gap-8 items-start">
          {/* Left – info */}
          <div>
            <ul className="space-y-2.5 mb-6">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[#1E424A]/80 text-sm">
                  <ChevronRight
                    className="w-5 h-5 text-[#008081] mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/pripremi"
              className="bg-[#008081] hover:bg-[#006566] text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-md inline-flex items-center gap-2 text-sm"
            >
              Види календар
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>

          {/* Right – upcoming sessions board */}
          <div className="bg-gradient-to-br from-[#008081]/10 to-[#008081]/5 rounded-2xl p-6 shadow-lg border border-[#008081]/10">
            <div className="flex items-center gap-2 mb-5">
              <Calendar className="w-6 h-6 text-[#008081]" aria-hidden="true" />
              <h3 className="text-2xl font-bold text-[#1E424A]">
                Следни припреми
              </h3>
            </div>
            <div className="space-y-3">
              {upcoming.map((prep) => (
                <div
                  key={prep.id}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-grow min-w-0">
                      <h4 className="font-semibold text-[#1E424A] mb-1.5 text-base">
                        {prep.title}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs font-medium px-2 py-0.5 bg-[#008081]/10 text-[#008081] rounded">
                          {prep.faculty}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xl font-bold text-[#1E424A] whitespace-nowrap">
                        {prep.dateRange}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
