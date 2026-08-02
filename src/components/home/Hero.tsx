import Link from "next/link";
import { Check } from "lucide-react";

const heroCards = [
  {
    title: "Припреми",
    href: "/pripremi",
    cta: "Види ги Припремите",
    points: [
      "Во живо или онлајн во мали групи",
      "На однапред одредени датуми по 2-3 часа дневно",
      "Решавање испитни задачи, техники за положување",
    ],
  },
  {
    title: "Онлајн курсеви",
    href: "https://ecourses.kodrum.dev",
    cta: "Види ги Курсевите",
    points: [
      "Видео материјали и задачи достапни во секое време",
      "24/7 поддршка од инструкторот на курсот",
      "Учење со свое темпо",
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
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1E424A] leading-tight text-balance">
              Спреми се за испит со Кодрум!
            </h1>
            <p className="text-lg sm:text-xl text-[#1E424A]/70 leading-relaxed max-w-2xl">
              Сега е вистинско време да завршите со испитите и да уживате во
              летото без стрес! 😎🌴
            </p>
            <div>
              <p className="text-sm font-medium text-[#1E424A]/60 mb-3">
                За студенти од:
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
                <h2 className="text-2xl font-bold text-[#1E424A] mb-4">
                  {card.title}
                </h2>
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
                {card.href.startsWith("http") ? (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-analytics-subject={card.title}
                    className="w-full bg-[#008081] hover:bg-[#006566] text-white font-medium py-3.5 px-6 rounded-lg transition-colors shadow-md block text-center text-sm"
                  >
                    {card.cta}
                  </a>
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
