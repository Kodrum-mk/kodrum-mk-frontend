import Link from "next/link";
import { Check } from "lucide-react";

type HeroCard = {
  title: string;
  href: string | null;
  cta: string;
  badge?: string;
  disabled?: boolean;
  points: string[];
};

const heroCards: HeroCard[] = [
  {
    title: "Часови за ФИНКИ",
    href: "/privatni-casovi-finki",
    cta: "Види приватни часови за ФИНКИ",
    badge: "Најбарано",
    points: [
      "СП, ООП, АПС, Калкулус 1, Веб, Бази",
      "Индивидуални 1-на-1 или мали групи во Скопје и онлајн",
      "Решавање колоквиумски и испитни задачи од минати сесии",
    ],
  },
  {
    title: "Испитни припреми",
    href: "/pripremi",
    cta: "Види ги припремите",
    points: [
      "Во живо во Скопје или онлајн во мали групи",
      "На однапред одредени датуми по 2-3 часа дневно",
      "Техники и финти за сигурно положување",
    ],
  },
];

const faculties = ["ФИНКИ", "ФЕИТ", "МФС", "Економски"];

export function Hero() {
  return (
    <section className="min-h-screen bg-white flex items-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover opacity-70"
        style={{
          backgroundImage: "url(/hero-bg.png)",
          backgroundPosition: "left center",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-white/40" aria-hidden="true" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-center">
          {/* Left column */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#008081]/10 text-[#008081] text-xs sm:text-sm font-bold">
              <span>🎯</span> Приватни часови & испитна подготовка
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1E424A] leading-tight text-balance">
              Приватни часови и испитна подготовка
            </h1>
            <p className="text-lg sm:text-xl text-[#1E424A]/70 leading-relaxed max-w-2xl">
              Стручна подготовка за колоквиуми и испити за студенти од ФИНКИ, ФЕИТ, МФС и Економски. Заврши со испитите со висока оцена и без стрес! 😎🌴
            </p>
            <div>
              <p className="text-sm font-medium text-[#1E424A]/60 mb-3">
                Приватни часови за студенти од:
              </p>
              <div className="flex flex-wrap gap-3">
                {faculties.map((f) => (
                  <div
                    key={f}
                    className="px-4 py-2 bg-white border-2 border-[#008081]/20 text-[#1E424A] font-medium rounded-lg text-sm"
                  >
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — product cards */}
          <div className="space-y-6">
            {heroCards.map((card) => (
              <div
                key={card.title}
                className="bg-white border-2 border-[#1E424A]/10 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between gap-2 mb-4">
                  <h2 className="text-2xl font-bold text-[#1E424A]">
                    {card.title}
                  </h2>
                  {"badge" in card && card.badge && (
                    <span className="rounded-full bg-[#008081]/10 px-2.5 py-0.5 text-xs font-bold text-[#008081]">
                      {card.badge}
                    </span>
                  )}
                </div>
                <ul className="space-y-3 mb-6">
                  {card.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-start gap-3 text-sm text-[#1E424A]/80"
                    >
                      <Check
                        className="w-5 h-5 text-[#008081] mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                {card.disabled || !card.href ? (
                  <div className="relative">
                    <span className="absolute -top-2 -right-2 z-10 rotate-12 rounded bg-[#FACC0B] px-2 py-1 text-[11px] leading-none font-bold text-[#1E424A] shadow-md">
                      Наскоро
                    </span>
                    <button
                      type="button"
                      disabled
                      data-analytics-subject={card.title}
                      className="w-full bg-[#008081]/40 text-white font-medium py-3.5 px-6 rounded-lg shadow-md block text-center text-sm cursor-not-allowed"
                    >
                      {card.cta}
                    </button>
                  </div>
                ) : (
                  <Link
                    href={card.href}
                    data-analytics-subject={card.title}
                    className="w-full bg-[#008081] hover:bg-[#006566] text-white font-medium py-3.5 px-6 rounded-lg transition-colors shadow-md block text-center text-sm"
                  >
                    {card.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
