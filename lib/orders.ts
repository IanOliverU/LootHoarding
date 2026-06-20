import type { CartLine } from "@/lib/cart-store";
import type { Product } from "@/lib/products";

export type ShippingAddress = {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
};

export type PaymentSummary = {
  method: "card" | "gcash" | "bank" | "hoardcoin";
  label: string;
  reference: string;
};

export type OrderItemSnapshot = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  categorySlug: string;
  icon: Product["icon"];
  rarity: Product["rarity"];
  displayPrice: number;
  quantity: number;
};

export type OrderSnapshot = {
  orderNumber: string;
  trackingToken: string;
  shipping: ShippingAddress;
  items: OrderItemSnapshot[];
  payment: PaymentSummary;
  actualTotal: 0;
  status: "confirmed";
  mishap: {
    text: string;
    type: "courier_mishap";
    triggeredAt: string;
    resolvedAt: string | null;
  } | null;
  createdAt: string;
};

const ORDERS_KEY = "loothoarding-orders";

function randomCode(length: number) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

export function createOrderSnapshot(
  shipping: ShippingAddress,
  cartItems: CartLine[],
  payment: PaymentSummary,
): OrderSnapshot {
  const now = new Date();
  return {
    orderNumber: `LH-${now.getFullYear()}-${randomCode(6)}`,
    trackingToken: randomCode(16).toLowerCase(),
    shipping: { ...shipping },
    items: cartItems.map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      brand: item.brand,
      category: item.category,
      categorySlug: item.categorySlug,
      icon: item.icon,
      rarity: item.rarity,
      displayPrice: item.displayPrice,
      quantity: item.quantity,
    })),
    payment,
    actualTotal: 0,
    status: "confirmed",
    mishap: null,
    createdAt: now.toISOString(),
  };
}

export function saveLocalOrder(order: OrderSnapshot) {
  const existing = getLocalOrders();
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...existing.filter((item) => item.orderNumber !== order.orderNumber)]));
}

export function createLocalOrder(
  shipping: ShippingAddress,
  cartItems: CartLine[],
  payment: PaymentSummary,
) {
  const order = createOrderSnapshot(shipping, cartItems, payment);
  saveLocalOrder(order);
  return order;
}

export function getLocalOrders(): OrderSnapshot[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(ORDERS_KEY) ?? "[]") as OrderSnapshot[];
  } catch {
    return [];
  }
}

export function getLocalOrderByNumber(orderNumber: string) {
  return getLocalOrders().find((order) => order.orderNumber === orderNumber) ?? null;
}

export function getLocalOrderByTrackingToken(trackingToken: string) {
  return getLocalOrders().find((order) => order.trackingToken === trackingToken) ?? null;
}

export function updateLocalOrderMishap(trackingToken: string, mishap: NonNullable<OrderSnapshot["mishap"]>) {
  const orders = getLocalOrders();
  const updated = orders.map((order) => order.trackingToken === trackingToken ? { ...order, mishap } : order);
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  return updated.find((order) => order.trackingToken === trackingToken) ?? null;
}
