"use client";

import { useRouter } from "next/navigation";
import { CheckoutProgress } from "@/components/checkout/checkout-progress";
import { Button } from "@/components/ui/button";
import { hasCompleteShipping, type PaymentMethod, useCheckoutStore } from "@/lib/checkout-store";
import { cn } from "@/lib/utils";

const methods = [
  { value: "card" as const, name: "Credit / debit card", description: "LootHoardCard accepted. Visa, Mastercard, and vibes." },
  { value: "gcash" as const, name: "GCash (fake)", description: "Scan a QR code that leads to nothing." },
  { value: "bank" as const, name: "Bank transfer (also fake)", description: "3–5 imaginary business days." },
  { value: "hoardcoin" as const, name: "HoardCoin™", description: "Decentralized, untraceable, worthless. Just like the rest." },
];

export function PaymentMethodSelector() {
  const router = useRouter();
  const shipping = useCheckoutStore((state) => state.shipping);
  const hydrated = useCheckoutStore((state) => state.hydrated);
  const selected = useCheckoutStore((state) => state.method);
  const setMethod = useCheckoutStore((state) => state.setMethod);

  function proceed() {
    if (!hasCompleteShipping(shipping)) return router.push("/checkout");
    router.push(`/checkout/payment/${selected}`);
  }

  if (!hydrated) return <main className="grid min-h-[520px] place-items-center font-mono text-xs text-ink-dim">RETRIEVING IMAGINARY WALLET…</main>;

  return (
    <main>
      <CheckoutProgress current={2} />
      <div className="mx-auto mb-[70px] mt-[30px] max-w-[680px] px-5 md:px-10">
        <section className="rounded-[14px] border border-line bg-card p-5 sm:p-7">
          <h1 className="font-display text-lg font-semibold">How would you like to not pay?</h1>
          <p className="mb-6 mt-1.5 text-[0.8rem] text-ink-dim">Pick a method. All of them end the same way.</p>

          <div className="mb-[26px] flex flex-col gap-2.5">
            {methods.map(({ value, name, description }) => {
              const active = selected === value;
              return (
                <button
                  aria-pressed={active}
                  className={cn("flex items-center gap-3.5 rounded-[11px] border border-line-strong p-4 text-left transition-colors hover:border-ink-dim", active && "border-ink bg-page")}
                  key={value}
                  onClick={() => setMethod(value)}
                  type="button"
                >
                  <span className={cn("relative size-[18px] shrink-0 rounded-full border-[1.5px] border-line-strong after:absolute after:inset-[3px] after:rounded-full", active && "border-ink after:bg-ink")} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{name}</span>
                    <span className="mt-0.5 block text-[0.72rem] text-ink-dim">{description}</span>
                  </span>
                  <span className="text-ink-dim">›</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between gap-3">
            <Button variant="outline" onClick={() => router.push("/checkout")}>Back</Button>
            <Button onClick={proceed}>Continue with {methodLabel(selected)} →</Button>
          </div>
        </section>
      </div>
    </main>
  );
}

function methodLabel(method: PaymentMethod) {
  return method === "card" ? "card" : method === "gcash" ? "GCash" : method === "bank" ? "bank transfer" : "HoardCoin";
}
