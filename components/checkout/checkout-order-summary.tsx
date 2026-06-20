"use client";

import Link from "next/link";
import { ProductVisual } from "@/components/storefront/product-visual";
import { PesoAmount } from "@/components/storefront/peso-amount";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";

export function CheckoutOrderSummary() {
  const items = useCartStore((state) => state.items);
  const hypotheticalTotal = items.reduce((total, item) => total + item.displayPrice * item.quantity, 0);

  return (
    <aside className="rounded-[14px] border border-line bg-card p-5 sm:p-7" aria-label="Order summary">
      <h2 className="font-display text-base font-semibold">Order summary</h2>
      {items.length ? (
        <>
          <div className="mb-[18px] mt-4">
            {items.map((item) => (
              <div className="flex gap-3 border-b border-line py-3 last:border-0" key={item.id}>
                <ProductVisual className="size-12 shrink-0 rounded-lg" product={item} showBrand={false} />
                <div className="min-w-0 flex-1">
                  <h3 className="text-[0.78rem] font-semibold leading-[1.3]">{item.name}</h3>
                  <p className="mt-1 font-mono text-[0.68rem] uppercase text-ink-dim">QTY {item.quantity} · {item.rarity}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-0.5 font-mono">
                  <span className="text-[0.62rem] text-ink-dim line-through"><PesoAmount amount={item.displayPrice * item.quantity} /></span>
                  <span className="text-[0.8rem] font-bold text-green"><PesoAmount /></span>
                </div>
              </div>
            ))}
          </div>
          <dl className="space-y-2 text-[0.8rem] text-ink-dim">
            <div className="flex justify-between gap-4"><dt>What this would have cost</dt><dd className="font-mono line-through"><PesoAmount amount={hypotheticalTotal} /></dd></div>
            <div className="flex justify-between gap-4"><dt>Shipping</dt><dd className="font-mono"><PesoAmount /></dd></div>
            <div className="flex justify-between gap-4"><dt>Tax, fees, regret</dt><dd className="font-mono"><PesoAmount /></dd></div>
            <div className="mt-2 flex items-baseline justify-between border-t border-line pt-3.5 text-ink">
              <dt className="text-sm font-semibold">Order total</dt><dd className="font-mono text-2xl font-bold text-green"><PesoAmount /></dd>
            </div>
          </dl>
        </>
      ) : (
        <div className="py-12 text-center">
          <p className="font-display font-semibold">Your hoard is empty.</p>
          <p className="mt-2 text-xs text-ink-dim">A checkout with restraint. Disturbing.</p>
          <Button className="mt-5" variant="outline" asChild><Link href="/catalog">Return to catalog</Link></Button>
        </div>
      )}
    </aside>
  );
}
