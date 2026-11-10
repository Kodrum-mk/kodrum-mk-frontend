import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/structured";
import Faq from "@/components/ui/Faq";
import SectionHeading from "@/components/ui/SectionHeading";
import { CPP_FAQ } from "@/data/faq";

export const metadata: Metadata = pageMeta({
  title: "ЧПП – Честопоставувани прашања",
  description:
    "Одговори на честите прашања за Кодрум, запишување, курсеви и плаќање.",
  path: "/cpp",
});

export default function CppPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd("ЧПП", "/cpp")} />
      <div className="u-wrap pt-6 sm:pt-10">
        <SectionHeading
          as="h1"
          title="Честопоставувани прашања"
          intro="Овде ги наоѓаш одговорите на прашањата кои ги добиваме најчесто. Ако не го пронајдеш тоа што го барате, не колебај се да нè контактираш."
          className="max-w-3xl"
        />
      </div>
      <Faq
        items={CPP_FAQ}
        id="cpp-faq"
        title="Прашања и одговори"
        className="u-wrap pb-20"
      />
    </>
  );
}
