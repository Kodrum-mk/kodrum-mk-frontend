import Link from "next/link";
import ContactButtons from "@/components/contact/ContactButtons";
import type { FaqEntry } from "@/data/faq";

/** `a` stays plain text so it can also be published as structured data. */
export type FaqItem = FaqEntry & {
  /** an optional link that follows the answer */
  link?: { href: string; label: string };
};

/**
 * Frequently asked questions as an accordion of native <details> (works without JavaScript, keyboard
 * accessible). The same questions are published as schema.org FAQPage data. The caller supplies the
 * section's spacing via `className`, e.g. "u-wrap pb-16". `data-analytics-section="faq"` is what the
 * site analytics watches to count FAQ views.
 */
export default function Faq({
  items,
  id = "faq",
  title = "Најчести прашања",
  intro,
  className = "",
  contactCard = true,
}: {
  items: FaqItem[];
  id?: string;
  title?: string;
  intro?: string;
  className?: string;
  contactCard?: boolean;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.bullets ? `${f.a} ${f.bullets.join("; ")}.` : f.a,
      },
    })),
  };

  return (
    <section
      aria-labelledby={`${id}-heading`}
      data-analytics-section="faq"
      className={className}
    >
      <div className="mx-auto max-w-3xl">
        <h2
          id={`${id}-heading`}
          className="text-center text-[clamp(1.6rem,3.6vw,2.4rem)] font-extrabold tracking-[-.02em] text-ink"
        >
          {title}
        </h2>
        {intro && (
          <p className="mx-auto mt-2 max-w-xl text-center text-[17px] leading-relaxed text-body">
            {intro}
          </p>
        )}
        <div className="mt-8 space-y-3">
          {items.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border-2 border-line bg-white open:border-teal/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 text-[17px] font-extrabold text-ink outline-none focus-visible:ring-4 focus-visible:ring-teal/20 [&::-webkit-details-marker]:hidden">
                {f.q}
                <span
                  aria-hidden
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-teal-lt text-teal-dk transition group-open:rotate-45"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 text-[17px] leading-relaxed text-body">
                <p>
                  {f.a}
                  {f.link && (
                    <>
                      {" "}
                      <Link
                        href={f.link.href}
                        className="font-bold text-teal-dk underline underline-offset-4"
                      >
                        {f.link.label}
                      </Link>
                      .
                    </>
                  )}
                </p>
                {f.bullets && (
                  <ul className="mt-3 space-y-2">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3">
                        <span
                          aria-hidden
                          className="mt-[.6em] h-2 w-2 shrink-0 rounded-full bg-teal"
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </details>
          ))}
        </div>

        {contactCard && (
          <div className="mt-8 rounded-3xl border-2 border-yellow bg-yellow-lt p-6 text-center sm:p-8">
            <p className="text-[19px] font-extrabold text-ink">
              Не го најдовте одговорот?
            </p>
            <p className="mx-auto mt-1 max-w-md text-[17px] leading-relaxed text-body">
              Јавете ни се или пишете ни, ќе ви одговориме на македонски.
            </p>
            <ContactButtons className="mt-5 justify-center" />
          </div>
        )}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </section>
  );
}
