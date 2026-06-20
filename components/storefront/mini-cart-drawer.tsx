"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/lib/cart-store";
import { PriceBlock } from "./price-block";
import { PesoAmount } from "./peso-amount";
import { ProductVisual } from "./product-visual";
import { RarityTag } from "./rarity-tag";
import { ThemeToggle } from "./theme-toggle";

export function MiniCartDrawer() {
  const { items, isOpen, setOpen, removeItem, setQuantity } = useCartStore();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const hypotheticalTotal = items.reduce(
    (total, item) => total + item.displayPrice * item.quantity,
    0,
  );

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full max-w-[380px]">
        <div className="flex items-center justify-between border-b border-line px-[22px] py-5 pr-[62px]">
          <div>
            <SheetTitle className="flex items-center gap-2 text-[1.05rem] font-semibold">
              Your hoard
              <span className="rounded-full bg-ink px-2 py-0.5 font-mono text-[0.68rem] font-semibold text-page">{itemCount}</span>
            </SheetTitle>
            <SheetDescription className="sr-only">
            {itemCount === 0 ? "Currently burden-free." : `${itemCount} item${itemCount === 1 ? "" : "s"}, responsibly acquired.`}
            </SheetDescription>
          </div>
          <ThemeToggle />
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="mb-5 grid size-16 place-items-center rounded-full bg-sunken text-ink-dim">
              <ShoppingBag className="size-7" />
            </div>
            <h3 className="font-display text-xl font-bold">Remarkably restrained.</h3>
            <p className="mt-2 max-w-xs text-sm leading-6 text-ink-dim">
              Your cart is empty. The warehouse remains theoretical.
            </p>
            <SheetClose asChild>
              <Button className="mt-6" asChild>
                <Link href="/catalog">Browse the loot</Link>
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-[22px] py-2">
              {items.map((item) => (
                <div className="flex gap-3.5 border-b border-line py-4 last:border-0" key={item.id}>
                  <ProductVisual product={item} className="size-16 shrink-0 rounded-[10px]" />
                  <div className="min-w-0 flex-1">
                      <RarityTag rarity={item.rarity} />
                      <h3 className="mt-1 text-[0.84rem] font-semibold leading-snug">{item.name}</h3>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                        <div className="inline-flex items-center overflow-hidden rounded-[7px] border border-line-strong">
                          <button
                            className="grid size-[26px] place-items-center bg-page text-ink-dim"
                            aria-label={`Decrease ${item.name} quantity`}
                            onClick={() => setQuantity(item.id, item.quantity - 1)}
                          ><Minus className="size-3" /></button>
                          <span className="w-7 text-center font-mono text-xs">{item.quantity}</span>
                          <button
                            className="grid size-[26px] place-items-center bg-page text-ink-dim"
                            aria-label={`Increase ${item.name} quantity`}
                            onClick={() => setQuantity(item.id, item.quantity + 1)}
                          ><Plus className="size-3" /></button>
                        </div>
                        <PriceBlock displayPrice={item.displayPrice * item.quantity} size="compact" />
                      </div>
                      <button
                        className="mt-2 font-mono text-[0.62rem] text-ink-dim underline underline-offset-2 hover:text-red"
                        onClick={() => removeItem(item.id)}
                      >Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-line px-[22px] pb-[22px] pt-[18px]">
              <dl className="space-y-2 text-[0.8rem]">
                <div className="flex justify-between gap-4 text-ink-dim">
                  <dt>What this would have cost</dt>
                  <dd className="font-mono line-through"><PesoAmount amount={hypotheticalTotal} /></dd>
                </div>
                <div className="flex justify-between gap-4 text-ink-dim">
                  <dt>Shipping</dt>
                  <dd className="font-mono"><PesoAmount /></dd>
                </div>
                <div className="flex justify-between gap-4 text-ink-dim">
                  <dt>Tax, fees, regret</dt>
                  <dd className="font-mono"><PesoAmount /></dd>
                </div>
                <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
                  <dt className="text-sm font-semibold">Order total</dt>
                  <dd className="font-mono text-2xl font-bold text-green"><PesoAmount /></dd>
                </div>
              </dl>
              <Button className="mt-5 w-full" size="lg" asChild>
                <Link href="/checkout" onClick={() => setOpen(false)}>
                  Proceed to checkout
                </Link>
              </Button>
              <SheetClose className="mt-2.5 block w-full text-center text-xs text-ink-dim hover:text-ink">
                Keep hoarding
              </SheetClose>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
