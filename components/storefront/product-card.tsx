"use client";

import { motion } from "framer-motion";
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
    <motion.article whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 280, damping: 22 }}>
      <Link
        href={`/product/${product.slug}`}
        className="group block overflow-hidden rounded-[14px] border border-line bg-raised transition-shadow hover:shadow-soft"
      >
        <ProductVisual product={product} className="aspect-auto h-[170px] rounded-none border-b border-line" />
        <div className="p-[18px]">
          <p className="mb-2 font-mono text-[0.68rem] uppercase tracking-[0.04em] text-ink-dim">{product.category}</p>
          <RarityTag rarity={product.rarity} className="mb-2.5" />
          <h3 className="min-h-10 text-[0.94rem] font-semibold leading-[1.35] text-ink">
            {product.name}
          </h3>
          <PriceBlock className="mt-3.5" displayPrice={product.displayPrice} />
          <div className="mt-4">
            <Button
              className="w-full rounded-lg"
              aria-label={`Add ${product.name} to cart`}
              onClick={(event) => {
                event.preventDefault();
                addItem(product);
              }}
            >
              Add to cart
            </Button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
