import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { CoursesPreview } from "@/components/home/CoursesPreview";
import { PrepSection } from "@/components/home/PrepSection";
import { InfoSection } from "@/components/home/InfoSection";

export const metadata: Metadata = {
  title: "Кодрум – Испитна подготовка за студенти",
  description:
    "Сега е вистинско време да завршите со испитите и да уживате во летото без стрес! 😎🌴",
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
