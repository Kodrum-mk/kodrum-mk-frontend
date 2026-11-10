import Button from "@/components/ui/Button";
import Arrow from "@/components/ui/Arrow";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";

type HeroCard = {
  title: string;
  href: string | null;
  cta: string;
  disabled?: boolean;
  points: string[];
};

const heroCards: HeroCard[] = [
  // {
  //   title: "Часови за ФИНКИ",
  //   href: "/privatni-casovi-finki",
  //   cta: "Види приватни часови за ФИНКИ",
  //   badge: "Најбарано",
  //   points: [
  //     "СП, ООП, АПС, Калкулус 1, Веб, Бази",
  //     "Индивидуални 1-на-1 или мали групи во Скопје и онлајн",
  //     "Решавање колоквиумски и испитни задачи од минати сесии",
  //   ],
  // },
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
    href: null,
    disabled: true,
    cta: "Види ги Курсевите",
    points: [
      "Видео материјали и задачи достапни во секое време",
      "24/7 поддршка од инструкторот на курсот",
      "Учење со свое темпо",
    ],
  },
];

const faculties = ["ФИНКИ", "ФЕИТ", "МФС", "Економски"];

function CheckTile() {
  return (
    <span
      aria-hidden
      className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal-lt text-teal-dk"
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
        <path
          d="m5 12.5 4.5 4.5L19 7.5"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function Hero() {
  return (
    <section className="u-wrap relative pb-14 pt-6 sm:pb-20 sm:pt-12">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[55%_45%] lg:gap-14">
        {/* Left column */}
        <Reveal className="text-center">
          <p className="text-[13px] font-black uppercase tracking-[.2em] text-teal">
            Испитна подготовка
          </p>
          <h1 className="mt-3 text-balance text-[clamp(2.3rem,6vw,4.2rem)] font-extrabold leading-[1.06] tracking-[-.03em] text-ink">
            Спреми се за испит со Кодрум!
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[18px] leading-relaxed text-body sm:text-[19px]">
            Сега е вистинско време да се подготвите за испитите и да ги положите
            без стрес!
          </p>
          <div className="mt-8">
            <p className="mb-3 text-[15px] font-bold text-muted">
              За студенти од:
            </p>
            <ul className="flex flex-wrap justify-center gap-2.5">
              {faculties.map((f) => (
                <li
                  key={f}
                  className="rounded-full border-2 border-line bg-white px-4 py-2 text-[15px] font-extrabold text-ink shadow-[0_6px_16px_-12px_rgba(30,66,74,.5)]"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Right column: product cards */}
        <div className="space-y-5">
          {heroCards.map((card, i) => (
            <Reveal key={card.title} delay={120 + i * 120}>
              <Card className="p-6 sm:p-8">
                <h2 className="mb-5 text-[24px] font-extrabold leading-tight tracking-[-.01em] text-ink">
                  {card.title}
                </h2>
                <ul className="mb-6 space-y-3">
                  {card.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-start gap-3 text-[17px] leading-relaxed text-body"
                    >
                      <CheckTile />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                {card.disabled || !card.href ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      variant="teal"
                      size="lg"
                      disabled
                      data-analytics-subject={card.title}
                      className="w-full sm:w-auto"
                    >
                      {card.cta}
                    </Button>
                    <span className="rounded-full bg-yellow px-3 py-1 text-[12px] font-black uppercase tracking-wide text-ink">
                      Наскоро
                    </span>
                  </div>
                ) : (
                  <Button
                    href={card.href}
                    variant="yellow"
                    size="lg"
                    data-analytics-subject={card.title}
                    className="w-full sm:w-auto"
                  >
                    {card.cta}
                    <Arrow className="h-5 w-5" />
                  </Button>
                )}
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
