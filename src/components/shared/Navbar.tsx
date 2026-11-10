"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import ContactIcon from "@/components/contact/icons";
import { DISCORD_URL } from "@/lib/site";
import { cn } from "@/utils/cn";

type NavLink = { label: string; href: string | null; disabled?: boolean };

const navLinks: NavLink[] = [
  { label: "Почетна", href: "/" },
  { label: "Припреми", href: "/pripremi" },
  { label: "Курсеви", href: null, disabled: true },
  { label: "Промо пакети", href: "/promo-paketi" },
  { label: "Контакт", href: "/kontakt" },
];

const linkBase = "rounded-full px-4 py-2.5 text-[15px] font-bold transition";
const linkIdle = "text-ink hover:bg-teal-lt/70 hover:text-teal-dk";
const linkActive = "bg-teal-lt text-teal-dk";

function SoonChip() {
  return (
    <span className="rounded-full bg-yellow px-2 py-0.5 text-[10.5px] font-black uppercase leading-none tracking-wide text-ink">
      Наскоро
    </span>
  );
}

/**
 * Floating white pill, sticky at the top. The header is transparent and `pointer-events-none`, so the
 * page backdrop shows around the pill and clicks pass through the gaps. Below `lg` the links live in a
 * panel under the pill, which is what keeps it from overflowing at 360-1023px.
 */
export function Navbar() {
  const path = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const panelId = useId();

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

  const isActive = (href: string) =>
    href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`);

  return (
    <header className="site-header pointer-events-none sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div ref={root} className="relative mx-auto max-w-[1200px]">
        <nav
          aria-label="Главна навигација"
          className="pointer-events-auto flex h-14 items-center gap-1 rounded-full border border-line bg-white/95 p-1.5 pl-4 shadow-[0_12px_32px_-14px_rgba(30,66,74,.4)] backdrop-blur-xl sm:h-16 sm:gap-3 sm:p-2 sm:pl-5"
        >
          <Link
            href="/"
            className="mr-auto flex shrink-0 items-center lg:mr-4"
            aria-label="Кодрум, почетна страница"
          >
            <Image
              src="/logo.png"
              alt="Кодрум"
              width={703}
              height={229}
              priority
              className="h-8 w-auto sm:h-10"
            />
          </Link>

          <div className="mr-auto hidden items-center gap-1 lg:flex">
            {navLinks.map((l) =>
              l.href ? (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={cn(
                    linkBase,
                    "whitespace-nowrap",
                    isActive(l.href) ? linkActive : linkIdle,
                  )}
                >
                  {l.label}
                </Link>
              ) : (
                <span
                  key={l.label}
                  aria-disabled="true"
                  className={cn(
                    linkBase,
                    "inline-flex cursor-default items-center gap-2 text-muted",
                  )}
                >
                  {l.label}
                  <SoonChip />
                </span>
              ),
            )}
          </div>

          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Приклучи се на Discord заедницата"
            className="hidden h-10 items-center gap-2 rounded-full bg-teal px-4 text-[14px] font-extrabold text-white shadow-[0_3px_0_var(--color-teal-dk)] transition hover:brightness-110 sm:inline-flex sm:px-5 sm:text-[15px]"
          >
            <ContactIcon name="discord" className="h-[18px] w-[18px]" />
            Discord
          </a>

          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "Затвори го менито" : "Отвори го менито"}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink transition hover:bg-teal-lt/70 lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              aria-hidden
            >
              {open ? (
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </nav>

        {open && (
          <div
            id={panelId}
            className="pointer-events-auto absolute inset-x-0 top-full mt-2 origin-top rounded-3xl border border-line bg-white p-2 shadow-[0_24px_60px_-20px_rgba(30,66,74,.45)] lg:hidden"
          >
            <ul className="space-y-1">
              {navLinks.map((l) => (
                <li key={l.label}>
                  {l.href ? (
                    <Link
                      href={l.href}
                      aria-current={isActive(l.href) ? "page" : undefined}
                      className={cn(
                        "block rounded-2xl px-4 py-3 text-[16px] font-bold",
                        isActive(l.href)
                          ? linkActive
                          : "text-ink hover:bg-paper-2",
                      )}
                    >
                      {l.label}
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="flex items-center gap-2 rounded-2xl px-4 py-3 text-[16px] font-bold text-muted"
                    >
                      {l.label}
                      <SoonChip />
                    </span>
                  )}
                </li>
              ))}
              <li className="sm:hidden">
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center justify-center gap-2 rounded-2xl bg-teal px-4 py-3 text-[16px] font-extrabold text-white shadow-[0_3px_0_var(--color-teal-dk)]"
                >
                  <ContactIcon name="discord" className="h-5 w-5" />
                  Discord
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
