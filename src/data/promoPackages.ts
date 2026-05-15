import type { PromoPackage } from "@/types";

export const promoPackages: PromoPackage[] = [
  {
    id: "premium",
    badge: "Премиум",
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
    noteText: "Понуда со ограничено времетраење",
    registrationUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLScxb4pyK4RWKZ3HyDqeyJkUacK7od1odn5UPO3tKNbLYCjagQ/viewform?usp=send_form",
  },
  {
    id: "popular",
    badge: "Најпопуларно",
    featured: true,
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
    registrationUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLScxb4pyK4RWKZ3HyDqeyJkUacK7od1odn5UPO3tKNbLYCjagQ/viewform?usp=send_form",
  },
  {
    id: "friends",
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
    noteText: "Минимум: 2+ пријатели",
    registrationUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLScxb4pyK4RWKZ3HyDqeyJkUacK7od1odn5UPO3tKNbLYCjagQ/viewform?usp=send_form",
  },
];

export const fallbackPromoPackages = promoPackages;
