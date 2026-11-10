import { cn } from "@/utils/cn";

/** White card with a soft border and a layered shadow. */
export default function Card({
  children,
  className,
  as: Tag = "div",
  tone = "white",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "section" | "li";
  tone?: "white" | "yellow" | "teal";
}) {
  return (
    <Tag
      className={cn(
        "rounded-3xl border-2 p-6 shadow-[0_24px_50px_-40px_rgba(30,66,74,.6)]",
        tone === "white" && "border-line bg-white",
        tone === "yellow" && "border-yellow bg-yellow-lt",
        tone === "teal" && "border-teal/30 bg-teal-lt",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
