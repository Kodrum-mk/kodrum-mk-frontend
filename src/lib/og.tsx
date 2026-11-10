import { ImageResponse } from "next/og";
import { OG_SIZE } from "@/lib/seo";
import {
  KODRUM_MARK_PNG,
  MANROPE_CYRILLIC_600,
  MANROPE_CYRILLIC_800,
  MANROPE_LATIN_600,
  MANROPE_LATIN_800,
} from "@/lib/og-assets";

/**
 * Share image (Open Graph) in the site's look: white card, teal and yellow glows, the Kodrum mark.
 * Used by src/app/opengraph-image.tsx.
 *
 * ImageResponse has no Cyrillic font of its own, so Manrope (SIL Open Font License) is bundled and embedded
 * as base64 in src/lib/og-assets.ts: no network and no file access at build or runtime.
 */

const bytes = (b64: string) =>
  Uint8Array.from(Buffer.from(b64, "base64")).buffer;

const FONTS = [
  {
    name: "ManropeCy",
    data: bytes(MANROPE_CYRILLIC_800),
    weight: 800 as const,
    style: "normal" as const,
  },
  {
    name: "ManropeLa",
    data: bytes(MANROPE_LATIN_800),
    weight: 800 as const,
    style: "normal" as const,
  },
  {
    name: "ManropeCy",
    data: bytes(MANROPE_CYRILLIC_600),
    weight: 600 as const,
    style: "normal" as const,
  },
  {
    name: "ManropeLa",
    data: bytes(MANROPE_LATIN_600),
    weight: 600 as const,
    style: "normal" as const,
  },
];
const MARK = `data:image/png;base64,${KODRUM_MARK_PNG}`;

export function renderOg({
  kicker,
  title,
  subtitle,
  chips,
  accent = "#008081",
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  chips?: string[];
  accent?: string;
}) {
  const long = title.length > 34;
  const dark = "#1e424a";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "linear-gradient(135deg, #ffffff 0%, #f4f8f8 100%)",
        // Latin first, Cyrillic as the fallback: each glyph comes from the file that has it, at the right weight
        fontFamily: "ManropeLa, ManropeCy",
        color: dark,
      }}
    >
      {/* glows and the slanted bar from the Kodrum mark */}
      <div
        style={{
          position: "absolute",
          left: -140,
          top: -160,
          width: 560,
          height: 560,
          borderRadius: 560,
          background: "rgba(0,128,129,.16)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -120,
          top: -140,
          width: 480,
          height: 480,
          borderRadius: 480,
          background: "rgba(250,204,11,.30)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 70,
          bottom: -120,
          width: 150,
          height: 520,
          borderRadius: 60,
          background: accent,
          opacity: 0.16,
          transform: "rotate(34deg)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 18,
          background: accent,
          display: "flex",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px 64px 96px",
          width: "100%",
          height: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MARK} width={72} height={72} alt="" />
          <div style={{ display: "flex", fontSize: 34, fontWeight: 800 }}>
            Кодрум
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: 12,
              padding: "8px 22px",
              borderRadius: 999,
              background: "#ffffff",
              border: "2px solid #dbe7e8",
              fontSize: 26,
              fontWeight: 600,
            }}
          >
            {kicker}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: long ? 70 : 88,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: -2,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                display: "flex",
                marginTop: 22,
                fontSize: 36,
                fontWeight: 600,
                color: "#41595f",
                lineHeight: 1.3,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {(chips ?? []).map((c) => (
            <div
              key={c}
              style={{
                display: "flex",
                padding: "12px 26px",
                borderRadius: 999,
                background: accent,
                color: "#ffffff",
                fontSize: 30,
                fontWeight: 800,
              }}
            >
              {c}
            </div>
          ))}
        </div>
      </div>
    </div>,
    { ...OG_SIZE, fonts: FONTS },
  );
}
