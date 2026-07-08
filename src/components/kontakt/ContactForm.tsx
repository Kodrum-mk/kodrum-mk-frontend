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

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
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
        message: error instanceof Error ? error.message : "Failed to send message.",
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
    <div className="bg-[#F2F0E7] rounded-2xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-[#1E424A] mb-6">
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
              className="block text-sm font-medium text-[#1E424A] mb-1.5"
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
              className="w-full px-4 py-3 rounded-lg border border-[#1E424A]/20 bg-white focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 text-[#1E424A] placeholder:text-[#1E424A]/40 transition-all text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-[#1E424A] mb-1.5"
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
            placeholder="you@email.com"
            className="w-full px-4 py-3 rounded-lg border border-[#1E424A]/20 bg-white focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 text-[#1E424A] placeholder:text-[#1E424A]/40 transition-all text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-[#1E424A] mb-1.5"
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
            className="w-full px-4 py-3 rounded-lg border border-[#1E424A]/20 bg-white focus:outline-none focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/20 text-[#1E424A] placeholder:text-[#1E424A]/40 transition-all text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-[#1E424A] mb-1.5"
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
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#008081] hover:bg-[#006566] disabled:opacity-70 text-white font-medium py-3.5 px-6 rounded-lg transition-colors shadow-md text-sm"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
