"use client";

import { motion, useReducedMotion } from "framer-motion";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";

interface FacultyCard {
  id: string;
  name: string;
  courses: string[];
}

const facultyData: FacultyCard[] = [
  {
    id: "finki",
    name: "ФИНКИ",
    courses: [
      "Математика 1",
      "Структурно програмирање",
      "Објектно програмирање",
      "Алгоритми и податоци",
      "Веб Програмирање",
    ],
  },
  {
    id: "feit",
    name: "ФЕИТ",
    courses: [
      "Математика 1",
      "Основи на електротехника",
      "Физика",
      "Електронски системи",
      "Сигнали и Системи",
    ],
  },
  {
    id: "mfs",
    name: "МФС",
    courses: [
      "Математика 1",
      "Механика",
      "Инженерска графика",
      "Техничка подготовка",
      "Материјали",
    ],
  },
  {
    id: "ekonomski",
    name: "Економски",
    courses: [
      "Математика",
      "Статистика",
      "Микроекономија",
      "Сметководство",
      "Менаџмент",
    ],
  },
];

const ACCENTS = ["bg-teal", "bg-yellow", "bg-ink", "bg-teal-dk"];
const duplicated = [...facultyData, ...facultyData, ...facultyData];

function FacultyCardView({
  faculty,
  accent,
}: {
  faculty: FacultyCard;
  accent: string;
}) {
  return (
    <div className="relative h-full overflow-hidden rounded-3xl border-2 border-line bg-white p-7 shadow-[0_24px_50px_-40px_rgba(30,66,74,.6)]">
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-1.5 ${accent}`}
      />
      <h3 className="text-[28px] font-extrabold tracking-[-.02em] text-ink">
        {faculty.name}
      </h3>
      <ul className="mt-5 space-y-3">
        {faculty.courses.map((course) => (
          <li
            key={course}
            className="flex items-start gap-3 text-[17px] leading-snug text-body"
          >
            <span
              aria-hidden
              className="mt-[.55em] h-2 w-2 shrink-0 rounded-full bg-teal"
            />
            {course}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CoursesPreview() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden pb-16 pt-4 sm:pb-20">
      <div className="u-wrap">
        <SectionHeading
          kicker="Наскоро"
          title="Курсеви"
          intro="Истражувајте ги нашите курсеви по факултет и погледнете кои предмети се моментално достапни за подготовка."
        />
        <div className="-mt-2 mb-10 flex justify-center">
          <Button variant="teal" size="lg" disabled>
            Види ги сите
          </Button>
        </div>
      </div>

      {reduceMotion ? (
        // reduced motion: a plain, swipeable row instead of the endless marquee
        <ul className="flex snap-x gap-5 overflow-x-auto px-4 pb-4">
          {facultyData.map((faculty, i) => (
            <li
              key={faculty.id}
              className="w-[300px] shrink-0 snap-start md:w-[360px]"
            >
              <FacultyCardView
                faculty={faculty}
                accent={ACCENTS[i % ACCENTS.length]}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="relative w-full overflow-hidden">
          {/* each card carries its own right padding, so one third of the track is exactly one loop */}
          <motion.div
            className="flex w-max"
            animate={{ x: ["0%", "-33.3333%"] }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 60,
              ease: "linear",
            }}
            aria-hidden="true"
          >
            {duplicated.map((faculty, index) => (
              <div
                key={`${faculty.id}-${index}`}
                className="w-[320px] shrink-0 pr-5 md:w-[380px]"
              >
                <FacultyCardView
                  faculty={faculty}
                  accent={ACCENTS[index % ACCENTS.length]}
                />
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </section>
  );
}
