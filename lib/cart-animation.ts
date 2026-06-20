import type { Product } from "@/lib/products";

export const CART_ANIMATION_EVENT = "loothoarding:cart-add";

export type CartAnimationDetail = {
  id: string;
  name: string;
  rarity: Product["rarity"];
  startX: number;
  startY: number;
};

export function animateProductToCart(source: HTMLElement, product: Product) {
  const bounds = source.getBoundingClientRect();
  const detail: CartAnimationDetail = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: product.name,
    rarity: product.rarity,
    startX: bounds.left + bounds.width / 2,
    startY: bounds.top + bounds.height / 2,
  };
  window.dispatchEvent(new CustomEvent<CartAnimationDetail>(CART_ANIMATION_EVENT, { detail }));
}
