import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { CoursesPreview } from "@/components/home/CoursesPreview";
import { PrepSection } from "@/components/home/PrepSection";
import { InfoSection } from "@/components/home/InfoSection";

export const metadata: Metadata = pageMeta({
  title: "Кодрум – Приватни часови и испитна подготовка за студенти (ФИНКИ)",
  description:
    "Професионални приватни часови и испитна подготовка за студенти од ФИНКИ, ФЕИТ, МФС и Економски. Индивидуални и групни часови за СП, ООП, АПС, Калкулус 1 и бази во Скопје и онлајн.",
  path: "/",
});

// PrepSection reads Strapi on every request (no-store); declared so the build does not try to prerender it.
export const dynamic = "force-dynamic";

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
