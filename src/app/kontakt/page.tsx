import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/structured";
import { ContactForm } from "@/components/kontakt/ContactForm";
import ContactButtons from "@/components/contact/ContactButtons";
import ContactIcon from "@/components/contact/icons";
import Faq from "@/components/ui/Faq";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { KONTAKT_FAQ } from "@/data/faq";
import { ADDRESS, EMAIL, PHONE, SOCIALS } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Контакт",
  description:
    "Контактирај нè за прашања, пријавување или поддршка. Ние сме тука да помогнеме!",
  path: "/kontakt",
});

const contactInfo: {
  icon: "email" | "call" | "pin";
  label: string;
  value: string;
  href: string | null;
}[] = [
  ...(EMAIL
    ? [
        {
          icon: "email" as const,
          label: "Email",
          value: EMAIL,
          href: `mailto:${EMAIL}`,
        },
      ]
    : []),
  {
    icon: "call",
    label: "Телефон",
    value: PHONE.display,
    href: `tel:${PHONE.e164}`,
  },
  { icon: "pin", label: "Локација", value: ADDRESS.line, href: null },
];

export default function KontaktPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd("Контакт", "/kontakt")} />
      <div className="u-wrap pb-16 pt-6 sm:pb-20 sm:pt-10">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left */}
          <Reveal>
            <SectionHeading
              as="h1"
              align="left"
              title="Контакт"
              intro="Имате прашање или сакате да се пријавите за курс? Контактирајте нè директно и ние ќе ви одговориме во најкраток рок."
              className="mb-8 max-w-xl"
            />

            <ul className="mb-8 space-y-5">
              {contactInfo.map(({ icon, label, value, href }) => (
                <li key={label} className="flex items-center gap-4">
                  <span
                    aria-hidden
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-teal-lt text-teal-dk"
                  >
                    {icon === "pin" ? (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinejoin="round"
                      >
                        <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
                        <circle cx="12" cy="9.5" r="2.4" />
                      </svg>
                    ) : (
                      <ContactIcon name={icon} className="h-6 w-6" />
                    )}
                  </span>
                  <div>
                    <p className="text-[14px] font-bold text-muted">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        className="break-all text-[18px] font-extrabold text-ink transition hover:text-teal"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-[18px] font-extrabold text-ink">
                        {value}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <p className="mb-3 text-[14px] font-bold text-muted">
              Следи нè на:
            </p>
            <ul className="mb-8 flex gap-3">
              {SOCIALS.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="grid h-12 w-12 place-items-center rounded-full border border-line bg-white text-ink transition hover:-translate-y-0.5 hover:border-teal hover:bg-teal hover:text-white"
                  >
                    <ContactIcon name={s.id} className="h-6 w-6" />
                  </a>
                </li>
              ))}
            </ul>

            <p className="mb-3 text-[14px] font-bold text-muted">
              Или јавете ни се директно:
            </p>
            <ContactButtons skip={["email", "discord"]} />
          </Reveal>

          <Reveal delay={120}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
      <Faq
        items={KONTAKT_FAQ}
        id="kontakt-faq"
        className="u-wrap pb-20"
        contactCard={false}
      />
    </>
  );
}
