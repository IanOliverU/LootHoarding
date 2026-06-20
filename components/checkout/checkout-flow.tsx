"use client";

import { Check, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { ProductVisual } from "@/components/storefront/product-visual";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useCartStore } from "@/lib/cart-store";
import { createLocalOrder, type OrderSnapshot, type ShippingAddress } from "@/lib/orders";
import { php } from "@/lib/products";
import { cn } from "@/lib/utils";

const initialShipping: ShippingAddress = {
  firstName: "",
  lastName: "",
  street: "",
  city: "",
  province: "",
  postalCode: "",
  phone: "",
};

const paymentStages = [
  { text: "Authorizing...", sub: "Contacting a bank that does not exist", progress: 20 },
  { text: "Bank said yes (lie)...", sub: "No verification was actually performed", progress: 50 },
  { text: "Deducting ₱0.00...", sub: "Nothing is leaving any account, anywhere", progress: 80 },
  { text: "Finalizing...", sub: "Generating a tracking number for a package that doesn’t exist", progress: 100 },
];

const fieldLabels: Record<keyof ShippingAddress, string> = {
  firstName: "First name",
  lastName: "Last name",
  street: "Street address",
  city: "City",
  province: "Province",
  postalCode: "Postal code",
  phone: "Phone",
};

const placeholders: Record<keyof ShippingAddress, string> = {
  firstName: "Marco",
  lastName: "Dela Cruz",
  street: "123 Fields Avenue",
  city: "Angeles City",
  province: "Pampanga",
  postalCode: "2009",
  phone: "09xx xxx xxxx",
};

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function CheckoutFlow() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [step, setStep] = useState<1 | 2>(1);
  const [shipping, setShipping] = useState(initialShipping);
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [order, setOrder] = useState<OrderSnapshot | null>(null);
  const [processing, setProcessing] = useState(false);

  const hypotheticalTotal = items.reduce((total, item) => total + item.displayPrice * item.quantity, 0);

  function updateField(key: keyof ShippingAddress, value: string) {
    setShipping((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function continueToReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof ShippingAddress, string>> = {};
    (Object.keys(shipping) as Array<keyof ShippingAddress>).forEach((key) => {
      if (!shipping[key].trim()) nextErrors[key] = `${fieldLabels[key]} is required`;
    });
    if (shipping.postalCode && !/^\d{4}$/.test(shipping.postalCode)) nextErrors.postalCode = "Use a 4-digit postal code";
    if (shipping.phone && shipping.phone.replace(/\D/g, "").length < 10) nextErrors.phone = "Enter a valid phone number";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function startPayment() {
    if (processing || !items.length) return;
    setProcessing(true);
    setOrder(null);
    setStageIndex(0);
    setPaymentOpen(true);

    for (let index = 0; index < paymentStages.length; index += 1) {
      setStageIndex(index);
      await sleep(1_100);
    }
    await sleep(500);
    const placedOrder = createLocalOrder(shipping, items);
    setOrder(placedOrder);
    clearCart();
    setProcessing(false);
  }

  function trackOrder() {
    if (!order) return;
    router.push(`/track/${order.trackingToken}`);
  }

  const fullAddress = `${shipping.firstName} ${shipping.lastName}, ${shipping.street}, ${shipping.city}, ${shipping.province} ${shipping.postalCode}`;

  return (
    <main>
      <section className="mx-auto mt-9 max-w-[1100px] px-5 md:px-10" aria-label="Checkout progress">
        <div className="flex items-center">
          <ProgressStep active={step === 1} done={step > 1} number={1} label="Shipping" />
          <div className="mx-4 h-px flex-1 bg-line" />
          <ProgressStep active={step === 2} done={false} number={2} label="Review & pay" />
        </div>
      </section>

      <div className="mx-auto mb-[60px] mt-8 grid max-w-[1100px] items-start gap-7 px-5 md:px-10 lg:grid-cols-[1fr_380px] lg:gap-12">
        <section className="rounded-[14px] border border-line bg-card p-5 sm:p-7">
          {step === 1 ? (
            <form onSubmit={continueToReview} noValidate>
              <h1 className="font-display text-lg font-semibold">Where should this never arrive?</h1>
              <p className="mb-[22px] mt-1.5 text-[0.8rem] text-ink-dim">Enter a real address. The courier will find a way to fail regardless.</p>

              <div className="grid gap-3.5 sm:grid-cols-2">
                <CheckoutField field="firstName" value={shipping.firstName} error={errors.firstName} onChange={updateField} />
                <CheckoutField field="lastName" value={shipping.lastName} error={errors.lastName} onChange={updateField} />
                <div className="sm:col-span-2"><CheckoutField field="street" value={shipping.street} error={errors.street} onChange={updateField} /></div>
                <CheckoutField field="city" value={shipping.city} error={errors.city} onChange={updateField} />
                <CheckoutField field="province" value={shipping.province} error={errors.province} onChange={updateField} />
                <CheckoutField field="postalCode" value={shipping.postalCode} error={errors.postalCode} onChange={updateField} inputMode="numeric" />
                <CheckoutField field="phone" value={shipping.phone} error={errors.phone} onChange={updateField} inputMode="tel" />
              </div>

              <div className="mt-[26px] flex justify-end">
                <Button type="submit" disabled={!items.length}>Continue to review</Button>
              </div>
            </form>
          ) : (
            <div>
              <h1 className="font-display text-lg font-semibold">Review your hoard</h1>
              <p className="mb-[22px] mt-1.5 text-[0.8rem] text-ink-dim">Last chance to back out. You will not back out.</p>

              <div>
                <div className="flex justify-between gap-5 py-2 text-[0.84rem]">
                  <span className="shrink-0 text-ink-dim">Ship to</span>
                  <span className="max-w-[65%] text-right font-mono text-[0.78rem] leading-5">{fullAddress}</span>
                </div>
                <button className="text-xs text-ink-dim underline underline-offset-2 hover:text-ink" onClick={() => setStep(1)} type="button">Edit address</button>
              </div>

              <div className="mt-[18px] border-t border-line pt-[18px]">
                <p className="mb-2.5 text-[0.8rem] text-ink-dim">Payment method</p>
                <div className="flex items-center justify-between gap-4 rounded-[10px] border border-line-strong px-4 py-3.5">
                  <span className="text-[0.84rem] font-medium">Imaginary Visa •••• 0000</span>
                  <span className="font-mono text-[0.68rem] text-ink-dim">EXP: NEVER</span>
                </div>
              </div>

              <div className="mt-[26px] flex justify-between gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={startPayment} disabled={processing}>Place order — ₱0.00</Button>
              </div>
            </div>
          )}
        </section>

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
                      <span className="text-[0.62rem] text-ink-dim line-through">{php.format(item.displayPrice * item.quantity)}</span>
                      <span className="text-[0.8rem] font-bold text-green">₱0.00</span>
                    </div>
                  </div>
                ))}
              </div>
              <OrderLedger hypotheticalTotal={hypotheticalTotal} />
            </>
          ) : (
            <div className="py-12 text-center">
              <p className="font-display font-semibold">Your hoard is empty.</p>
              <p className="mt-2 text-xs text-ink-dim">A checkout with restraint. Disturbing.</p>
              <Button className="mt-5" variant="outline" asChild><Link href="/catalog">Return to catalog</Link></Button>
            </div>
          )}
        </aside>
      </div>

      <Dialog open={paymentOpen} onOpenChange={(open) => { if (!processing && !open) setPaymentOpen(false); }}>
        <DialogContent
          onEscapeKeyDown={(event) => { if (processing) event.preventDefault(); }}
          onInteractOutside={(event) => event.preventDefault()}
        >
          {order ? (
            <div>
              <div className="mx-auto mb-5 grid size-[54px] place-items-center rounded-full bg-green text-raised"><Check className="size-6" /></div>
              <DialogTitle>Order placed</DialogTitle>
              <DialogDescription className="mb-6 mt-2 leading-5">Your loot is confirmed. It will never arrive, but it will be tracked obsessively the entire time.</DialogDescription>
              <Button className="w-full" onClick={trackOrder}>Track this order</Button>
            </div>
          ) : (
            <div>
              <div className="mx-auto mb-[26px] size-[54px] animate-spin rounded-full border-[3px] border-line border-t-gold" />
              <DialogTitle className="font-mono text-sm">{paymentStages[stageIndex].text}</DialogTitle>
              <DialogDescription className="mb-7 mt-2 min-h-4">{paymentStages[stageIndex].sub}</DialogDescription>
              <div className="mb-6 h-1 overflow-hidden rounded-full bg-line">
                <div className="h-full bg-gold transition-[width] duration-500" style={{ width: `${paymentStages[stageIndex].progress}%` }} />
              </div>
              <p className="font-mono text-3xl font-bold text-green">₱0.00</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}

function ProgressStep({ active, done, number, label }: { active: boolean; done: boolean; number: number; label: string }) {
  return (
    <div className={cn("flex items-center gap-2.5 text-ink-dim", active && "font-semibold text-ink")}>
      <span className={cn(
        "grid size-[26px] place-items-center rounded-full border border-line-strong font-mono text-xs",
        active && "border-ink bg-ink text-page",
        done && "border-green bg-green text-raised",
      )}>{done ? <Check className="size-3.5" /> : number}</span>
      <span className="whitespace-nowrap text-[0.8rem]">{label}</span>
    </div>
  );
}

function CheckoutField({
  field,
  value,
  error,
  onChange,
  inputMode,
}: {
  field: keyof ShippingAddress;
  value: string;
  error?: string;
  onChange: (field: keyof ShippingAddress, value: string) => void;
  inputMode?: "numeric" | "tel";
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs tracking-[0.02em] text-ink-dim">{fieldLabels[field]}</span>
      <input
        aria-invalid={Boolean(error)}
        className={cn("w-full rounded-lg border border-line-strong bg-page px-[13px] py-[11px] text-sm text-ink placeholder:text-ink-dim/70", error && "border-red")}
        inputMode={inputMode}
        onChange={(event) => onChange(field, event.target.value)}
        placeholder={placeholders[field]}
        value={value}
      />
      {error && <span className="mt-1 block text-[0.68rem] text-red">{error}</span>}
    </label>
  );
}

function OrderLedger({ hypotheticalTotal }: { hypotheticalTotal: number }) {
  return (
    <dl className="space-y-2 text-[0.8rem] text-ink-dim">
      <div className="flex justify-between gap-4"><dt>What this would have cost</dt><dd className="font-mono line-through">{php.format(hypotheticalTotal)}</dd></div>
      <div className="flex justify-between gap-4"><dt>Shipping</dt><dd className="font-mono">₱0.00</dd></div>
      <div className="flex justify-between gap-4"><dt>Tax, fees, regret</dt><dd className="font-mono">₱0.00</dd></div>
      <div className="mt-2 flex items-baseline justify-between border-t border-line pt-3.5 text-ink">
        <dt className="text-sm font-semibold">Order total</dt><dd className="font-mono text-2xl font-bold text-green">₱0.00</dd>
      </div>
    </dl>
  );
}
