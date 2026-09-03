"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/utils/cn";

const navLinks = [
  { label: "Почетна", href: "/" },
  // { label: "Часови за ФИНКИ", href: "/privatni-casovi-finki" },
  { label: "Припреми", href: "/pripremi" },
  { label: "Курсеви", href: null, disabled: true },
  { label: "Промо пакети", href: "/promo-paketi" },
  { label: "Контакт", href: "/kontakt" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 bg-white border-b border-[#1E424A]/10 shadow-sm"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Image
              src="/logo.png"
              alt="Кодрум"
              width={120}
              height={40}
              className="w-[120px] h-auto"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              if (link.disabled) {
                return (
                  <span
                    key={link.label}
                    className="relative inline-flex flex-col items-center text-[#1E424A]/60 font-medium text-sm cursor-default"
                  >
                    <span className="mb-0.5 rounded bg-[#FACC0B] px-1.5 py-0.5 text-[11px] leading-none font-bold text-[#1E424A]">
                      Наскоро
                    </span>
                    <span className="relative">
                      {link.label}
                      <span className="absolute left-0 top-1/2 h-0.5 w-full -rotate-12 bg-[#FACC0B]" />
                    </span>
                  </span>
                );
              }

              if (!link.href) {
                return null;
              }

              const isExternal = link.href.startsWith("http");
              return isExternal ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1E424A] hover:text-[#008081] transition-colors font-medium text-sm"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#1E424A] hover:text-[#008081] transition-colors font-medium text-sm"
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <a
              href="https://discord.gg/FmMjw3Q564"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex bg-[#008081] hover:bg-[#006566] text-white font-medium py-2 px-5 rounded-lg transition-colors text-sm"
            >
              Join Discord
            </a>
            <button
              className="md:hidden p-2 rounded-lg text-[#1E424A] hover:bg-[#F2F0E7] transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden border-t border-[#1E424A]/10 bg-white overflow-hidden transition-all duration-200",
          mobileOpen ? "max-h-96 py-4" : "max-h-0",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col gap-1">
          {navLinks.map((link) => {
              if (link.disabled) {
                return (
                  <span
                    key={link.label}
                    className="relative mx-3 my-2.5 inline-flex w-fit flex-col text-[#1E424A]/60 font-medium text-sm cursor-default"
                  >
                    <span className="mb-0.5 w-fit rounded bg-[#FACC0B] px-1.5 py-0.5 text-[11px] leading-none font-bold text-[#1E424A]">
                      Наскоро
                    </span>
                    <span className="relative">
                      {link.label}
                      <span className="absolute left-0 top-1/2 h-0.5 w-full -rotate-12 bg-[#FACC0B]" />
                    </span>
                  </span>
                );
              }

              if (!link.href) {
                return null;
              }

              const isExternal = link.href.startsWith("http");
              return isExternal ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-[#1E424A] hover:bg-[#F2F0E7] hover:text-[#008081] transition-colors font-medium text-sm"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-[#1E424A] hover:bg-[#F2F0E7] hover:text-[#008081] transition-colors font-medium text-sm"
                >
                  {link.label}
                </Link>
              );
            })}
          <a
            href="https://discord.gg/FmMjw3Q564"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-center bg-[#008081] hover:bg-[#006566] text-white font-medium py-2.5 px-5 rounded-lg transition-colors text-sm"
          >
            Join Discord
          </a>
        </div>
      </div>
    </nav>
  );
}
