import { SITE_URL } from "@/lib/site";

// Hand-written instead of robots.ts so it can point to llms.txt: robots.txt has no directive for it, so the
// pointers are comments. The disallows keep the admin tool and the API routes out of search engines.
export const dynamic = "force-dynamic";

const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
];
const SEARCH_CRAWLERS = [
  "Googlebot",
  "Bingbot",
  "Slurp",
  "DuckDuckBot",
  "Baiduspider",
  "YandexBot",
  "Applebot",
];

export function GET() {
  const pointers = [
    `# ${SITE_URL}`,
    `# Sitemap:       ${SITE_URL}/sitemap.xml`,
    `# llms.txt:      ${SITE_URL}/llms.txt`,
    `# llms-full.txt: ${SITE_URL}/llms-full.txt`,
  ];
  const open = ["Allow: /", "Disallow: /admin", "Disallow: /api/"];
  const groups = [
    ["User-agent: *", ...open],
    [
      ...[...SEARCH_CRAWLERS, ...AI_CRAWLERS].map((a) => `User-agent: ${a}`),
      ...open,
    ],
  ];
  const body =
    [
      pointers.join("\n"),
      ...groups.map((g) => g.join("\n")),
      `Sitemap: ${SITE_URL}/sitemap.xml`,
    ].join("\n\n") + "\n";
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
