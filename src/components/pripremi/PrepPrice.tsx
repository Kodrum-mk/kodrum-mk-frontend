import { cn } from "@/utils/cn";

const DISCOUNT_AMOUNT = 500;

type PrepPriceProps = {
  price?: number;
  compact?: boolean;
  className?: string;
};

function formatMkd(price: number) {
  return `${price.toLocaleString("mk-MK")} МКД`;
}

export function PrepPrice({ price, compact = false, className }: PrepPriceProps) {
  if (!price) return null;

  const originalPrice = price + DISCOUNT_AMOUNT;

  return (
    <div
      className={cn(
        "rounded-lg border-2 border-[#FACC0B] bg-white shadow-sm",
        compact ? "px-3 py-2" : "px-4 py-3",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-baseline justify-center gap-3",
          compact ? "text-xs" : "text-base",
        )}
      >
        <span className="font-semibold text-[#1E424A]/45 line-through">
          {formatMkd(originalPrice)}
        </span>
        <span
          className={cn(
            "font-extrabold text-[#FACC0B]",
            compact ? "text-lg" : "text-2xl",
          )}
        >
          {formatMkd(price)}
        </span>
      </div>
    </div>
  );
}
