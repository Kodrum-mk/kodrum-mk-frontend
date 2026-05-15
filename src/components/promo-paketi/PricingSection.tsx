"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Star, Gift, Users, Check, Clock, AlertCircle } from "lucide-react";
import type { PromoPackage } from "@/types";
import { fallbackPromoPackages } from "@/data/promoPackages";
import { loadPromoPackages } from "@/data/promoPackagesApi";

const iconByIndex = [Star, Gift, Users];

function getCardIcon(index: number, card: PromoPackage) {
  if (card.featured) return Gift;
  if (card.noteText?.includes("пријатели")) return Users;
  return iconByIndex[index % iconByIndex.length];
}

function getNoteIcon(noteText?: string) {
  if (!noteText) return null;
  if (noteText.includes("Минимум")) return AlertCircle;
  return Clock;
}

export function PricingSection() {
  const [cards, setCards] = useState<PromoPackage[]>(fallbackPromoPackages);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const run = async () => {
      const result = await loadPromoPackages(controller.signal);
      if (controller.signal.aborted) return;
      setCards(result.packages);
      setErrorMessage(result.errorMessage ?? null);
    };

    void run();

    return () => controller.abort();
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white w-full">
      <div className="max-w-7xl mx-auto">
        {errorMessage && (
          <div className="mb-6 rounded-lg border border-[#FACC0B]/50 bg-[#FACC0B]/15 px-4 py-3 text-sm text-[#1E424A]">
            {errorMessage}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => {
            const Icon = getCardIcon(index, card);
            const NoteIcon = getNoteIcon(card.noteText);

            return (
              <Link
                key={card.id}
                href={card.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`bg-white rounded-xl shadow-md p-8 flex flex-col hover:shadow-xl transition-shadow ${
                  card.featured
                    ? "border-2 border-[#008081] lg:scale-105"
                    : "border border-[#1E424A]/10"
                }`}
              >
              {card.badge && (
                <div className="mb-6">
                  <span className="inline-block bg-[#FACC0B] text-[#1E424A] px-4 py-1.5 rounded-lg text-sm font-bold">
                    {card.badge}
                  </span>
                </div>
              )}
              {!card.badge && <div className="mb-6 mt-11" />}

              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-[#008081]/10 flex items-center justify-center">
                  <Icon className="w-8 h-8 text-[#008081]" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#1E424A] mb-3">
                {card.title}
              </h3>
              <p className="text-base text-[#1E424A]/70 mb-6 leading-relaxed">
                {card.description}
              </p>

              {/* Price */}
              <div className="bg-[#F2F0E7] rounded-lg p-5 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-base text-[#1E424A]/50 line-through">
                    {card.originalPrice}
                  </span>
                  <span className="text-xl font-bold text-[#008081]">
                    {card.discount}
                  </span>
                </div>
                <div className="text-sm text-[#008081] font-semibold">
                  {card.savings}
                </div>
              </div>

              {/* Courses */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-[#1E424A] mb-3">
                  Вклучени курсеви:
                </h4>
                <ul className="space-y-2">
                  {card.courses.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-[#1E424A]/70">
                      <Check className="w-4 h-4 text-[#008081] mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Includes */}
              <div className="mb-6 flex-grow">
                <h4 className="text-sm font-bold text-[#1E424A] mb-3">
                  Што е вклучено:
                </h4>
                <ul className="space-y-2">
                  {card.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#1E424A]/70">
                      <Check className="w-4 h-4 text-[#008081] mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {card.noteText && NoteIcon && (
                <div className="bg-[#FACC0B]/10 border border-[#FACC0B]/30 rounded-lg p-3 mb-6 flex items-center gap-2">
                  <NoteIcon className="w-4 h-4 text-[#1E424A] flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm text-[#1E424A] font-medium">
                    {card.noteText}
                  </span>
                </div>
              )}

              <div className="w-full bg-[#008081] hover:bg-[#006566] text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm text-sm mt-auto text-center">
                Само пријави се!
              </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
