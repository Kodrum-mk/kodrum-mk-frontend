"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Star, Gift, Users, Check, Clock, AlertCircle } from "lucide-react";
import type { PromoPackage } from "@/types";
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

function PromoCardSkeleton() {
  return (
    <div className="w-full max-w-[430px] bg-white rounded-xl border border-[#1E424A]/10 shadow-md p-8 flex flex-col animate-pulse">
      <div className="mb-6 h-8 w-28 rounded-lg bg-[#FACC0B]/20" />
      <div className="mb-6">
        <div className="w-16 h-16 rounded-full bg-[#008081]/10" />
      </div>
      <div className="h-7 w-3/4 rounded bg-[#1E424A]/10 mb-3" />
      <div className="space-y-2 mb-6">
        <div className="h-4 w-full rounded bg-[#1E424A]/10" />
        <div className="h-4 w-5/6 rounded bg-[#1E424A]/10" />
      </div>
      <div className="bg-[#F2F0E7] rounded-lg p-5 mb-6">
        <div className="h-6 w-32 rounded bg-[#1E424A]/10 mb-2" />
        <div className="h-4 w-28 rounded bg-[#008081]/10" />
      </div>
      <div className="space-y-2 mb-6">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-4 w-4/5 rounded bg-[#1E424A]/10" />
        ))}
      </div>
      <div className="space-y-2 mb-6 flex-grow">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-4 w-full rounded bg-[#1E424A]/10" />
        ))}
      </div>
      <div className="h-11 w-full rounded-lg bg-[#008081]/15 mt-auto" />
    </div>
  );
}

export function PricingSection() {
  const [cards, setCards] = useState<PromoPackage[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const run = async () => {
      setIsLoading(true);
      const result = await loadPromoPackages(controller.signal);
      if (controller.signal.aborted) return;
      setCards(result.packages);
      setErrorMessage(result.errorMessage ?? null);
      setIsLoading(false);
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
        <div className="mx-auto grid w-full max-w-[920px] grid-cols-1 justify-items-center gap-8 md:grid-cols-2">
          {isLoading ? Array.from({ length: 3 }).map((_, index) => (
            <PromoCardSkeleton key={index} />
          )) : cards.map((card, index) => {
            const Icon = getCardIcon(index, card);
            const NoteIcon = getNoteIcon(card.noteText);
            const isCenteredLastCard =
              cards.length > 1 && cards.length % 2 === 1 && index === cards.length - 1;

            return (
              <Link
                key={card.id}
                href={card.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full max-w-[430px] bg-white rounded-xl shadow-md p-8 flex flex-col hover:shadow-xl transition-shadow ${
                  isCenteredLastCard ? "md:col-span-2" : ""
                } ${
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
              <div className="bg-[#F2F0E7] rounded-lg p-6 mb-6 border-2 border-[#FACC0B]/60 text-center">
                <div className="mb-3 flex flex-wrap items-baseline justify-center gap-4">
                  <span className="text-lg text-[#1E424A]/50 line-through">
                    {card.originalPrice}
                  </span>
                  <span className="text-5xl font-black leading-none text-[#008081]">
                    {card.discount}
                  </span>
                </div>
                <div className="mb-2 text-sm font-extrabold uppercase tracking-wide text-[#1E424A]">
                  Попуст:
                </div>
                <div className="inline-flex rounded-lg bg-[#FACC0B] px-4 py-2 text-lg font-black text-[#1E424A] shadow-sm">
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
