"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/products";

export type CartLine = Product & { quantity: number };

type CartState = {
  items: CartLine[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setOpen: (isOpen: boolean) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          const items = existing
            ? state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
              )
            : [...state.items, { ...product, quantity }];
          return { items, isOpen: true };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      setQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.id !== id)
              : state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        })),
      clearCart: () => set({ items: [], isOpen: false }),
      setOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: "loothoarding-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
