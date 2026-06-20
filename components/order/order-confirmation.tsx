"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductVisual } from "@/components/storefront/product-visual";
import { RarityTag } from "@/components/storefront/rarity-tag";
import { Button } from "@/components/ui/button";
import { getLocalOrderByNumber, type OrderSnapshot } from "@/lib/orders";
import { php } from "@/lib/products";

export function OrderConfirmation({
  orderNumber,
  serverOrder,
}: {
  orderNumber: string;
  serverOrder: OrderSnapshot | null;
}) {
  const [order, setOrder] = useState<OrderSnapshot | null>(serverOrder);
  const [resolved, setResolved] = useState(Boolean(serverOrder));

  useEffect(() => {
    if (!serverOrder) setOrder(getLocalOrderByNumber(orderNumber));
    setResolved(true);
  }, [orderNumber, serverOrder]);

  if (!resolved) {
    return <main className="grid min-h-[560px] place-items-center font-mono text-xs text-ink-dim">LOCATING PAPERWORK…</main>;
  }

  if (!order) {
    return (
      <main className="grid min-h-[560px] place-items-center px-6 text-center">
        <div>
          <p className="font-display text-2xl font-bold">Order not found</p>
          <p className="mt-2 text-sm text-ink-dim">Even the imaginary paperwork has limits.</p>
          <Button className="mt-6" asChild><Link href="/catalog">Return to catalog</Link></Button>
        </div>
      </main>
    );
  }

  const hypotheticalTotal = order.items.reduce((total, item) => total + item.displayPrice * item.quantity, 0);
  const placedAt = new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Manila",
  }).format(new Date(order.createdAt)).toUpperCase();
  const recipient = `${order.shipping.firstName} ${order.shipping.lastName}`;
  const address = `${order.shipping.street}, ${order.shipping.city}, ${order.shipping.province} ${order.shipping.postalCode}`;

  return (
    <main>
      <section className="mx-auto max-w-[720px] px-5 pb-0 pt-[60px] text-center md:px-10">
        <div className="mx-auto mb-[22px] grid size-16 place-items-center rounded-full border border-green bg-green-fill text-green">
          <Check className="size-7" />
        </div>
        <h1 className="font-display text-[1.9rem] font-bold tracking-[-0.01em]">Order confirmed</h1>
        <p className="mx-auto mt-2.5 max-w-[480px] text-[0.9rem] leading-[1.6] text-ink-dim">
          ₱0.00 has been deducted from nothing. Your loot is locked in and will be tracked obsessively until something inevitably goes wrong.
        </p>

        <dl className="mb-11 mt-7 inline-flex max-w-full flex-wrap items-center justify-center gap-y-4 rounded-xl border border-line bg-card px-[26px] py-3.5 text-left">
          <MetaItem label="Order number" value={order.orderNumber} />
          <MetaItem label="Placed" value={placedAt} bordered />
          <MetaItem label="Status" value="CONFIRMED" bordered green />
        </dl>
      </section>

      <div className="mx-auto mb-[60px] grid max-w-[1000px] items-start gap-5 px-5 md:px-10 lg:grid-cols-[1fr_360px] lg:gap-10">
        <section className="rounded-[14px] border border-line bg-card p-5 sm:p-[26px]">
          <h2 className="mb-[18px] font-display text-base font-semibold">Items in this order</h2>
          {order.items.map((item) => (
            <article className="flex gap-3.5 border-b border-line py-3.5 first:pt-0 last:border-0" key={item.id}>
              <ProductVisual className="size-[54px] shrink-0 rounded-[9px]" product={item} showBrand={false} />
              <div className="min-w-0 flex-1">
                <RarityTag className="mb-1 text-[0.58rem]" rarity={item.rarity} />
                <h3 className="text-[0.84rem] font-semibold">{item.name}</h3>
                <p className="mt-1 font-mono text-[0.7rem] text-ink-dim">QTY {item.quantity}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1 font-mono">
                <span className="text-[0.68rem] text-ink-dim line-through">{php.format(item.displayPrice * item.quantity)}</span>
                <span className="text-sm font-bold text-green">₱0.00</span>
              </div>
            </article>
          ))}

          <dl className="mt-[18px] space-y-2 border-t border-line pt-4 text-[0.8rem] text-ink-dim">
            <div className="flex justify-between gap-4"><dt>What this would have cost</dt><dd className="font-mono line-through">{php.format(hypotheticalTotal)}</dd></div>
            <div className="flex justify-between gap-4"><dt>Shipping</dt><dd className="font-mono">₱0.00</dd></div>
            <div className="flex justify-between gap-4"><dt>Tax, fees, regret</dt><dd className="font-mono">₱0.00</dd></div>
            <div className="mt-2 flex items-baseline justify-between border-t border-line pt-3.5 text-ink">
              <dt className="text-sm font-semibold">Total charged</dt><dd className="font-mono text-[1.4rem] font-bold text-green">₱0.00</dd>
            </div>
          </dl>
        </section>

        <div className="space-y-5">
          <section className="rounded-[14px] border border-line bg-card p-5 sm:p-[26px]">
            <h2 className="mb-[18px] font-display text-base font-semibold">Shipping to</h2>
            <ShippingRow label="Recipient" value={recipient} />
            <ShippingRow label="Address" value={address} />
            <ShippingRow label="Phone" value={order.shipping.phone} />
            <ShippingRow label="Carrier" value="A guy on a scooter, probably" last />
          </section>

          <section className="rounded-[14px] border border-line bg-card p-5 sm:p-[26px]">
            <h2 className="mb-[18px] font-display text-base font-semibold">What happens now</h2>
            <NextStep><strong>A warehouse that doesn&apos;t exist</strong> begins preparing a shipment of nothing.</NextStep>
            <NextStep><strong>A courier avatar</strong> spawns on the tracking map and starts heading your way.</NextStep>
            <NextStep>There is a <strong>90% chance</strong> something deeply unreasonable happens to your shipment mid-route.</NextStep>
            <div className="mt-[30px] flex gap-3">
              <Button className="flex-1" variant="outline" asChild><Link href="/catalog">Continue shopping</Link></Button>
              <Button className="flex-1" asChild><Link href={`/track/${order.trackingToken}`}>Track this order</Link></Button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function MetaItem({ label, value, bordered = false, green = false }: { label: string; value: string; bordered?: boolean; green?: boolean }) {
  return (
    <div className={bordered ? "border-l border-line pl-6 ml-6" : ""}>
      <dt className="mb-1 font-mono text-[0.64rem] uppercase tracking-[0.06em] text-ink-dim">{label}</dt>
      <dd className={`font-mono text-[0.84rem] font-semibold ${green ? "text-green" : ""}`}>{value}</dd>
    </div>
  );
}

function ShippingRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 py-2 text-[0.8rem] ${last ? "" : "border-b border-line"}`}>
      <span className="text-ink-dim">{label}</span><span className="max-w-[65%] text-right font-mono text-[0.75rem] leading-5">{value}</span>
    </div>
  );
}

function NextStep({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 border-t border-line py-3 first:border-0 first:pt-0">
      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-gold" />
      <p className="text-[0.8rem] leading-[1.5] text-ink-dim [&_strong]:font-semibold [&_strong]:text-ink">{children}</p>
    </div>
  );
}
