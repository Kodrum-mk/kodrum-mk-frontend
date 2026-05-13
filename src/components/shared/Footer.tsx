import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react";

const navLinks = [
  { label: "Почетна", href: "/" },
  { label: "Курсеви", href: "https://courses.kodrum.dev" },
  { label: "Припреми", href: "/pripremi" },
  { label: "Промо пакети", href: "/promo-paketi" },
  { label: "Контакт", href: "/kontakt" },
];

const supportLinks = [
  { label: "ЧПП", href: "/cpp" },
  { label: "Help Center", href: "/help" },
  { label: "Политика за приватност", href: "/privatnost" },
  { label: "Услови за користење", href: "/uslovi" },
];

export function Footer() {
  return (
    <footer className="bg-[#1E424A] text-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-3">Kodrum</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Модерна образовна платформа за испитна подготовка, практично учење
              и флексибилни формати за студенти.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-base font-semibold text-white mb-4">
              Навигација
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => {
                const isExternal = link.href.startsWith("http");
                return (
                  <li key={link.href}>
                    {isExternal ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/70 hover:text-[#008081] transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-white/70 hover:text-[#008081] transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-base font-semibold text-white mb-4">
              Поддршка
            </h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[#008081] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + Social */}
          <div>
            <h4 className="text-base font-semibold text-white mb-4">
              Претплати се
            </h4>
            <p className="text-white/70 text-sm mb-4">
              Прими информации за нови курсеви, припреми и промоции.
            </p>
            
            <div className="flex gap-3">
              {[
                {
                  href: "https://facebook.com",
                  Icon: Facebook,
                  label: "Facebook",
                },
                {
                  href: "https://instagram.com",
                  Icon: Instagram,
                  label: "Instagram",
                },
                {
                  href: "https://linkedin.com",
                  Icon: Linkedin,
                  label: "LinkedIn",
                },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#008081] border border-white/20 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            © 2025 Kodrum. Сите права се задржани.
          </p>
          <div className="flex gap-4 text-white/60 text-sm">
            <Link
              href="/privatnost"
              className="hover:text-[#008081] transition-colors"
            >
              Приватност
            </Link>
            <Link
              href="/uslovi"
              className="hover:text-[#008081] transition-colors"
            >
              Услови
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
