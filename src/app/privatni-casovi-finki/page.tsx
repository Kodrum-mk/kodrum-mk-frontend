import type { Metadata } from "next";
import Link from "next/link";
import {
  Code,
  BookOpen,
  Cpu,
  Database,
  Binary,
  Globe,
  GraduationCap,
  CheckCircle2,
  Phone,
  MessageCircle,
  Clock,
  MapPin,
  Laptop,
  Users,
  Award,
  ChevronRight,
} from "lucide-react";
import { FinkiInquiryForm } from "@/components/finki/FinkiInquiryForm";
import { FinkiFaqAccordion } from "@/components/finki/FinkiFaqAccordion";
import { finkiFaqs } from "@/data/finkiFaqs";

export const metadata: Metadata = {
  title: "Приватни Часови за ФИНКИ – Испитна Подготовка",
  description:
    "Барате приватни часови за ФИНКИ (privatni casovi finki)? Кодрум нуди стручна подготовка за испити и колоквиуми по СП, ООП, АПС, Калкулус 1, Веб и Бази. Во живо во Скопје и онлајн.",
  keywords: [
    "приватни часови финки",
    "privatni casovi finki",
    "часови финки",
    "casovi finki",
    "приватни часови за финки",
    "испитна подготовка финки",
    "кодрум финки",
    "структурно програмирање часови",
    "објектно програмирање финки",
    "алгоритми и структури на податоци часови",
    "калкулус 1 финки",
    "веб програмирање финки",
    "бази на податоци финки",
    "приватни часови скопје",
    "часови по програмирање финки",
    "подготовка за испити финки",
  ],
  alternates: {
    canonical: "https://kodrum.mk/privatni-casovi-finki",
  },
  openGraph: {
    title: "Приватни Часови за ФИНКИ – Кодрум",
    description:
      "Индивидуални и групни приватни часови за студенти на ФИНКИ. Положи ги СП, ООП, АПС и Калкулус со леснотија!",
    url: "https://kodrum.mk/privatni-casovi-finki",
    siteName: "Кодрум",
    locale: "mk_MK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Приватни Часови за ФИНКИ – Кодрум",
    description:
      "Индивидуални и групни приватни часови за студенти на ФИНКИ во Скопје и онлајн.",
  },
};

const subjects = [
  {
    icon: Code,
    title: "Структурно програмирање (СП)",
    lang: "C / C++",
    badge: "1-ва година",
    description:
      "Комплетна подготовка од основи до напредни концепти: низи, матрици, текстуални низи, покажувачи (pointers), динамичка меморија, рекурзија и структури. Директно решавање испитни задачи од 1. и 2. колоквиум.",
  },
  {
    icon: Cpu,
    title: "Објектно-ориентирано програмирање (ООП)",
    lang: "C++ / Java",
    badge: "1-ва / 2-ра година",
    description:
      "Класи, објекти, енкапсулација, конструктори/деструктори, статички членови, преоптоварување на оператори, наследување, виртуелни функции, полиморфизам, templates и исклучоци. Решавање на типични колоквиумски задачи.",
  },
  {
    icon: Binary,
    title: "Алгоритми и структури на податоци (АПС)",
    lang: "Java / C++",
    badge: "2-ра година",
    description:
      "Стекови, редици, поврзани листи, дрва (бинарни, BST, AVL), графови (BFS, DFS, Dijkstra), сортирања и динамичко програмирање. Техники за оптимизација на временска и просторна комплексност.",
  },
  {
    icon: BookOpen,
    title: "Калкулус 1 и 2 (Математичка анализа)",
    lang: "Математика",
    badge: "1-ва година",
    description:
      "Лимити, непрекинатост, изводи, Лопиталово правило, испитување на тек на функција и графици, неопределени и определени интеграли, методи за интеграција и парцијална интеграција чекор по чекор.",
  },
  {
    icon: Globe,
    title: "Веб Програмирање",
    lang: "HTML / CSS / JS / React / Node",
    badge: "2-ра / 3-та година",
    description:
      "Frontend (DOM, JavaScript ES6+, React компоненти, hooks, рутирање) и Backend (Node.js, Express, REST APIs, поврзување со бази). Изработка и спремање на практични испитни проекти.",
  },
  {
    icon: Database,
    title: "Бази на податоци",
    lang: "SQL / PostgreSQL",
    badge: "2-ра година",
    description:
      "Релационен модел, ER дијаграми, сложени SQL прашања (JOINs, подпрашања, агрегатни функции, групирања), нормализација (1NF, 2NF, 3NF, BCNF) и трансакции.",
  },
];

const reasons = [
  {
    title: "100% фокус на реални ФИНКИ испитни рокови",
    desc: "Не трошиме време на суво читање материјали. Секој час директно решаваме задачи од минати испитни рокови и колоквиуми што професорите на ФИНКИ ги поставуваат.",
  },
  {
    title: "Ментори што веќе го поминале ФИНКИ",
    desc: "Нашите ментори самите ги завршиле овие предмети со високи оценки и точно знаат кои се трик прашањата, финтите за поени и критериумите за оценување.",
  },
  {
    title: "Индивидуално (1-на-1) или во мала група",
    desc: "Избери индивидуални приватни часови според твое темпо или евтини интерактивни припреми во мали групи до 10 колеги.",
  },
  {
    title: "Поддршка на Discord и материјали",
    desc: "Секој час е придружен со уредни белешки и код. Добиваш и пристап до нашата Discord заедница каде менторите ти одговараат на прашања помеѓу часовите.",
  },
];

const finkiTestimonials = [
  {
    quote:
      "По 3 паднати рока по Структурно програмирање, земав часови во Кодрум пред јунската сесија. Задачите со покажувачи и динамичка меморија ми станаа кристално јасни. Го положив со 8!",
    name: "Бојан Т.",
    subject: "СП – ФИНКИ (ПСИО)",
  },
  {
    quote:
      "На АПС ми фалеа само неколку поени на прв колоквиум. Со менторот од Кодрум ги поминавме дрвата и графовите за 3 дена и вториот колоквиум го положив со 90%!",
    name: "Симона Д.",
    subject: "АПС – ФИНКИ (СИ)",
  },
  {
    quote:
      "Математика/Калкулус ми беше најголем страв. На часовите решававме токму такви интеграли и испитувања на функции какви што се паднаа на испитот. Презадоволна сум.",
    name: "Мартина К.",
    subject: "Калкулус 1 – ФИНКИ (КН)",
  },
];

export default function FinkiPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        "name": "Приватни часови и испитна подготовка за ФИНКИ",
        "description":
          "Специјализирани приватни часови по Структурно програмирање, ООП, АПС, Калкулус 1, Веб програмирање и Бази на податоци за студенти на ФИНКИ.",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Кодрум (Kodrum)",
          "url": "https://kodrum.mk",
        },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": ["Onsite", "Online"],
          "location": "Скопје, Македонија",
        },
        "offers": {
          "@type": "Offer",
          "category": "Private tutoring",
          "priceCurrency": "MKD",
          "availability": "https://schema.org/InStock",
        },
      },
      {
        "@type": "FAQPage",
        "mainEntity": finkiFaqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Почетна",
            "item": "https://kodrum.mk",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Приватни часови за ФИНКИ",
            "item": "https://kodrum.mk/privatni-casovi-finki",
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-[#1E424A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F0E7]/60 via-white to-white py-16 sm:py-24 border-b border-[#1E424A]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[58%_42%] gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#008081]/10 text-[#008081] text-xs sm:text-sm font-bold mb-6">
                <GraduationCap className="w-4 h-4" />
                <span>ФИНКИ Специјализирана Подготовка &middot; Скопје & Онлајн</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1E424A] leading-[1.15] mb-6">
                Приватни часови за студенти на{" "}
                <span className="text-[#008081]">ФИНКИ</span>
              </h1>

              <p className="text-lg sm:text-xl text-[#1E424A]/80 leading-relaxed mb-8">
                Барате <strong>приватни часови за ФИНКИ</strong> (privatni casovi finki)? Кодрум нуди стручна индивидуална и групна подготовка за колоквиуми и испитни рокови. Директно решавање на реални испитни задачи по <strong>СП</strong>, <strong>ООП</strong>, <strong>АПС</strong>, <strong>Калкулус 1</strong>, <strong>Веб</strong> и <strong>Бази</strong>.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <a
                  href="#inquiry"
                  className="bg-[#008081] hover:bg-[#006566] text-white font-semibold py-3.5 px-7 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
                >
                  Закажи приватен час
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/38975295582"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center gap-2 text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp / Viber
                </a>
                <Link
                  href="/pripremi"
                  className="border border-[#1E424A]/20 bg-white hover:bg-[#F2F0E7] text-[#1E424A] font-semibold py-3.5 px-6 rounded-xl transition-colors text-sm"
                >
                  Види распоред на групи
                </Link>
              </div>

              {/* Badges list */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#1E424A]/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#008081] flex-shrink-0" />
                  <span className="text-xs font-semibold">Испитни задачи</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#008081] flex-shrink-0" />
                  <span className="text-xs font-semibold">1-на-1 и групи</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#008081] flex-shrink-0" />
                  <span className="text-xs font-semibold">Во живо во Скопје</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#008081] flex-shrink-0" />
                  <span className="text-xs font-semibold">Онлајн со снимки</span>
                </div>
              </div>
            </div>

            {/* Right Card / Inquiry Form */}
            <div id="inquiry">
              <FinkiInquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#008081] bg-[#008081]/10 px-3 py-1 rounded-full">
              ФИНКИ програма
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E424A] mt-3 mb-4">
              Предмети за кои држиме приватни часови на ФИНКИ
            </h2>
            <p className="text-base sm:text-lg text-[#1E424A]/70 leading-relaxed">
              Без разлика дали ти треба помош за лабораториски вежби, прв/втор колоквиум или цел испитен рок (јануарска, јунска или септемвриска сесија), тука сме да помогнеме.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((s) => {
              const IconComponent = s.icon;
              return (
                <div
                  key={s.title}
                  className="bg-white border-2 border-[#1E424A]/10 rounded-2xl p-6 hover:border-[#008081]/40 hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#008081]/10 text-[#008081] flex items-center justify-center">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FACC0B]/30 text-[#1E424A]">
                          {s.badge}
                        </span>
                        <span className="text-xs font-semibold text-[#008081]">
                          {s.lang}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-[#1E424A] mb-2.5">
                      {s.title}
                    </h3>
                    <p className="text-sm text-[#1E424A]/75 leading-relaxed mb-6">
                      {s.description}
                    </p>
                  </div>
                  <a
                    href="#inquiry"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#008081] hover:text-[#006566] transition-colors pt-4 border-t border-[#1E424A]/10"
                  >
                    Закажи час за овој предмет
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Kodrum Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F2F0E7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#008081] bg-white px-3 py-1 rounded-full border border-[#008081]/20">
              Зошто Кодрум?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E424A] mt-3 mb-4">
              Зошто студентите на ФИНКИ го избираат Кодрум?
            </h2>
            <p className="text-base sm:text-lg text-[#1E424A]/70 leading-relaxed">
              Не нудиме генерички предавања – нудиме стратегија за положување на испитот од прв обид.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reasons.map((r, i) => (
              <div
                key={r.title}
                className="bg-white rounded-2xl p-8 shadow-md border border-[#1E424A]/10 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#008081] text-white flex items-center justify-center font-extrabold text-base flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1E424A] mb-2">
                    {r.title}
                  </h3>
                  <p className="text-sm text-[#1E424A]/75 leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-[#1E424A]/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E424A] mb-4">
              Како се одвиваат приватните часови?
            </h2>
            <p className="text-base text-[#1E424A]/70">
              Изберете го форматот што најмногу ви одговара на вашето секојдневие и обврски.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="border-2 border-[#1E424A]/10 rounded-2xl p-8 hover:border-[#008081] transition-all bg-[#F2F0E7]/20">
              <div className="w-12 h-12 rounded-xl bg-[#008081]/10 text-[#008081] flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#1E424A] mb-3">
                Во живо во Скопје
              </h3>
              <p className="text-sm text-[#1E424A]/70 leading-relaxed mb-6">
                Часови во училница во Скопје со директна менторска интеракција. Идеално за студенти кои сакаат фокус без дистракции и директна помош на свој лаптоп.
              </p>
              <ul className="space-y-2 text-sm text-[#1E424A]/85">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#008081]" />
                  <span>Модерно опремен простор во Скопје</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#008081]" />
                  <span>Индивидуален пристап или мали групи</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#008081]" />
                  <span>Решавање колоквиуми на бела табла и лаптоп</span>
                </li>
              </ul>
            </div>

            <div className="border-2 border-[#1E424A]/10 rounded-2xl p-8 hover:border-[#008081] transition-all bg-[#F2F0E7]/20">
              <div className="w-12 h-12 rounded-xl bg-[#008081]/10 text-[#008081] flex items-center justify-center mb-6">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#1E424A] mb-3">
                Онлајн (од каде било)
              </h3>
              <p className="text-sm text-[#1E424A]/70 leading-relaxed mb-6">
                Интерактивни часови преку Google Meet / Discord со дигитална табла за математика и live coding за програмирање. Добиваш снимка од секој час!
              </p>
              <ul className="space-y-2 text-sm text-[#1E424A]/85">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#008081]" />
                  <span>Споделување екран и дигитална табла</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#008081]" />
                  <span>Видео снимки достапни за повторување</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#008081]" />
                  <span>Флексибилни термини во попладневни часови</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#008081] bg-[#008081]/10 px-3 py-1 rounded-full">
              Искуства
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E424A] mt-3 mb-4">
              Што велат колегите од ФИНКИ за Кодрум?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {finkiTestimonials.map((t) => (
              <div
                key={t.name}
                className="bg-[#F2F0E7]/40 border border-[#1E424A]/10 rounded-2xl p-6 flex flex-col justify-between shadow-sm"
              >
                <p className="text-sm text-[#1E424A]/80 italic leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <h4 className="font-bold text-[#1E424A] text-base">{t.name}</h4>
                  <p className="text-xs font-semibold text-[#008081]">{t.subject}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F2F0E7]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E424A] mb-4">
              Често поставувани прашања за приватни часови за ФИНКИ
            </h2>
            <p className="text-base text-[#1E424A]/70">
              Сè што треба да знаете пред да го закажете вашиот прв час.
            </p>
          </div>

          <FinkiFaqAccordion />

          <div className="mt-12 text-center bg-white p-8 rounded-2xl border border-[#1E424A]/10 shadow-sm">
            <h3 className="text-xl font-bold text-[#1E424A] mb-2">
              Имаш специфично прашање за твојот предмет?
            </h3>
            <p className="text-sm text-[#1E424A]/70 mb-6">
              Контактирај нè директно на телефон, Viber или преку контакт формата.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+38975295582"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#008081] hover:bg-[#006566] text-white font-medium rounded-lg text-sm transition-colors"
              >
                <Phone className="w-4 h-4" />
                +389 75 295 582
              </a>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#1E424A]/20 hover:bg-[#F2F0E7] text-[#1E424A] font-medium rounded-lg text-sm transition-colors"
              >
                Контакт страница
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#1E424A] text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Подготви се за претстојниот испитен рок на ФИНКИ со Кодрум!
          </h2>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
            Не дозволувај испитите да ти го расипат летото или роковите. Закажи го твојот приватен час уште денес.
          </p>
          <div className="pt-2">
            <a
              href="#inquiry"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#FACC0B] hover:bg-[#eab308] text-[#1E424A] font-bold rounded-xl text-base transition-all shadow-lg"
            >
              Закажи час веднаш
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
