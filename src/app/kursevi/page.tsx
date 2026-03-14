import type { Metadata } from "next";
import { CoursesClient } from "@/components/kursevi/CoursesClient";

export const metadata: Metadata = {
  title: "Курсеви",
  description:
    "Разгледајте ги сите достапни онлајн курсеви за студенти од ФИНКИ, ФЕИТ, Економски и Машински факултет.",
};

export default function KurseviPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1E424A] mb-4">
          Курсеви
        </h1>
        <p className="text-lg text-[#1E424A]/70 max-w-2xl">
          Пребарај и филтрирај курсеви по факултет. Секој курс вклучува видео
          материјали, задачи и поддршка од инструкторот.
        </p>
      </div>
      <CoursesClient />
    </div>
  );
}
