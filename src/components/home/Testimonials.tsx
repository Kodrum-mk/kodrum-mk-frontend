"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    []
  );

  const prev = () =>
    setCurrentIndex(
      (p) => (p - 2 + testimonials.length) % testimonials.length
    );

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  const first = testimonials[currentIndex];
  const second = testimonials[(currentIndex + 1) % testimonials.length];

  return (
    <div>
      <h3 className="text-2xl font-bold text-[#1E424A] mb-6">
        Што кажуваат студентите
      </h3>

      <div className="flex flex-col gap-6">
        {[first, second].map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#008081]"
          >
            <p className="text-base text-[#1E424A] leading-relaxed italic mb-4">
              &ldquo;{t.quote}&rdquo;
            </p>
            <p className="font-bold text-[#1E424A] text-sm">{t.name}</p>
            <p className="text-sm text-[#008081]">{t.subtitle}</p>
          </div>
        ))}

        {/* Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={prev}
            aria-label="Previous testimonials"
            className="p-2 rounded-lg bg-white hover:bg-[#008081] hover:text-white border border-[#1E424A]/10 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {Array.from({ length: pairCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i * 2)}
                aria-label={`Go to testimonial pair ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  Math.floor(currentIndex / 2) === i
                    ? "bg-[#008081] w-6"
                    : "bg-[#1E424A]/20 hover:bg-[#1E424A]/40 w-2"
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            aria-label="Next testimonials"
            className="p-2 rounded-lg bg-white hover:bg-[#008081] hover:text-white border border-[#1E424A]/10 transition-colors shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
