"use server";

import type { CartLine } from "@/lib/cart-store";
import { createOrderSnapshot, type PaymentSummary, type ShippingAddress } from "@/lib/orders";
import { catalogProducts } from "@/lib/products";
import { insertOrder, isSupabaseConfigured } from "@/lib/supabase/admin";

export type CreateOrderInput = {
  shipping: ShippingAddress;
  items: CartLine[];
  payment: PaymentSummary;
};

function validateOrderInput(input: CreateOrderInput) {
  const requiredShippingFields: Array<keyof ShippingAddress> = [
    "firstName", "lastName", "street", "city", "province", "postalCode", "phone",
  ];
  if (requiredShippingFields.some((field) => typeof input.shipping[field] !== "string" || !input.shipping[field].trim())) {
    throw new Error("Complete the shipping address before placing the order");
  }
  if (!input.items.length) throw new Error("The cart is empty");
  if (input.items.some((item) => !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99)) {
    throw new Error("Invalid item quantity");
  }
  if (!/^\d{4}$/.test(input.payment.last4)) throw new Error("Invalid imaginary card summary");
}

export async function createOrderAction(input: CreateOrderInput) {
  validateOrderInput(input);
  const canonicalItems: CartLine[] = input.items.map((submittedItem) => {
    const product = catalogProducts.find((candidate) => candidate.id === submittedItem.id);
    if (!product) throw new Error("A cart item no longer exists");
    return { ...product, quantity: submittedItem.quantity };
  });
  const order = createOrderSnapshot(input.shipping, canonicalItems, input.payment);
  const persisted = isSupabaseConfigured();
  if (persisted) await insertOrder(order);
  return { order, persisted };
}
