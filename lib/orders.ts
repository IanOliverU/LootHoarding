import type { CartLine } from "@/lib/cart-store";

export type ShippingAddress = {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
};

export type OrderSnapshot = {
  orderNumber: string;
  trackingToken: string;
  shipping: ShippingAddress;
  items: Array<{
    id: string;
    slug: string;
    name: string;
    brand: string;
    rarity: CartLine["rarity"];
    displayPrice: number;
    quantity: number;
  }>;
  actualTotal: 0;
  status: "confirmed";
  createdAt: string;
};

const ORDERS_KEY = "loothoarding-orders";

function randomCode(length: number) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

export function createLocalOrder(shipping: ShippingAddress, cartItems: CartLine[]): OrderSnapshot {
  const now = new Date();
  const order: OrderSnapshot = {
    orderNumber: `LH-${now.getFullYear()}-${randomCode(6)}`,
    trackingToken: randomCode(16).toLowerCase(),
    shipping: { ...shipping },
    items: cartItems.map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      brand: item.brand,
      rarity: item.rarity,
      displayPrice: item.displayPrice,
      quantity: item.quantity,
    })),
    actualTotal: 0,
    status: "confirmed",
    createdAt: now.toISOString(),
  };

  const existing = JSON.parse(window.localStorage.getItem(ORDERS_KEY) ?? "[]") as OrderSnapshot[];
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...existing]));
  return order;
}

export function getLocalOrders(): OrderSnapshot[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(window.localStorage.getItem(ORDERS_KEY) ?? "[]") as OrderSnapshot[];
}
