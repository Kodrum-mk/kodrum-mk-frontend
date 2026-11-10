"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "kodrum_cookie_notice_seen";

export function CookieNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      setIsVisible(window.localStorage.getItem(STORAGE_KEY) !== "true");
    } catch {
      setIsVisible(false);
    }
  }, []);

  // lets CSS lift the floating contact button above the notice (globals.css)
  useEffect(() => {
    if (!isVisible) return;
    document.documentElement.setAttribute("data-cookie-notice", "");
    return () => document.documentElement.removeAttribute("data-cookie-notice");
  }, [isVisible]);

  function acceptNotice() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // This notice must never block browsing.
    }

    setIsVisible(false);
  }

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Колачиња"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-3xl border border-line bg-white px-5 py-4 text-ink shadow-[0_24px_60px_-20px_rgba(30,66,74,.55)] sm:inset-x-4 sm:bottom-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[15px] leading-relaxed text-body">
          Овој сајт користи колачиња и собира податоци за аналитика.{" "}
          <Link
            href="/privatnost"
            className="font-bold text-teal-dk underline underline-offset-4 hover:text-teal"
          >
            Политика за приватност
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={acceptNotice}
          className="shrink-0 rounded-xl bg-teal px-6 py-2.5 text-[15px] font-black text-white shadow-[0_4px_0_var(--color-teal-dk)] transition hover:translate-y-0.5 hover:shadow-[0_2px_0_var(--color-teal-dk)]"
        >
          Во ред
        </button>
      </div>
    </div>
  );
}
