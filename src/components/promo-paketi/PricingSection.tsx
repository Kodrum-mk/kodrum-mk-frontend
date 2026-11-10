"use client";

import Link from "next/link";
import Arrow from "@/components/ui/Arrow";
import Reveal from "@/components/ui/Reveal";
import { useEffect, useState } from "react";
import { Star, Gift, Users, Check, Clock, AlertCircle } from "lucide-react";
import type { PromoPackage } from "@/types";
import { loadPromoPackages } from "@/data/promoPackagesApi";

const iconByIndex = [Star, Gift, Users];

function getCardIcon(index: number, card: PromoPackage) {
  if (card.featured) return Gift;
  if (card.noteText?.includes("пријател")) return Users;
  return iconByIndex[index % iconByIndex.length];
}

function getNoteIcon(noteText?: string) {
  if (!noteText) return null;
  if (noteText.includes("Минимум")) return AlertCircle;
  if (noteText.includes("пријател")) return Users;
  return Clock;
}

function formatSavingsAmount(savings: string) {
  return savings
    .replace(/заштеди/gi, "")
    .replace(/до/gi, "")
    .replace(/мкд/gi, "")
    .replace(/денари/gi, "")
    .trim();
}

function PromoCardSkeleton() {
  return (
    <div className="flex w-full animate-pulse flex-col rounded-3xl border-2 border-line bg-white p-7">
      <div className="mb-6 h-8 w-28 rounded-full bg-yellow/30" />
      <div className="mb-6 h-14 w-14 rounded-2xl bg-teal-lt" />
      <div className="mb-3 h-7 w-3/4 rounded bg-paper-3" />
      <div className="mb-6 space-y-2">
        <div className="h-4 w-full rounded bg-paper-3" />
        <div className="h-4 w-5/6 rounded bg-paper-3" />
      </div>
      <div className="mb-6 h-40 rounded-2xl bg-paper-2" />
      <div className="mb-6 space-y-2">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-4 w-4/5 rounded bg-paper-3" />
        ))}
      </div>
      <div className="mt-auto h-12 w-full rounded-xl bg-teal/20" />
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
    <section
      data-analytics-section="pricing"
      className="u-wrap pb-16 pt-2 sm:pb-20"
    >
      {errorMessage && (
        <div className="mx-auto mb-6 max-w-5xl rounded-2xl border-2 border-yellow bg-yellow-lt px-5 py-4 text-[16px] font-semibold text-ink">
          {errorMessage}
        </div>
      )}
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <PromoCardSkeleton key={index} />
            ))
          : cards.map((card, index) => {
              const Icon = getCardIcon(index, card);
              const NoteIcon = getNoteIcon(card.noteText);
              const isCenteredLastCard =
                cards.length > 1 &&
                cards.length % 2 === 1 &&
                index === cards.length - 1;
              const savingsAmount = formatSavingsAmount(card.savings);
              const isPercentageSavings = savingsAmount.includes("%");

              return (
                <Reveal
                  key={card.id}
                  delay={(index % 2) * 120}
                  className={
                    isCenteredLastCard
                      ? "md:col-span-2 md:mx-auto md:w-[calc(50%-.75rem)]"
                      : ""
                  }
                >
                  <Link
                    href={card.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-analytics-cta="booking"
                    className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border-2 bg-white p-6 shadow-[0_24px_50px_-36px_rgba(30,66,74,.6)] transition hover:-translate-y-1 hover:shadow-[0_30px_60px_-34px_rgba(30,66,74,.7)] sm:p-8 ${
                      card.featured ? "border-teal" : "border-line"
                    }`}
                  >
                    {card.featured && (
                      <span
                        aria-hidden
                        className="absolute inset-x-0 top-0 h-2 bg-teal"
                      />
                    )}

                    <div className="mb-5 flex items-start justify-between gap-3">
                      <span
                        aria-hidden
                        className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-lt text-teal-dk"
                      >
                        <Icon className="h-7 w-7" />
                      </span>
                      {card.badge && (
                        <span className="rounded-full bg-yellow px-4 py-1.5 text-[14px] font-black text-ink shadow-[0_3px_0_#c99f00]">
                          {card.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="mb-2 text-[24px] font-extrabold leading-tight tracking-[-.015em] text-ink">
                      {card.title}
                    </h3>
                    <p className="mb-6 text-[17px] leading-relaxed text-body">
                      {card.description}
                    </p>

                    {/* Price */}
                    <div className="mb-6 flex min-h-[176px] flex-col items-center justify-center rounded-2xl border-2 border-yellow bg-yellow-lt p-5 text-center">
                      <div className="mb-3 text-[18px] font-extrabold uppercase tracking-wide text-ink">
                        Заштеди:
                      </div>
                      <div className="inline-flex flex-col items-center rounded-2xl bg-yellow px-8 py-4 text-ink shadow-[0_5px_0_#c99f00]">
                        <span className="text-5xl font-black leading-none">
                          {savingsAmount}
                        </span>
                        {!isPercentageSavings && (
                          <span className="text-[16px] font-extrabold uppercase tracking-wide">
                            денари
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Courses */}
                    <div className="mb-6">
                      <h4 className="mb-3 text-[13px] font-black uppercase tracking-[.14em] text-muted">
                        Вклучени припреми:
                      </h4>
                      <ul className="space-y-2.5">
                        {card.courses.map((c) => (
                          <li
                            key={c}
                            className="flex items-start gap-3 text-[17px] leading-snug text-body"
                          >
                            <Check
                              className="mt-1 h-[18px] w-[18px] shrink-0 text-teal"
                              aria-hidden="true"
                            />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Includes */}
                    <div className="mb-6 flex-grow">
                      <h4 className="mb-3 text-[13px] font-black uppercase tracking-[.14em] text-muted">
                        Што е вклучено:
                      </h4>
                      <ul className="space-y-2.5">
                        {card.includes.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-[17px] leading-snug text-body"
                          >
                            <Check
                              className="mt-1 h-[18px] w-[18px] shrink-0 text-teal"
                              aria-hidden="true"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {card.noteText && NoteIcon && (
                      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-yellow/60 bg-yellow-lt p-4">
                        <NoteIcon
                          className="h-5 w-5 shrink-0 text-ink"
                          aria-hidden="true"
                        />
                        <span className="text-[16px] font-bold text-ink">
                          {card.noteText}
                        </span>
                      </div>
                    )}

                    <span className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal px-6 py-4 text-[16px] font-black tracking-wide text-white shadow-[0_4px_0_var(--color-teal-dk)] transition group-hover:translate-y-0.5 group-hover:shadow-[0_2px_0_var(--color-teal-dk)]">
                      Само пријави се!
                      <Arrow className="h-5 w-5" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
      </div>
    </section>
  );
}
