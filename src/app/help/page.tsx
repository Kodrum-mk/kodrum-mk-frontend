import type { Metadata } from "next";
import {
  Book,
  CreditCard,
  Users,
  HelpCircle,
  Search,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Help Center",
  description:
    "Пронајди одговори на честите прашања или добиј помош директно од нашиот тим.",
};

const topics = [
  {
    Icon: Book,
    title: "Започнување",
    articles: ["Како да се регистрирам?", "Која платформа да изберам?", "Прв курс"],
  },
  {
    Icon: CreditCard,
    title: "Плаќање",
    articles: ["Методи за плаќање", "Повраток на средства", "Фактури"],
  },
  {
    Icon: Users,
    title: "Мојот профил",
    articles: ["Промена на лозинка", "Профилни информации", "Нотификации"],
  },
  {
    Icon: HelpCircle,
    title: "Технички проблеми",
    articles: ["Видеото не се пушта", "Проблем со пријавување", "Бавна брзина"],
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#1E424A] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-lg text-white/80 mb-8">
            Добро дошол! Пронајди одговори или стапи во контакт со нашата
            поддршка.
          </p>
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1E424A]/40"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Пребарај помош..."
              className="w-full pl-12 pr-4 py-4 rounded-xl text-base text-[#1E424A] bg-white placeholder:text-[#1E424A]/40 focus:outline-none focus:ring-2 focus:ring-[#008081] transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {topics.map((topic) => (
            <div
              key={topic.title}
              className="bg-white border-2 border-[#1E424A]/10 rounded-2xl p-6 hover:border-[#008081]/40 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#008081]/10 flex items-center justify-center mb-4">
                <topic.Icon className="w-6 h-6 text-[#008081]" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold text-[#1E424A] mb-4">
                {topic.title}
              </h2>
              <ul className="space-y-2">
                {topic.articles.map((a) => (
                  <li key={a}>
                    <button className="flex items-center gap-2 text-sm text-[#1E424A]/70 hover:text-[#008081] transition-colors w-full text-left">
                      <ChevronRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      {a}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1E424A] mb-4">
            Не ти одговара ниедна статија?
          </h2>
          <p className="text-[#1E424A]/70 mb-6">
            Нашиот тим за поддршка е секогаш тука да ти помогне.
          </p>
          <a
            href="/kontakt"
            className="inline-flex bg-[#008081] hover:bg-[#006566] text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-md text-sm items-center gap-2"
          >
            Контактирај нè
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
