"use client";

import type { FormEvent } from "react";
import { useRef, useState } from "react";
import { trackEvent } from "@/utils/analytics";

type FormState = {
  ime: string;
  prezime: string;
  email: string;
  predmet: string;
  poraka: string;
};

const initialState: FormState = {
  ime: "",
  prezime: "",
  email: "",
  predmet: "",
  poraka: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const hasTrackedStart = useRef(false);

  function trackFormStart() {
    if (hasTrackedStart.current) return;
    hasTrackedStart.current = true;
    // contact_form_start: first focus/click inside contact form.
    trackEvent("contact_form_start", { form_name: "contact" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Неуспешно праќање.");
      }

      setForm(initialState);
      setStatus({
        type: "success",
        message: "Пораката е испратена.",
      });
      // contact_form_submit: only after successful API response.
      trackEvent("contact_form_submit", { form_name: "contact" });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Неуспешно праќање.",
      });
      // contact_form_error: failed contact form submission.
      trackEvent("contact_form_error", { form_name: "contact" });
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="bg-[#F2F0E7] rounded-2xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-[#1E424A] mb-6">Испрати порака</h2>
      <form
        className="space-y-5"
        onSubmit={handleSubmit}
        onFocus={trackFormStart}
        onClick={trackFormStart}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="ime"
              className="block text-sm font-medium text-[#1E424A] mb-1.5"
            >
              Ime *
            </label>
            <input
              id="ime"
              name="ime"
              type="text"
              required
              value={form.ime}
              onChange={(e) => updateField("ime", e.target.value)}
              placeholder="Вашето Ime"
              className="w-full px-4 py-3 rounded-lg border border-[#1E424A]/20 bg-white focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 text-[#1E424A] placeholder:text-[#1E424A]/40 transition-all text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="prezime"
              className="block text-sm font-medium text-[#1E424A] mb-1.5"
            >
              Презиме *
            </label>
            <input
              id="prezime"
              name="prezime"
              type="text"
              required
              value={form.prezime}
              onChange={(e) => updateField("prezime", e.target.value)}
              placeholder="Вашето презиме"
              className="w-full px-4 py-3 rounded-lg border border-[#1E424A]/20 bg-white focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 text-[#1E424A] placeholder:text-[#1E424A]/40 transition-all text-sm"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#1E424A] mb-1.5"
          >
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="vas@email.com"
            className="w-full px-4 py-3 rounded-lg border border-[#1E424A]/20 bg-white focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 text-[#1E424A] placeholder:text-[#1E424A]/40 transition-all text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="predmet"
            className="block text-sm font-medium text-[#1E424A] mb-1.5"
          >
            Предмет / Тема
          </label>
          <input
            id="predmet"
            name="predmet"
            type="text"
            value={form.predmet}
            onChange={(e) => updateField("predmet", e.target.value)}
            placeholder="Тема на вашата порака"
            className="w-full px-4 py-3 rounded-lg border border-[#1E424A]/20 bg-white focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 text-[#1E424A] placeholder:text-[#1E424A]/40 transition-all text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="poraka"
            className="block text-sm font-medium text-[#1E424A] mb-1.5"
          >
            Порака *
          </label>
          <textarea
            id="poraka"
            name="poraka"
            required
            rows={5}
            value={form.poraka}
            onChange={(e) => updateField("poraka", e.target.value)}
            placeholder="Напиши ја вашата порака тука..."
            className="w-full px-4 py-3 rounded-lg border border-[#1E424A]/20 bg-white focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 text-[#1E424A] placeholder:text-[#1E424A]/40 transition-all resize-none text-sm"
          />
        </div>
        {status && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              status.type === "success"
                ? "bg-[#008081]/10 text-[#1E424A]"
                : "bg-[#FACC0B]/15 text-[#1E424A]"
            }`}
          >
            {status.message}
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#008081] hover:bg-[#006566] disabled:opacity-70 text-white font-medium py-3.5 px-6 rounded-lg transition-colors shadow-md text-sm"
        >
          {isSubmitting ? "Се праќа..." : "Испрати"}
        </button>
      </form>
    </div>
  );
}
