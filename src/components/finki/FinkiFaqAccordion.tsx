"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { finkiFaqs } from "@/data/finkiFaqs";

export function FinkiFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((curr) => (curr === idx ? null : idx));
  };

  return (
    <div className="space-y-3">
      {finkiFaqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.question}
            className="border-2 border-[#1E424A]/10 rounded-xl overflow-hidden bg-white transition-all"
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-[#F2F0E7]/40 transition-colors"
            >
              <span className="text-base font-bold text-[#1E424A]">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-[#008081] flex-shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-sm text-[#1E424A]/75 leading-relaxed border-t border-[#1E424A]/5">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
