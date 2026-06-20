"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { ProductCard } from "@/components/storefront/product-card";
import { catalogProducts } from "@/lib/products";
import { searchProducts } from "@/lib/product-search";

const PAGE_SIZE = 9;

export function SearchResults({ query }: { query: string }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const normalizedQuery = query.trim();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useInfiniteQuery({
    queryKey: ["search-results", normalizedQuery],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const matches = normalizedQuery ? searchProducts(catalogProducts, normalizedQuery) : [];
      const start = pageParam * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      return {
        items: matches.slice(start, end),
        total: matches.length,
        nextPage: end < matches.length ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) void fetchNextPage();
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const products = data?.pages.flatMap((page) => page.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  if (isPending) {
    return <div className="grid min-h-96 place-items-center font-mono text-xs uppercase tracking-[0.1em] text-ink-dim">Searching the imaginary shelves…</div>;
  }

  if (!products.length) {
    return (
      <div className="grid min-h-96 place-items-center rounded-[14px] border border-dashed border-line-strong bg-raised p-8 text-center">
        <div>
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-sunken text-ink-dim"><Search className="size-5" /></div>
          <h2 className="mt-5 font-display text-xl font-bold">{normalizedQuery ? "No imaginary stock found." : "Search terms required."}</h2>
          <p className="mt-2 text-sm text-ink-dim">
            {normalizedQuery ? "Try a brand, model number, category, or fewer expensive words." : "Open Search loot and describe the poor decision you had in mind."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-[22px] flex items-center justify-between gap-4">
        <p className="font-mono text-xs text-ink-dim">{total} RESULTS · {products.length} LOADED</p>
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.06em] text-ink-dim">Sorted by relevance</span>
      </div>

      <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => <ProductCard product={product} key={product.id} />)}
      </div>

      <div
        ref={sentinelRef}
        className="grid min-h-24 place-items-center pt-8 text-center font-mono text-[0.68rem] uppercase tracking-[0.1em] text-ink-dim"
        aria-live="polite"
      >
        {isFetchingNextPage
          ? "Searching deeper into the shelves…"
          : hasNextPage
            ? "Scroll for more matches"
            : `All ${total} matching products loaded`}
      </div>
    </>
  );
}
