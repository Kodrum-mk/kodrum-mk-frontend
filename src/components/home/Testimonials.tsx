"use client";

import { useState, useEffect, useCallback } from "react";
import Arrow from "@/components/ui/Arrow";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Testimonial } from "@/types";

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "Кодрум ми помогна да го положам испитот со одлична оценка. Задачите беа одлично подготвени!",
    name: "Ана Стојковска",
    subtitle: "ФИНКИ, Софтверско Инженерство",
  },
  {
    id: 2,
    quote:
      "Професорите се многу посветени и објаснуваат јасно. Се чувствував подготвен за испитот.",
    name: "Марко Петровски",
    subtitle: "ФЕИТ, Електроника",
  },
  {
    id: 3,
    quote:
      "Одличен начин за учење! Материјалите се прегледни и лесни за следење.",
    name: "Елена Јовановска",
    subtitle: "Економски Факултет",
  },
  {
    id: 4,
    quote:
      "Благодарение на Кодрум, математиката стана полесна за разбирање. Многу практични примери!",
    name: "Димитар Николов",
    subtitle: "Машински Факултет",
  },
  {
    id: 5,
    quote:
      "Одлична поддршка и материјали. Секој концепт е објаснет со примери што навистина помагаат.",
    name: "Сара Илиевска",
    subtitle: "ФИНКИ, Информатика",
  },
  {
    id: 6,
    quote:
      "Припремите на Кодрум ми дадоа сигурност и структура за успешно полагање на испитот.",
    name: "Филип Ангеловски",
    subtitle: "Економски Факултет",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const pairCount = Math.ceil(testimonials.length / 2);

  const next = useCallback(
    () => setCurrentIndex((p) => (p + 2) % testimonials.length),
    [],
  );

  const prev = () =>
    setCurrentIndex((p) => (p - 2 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  const first = testimonials[currentIndex];
  const second = testimonials[(currentIndex + 1) % testimonials.length];

  return (
    <div>
      <SectionHeading title="Што кажуваат студентите" />

      <div className="mx-auto max-w-5xl">
        <div className="grid gap-5 md:grid-cols-2">
          {[first, second].map((t) => (
            <figure
              key={t.id}
              className="step-in flex flex-col rounded-3xl border-2 border-line bg-white p-6 shadow-[0_24px_50px_-40px_rgba(30,66,74,.6)] sm:p-7"
            >
              <span
                aria-hidden
                className="mb-3 text-[44px] font-black leading-none text-teal/30"
              >
                &ldquo;
              </span>
              <blockquote className="flex-1 text-[17px] leading-relaxed text-ink">
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 border-t border-line pt-4">
                <p className="text-[16px] font-extrabold text-ink">{t.name}</p>
                <p className="text-[15px] font-semibold text-teal-dk">
                  {t.subtitle}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center gap-5">
          <button
            onClick={prev}
            aria-label="Претходни искуства"
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-teal hover:bg-teal hover:text-white"
          >
            <Arrow dir="left" className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {Array.from({ length: pairCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i * 2)}
                aria-label={`Оди на искуства ${i + 1}`}
                className={`h-2.5 rounded-full transition-all ${Math.floor(currentIndex / 2) === i ? "w-7 bg-teal" : "w-2.5 bg-line hover:bg-muted/50"}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            aria-label="Следни искуства"
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-teal hover:bg-teal hover:text-white"
          >
            <Arrow className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
