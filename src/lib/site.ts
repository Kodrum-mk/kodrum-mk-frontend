/**
 * Site-wide facts in one place: the public address, contact details and social profiles. SEO files,
 * structured data, the footer and the contact menu all read from here, so a change (a new phone number,
 * a street address once there is one) is made once.
 */

/** Public address, without a trailing slash. Override with SITE_URL in the deployment. */
export const SITE_URL = (process.env.SITE_URL || "https://kodrum.mk").replace(
  /\/$/,
  "",
);

export const SITE_NAME = "Кодрум";
export const SITE_NAME_LATIN = "Kodrum";
export const SITE_TITLE =
  "Кодрум – Приватни часови и испитна подготовка за студенти (ФИНКИ)";
export const SITE_TAGLINE = "Испитна подготовка за студенти";
export const SITE_DESCRIPTION =
  "Професионални приватни часови и испитна подготовка за студенти од ФИНКИ, ФЕИТ, МФС и Економски. Индивидуални и групни часови за СП, ООП, АПС, Калкулус и програмирање во Скопје и онлајн.";

/** Viber and WhatsApp use the same number. */
export const PHONE = {
  display: "+389 75 295 582",
  e164: "+38975295582",
  digits: "38975295582",
};

/** The address already published on the site (contact page, structured data, privacy policy). */
export const EMAIL: string | undefined = "kodrum.mk@gmail.com";

/** Only a city: there is no street address yet. Add `street` here and it flows into structured data. */
export const ADDRESS = {
  city: "Скопје",
  country: "MK",
  line: "Скопје, Македонија",
};

export type SocialId = "instagram" | "facebook" | "discord";

/** Only profiles that exist. The footer and structured data show what is listed. */
export const SOCIALS: { id: SocialId; label: string; href: string }[] = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/kodrum.mk/",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/p/%D0%95%D0%B4%D1%83%D0%BA%D0%B0%D1%82%D0%B8%D0%B2%D0%B5%D0%BD-%D0%A6%D0%B5%D0%BD%D1%82%D0%B0%D1%80-%D0%9A%D0%BE%D0%B4%D1%80%D1%83%D0%BC-61583240054450/",
  },
  { id: "discord", label: "Discord", href: "https://discord.gg/FmMjw3Q564" },
];

export const DISCORD_URL = SOCIALS.find((s) => s.id === "discord")!.href;

/** Links for the contact buttons. `topic` (a subject or package) goes into the WhatsApp / email text. */
export function contactLinks(topic?: string) {
  const text = topic
    ? `Здраво! Се интересирам за „${topic}“ во Кодрум.`
    : "Здраво! Се интересирам за припремите во Кодрум.";
  return {
    call: `tel:${PHONE.e164}`,
    whatsapp: `https://wa.me/${PHONE.digits}?text=${encodeURIComponent(text)}`,
    viber: `viber://chat?number=%2B${PHONE.digits}`,
    instagram: "https://ig.me/m/kodrum.mk",
    email: EMAIL
      ? `mailto:${EMAIL}?subject=${encodeURIComponent(topic ? `Прашање: ${topic}` : "Прашање за Кодрум")}&body=${encodeURIComponent(text)}`
      : undefined,
  };
}
