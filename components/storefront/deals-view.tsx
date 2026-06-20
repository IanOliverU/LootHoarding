"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { animateProductToCart } from "@/lib/cart-animation";
import { useCartStore } from "@/lib/cart-store";
import { catalogProducts, type Product } from "@/lib/products";
import { PriceBlock } from "./price-block";
import { ProductVisual } from "./product-visual";
import { RarityTag } from "./rarity-tag";

const PAGE_SIZE = 8;

const discountCopy = [
  "-100% TODAY ONLY (EVERY DAY)",
  "-100% WHILE SUPPLIES IMAGINARY",
  "-100% FLASH HOARD",
  "-100% LAST CHANCE (NO CHANCE)",
  "-100% DOORBUSTER",
  "-100% MIDNIGHT MADNESS (NOON)",
  "-100% EXTREMELY LIMITED (INFINITE)",
  "-100% ONE DAY SALE (PERMANENT)",
];

type DealSort = "urgent" | "discount" | "newest";

function timerSeed(product: Product, index: number) {
  return 1_800 + ((index * 1_337 + product.displayPrice) % 18_000);
}

function sortedDeals(sort: DealSort) {
  const products = [...catalogProducts];

  if (sort === "urgent") {
    return products.sort(
      (a, b) => timerSeed(a, catalogProducts.indexOf(a)) - timerSeed(b, catalogProducts.indexOf(b)),
    );
  }

  if (sort === "discount") {
    return products.sort((a, b) => b.displayPrice - a.displayPrice);
  }

  return products.reverse();
}

function formatTime(total: number) {
  const hours = Math.floor(total / 3_600);
  const minutes = Math.floor((total % 3_600) / 60);
  const seconds = total % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

function DealTimer({ seed }: { seed: number }) {
  const [remaining, setRemaining] = useState(seed);
  const [glitched, setGlitched] = useState(false);

  useEffect(() => {
    let glitchTimeout: number | undefined;
    const interval = window.setInterval(() => {
      const roll = Math.random();

      if (roll < 0.1) {
        setRemaining((current) => current + 20 + Math.floor(Math.random() * 90));
        return;
      }

      if (roll < 0.18) {
        setRemaining((current) => Math.max(1, current - 10 - Math.floor(Math.random() * 60)));
        return;
      }

      if (roll < 0.24) {
        setGlitched(true);
        window.clearTimeout(glitchTimeout);
        glitchTimeout = window.setTimeout(() => setGlitched(false), 550);
        return;
      }

      setRemaining((current) => (current <= 1 ? seed : current - 1));
    }, 1_000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(glitchTimeout);
    };
  }, [seed]);

  return (
    <span className="font-mono text-[0.68rem] font-bold tabular-nums">
      {glitched ? "??:??:??" : formatTime(remaining)}
    </span>
  );
}

function DealCard({ product, index }: { product: Product; index: number }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <motion.article
      className="group overflow-hidden rounded-[14px] border border-line bg-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <div className="flex items-center gap-2 bg-ink px-3 py-[7px] font-mono text-page">
        <span className="size-1.5 animate-pulse rounded-full bg-red" aria-hidden="true" />
        <span className="text-[0.68rem] font-semibold">ENDING SOON ·</span>
        <DealTimer seed={timerSeed(product, index)} />
      </div>

      <Link href={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
        <ProductVisual product={product} className="h-[150px] rounded-none border-b border-line" />
      </Link>

      <div className="p-4">
        <p className="font-mono text-[0.62rem] font-bold text-red">
          {discountCopy[index % discountCopy.length]}
        </p>
        <RarityTag rarity={product.rarity} className="mt-2.5" />
        <Link href={`/product/${product.slug}`} className="block">
          <h2 className="mt-2 min-h-10 text-[0.9rem] font-semibold leading-snug transition-colors hover:text-gold">
            {product.name}
          </h2>
        </Link>
        <PriceBlock className="mt-3" displayPrice={product.displayPrice} size="compact" />
        <Button
          className="mt-4 w-full rounded-lg"
          aria-label={`Add ${product.name} to cart`}
          onClick={(event) => {
            animateProductToCart(event.currentTarget, product);
            addItem(product);
          }}
        >
          Add to cart
        </Button>
      </div>
    </motion.article>
  );
}

export function DealsView() {
  const [sort, setSort] = useState<DealSort>("urgent");
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useInfiniteQuery({
    queryKey: ["storefront-deals", sort],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const products = sortedDeals(sort);
      const start = pageParam * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      return {
        items: products.slice(start, end),
        nextPage: end < products.length ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const products = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <main>
      <section className="relative overflow-hidden border-b border-line px-5 py-12 text-center sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--red-fill),transparent_58%)]" />
        <div className="relative mx-auto max-w-2xl">
          <p className="inline-flex items-center gap-2 font-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-red">
            <span className="size-1.5 animate-pulse rounded-full bg-red" aria-hidden="true" />
            {catalogProducts.length} active “deals” · all ending soon, forever
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">Flash deals</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink-dim sm:text-base">
            Every timer below is lying to you. Some count down. Some count up. None of them ever actually reach zero.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 pb-16 sm:px-10">
        <div className="my-6 flex flex-col gap-3 border-b border-line pb-5 sm:my-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.08em] text-ink-dim">
            {catalogProducts.length} deals · {products.length} currently loaded
          </p>
          <label className="flex items-center gap-3 text-sm text-ink-dim">
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.08em]">Sort by</span>
            <select
              className="h-10 rounded-[9px] border border-line-strong bg-raised px-3 text-sm font-medium text-ink outline-none transition-colors focus:border-gold"
              value={sort}
              onChange={(event) => setSort(event.target.value as DealSort)}
            >
              <option value="urgent">Most urgent (allegedly)</option>
              <option value="discount">Biggest fake discount</option>
              <option value="newest">Newest</option>
            </select>
          </label>
        </div>

        {isPending ? (
          <div className="grid min-h-64 place-items-center font-mono text-xs uppercase tracking-[0.1em] text-ink-dim">
            Manufacturing urgency…
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
              <DealCard product={product} index={index} key={`${sort}-${product.id}`} />
            ))}
          </div>
        )}

        <div
          ref={sentinelRef}
          className="grid min-h-24 place-items-center pt-8 text-center font-mono text-[0.68rem] uppercase tracking-[0.1em] text-ink-dim"
          aria-live="polite"
        >
          {isFetchingNextPage
            ? "Loading more imaginary urgency…"
            : hasNextPage
              ? "Scroll for more deals"
              : "All deals loaded · the sale remains permanent"}
        </div>
      </section>
    </main>
  );
}
