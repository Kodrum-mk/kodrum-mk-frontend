import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { CoursesPreview } from "@/components/home/CoursesPreview";
import { PrepSection } from "@/components/home/PrepSection";
import { InfoSection } from "@/components/home/InfoSection";

export const metadata: Metadata = {
  title: "Кодрум – Приватни часови и испитна подготовка за студенти (ФИНКИ)",
  description:
    "Професионални приватни часови и испитна подготовка за студенти од ФИНКИ, ФЕИТ, МФС и Економски. Индивидуални и групни часови за СП, ООП, АПС, Калкулус 1 и бази во Скопје и онлајн.",
  alternates: {
    canonical: "https://kodrum.mk",
  },
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
