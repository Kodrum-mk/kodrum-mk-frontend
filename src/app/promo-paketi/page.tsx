import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/structured";
import { PricingSection } from "@/components/promo-paketi/PricingSection";
import Faq from "@/components/ui/Faq";
import SectionHeading from "@/components/ui/SectionHeading";
import { PROMO_FAQ } from "@/data/faq";

export const metadata: Metadata = pageMeta({
  title: "Промо пакети",
  description:
    "Специјални промо понуди, комбинирани пакети и попусти за испитна подготовка.",
  path: "/promo-paketi",
});

export default function PromoPaketiPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd("Промо пакети", "/promo-paketi")} />
      <div className="u-wrap pt-6 sm:pt-10">
        <SectionHeading
          as="h1"
          title="Промо пакети"
          intro="Разгледајте ги нашите специјални промо понуди, комбинирани пакети и подготовки со попуст. Изберете го најдобриот пакет за вас и вашите пријатели и заштедете на вашето образование."
          className="max-w-3xl"
        />
      </div>
      <PricingSection />
      <Faq items={PROMO_FAQ} id="promo-faq" className="u-wrap pb-20" />
    </>
  );
}
