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

export function PrepPrice({
  price,
  compact = false,
  className,
}: PrepPriceProps) {
  if (price == null) return null;

  const originalPrice = price + DISCOUNT_AMOUNT;

  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-yellow bg-yellow-lt",
        compact ? "px-3 py-2" : "px-4 py-3",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-baseline justify-center gap-3",
          compact ? "text-sm" : "text-[17px]",
        )}
      >
        <span className="font-bold text-muted line-through">
          {formatMkd(originalPrice)}
        </span>
        <span
          className={cn(
            "font-black text-ink",
            compact ? "text-xl" : "text-[28px]",
          )}
        >
          {formatMkd(price)}
        </span>
      </div>
    </div>
  );
}
