import type { Metadata } from "next";
import { PricingSection } from "@/components/promo-paketi/PricingSection";

export const metadata: Metadata = {
  title: "Промо пакети",
  description:
    "Специјални промо понуди, комбинирани пакети и попусти за испитна подготовка.",
};

export default function PromoPaketiPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E424A] mb-6">
            Промо пакети
          </h1>
          <p className="text-lg text-[#1E424A]/70 leading-relaxed">
            Разгледајте ги нашите специјални промо понуди, комбинирани пакети и
            подготовки со попуст. Изберете го најдобриот пакет за вас и вашите
            пријатели и заштедете на вашето образование.
          </p>
        </div>
      </div>
      <PricingSection />
    </div>
  );
}
