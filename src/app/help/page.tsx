import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/structured";
import { Book, CreditCard, Users, HelpCircle, Search } from "lucide-react";
import Arrow from "@/components/ui/Arrow";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = pageMeta({
  title: "Help Center",
  description:
    "Пронајди одговори на честите прашања или добиј помош директно од нашиот тим.",
  path: "/help",
});

const topics = [
  {
    Icon: Book,
    title: "Започнување",
    articles: [
      "Како да се регистрирам?",
      "Која платформа да изберам?",
      "Прв курс",
    ],
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
    <>
      <JsonLd data={breadcrumbLd("Help Center", "/help")} />
      <div className="u-wrap pb-20 pt-6 sm:pt-10">
        <SectionHeading
          as="h1"
          title="Help Center"
          intro="Добро дошол! Пронајди одговори или стапи во контакт со нашата поддршка."
          className="mb-6 max-w-2xl"
        />
        <div className="relative mx-auto mb-12 max-w-2xl">
          <Search
            className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            aria-label="Пребарај помош"
            placeholder="Пребарај помош..."
            className="w-full rounded-full border-2 border-line bg-white py-4 pl-14 pr-5 text-[17px] text-ink shadow-[0_12px_32px_-22px_rgba(30,66,74,.5)] outline-none transition placeholder:text-muted/70 focus:border-teal focus:ring-4 focus:ring-teal/20"
          />
        </div>

        <div className="mb-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {topics.map((topic, i) => (
            <Reveal key={topic.title} delay={i * 80}>
              <Card className="h-full">
                <span
                  aria-hidden
                  className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-teal-lt text-teal-dk"
                >
                  <topic.Icon className="h-6 w-6" />
                </span>
                <h2 className="mb-4 text-[21px] font-extrabold text-ink">
                  {topic.title}
                </h2>
                <ul className="space-y-1">
                  {topic.articles.map((a) => (
                    <li key={a}>
                      <button className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-[16px] font-semibold text-body transition hover:bg-paper-2 hover:text-teal-dk">
                        <Arrow className="h-4 w-4 shrink-0 text-teal" />
                        {a}
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>

        <Card tone="yellow" className="mx-auto max-w-3xl text-center sm:p-10">
          <h2 className="mb-2 text-[24px] font-extrabold text-ink">
            Не ти одговара ниедна статија?
          </h2>
          <p className="mb-6 text-[17px] text-body">
            Нашиот тим за поддршка е секогаш тука да ти помогне.
          </p>
          <Button href="/kontakt" variant="yellow" size="lg">
            Контактирај нè
            <Arrow className="h-5 w-5" />
          </Button>
        </Card>
      </div>
    </>
  );
}
