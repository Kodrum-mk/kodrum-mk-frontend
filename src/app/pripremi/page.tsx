import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/structured";
import { loadPrepSessions } from "@/data/prepSessionsApi";
import { prepCoursesLd } from "@/lib/structured";
import { PripremiClient } from "@/components/pripremi/PripremiClient";
import Faq from "@/components/ui/Faq";
import SectionHeading from "@/components/ui/SectionHeading";
import { PRIPREMI_FAQ } from "@/data/faq";

export const metadata: Metadata = pageMeta({
  title: "Припреми",
  description:
    "Активни припремни сесии за испити по факултет. Во живо, онлајн и хибридни формати.",
  path: "/pripremi",
});

// Strapi is read on every request (the loader uses no-store); declared so the build does not try to prerender it.
export const dynamic = "force-dynamic";

export default async function PripremiPage() {
  // the list on the page is fetched in the browser; this copy is only for the structured data
  const { sessions } = await loadPrepSessions(AbortSignal.timeout(3000));
  const coursesLd = prepCoursesLd(sessions);
  return (
    <>
      <JsonLd data={breadcrumbLd("Припреми", "/pripremi")} />
      {coursesLd && <JsonLd data={coursesLd} />}
      <div className="u-wrap pt-6 sm:pt-10">
        <SectionHeading
          as="h1"
          title="Активни припреми"
          intro="Прелистај ги тековно достапните припремни сесии за различни факултети и предмети, и провери ги идните термини во календарот подолу."
          className="max-w-3xl"
        />
      </div>
      <PripremiClient />
      <Faq items={PRIPREMI_FAQ} id="pripremi-faq" className="u-wrap pb-20" />
    </>
  );
}
