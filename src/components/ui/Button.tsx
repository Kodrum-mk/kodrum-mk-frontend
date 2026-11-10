import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

/**
 * Chunky "3D" button: a solid colour with a hard offset shadow that collapses when pressed.
 * With `href` it renders a link (external links open in a new tab), otherwise a <button>.
 */
const base =
  "inline-flex items-center justify-center gap-2 font-black tracking-wide transition outline-none focus-visible:ring-4 focus-visible:ring-teal/30 disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  yellow:
    "bg-yellow text-ink shadow-[0_5px_0_#c99f00] hover:translate-y-0.5 hover:shadow-[0_3px_0_#c99f00] active:translate-y-1 active:shadow-none",
  teal: "bg-teal text-white shadow-[0_4px_0_var(--color-teal-dk)] hover:translate-y-0.5 hover:shadow-[0_2px_0_var(--color-teal-dk)] active:translate-y-1 active:shadow-none",
  outline:
    "border-2 border-line bg-white text-ink hover:border-teal hover:text-teal-dk",
} as const;

const sizes = {
  sm: "rounded-full px-4 py-2 text-[14px]",
  md: "rounded-xl px-6 py-3 text-[15px]",
  lg: "rounded-xl px-8 py-4 text-[16px]",
} as const;

type Common = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
};
type AsLink = Common & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "href" | "className"
  >;
type AsButton = Common & { href?: undefined } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "className"
  >;

export default function Button(props: AsLink | AsButton) {
  const { variant = "teal", size = "md", className, ...rest } = props;
  const cls = cn(base, variants[variant], sizes[size], className);

  if ("href" in rest && rest.href !== undefined) {
    const { href, children, ...anchor } = rest as AsLink;
    const external = /^(https?:|mailto:|tel:|viber:)/.test(href);
    return external ? (
      <a
        href={href}
        className={cls}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        {...anchor}
      >
        {children}
      </a>
    ) : (
      <Link href={href} className={cls} {...anchor}>
        {children}
      </Link>
    );
  }
  const { type = "button", ...button } = rest as AsButton;
  return <button type={type} className={cls} {...button} />;
}
