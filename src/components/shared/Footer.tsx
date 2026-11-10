import Image from "next/image";
import Link from "next/link";
import ContactIcon from "@/components/contact/icons";
import Button from "@/components/ui/Button";
import Arrow from "@/components/ui/Arrow";
import { ADDRESS, EMAIL, PHONE, SOCIALS } from "@/lib/site";

const navLinks = [
  { label: "Почетна", href: "/" },
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

const linkCls =
  "group inline-flex items-center gap-2 text-[15.5px] font-semibold text-ink transition hover:text-teal";
const headCls = "text-[12px] font-black uppercase tracking-[.16em] text-muted";

/** Footer as a rounded light card: help strip, link columns, contact, legal row. */
export function Footer() {
  return (
    <footer className="bg-paper-2 px-3 pb-6 pt-14 sm:px-4 sm:pb-8">
      <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[32px] border border-line bg-white shadow-[0_24px_60px_-40px_rgba(30,66,74,.45)]">
        {/* help strip */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-line bg-yellow-lt px-6 py-6 sm:flex-row sm:items-center sm:px-10">
          <div className="flex items-center gap-4">
            <span
              aria-hidden
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-yellow text-ink shadow-[0_3px_0_#c99f00]"
            >
              <ContactIcon name="chat" className="h-6 w-6" />
            </span>
            <p className="text-[18px] font-extrabold leading-snug text-ink">
              Имате прашање? Јавете ни се, ќе ви одговориме.
            </p>
          </div>
          <Button
            href="/kontakt"
            variant="yellow"
            size="md"
            className="shrink-0"
          >
            Контакт
            <Arrow className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-10 px-6 py-10 sm:grid-cols-2 sm:px-10 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:gap-8">
          {/* brand */}
          <div>
            <Link
              href="/"
              aria-label="Кодрум, почетна страница"
              className="inline-block"
            >
              <Image
                src="/logo.png"
                alt="Кодрум"
                width={703}
                height={229}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-sm text-[15.5px] leading-relaxed text-body">
              Модерна образовна платформа за испитна подготовка, приватни часови
              за ФИНКИ и останати технички факултети, практично учење и
              флексибилни формати.
            </p>
            <p className="mt-5 text-[15px] font-bold text-ink">Следи нè</p>
            <p className="mt-1 max-w-sm text-[15px] leading-relaxed text-body">
              Информации за приватни часови, нови групи, припреми и промоции.
            </p>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {SOCIALS.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="grid h-11 w-11 place-items-center rounded-full border border-line bg-paper-2 text-ink transition hover:-translate-y-0.5 hover:border-teal hover:bg-teal hover:text-white"
                  >
                    <ContactIcon name={s.id} className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Навигација">
            <h2 className={headCls}>Навигација</h2>
            <ul className="mt-4 space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Поддршка">
            <h2 className={headCls}>Поддршка</h2>
            <ul className="mt-4 space-y-3">
              {supportLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={headCls}>Контакт</h2>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-lt text-teal-dk"
                >
                  <ContactIcon name="call" className="h-[18px] w-[18px]" />
                </span>
                <a
                  href={`tel:${PHONE.e164}`}
                  className="text-[15.5px] font-semibold text-ink transition hover:text-teal"
                >
                  {PHONE.display}
                </a>
              </li>
              {EMAIL && (
                <li className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-lt text-teal-dk"
                  >
                    <ContactIcon name="email" className="h-[18px] w-[18px]" />
                  </span>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="break-all text-[15.5px] font-semibold text-ink transition hover:text-teal"
                  >
                    {EMAIL}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-lt text-teal-dk"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-[18px] w-[18px]"
                    fill="none"
                  >
                    <path
                      d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="9.5"
                      r="2.4"
                      stroke="currentColor"
                      strokeWidth="1.9"
                    />
                  </svg>
                </span>
                <span className="text-[15.5px] font-semibold text-ink">
                  {ADDRESS.line}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-line px-6 py-4 text-[14px] font-semibold text-muted sm:flex-row sm:px-10">
          <p>© {new Date().getFullYear()} Kodrum. Сите права се задржани.</p>
          <div className="flex gap-5">
            <Link href="/privatnost" className="transition hover:text-teal">
              Приватност
            </Link>
            <Link href="/uslovi" className="transition hover:text-teal">
              Услови
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
