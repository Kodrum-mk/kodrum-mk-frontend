"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

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

const duplicated = [...facultyData, ...facultyData, ...facultyData];

export function CoursesPreview() {
  return (
    <section className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto w-full mb-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1E424A] mb-4">
            Курсеви
          </h2>
          <p className="text-lg text-[#1E424A]/70 max-w-2xl mx-auto mb-8">
            Истражувајте ги нашите курсеви по факултет и погледнете кои предмети
            се моментално достапни за подготовка.
          </p>
          <Link
            href="/kursevi"
            className="bg-[#008081] hover:bg-[#006566] text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-md inline-flex items-center gap-2 text-sm"
          >
            Види ги сите
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Scrolling carousel */}
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex gap-8"
          animate={{ x: ["0%", `-${(100 / 3) * facultyData.length}%`] }}
          transition={{ repeat: Infinity, repeatType: "loop", duration: 60, ease: "linear" }}
          aria-hidden="true"
        >
          {duplicated.map((faculty, index) => (
            <div
              key={`${faculty.id}-${index}`}
              className="flex-shrink-0 w-[350px] md:w-[400px]"
            >
              <div className="bg-gradient-to-br from-[#1E424A] to-[#1E424A]/90 rounded-2xl shadow-2xl p-8 h-[420px] flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#008081]/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#FACC0B]/10 rounded-full blur-3xl" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-6">
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                      {faculty.name}
                    </h3>
                    <div className="w-16 h-1 bg-[#008081] rounded-full" />
                  </div>
                  <ul className="space-y-3">
                    {faculty.courses.map((course) => (
                      <li
                        key={course}
                        className="flex items-start gap-3 text-white/90"
                      >
                        <ChevronRight
                          className="w-5 h-5 text-[#008081] mt-1 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span className="text-lg leading-relaxed">{course}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
