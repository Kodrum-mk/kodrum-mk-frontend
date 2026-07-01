"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/utils/analytics";

type FormState = {
  ime: string;
  prezime: string;
  email: string;
  telefon: string;
  discordUsername: string;
  subjectId: string;
  prepSessionId: string;
  attendancePreference: "online" | "physical";
  poraka: string;
};

type Subject = {
  id: string;
  name: string;
  slug: string;
};

const initialState: FormState = {
  ime: "",
  prezime: "",
  email: "",
  telefon: "",
  discordUsername: "",
  subjectId: "",
  prepSessionId: "",
  attendancePreference: "physical",
  poraka: "",
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const hasTrackedStart = useRef(false);

  async function loadSubjects() {
    try {
      const response = await fetch("/api/subjects");
      const payload = (await response.json()) as {
        subjects?: Subject[];
        prepSession?: { id: string; title: string } | null;
      };

      if (!response.ok) {
        throw new Error("Неуспешно читање предмети.");
      }

      const nextSubjects = payload.subjects ?? [];
      setSubjects(nextSubjects);
      setForm((current) => ({
        ...current,
        subjectId: current.subjectId || nextSubjects[0]?.id || "",
        prepSessionId: payload.prepSession?.id ?? "",
      }));
      setStatus(null);
    } catch {
      setStatus({
        type: "error",
        message: "Вклучи Strapi за да се вчитаат предметите.",
      });
    }
  }

  useEffect(() => {
    loadSubjects();
  }, []);

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
      if (!isValidEmail(form.email)) {
        throw new Error("Внесете валиден email.");
      }

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Неуспешно праќање.");
      }

      setForm((current) => ({
        ...initialState,
        prepSessionId: current.prepSessionId,
        subjectId: subjects[0]?.id || "",
      }));
      setStatus({
        type: "success",
        message: "Пријавата е зачувана.",
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
      <h2 className="text-2xl font-bold text-[#1E424A] mb-6">Пријава</h2>
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
              Име *
            </label>
            <input
              id="ime"
              name="ime"
              type="text"
              required
              value={form.ime}
              onChange={(e) => updateField("ime", e.target.value)}
              placeholder="Вашето име"
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
            htmlFor="telefon"
            className="block text-sm font-medium text-[#1E424A] mb-1.5"
          >
            Телефон *
          </label>
          <input
            id="telefon"
            name="telefon"
            type="text"
            required
            value={form.telefon}
            onChange={(e) => updateField("telefon", e.target.value)}
            placeholder="+389 7X XXX XXX"
            className="w-full px-4 py-3 rounded-lg border border-[#1E424A]/20 bg-white focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 text-[#1E424A] placeholder:text-[#1E424A]/40 transition-all text-sm"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-[#1E424A] mb-1.5"
          >
            Начин на присуство *
          </label>
          <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-[#1E424A]/20 bg-white p-1">
            {[
              { value: "physical", label: "Физичко присуство" },
              { value: "online", label: "Онлајн" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    attendancePreference: option.value as "online" | "physical",
                    discordUsername:
                      option.value === "online" ? current.discordUsername : "",
                  }))
                }
                className={`min-h-11 rounded-md px-3 text-sm font-bold transition-colors ${
                  form.attendancePreference === option.value
                    ? "bg-[#008081] text-white shadow-sm"
                    : "bg-transparent text-[#1E424A]/65 hover:bg-[#F2F0E7]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        {form.attendancePreference === "online" && (
          <div>
            <label
              htmlFor="discordUsername"
              className="block text-sm font-medium text-[#1E424A] mb-1.5"
            >
              Discord username
            </label>
            <input
              id="discordUsername"
              name="discordUsername"
              type="text"
              value={form.discordUsername}
              onChange={(e) => updateField("discordUsername", e.target.value)}
              placeholder="username"
              className="w-full px-4 py-3 rounded-lg border border-[#1E424A]/20 bg-white focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 text-[#1E424A] placeholder:text-[#1E424A]/40 transition-all text-sm"
            />
          </div>
        )}
        <div>
          <label
            htmlFor="subjectId"
            className="block text-sm font-medium text-[#1E424A] mb-1.5"
          >
            Предмет *
          </label>
          <select
            id="subjectId"
            name="subjectId"
            required
            value={form.subjectId}
            onChange={(e) => updateField("subjectId", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-[#1E424A]/20 bg-white focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 text-[#1E424A] transition-all text-sm"
          >
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-[#1E424A]/60">
            Ќе добиете email со информации за уплата или следни чекори.
          </p>
        </div>
        <div>
          <label
            htmlFor="poraka"
            className="block text-sm font-medium text-[#1E424A] mb-1.5"
          >
            Порака
          </label>
          <textarea
            id="poraka"
            name="poraka"
            rows={5}
            value={form.poraka}
            onChange={(e) => updateField("poraka", e.target.value)}
            placeholder="Белешка за пријавата..."
            className="w-full px-4 py-3 rounded-lg border border-[#1E424A]/20 bg-white focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 text-[#1E424A] placeholder:text-[#1E424A]/40 transition-all resize-none text-sm"
          />
        </div>
        {status && (
          <div
            className={`rounded-lg px-4 py-3 text-sm flex justify-between items-center ${
              status.type === "success"
                ? "bg-[#008081]/10 text-[#1E424A]"
                : "bg-[#FACC0B]/15 text-[#1E424A]"
            }`}
          >
            <span>{status.message}</span>
            {status.type === "error" && status.message.includes("Strapi") && (
              <button
                type="button"
                onClick={loadSubjects}
                className="ml-4 rounded bg-[#1E424A] px-3 py-1 text-xs text-white"
              >
                Обиди се повторно
              </button>
            )}
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting || subjects.length === 0}
          className="w-full bg-[#008081] hover:bg-[#006566] disabled:opacity-70 text-white font-medium py-3.5 px-6 rounded-lg transition-colors shadow-md text-sm"
        >
          {isSubmitting ? "Се праќа..." : "Зачувај пријава"}
        </button>
      </form>
    </div>
  );
}
