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
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-lg border border-[#1E424A]/10 bg-white px-4 py-3 text-[#1E424A] shadow-lg">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed">
          Користиме аналитика за да разбереме посети и да ја подобриме услугата.{" "}
          <Link
            href="/privatnost"
            className="font-semibold text-[#008081] hover:text-[#006566]"
          >
            Политика за приватност
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={acceptNotice}
          className="shrink-0 rounded-lg bg-[#008081] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#006566]"
        >
          Во ред
        </button>
      </div>
    </div>
  );
}
