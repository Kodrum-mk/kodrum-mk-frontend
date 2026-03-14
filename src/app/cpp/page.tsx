import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "ЧПП – Честопоставувани прашања",
  description:
    "Одговори на честите прашања за Кодрум, запишување, курсеви и плаќање.",
};

const faqs = [
  {
    q: "Кои се условите за запишување?",
    a: "Не постојат специјални услови. Нашите курсеви и припреми се отворени за сите студенти независно од факултетот и успехот.",
  },
  {
    q: "Каде се одржуваат физичките припреми?",
    a: "Физичките припреми се одржуваат на локација во Скопје. Точните адреси се наведени при запишување на одредена припрема.",
  },
  {
    q: "Дали можам да посетувам припрема онлајн?",
    a: "Да, голем дел на нашите припреми се достапни онлајн преку видео повик, а некои се хибридно или целосно онлајн. Ова е наведено при секоја припрема.",
  },
  {
    q: "Кога е плаќањето?",
    a: "Плаќањето се врши однапред пред почетокот на припремата или курсот преку банкарски трансфер или картичка.",
  },
  {
    q: "Дали постои попуст за студенти?",
    a: "Да, нудиме специјални промо пакети и попусти. Провери ги нашите промо понуди за да ги видиш тековните акции.",
  },
  {
    q: "Каков е распоредот на припремата?",
    a: "Припремите обично траат 2-4 дена по 2-3 часа дневно. Точниот распоред е наведен на страницата за одредена припрема.",
  },
  {
    q: "Дали добивам сертификат?",
    a: "Издаваме потврди за успешно завршување на курсевите. За припремите, исходот зависи од успехот на испитот.",
  },
  {
    q: "Дали можам да се откажам по запишување?",
    a: "Откажувањето е можно до 48 часа пред почетокот на припремата или курсот. По тој период, одлуката е финална и плаќањето не се враќа.",
  },
];

export default function CppPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1E424A] mb-6">
          Честопоставувани прашања
        </h1>
        <p className="text-lg text-[#1E424A]/70 mb-12 leading-relaxed">
          Овде ги наоѓаш одговорите на прашањата кои ги добиваме најчесто. Ако
          не го пронајдеш тоа што го барате, не колебај се да нè контактираш.
        </p>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="bg-white border-2 border-[#1E424A]/10 rounded-2xl p-6 hover:border-[#008081]/30 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#008081]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ChevronRight className="w-5 h-5 text-[#008081]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1E424A] mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-sm text-[#1E424A]/70 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[#1E424A]/60 mb-4">
            Имаш уште прашање? Јави нè се!
          </p>
          <a
            href="/kontakt"
            className="inline-flex bg-[#008081] hover:bg-[#006566] text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-md text-sm items-center gap-2"
          >
            Контакт
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
