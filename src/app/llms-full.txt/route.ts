import { buildLlmsFull } from "@/lib/llms";

// Built per request from Strapi (cached for a few minutes in lib/llms.ts), so new preps and packages show up without a deploy.
export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(await buildLlmsFull(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
