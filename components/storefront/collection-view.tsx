"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/storefront/product-card";
import { PriceBlock } from "@/components/storefront/price-block";
import { ProductVisual } from "@/components/storefront/product-visual";
import { PesoAmount } from "@/components/storefront/peso-amount";
import { RarityTag } from "@/components/storefront/rarity-tag";
import type { StoreCollection } from "@/lib/collections";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function CollectionView({
  collection,
  collections,
  products,
}: {
  collection: StoreCollection;
  collections: StoreCollection[];
  products: Product[];
}) {
  const [activeShowcase, setActiveShowcase] = useState(0);
  const showcaseProducts = products.slice(0, 4);
  const legendaryCount = products.filter((product) => product.rarity === "legendary").length;

  useEffect(() => {
    setActiveShowcase(0);
  }, [collection.slug]);

  useEffect(() => {
    if (showcaseProducts.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timeout: number;
    const scheduleNext = () => {
      timeout = window.setTimeout(() => {
        setActiveShowcase((current) => (current + 1) % showcaseProducts.length);
        scheduleNext();
      }, 3_000 + Math.random() * 2_000);
    };

    scheduleNext();
    return () => window.clearTimeout(timeout);
  }, [collection.slug, showcaseProducts.length]);

  const featuredProduct = showcaseProducts[activeShowcase] ?? products[0];

  return (
    <main>
      <nav className="mx-auto max-w-[1280px] px-5 pt-[22px] font-mono text-[0.68rem] tracking-[0.03em] text-ink-dim md:px-10" aria-label="Breadcrumb">
        <Link className="transition-colors hover:text-ink" href="/">HOME</Link>
        <span aria-hidden="true"> / </span>
        <span>COLLECTIONS</span>
        <span aria-hidden="true"> / </span>
        <span className="text-ink">{collection.name.toUpperCase()}</span>
      </nav>

      <section className="mx-auto mt-[18px] max-w-[1280px] px-5 md:px-10" aria-labelledby="collection-title">
        <div className="relative flex flex-col items-stretch gap-9 overflow-hidden rounded-[18px] bg-ink px-7 py-10 text-page sm:px-10 md:flex-row md:items-center md:justify-between md:gap-11 md:px-12 md:py-12">
          <div className="relative z-10 flex-1">
            <p className="flex items-center gap-2 font-mono text-[0.68rem] font-medium uppercase tracking-[0.08em] text-gold">
              <span aria-hidden="true">◆</span> Curated collection
            </p>
            <h1 id="collection-title" className="mt-3.5 font-display text-[2.125rem] font-bold leading-[1.15] tracking-[-0.01em]">
              {collection.name}
            </h1>
            <p className="mt-3.5 max-w-[460px] text-[0.9rem] leading-[1.65] text-page/70">
              {collection.description}
            </p>
            <dl className="mt-[22px] flex flex-wrap gap-x-6 gap-y-4">
              <div>
                <dd className="font-mono text-lg font-bold text-gold">{products.length}</dd>
                <dt className="mt-0.5 text-[0.65rem] uppercase tracking-[0.04em] text-page/55">Items</dt>
              </div>
              <div>
                <dd className="font-mono text-lg font-bold text-gold">{legendaryCount}</dd>
                <dt className="mt-0.5 text-[0.65rem] uppercase tracking-[0.04em] text-page/55">Legendary</dt>
              </div>
              <div>
                <dd className="font-mono text-lg font-bold text-gold"><PesoAmount /></dd>
                <dt className="mt-0.5 text-[0.65rem] uppercase tracking-[0.04em] text-page/55">Every single one</dt>
              </div>
            </dl>
          </div>

          {featuredProduct && (
            <div className="relative z-10 w-full shrink-0 overflow-hidden rounded-[14px] border border-page/15 bg-page/6 p-[18px] sm:w-[230px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={featuredProduct.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/product/${featuredProduct.slug}`}>
                    <ProductVisual
                      product={featuredProduct}
                      showBrand={false}
                      className="h-[100px] rounded-[9px] bg-page/10 text-page/55"
                    />
                    <RarityTag rarity={featuredProduct.rarity} className="mt-3 text-[0.6rem] tracking-[0.08em]" />
                    <h2 className="mt-1.5 min-h-8 text-[0.78rem] font-semibold leading-[1.35] text-page">
                      {featuredProduct.name}
                    </h2>
                    <PriceBlock
                      className="mt-2 gap-x-2 [&>span:first-child]:text-page/45"
                      displayPrice={featuredProduct.displayPrice}
                      size="compact"
                    />
                  </Link>
                </motion.div>
              </AnimatePresence>

              <div className="mt-3.5 flex justify-center gap-1.5" aria-label="Featured product slides">
                {showcaseProducts.map((product, index) => (
                  <button
                    type="button"
                    className={cn("size-[5px] rounded-full bg-page/25", activeShowcase === index && "bg-gold")}
                    aria-label={`Show ${product.name}`}
                    aria-current={activeShowcase === index ? "true" : undefined}
                    onClick={() => setActiveShowcase(index)}
                    key={product.id}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto mt-7 max-w-[1280px] px-5 md:px-10" aria-labelledby="other-collections-title">
        <h2 id="other-collections-title" className="mb-3 font-mono text-[0.68rem] uppercase tracking-[0.04em] text-ink-dim">
          Other collections
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {collections.map((item) => {
            const active = item.slug === collection.slug;
            return (
              <Link
                href={`/collection/${item.slug}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full border border-line-strong px-4 py-2 text-[0.78rem] font-medium text-ink-dim transition-all hover:-translate-y-0.5 hover:border-ink-dim hover:text-ink active:translate-y-0 active:scale-[0.97]",
                  active && "border-ink bg-ink text-page hover:border-ink hover:text-page",
                )}
                key={item.slug}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 pb-[60px] pt-9 md:px-10" aria-labelledby="collection-products-title">
        <div className="mb-6 flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 id="collection-products-title" className="font-display text-xl font-semibold">
            {products.length} items in this collection
          </h2>
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.04em] text-ink-dim">Curated · no filters needed</span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => <ProductCard product={product} key={product.id} />)}
        </div>
      </section>
    </main>
  );
}
