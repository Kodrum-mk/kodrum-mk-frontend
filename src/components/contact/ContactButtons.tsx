import ContactIcon from "./icons";
import { channels } from "./channels";

/**
 * Contact channels as a row of buttons: call, WhatsApp, Viber, Instagram, Discord (and email). Server
 * component, plain links, so it works without JavaScript. Used by the footer, the contact page and under
 * every FAQ.
 */
export default function ContactButtons({
  topic,
  skip = [],
  iconOnly = false,
  className = "",
}: {
  topic?: string;
  skip?: string[];
  /** round icon buttons in one row (for narrow places); the label becomes the tooltip */
  iconOnly?: boolean;
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap gap-2.5 ${className}`}>
      {channels(topic)
        .filter((c) => !skip.includes(c.id))
        .map((c) => (
          <li key={c.id}>
            <a
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noopener noreferrer" : undefined}
              aria-label={iconOnly ? c.label : undefined}
              title={iconOnly ? c.label : undefined}
              className={
                iconOnly
                  ? "grid h-11 w-11 place-items-center rounded-full text-white shadow-[0_6px_16px_-10px_rgba(30,66,74,.6)] transition hover:-translate-y-0.5 hover:brightness-110"
                  : "inline-flex items-center gap-2.5 rounded-full border border-line bg-white py-2 pl-2 pr-4 text-[15px] font-bold text-ink shadow-[0_6px_16px_-12px_rgba(30,66,74,.5)] transition hover:-translate-y-0.5 hover:border-teal"
              }
              style={iconOnly ? { background: c.tile } : undefined}
            >
              {iconOnly ? (
                <ContactIcon name={c.icon} className="h-5 w-5" />
              ) : (
                <>
                  <span
                    className="grid h-8 w-8 place-items-center rounded-full text-white"
                    style={{ background: c.tile }}
                  >
                    <ContactIcon name={c.icon} className="h-[18px] w-[18px]" />
                  </span>
                  {c.id === "call" ? c.hint : c.label}
                </>
              )}
            </a>
          </li>
        ))}
    </ul>
  );
}
