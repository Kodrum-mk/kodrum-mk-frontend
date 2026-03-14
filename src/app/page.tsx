import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { CoursesPreview } from "@/components/home/CoursesPreview";
import { PrepSection } from "@/components/home/PrepSection";
import { InfoSection } from "@/components/home/InfoSection";

export const metadata: Metadata = {
  title: "Кодрум – Испитна подготовка за студенти",
  description:
    "Подгови се за испити преку практично решавање на задачи, фокусирана подготовка и флексибилни формати на учење.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <CoursesPreview />
      <PrepSection />
      <InfoSection />
    </>
  );
}
