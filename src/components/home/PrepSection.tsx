import { loadPrepSessions } from "@/data/prepSessionsApi";
import Button from "@/components/ui/Button";
import Arrow from "@/components/ui/Arrow";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

const bullets = [
  "Подготовка за испит",
  "Може да се следи физички на локација или онлајн преку повик",
  "Се организира на однапред одредени датуми",
  "Најчесто трае 2 до 3 часа дневно",
  "Обично се одвива во неколку дена, зависно од предметот",
  "Фокусот е на решавање испитни задачи и практична подготовка",
];

export async function PrepSection() {
  const { sessions } = await loadPrepSessions();
  const upcoming = sessions.slice(0, 3);

  return (
    <section className="u-wrap pb-16 sm:pb-20">
      <SectionHeading
        title="Припреми"
        intro="Во живо или online подготовки за испит организирани по факултет и предмет, најавени неколку недели пред испитните рокови."
      />

      <div className="grid items-start gap-6 lg:grid-cols-[45%_55%] lg:gap-8">
        {/* Left: info */}
        <Reveal>
          <ul className="mb-7 space-y-3">
            {bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 text-[17px] leading-relaxed text-body"
              >
                <span
                  aria-hidden
                  className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal-lt text-teal-dk"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
                    <path
                      d="m9 6 6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <Button
            href="/pripremi"
            variant="yellow"
            size="lg"
            data-analytics-subject="Припреми"
          >
            Види календар
            <Arrow className="h-5 w-5" />
          </Button>
        </Reveal>

        {/* Right: upcoming sessions board */}
        <Reveal delay={120}>
          <div className="rounded-3xl border-2 border-line bg-white p-6 shadow-[0_24px_50px_-40px_rgba(30,66,74,.6)] sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span
                aria-hidden
                className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-lt text-teal-dk"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3.5" y="5" width="17" height="15" rx="3" />
                  <path d="M8 3v4M16 3v4M3.5 10h17" />
                </svg>
              </span>
              <h3 className="text-[22px] font-extrabold text-ink">
                Следни припреми
              </h3>
            </div>
            <ul className="space-y-3">
              {upcoming.map((prep) => (
                <li
                  key={prep.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-paper-2 p-4"
                >
                  <div className="min-w-0">
                    <h4 className="mb-1.5 text-[17px] font-extrabold leading-snug text-ink">
                      {prep.title}
                    </h4>
                    <span className="inline-block rounded-full bg-teal-lt px-3 py-0.5 text-[13px] font-bold text-teal-dk">
                      {prep.faculty}
                    </span>
                  </div>
                  <div className="shrink-0 text-right text-[18px] font-extrabold text-ink">
                    {prep.startDate}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
