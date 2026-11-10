"use client";

import type { FormEvent } from "react";
import { useState, useRef } from "react";
import { trackEvent } from "@/utils/analytics";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  subject: "",
  message: "",
};

const inputCls =
  "w-full rounded-2xl border-2 border-line bg-white px-4 py-3 text-[16px] text-ink outline-none transition placeholder:text-muted/70 focus:border-teal focus:ring-4 focus:ring-teal/20";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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
    trackEvent("contact_form_start", { form_name: "contact" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      if (!isValidEmail(form.email)) {
        throw new Error("Please enter a valid email.");
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Failed to send message.");
      }

      setForm(initialState);
      setStatus({
        type: "success",
        message: "Message sent successfully.",
      });
      trackEvent("contact_form_submit", { form_name: "contact" });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to send message.",
      });
      trackEvent("contact_form_error", { form_name: "contact" });
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="rounded-3xl border-2 border-line bg-white p-6 shadow-[0_24px_60px_-34px_rgba(30,66,74,.5)] sm:p-8">
      <h2 className="mb-6 text-[26px] font-extrabold tracking-[-.01em] text-ink">
        Send a Message
      </h2>
      <form
        className="space-y-5"
        onSubmit={handleSubmit}
        onFocus={trackFormStart}
        onClick={trackFormStart}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="mb-1.5 block text-[15px] font-bold text-ink"
            >
              First Name *
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              placeholder="Your First Name"
              className={inputCls}
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="mb-1.5 block text-[15px] font-bold text-ink"
            >
              Last Name *
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              placeholder="Your Last Name"
              className={inputCls}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-[15px] font-bold text-ink"
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
            placeholder="you@email.com"
            className={inputCls}
          />
        </div>
        <div>
          <label
            htmlFor="subject"
            className="mb-1.5 block text-[15px] font-bold text-ink"
          >
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={form.subject}
            onChange={(e) => updateField("subject", e.target.value)}
            placeholder="Message Subject"
            className={inputCls}
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="mb-1.5 block text-[15px] font-bold text-ink"
          >
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            placeholder="Write your message here..."
            className={`${inputCls} resize-none`}
          />
        </div>
        {status && (
          <div
            role={status.type === "error" ? "alert" : "status"}
            className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3 text-[16px] font-semibold text-ink ${
              status.type === "success"
                ? "border-teal/30 bg-teal-lt"
                : "border-yellow bg-yellow-lt"
            }`}
          >
            <span>{status.message}</span>
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-teal px-6 py-4 text-[16px] font-black tracking-wide text-white shadow-[0_4px_0_var(--color-teal-dk)] outline-none transition hover:translate-y-0.5 hover:shadow-[0_2px_0_var(--color-teal-dk)] focus-visible:ring-4 focus-visible:ring-teal/30 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
