import { DISCORD_URL, EMAIL, PHONE, contactLinks } from "@/lib/site";
import type { ContactIconName } from "./icons";

export type Channel = {
  id: string;
  label: string;
  hint: string;
  href: string;
  icon: ContactIconName;
  tile: string;
  external: boolean;
};

/** The ways to reach Kodrum, in the order they are shown. `topic` (a subject) goes into the message. */
export function channels(topic?: string): Channel[] {
  const l = contactLinks(topic);
  const list: Channel[] = [
    {
      id: "call",
      label: "Повикајте нè",
      hint: PHONE.display,
      href: l.call,
      icon: "call",
      tile: "#008081",
      external: false,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      hint: "Пишете ни порака",
      href: l.whatsapp,
      icon: "whatsapp",
      tile: "#16a34a",
      external: true,
    },
    {
      id: "viber",
      label: "Viber",
      hint: "Пишете ни порака",
      href: l.viber,
      icon: "viber",
      tile: "#7360f2",
      external: false,
    },
    {
      id: "instagram",
      label: "Instagram",
      hint: "@kodrum.mk",
      href: l.instagram,
      icon: "instagram",
      tile: "#d6249f",
      external: true,
    },
    {
      id: "discord",
      label: "Discord",
      hint: "Приклучете се на заедницата",
      href: DISCORD_URL,
      icon: "discord",
      tile: "#5865f2",
      external: true,
    },
  ];
  if (EMAIL && l.email)
    list.push({
      id: "email",
      label: "Е-пошта",
      hint: EMAIL,
      href: l.email,
      icon: "email",
      tile: "#e8590c",
      external: false,
    });
  return list;
}
