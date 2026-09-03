"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Send, CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { trackEvent } from "@/utils/analytics";

type FormState = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  format: string;
  notes: string;
};

const initialForm: FormState = {
  name: "",
  phone: "",
  email: "",
  subject: "Структурно програмирање (C/C++)",
  format: "Во живо во Скопје",
  notes: "",
};

const finkiSubjects = [
  "Структурно програмирање (C/C++)",
  "Објектно-ориентирано програмирање (ООП)",
  "Алгоритми и структури на податоци (АПС)",
  "Калкулус 1 (Математичка анализа)",
  "Калкулус 2",
  "Дискретна математика",
  "Веб програмирање",
  "Бази на податоци",
  "Напредно програмирање",
  "Оперативни системи",
  "Друг предмет (наведете во порака)",
];

export function FinkiInquiryForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const formattedMessage = [
        "--- БАРАЊЕ ЗА ПРИВАТНИ ЧАСОВИ ФИНКИ ---",
        `Име: ${form.name}`,
        `Телефон / Viber: ${form.phone}`,
        `Email: ${form.email}`,
        `Предмет: ${form.subject}`,
        `Формат: ${form.format}`,
        `Белешка: ${form.notes || "Нема белешка"}`,
      ].join("\n");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.name,
          lastName: "(ФИНКИ Приватни часови)",
          email: form.email,
          subject: `[Приватни часови ФИНКИ] ${form.subject}`,
          message: formattedMessage,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Грешка при испраќање на пријавата.");
      }

      setIsSuccess(true);
      trackEvent("finki_inquiry_submit", { subject: form.subject });
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Грешка при испраќање. Обидете се повторно."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-white border-2 border-[#008081]/30 rounded-2xl p-8 text-center shadow-xl">
        <div className="w-16 h-16 bg-[#008081]/10 text-[#008081] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-[#1E424A] mb-2">
          Пријавата е успешно испратена!
        </h3>
        <p className="text-base text-[#1E424A]/70 mb-6 max-w-md mx-auto">
          Ти благодариме! Нашиот менторски тим ќе те контактира на телефон/Viber во најбрз можен рок за да го договориме првиот час и терминот.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="viber://chat?number=%2B38975295582"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#7360F2] text-white font-medium text-sm hover:opacity-95 transition-opacity"
          >
            <MessageCircle className="w-4 h-4" />
            Пиши директно на Viber
          </a>
          <button
            type="button"
            onClick={() => {
              setIsSuccess(false);
              setForm(initialForm);
            }}
            className="px-5 py-3 rounded-lg border border-[#1E424A]/20 text-[#1E424A] font-medium text-sm hover:bg-[#F2F0E7] transition-colors"
          >
            Испрати ново барање
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-[#1E424A]/10 rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-[#008081] bg-[#008081]/10 px-3 py-1 rounded-full">
          Брза пријава
        </span>
        <h3 className="text-2xl font-bold text-[#1E424A] mt-2">
          Закажи приватен час за ФИНКИ
        </h3>
        <p className="text-sm text-[#1E424A]/70 mt-1">
          Пополни ги основните податоци и нашиот тим ќе те исконтактира со предлог термини.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-semibold text-[#1E424A] mb-1.5"
          >
            Име и презиме *
          </label>
          <input
            id="name"
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="пр. Марко Стојановски"
            className="w-full px-4 py-2.5 rounded-lg border border-[#1E424A]/20 bg-[#F2F0E7]/30 text-[#1E424A] text-sm focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-semibold text-[#1E424A] mb-1.5"
            >
              Телефон / Viber / WhatsApp *
            </label>
            <input
              id="phone"
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="07X XXX XXX"
              className="w-full px-4 py-2.5 rounded-lg border border-[#1E424A]/20 bg-[#F2F0E7]/30 text-[#1E424A] text-sm focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-[#1E424A] mb-1.5"
            >
              Email адреса *
            </label>
            <input
              id="email"
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="tvojot@email.com"
              className="w-full px-4 py-2.5 rounded-lg border border-[#1E424A]/20 bg-[#F2F0E7]/30 text-[#1E424A] text-sm focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="subject"
              className="block text-xs font-semibold text-[#1E424A] mb-1.5"
            >
              ФИНКИ Предмет *
            </label>
            <select
              id="subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#1E424A]/20 bg-[#F2F0E7]/30 text-[#1E424A] text-sm focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 transition-all"
            >
              {finkiSubjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="format"
              className="block text-xs font-semibold text-[#1E424A] mb-1.5"
            >
              Префериран формат *
            </label>
            <select
              id="format"
              value={form.format}
              onChange={(e) => setForm({ ...form, format: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#1E424A]/20 bg-[#F2F0E7]/30 text-[#1E424A] text-sm focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 transition-all"
            >
              <option value="Во живо во Скопје">Во живо во Скопје</option>
              <option value="Онлајн (видео повик)">Онлајн (видео повик)</option>
              <option value="Хибридно / Сеедно">Хибридно / Сеедно</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="notes"
            className="block text-xs font-semibold text-[#1E424A] mb-1.5"
          >
            Дополнителни информации (задачи, рок, термин)
          </label>
          <textarea
            id="notes"
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="пр. Ми треба подготовка за втор колоквиум по СП, слободен сум после 16ч..."
            className="w-full px-4 py-2.5 rounded-lg border border-[#1E424A]/20 bg-[#F2F0E7]/30 text-[#1E424A] text-sm focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 transition-all resize-none"
          />
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#008081] hover:bg-[#006566] disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 text-sm"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? "Се испраќа..." : "Испрати барање за час"}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-[#1E424A]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#1E424A]/70">
        <span>Имаш итно прашање или испит утре?</span>
        <a
          href="tel:+38975295582"
          className="inline-flex items-center gap-1.5 font-bold text-[#008081] hover:underline"
        >
          <Phone className="w-3.5 h-3.5" />
          Јави се директно: +389 75 295 582
        </a>
      </div>
    </div>
  );
}
