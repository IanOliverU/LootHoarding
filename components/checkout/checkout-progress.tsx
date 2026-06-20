import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function CheckoutProgress({ current, finalLabel = "Review & pay" }: { current: 1 | 2 | 3; finalLabel?: string }) {
  const steps = ["Shipping", "Payment method", finalLabel];
  return (
    <section className="mx-auto mt-9 max-w-[680px] px-5 md:px-10" aria-label="Checkout progress">
      <div className="flex items-center">
        {steps.map((label, index) => {
          const number = (index + 1) as 1 | 2 | 3;
          const done = number < current;
          const active = number === current;
          return (
            <div className="contents" key={label}>
              {index > 0 && <div className="mx-2 h-px flex-1 bg-line sm:mx-4" />}
              <div className={cn("flex items-center gap-2 text-ink-dim", active && "font-semibold text-ink")}>
                <span className={cn(
                  "grid size-[26px] shrink-0 place-items-center rounded-full border border-line-strong font-mono text-xs",
                  active && "border-ink bg-ink text-page",
                  done && "border-green bg-green text-raised",
                )}>{done ? <Check className="size-3.5" /> : number}</span>
                <span className="hidden whitespace-nowrap text-[0.8rem] sm:block">{label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
