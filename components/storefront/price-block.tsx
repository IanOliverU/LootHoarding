import { cn } from "@/lib/utils";
import { php } from "@/lib/products";

export function PriceBlock({
  displayPrice,
  size = "default",
  className,
}: {
  displayPrice: number;
  size?: "compact" | "default" | "hero";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono", className)}>
      <span
        className={cn(
          "text-ink-dim line-through decoration-1",
          size === "compact" ? "text-xs" : size === "hero" ? "text-base" : "text-sm",
        )}
      >
        {php.format(displayPrice)}
      </span>
      <span
        className={cn(
          "font-bold text-green",
          size === "compact" ? "text-sm" : size === "hero" ? "text-3xl" : "text-xl",
        )}
      >
        ₱0.00
      </span>
    </div>
  );
}
