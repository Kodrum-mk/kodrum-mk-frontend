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
        "rounded-lg border-2 border-[#FACC0B] bg-[#1E424A] text-center shadow-sm",
        compact ? "px-3 py-2" : "px-4 py-3",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center gap-2",
          compact ? "mb-0.5 text-[11px]" : "mb-1 text-xs",
        )}
      >
        <span className="font-bold text-[#FACC0B]">-500 МКД</span>
        <span className="text-white/55 line-through">
          {formatMkd(originalPrice)}
        </span>
      </div>
      <div
        className={cn(
          "font-extrabold text-[#FACC0B]",
          compact ? "text-base" : "text-2xl",
        )}
      >
        {formatMkd(price)}
      </div>
    </div>
  );
}
