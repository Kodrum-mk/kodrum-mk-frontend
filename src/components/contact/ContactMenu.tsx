"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import ContactIcon from "./icons";
import { channels } from "./channels";

/**
 * A round "Контакт" button in the corner of every public page. It opens a small panel with the ways to
 * reach Kodrum (call, WhatsApp, Viber, Instagram, Discord, email). It lifts above the cookie notice while
 * that is visible (see `.contact-fab` in globals.css).
 */
export default function ContactMenu() {
  const path = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // the admin dashboard is a tool, not a public page
  if (path.startsWith("/admin")) return null;

  return (
    <div
      ref={root}
      className="contact-fab fixed bottom-3 right-3 z-40 flex flex-col items-end gap-3 sm:bottom-4 sm:right-4"
    >
      {open && (
        <div
          id="contact-panel"
          role="dialog"
          aria-label="Контакт"
          className="w-[min(20rem,calc(100vw-1.5rem))] rounded-3xl border border-line bg-white/95 p-3 shadow-[0_24px_60px_-20px_rgba(30,66,74,.55)] backdrop-blur-xl"
        >
          <p className="px-2 pb-2 pt-1 text-[17px] font-extrabold text-ink">
            Јавете ни се
          </p>
          <ul className="space-y-1">
            {channels().map((c) => (
              <li key={c.id}>
                <a
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-paper-2"
                >
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white"
                    style={{ background: c.tile }}
                  >
                    <ContactIcon name={c.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[16px] font-extrabold leading-tight text-ink">
                      {c.label}
                    </span>
                    <span className="block truncate text-[14px] font-semibold text-muted">
                      {c.hint}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        aria-expanded={open}
        aria-controls="contact-panel"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2.5 rounded-full bg-teal py-3 pl-4 pr-5 text-[15px] font-black text-white shadow-[0_12px_28px_-10px_rgba(0,105,106,.7),0_4px_0_var(--color-teal-dk)] outline-none transition hover:translate-y-0.5 focus-visible:ring-4 focus-visible:ring-teal/30"
      >
        <ContactIcon name="chat" className="h-5 w-5" />
        Контакт
      </button>
    </div>
  );
}
