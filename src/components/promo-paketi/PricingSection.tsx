import { Star, Gift, Users, Check, Clock, AlertCircle } from "lucide-react";

interface PricingCard {
  id: string;
  badge?: string;
  featured?: boolean;
  Icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
  originalPrice: string;
  discount: string;
  savings: string;
  courses: string[];
  includes: string[];
  note?: { Icon: React.FC<{ className?: string }>; text: string };
}

const cards: PricingCard[] = [
  {
    id: "premium",
    badge: "Премиум",
    Icon: Star,
    title: "ФЕИТ/МФС комбо пакет",
    description: "Пријави се на две припреми и добиј 20% попуст на вкупната цена.",
    originalPrice: "8,000 МКД",
    discount: "-20%",
    savings: "Заштеди до 2,000 МКД",
    courses: ["Основи на Електротехника", "Математика 1", "Механика", "Инженерска графика"],
    includes: [
      "2 комплетни припреми",
      "6-8 дена учење",
      "Две припреми по ФЕИТ",
      "Две припреми по МФС",
      "Поддршка на личен ментор",
    ],
    note: { Icon: Clock, text: "Понуда со ограничено времетраење" },
  },
  {
    id: "popular",
    badge: "Најпопуларно",
    featured: true,
    Icon: Gift,
    title: "Математика + Програмирање пакет",
    description: "Силна основа во математика и програмирање",
    originalPrice: "78,000 МКД",
    discount: "-20%",
    savings: "Заштеди до 2,000 МКД",
    courses: ["Калкулус/Математика 1", "Структурно програмирање"],
    includes: [
      "2 сеопфатни припреми",
      "Математичка основа",
      "Програмерски вештини",
      "7/8 дена предавања x 3 часа дневно",
      "Поддршка на личен ментор",
    ],
  },
  {
    id: "friends",
    Icon: Users,
    title: "Пакет за пријатели",
    description: "Донеси пријател и заштедете заедно",
    originalPrice: "По лице: 2,500 МКД",
    discount: "По лице: 2,000 МКД",
    savings: "Заштеди до 500 МКД секој",
    courses: ["Било која припрема по избор"],
    includes: [
      "Изберете било која припрема",
      "Учете заедно",
      "Групни проекти",
      "Споделени ресурси",
      "Бонус активности за пријателство",
    ],
    note: { Icon: AlertCircle, text: "Минимум: 2+ пријатели" },
  },
];

export function PricingSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white w-full">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`bg-white rounded-xl shadow-md p-8 flex flex-col hover:shadow-xl transition-shadow ${
                card.featured
                  ? "border-2 border-[#008081] lg:scale-105"
                  : "border border-[#1E424A]/10"
              }`}
            >
              {card.badge && (
                <div className="mb-6">
                  <span className="inline-block bg-[#FACC0B] text-[#1E424A] px-4 py-1.5 rounded-lg text-sm font-bold">
                    {card.badge}
                  </span>
                </div>
              )}
              {!card.badge && <div className="mb-6 mt-11" />}

              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-[#008081]/10 flex items-center justify-center">
                  <card.Icon className="w-8 h-8 text-[#008081]" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#1E424A] mb-3">
                {card.title}
              </h3>
              <p className="text-base text-[#1E424A]/70 mb-6 leading-relaxed">
                {card.description}
              </p>

              {/* Price */}
              <div className="bg-[#F2F0E7] rounded-lg p-5 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-base text-[#1E424A]/50 line-through">
                    {card.originalPrice}
                  </span>
                  <span className="text-xl font-bold text-[#008081]">
                    {card.discount}
                  </span>
                </div>
                <div className="text-sm text-[#008081] font-semibold">
                  {card.savings}
                </div>
              </div>

              {/* Courses */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-[#1E424A] mb-3">
                  Вклучени курсеви:
                </h4>
                <ul className="space-y-2">
                  {card.courses.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-[#1E424A]/70">
                      <Check className="w-4 h-4 text-[#008081] mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Includes */}
              <div className="mb-6 flex-grow">
                <h4 className="text-sm font-bold text-[#1E424A] mb-3">
                  Што е вклучено:
                </h4>
                <ul className="space-y-2">
                  {card.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#1E424A]/70">
                      <Check className="w-4 h-4 text-[#008081] mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {card.note && (
                <div className="bg-[#FACC0B]/10 border border-[#FACC0B]/30 rounded-lg p-3 mb-6 flex items-center gap-2">
                  <card.note.Icon className="w-4 h-4 text-[#1E424A] flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm text-[#1E424A] font-medium">
                    {card.note.text}
                  </span>
                </div>
              )}

              <button className="w-full bg-[#008081] hover:bg-[#006566] text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm text-sm mt-auto">
                Само пријави се!
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
