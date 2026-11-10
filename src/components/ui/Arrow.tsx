/** Arrow icon (instead of the "→" / "←" text characters). */
export default function Arrow({
  dir = "right",
  className = "h-5 w-5",
}: {
  dir?: "right" | "left";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} ${dir === "left" ? "rotate-180" : ""}`}
      aria-hidden
      fill="none"
    >
      <path
        d="M5 12h13M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
