"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/products";
import { PriceBlock } from "./price-block";
import { ProductVisual } from "./product-visual";
import { RarityTag } from "./rarity-tag";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <motion.article whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 280, damping: 22 }}>
      <Link
        href={`/product/${product.slug}`}
        className="group block rounded-3xl border border-line bg-card p-3 transition-shadow hover:shadow-soft"
      >
        <ProductVisual product={product} />
        <div className="px-2 pb-2 pt-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <RarityTag rarity={product.rarity} />
            <span className="truncate text-xs text-ink-dim">{product.category}</span>
          </div>
          <h3 className="min-h-12 font-display text-lg font-bold leading-snug text-ink">
            {product.name}
          </h3>
          <div className="mt-5 flex items-end justify-between gap-3">
            <PriceBlock displayPrice={product.displayPrice} size="compact" />
            <Button
              size="icon"
              aria-label={`Add ${product.name} to cart`}
              onClick={(event) => {
                event.preventDefault();
                addItem(product);
              }}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
