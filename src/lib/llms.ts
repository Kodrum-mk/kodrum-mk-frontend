import { loadPrepSessions } from "@/data/prepSessionsApi";
import { loadPromoPackages } from "@/data/promoPackagesApi";
import type { PrepSession, PromoPackage } from "@/types";
import { LLMS_BASE, LLMS_FULL_BASE } from "@/lib/llms-content";
import { SITE_URL } from "@/lib/site";

/**
 * Builds /llms.txt and /llms-full.txt: the hand-written text (llms-content.ts) plus live sections from Strapi,
 * the active prep sessions and the promo packages. If Strapi is down the live sections are left out and the
 * hand-written text is served alone, so the files never break. Only data that came from Strapi is published,
 * never the hard-coded fallback packages.
 */

type Live = { preps: PrepSession[]; promos: PromoPackage[] };

let cache: { at: number; live: Live } | null = null;
const TTL_MS = 10 * 60 * 1000;

async function loadLive(): Promise<Live> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.live;
  const [prep, promo] = await Promise.all([
    loadPrepSessions(),
    loadPromoPackages(),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const live: Live = {
    // the site hides sessions that have already started; so does this
    preps:
      prep.source === "strapi"
        ? prep.sessions.filter((s) => !s.startDateIso || s.startDateIso > today)
        : [],
    promos: promo.source === "strapi" ? promo.packages : [],
  };
  // an outage must not be cached for ten minutes
  if (prep.errorMessage || promo.source !== "strapi") return live;
  cache = { at: Date.now(), live };
  return live;
}

const domain = (text: string) => text.replaceAll("https://kodrum.mk", SITE_URL);

function prepLine(s: PrepSession) {
  const parts = [
    `${s.faculty}`,
    s.datesLabel ? `термини: ${s.datesLabel}` : `почнува ${s.startDate}`,
    s.duration ? `траење: ${s.duration}` : null,
    s.examDate ? `испит: ${s.examDate}` : null,
    s.price != null
      ? `цена: ${s.price.toLocaleString("en-US").replace(",", ".")} ден.`
      : null,
    s.spotsLeft > 0 ? `слободни места: ${s.spotsLeft}` : "нема слободни места",
    s.instructor ? `инструктор: ${s.instructor}` : null,
  ].filter(Boolean);
  return `- **${s.title}** (${parts.join("; ")})`;
}

function prepSection(preps: PrepSession[], level: "##" | "###") {
  if (preps.length === 0) return "";
  return [
    `${level} Тековни припреми`,
    `Припреми со отворено запишување (ажурирано од системот; сите се на ${SITE_URL}/pripremi):`,
    ...preps.map(prepLine),
  ].join("\n");
}

function promoLine(p: PromoPackage, full: boolean) {
  const head = `- **${p.title}**${p.badge ? ` (${p.badge})` : ""}: ${p.description} ${p.savings} (${p.discount}).`;
  if (!full) return head;
  return [
    head,
    `  - Вклучени припреми: ${p.courses.join(", ")}.`,
    `  - Што е вклучено: ${p.includes.join(", ")}.`,
    p.noteText ? `  - Белешка: ${p.noteText}.` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function promoSection(
  promos: PromoPackage[],
  level: "##" | "###",
  full: boolean,
) {
  if (promos.length === 0) return "";
  return [
    `${level} Промо пакети`,
    `Тековни пакети со попуст (${SITE_URL}/promo-paketi):`,
    ...promos.map((p) => promoLine(p, full)),
  ].join("\n");
}

const updated = () =>
  `Последно ажурирано: ${new Date().toISOString().slice(0, 10)}`;

/** Inserts `block` before the first occurrence of `marker`; appends it when the marker is not found. */
function insertBefore(text: string, marker: string, block: string) {
  if (!block) return text;
  const i = text.indexOf(marker);
  return i === -1
    ? `${text}\n\n${block}`
    : `${text.slice(0, i)}${block}\n\n${text.slice(i)}`;
}

export async function buildLlms(): Promise<string> {
  const { preps, promos } = await loadLive();
  const live = [prepSection(preps, "##"), promoSection(promos, "##", false)]
    .filter(Boolean)
    .join("\n\n");
  return `${insertBefore(domain(LLMS_BASE), "## Клучни врски и страници", live)}\n\n${updated()}\n`;
}

export async function buildLlmsFull(): Promise<string> {
  const { preps, promos } = await loadLive();
  const live = [prepSection(preps, "###"), promoSection(promos, "###", true)]
    .filter(Boolean)
    .join("\n\n");
  const text = insertBefore(
    domain(LLMS_FULL_BASE),
    "---\n\n## 4. Како се закажува час?",
    live ? `${live}\n\n` : "",
  );
  return `${text}\n\n${updated()}\n`;
}
