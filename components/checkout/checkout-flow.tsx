"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckoutOrderSummary } from "@/components/checkout/checkout-order-summary";
import { CheckoutProgress } from "@/components/checkout/checkout-progress";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { emptyShipping, useCheckoutStore } from "@/lib/checkout-store";
import type { ShippingAddress } from "@/lib/orders";
import { cn } from "@/lib/utils";

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

export function CheckoutFlow() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const savedShipping = useCheckoutStore((state) => state.shipping);
  const hydrated = useCheckoutStore((state) => state.hydrated);
  const setShipping = useCheckoutStore((state) => state.setShipping);
  const [shipping, setLocalShipping] = useState<ShippingAddress>(emptyShipping);
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});

  useEffect(() => {
    if (hydrated) setLocalShipping(savedShipping);
  }, [hydrated, savedShipping]);

  function updateField(key: keyof ShippingAddress, value: string) {
    setLocalShipping((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function continueToPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof ShippingAddress, string>> = {};
    (Object.keys(shipping) as Array<keyof ShippingAddress>).forEach((key) => {
      if (!shipping[key].trim()) nextErrors[key] = `${fieldLabels[key]} is required`;
    });
    if (shipping.postalCode && !/^\d{4}$/.test(shipping.postalCode)) nextErrors.postalCode = "Use a 4-digit postal code";
    if (shipping.phone && shipping.phone.replace(/\D/g, "").length < 10) nextErrors.phone = "Enter a valid phone number";
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);

    setShipping(shipping);
    router.push("/checkout/payment");
  }

  return (
    <main>
      <CheckoutProgress current={1} />
      <div className="mx-auto mb-[60px] mt-8 grid max-w-[1100px] items-start gap-7 px-5 md:px-10 lg:grid-cols-[1fr_380px] lg:gap-12">
        <section className="rounded-[14px] border border-line bg-card p-5 sm:p-7">
          <form onSubmit={continueToPayment} noValidate>
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
              <Button type="submit" disabled={!cartItems.length}>Continue to payment</Button>
            </div>
          </form>
        </section>
        <CheckoutOrderSummary />
      </div>
    </main>
  );
}

function CheckoutField({ field, value, error, onChange, inputMode }: {
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
