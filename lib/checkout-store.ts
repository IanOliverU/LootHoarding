"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PaymentSummary, ShippingAddress } from "@/lib/orders";

export type PaymentMethod = PaymentSummary["method"];

export const emptyShipping: ShippingAddress = {
  firstName: "",
  lastName: "",
  street: "",
  city: "",
  province: "",
  postalCode: "",
  phone: "",
};

type CheckoutState = {
  shipping: ShippingAddress;
  method: PaymentMethod;
  hydrated: boolean;
  setShipping: (shipping: ShippingAddress) => void;
  setMethod: (method: PaymentMethod) => void;
  reset: () => void;
  setHydrated: (hydrated: boolean) => void;
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      shipping: emptyShipping,
      method: "card",
      hydrated: false,
      setShipping: (shipping) => set({ shipping }),
      setMethod: (method) => set({ method }),
      reset: () => set({ shipping: emptyShipping, method: "card" }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "loothoarding-checkout",
      partialize: (state) => ({ shipping: state.shipping, method: state.method }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);

export function hasCompleteShipping(shipping: ShippingAddress) {
  return Object.values(shipping).every((value) => value.trim().length > 0);
}
