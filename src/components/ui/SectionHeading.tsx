import { cn } from "@/utils/cn";

/** Kicker + heading + intro. Use `as="h1"` for the page title. */
export default function SectionHeading({
  kicker,
  title,
  intro,
  as: Tag = "h2",
  align = "center",
  className,
}: {
  kicker?: string;
  title: string;
  intro?: string;
  as?: "h1" | "h2";
  align?: "center" | "left";
  className?: string;
}) {
  const center = align === "center";
  return (
    <div
      className={cn(
        "mb-8 max-w-2xl md:mb-10",
        center && "mx-auto text-center",
        className,
      )}
    >
      {kicker && (
        <p className="text-[13px] font-black uppercase tracking-[.2em] text-teal">
          {kicker}
        </p>
      )}
      <Tag
        className={cn(
          "mt-3 text-balance font-extrabold leading-tight tracking-[-.025em] text-ink",
          Tag === "h1"
            ? "text-[clamp(2rem,5.4vw,3.4rem)] leading-[1.08]"
            : "text-[clamp(1.7rem,3.8vw,2.5rem)]",
          !kicker && "mt-0",
        )}
      >
        {title}
      </Tag>
      {intro && (
        <p className="mt-3 text-[17px] leading-relaxed text-body sm:text-[18px]">
          {intro}
        </p>
      )}
    </div>
  );
}
