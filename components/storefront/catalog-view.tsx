"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { ProductCard } from "@/components/storefront/product-card";
import { PesoSymbol } from "@/components/storefront/peso-amount";
import { Button } from "@/components/ui/button";
import { categoryTaxonomy } from "@/lib/category-taxonomy";
import { catalogProducts, type Product, type Rarity } from "@/lib/products";
import { cn } from "@/lib/utils";

const categoryOptions = categoryTaxonomy.map((category) => ({
  label: category.name,
  value: category.slug,
  count: catalogProducts.filter((product) => product.categorySlug === category.slug).length,
}));

const brandOptions = Array.from(
  catalogProducts.reduce(
    (counts, product) => counts.set(product.brand, (counts.get(product.brand) ?? 0) + 1),
    new Map<string, number>(),
  ),
)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .slice(0, 8)
  .map(([brand, count]) => ({ label: brand, value: brand, count }));

const rarities: Rarity[] = ["legendary", "epic", "rare"];
const PAGE_SIZE = 9;

function readList(value: string | null) {
  return value ? value.split(",").filter(Boolean) : [];
}

type FiltersProps = {
  categories: string[];
  subcategories: string[];
  brands: string[];
  selectedRarities: string[];
  maxPrice: number;
  hasPriceFilter: boolean;
  toggleListValue: (key: "category" | "subcategory" | "brand" | "rarity", value: string) => void;
  setParam: (key: string, value?: string) => void;
  clearFilters: () => void;
};

function FilterPanel({
  categories,
  subcategories,
  brands,
  selectedRarities,
  maxPrice,
  hasPriceFilter,
  toggleListValue,
  setParam,
  clearFilters,
}: FiltersProps) {
  return (
    <div className="flex flex-col gap-7">
      <FilterGroup title="Category">
        <div className="space-y-[9px]">
          {categoryOptions.map((option) => {
            const checked = categories.includes(option.value);
            return (
              <button
                className="flex w-full items-center gap-[9px] text-left text-[0.8rem] text-ink-dim transition-colors hover:text-ink"
                key={option.value}
                onClick={() => toggleListValue("category", option.value)}
                type="button"
              >
                <span className={cn("grid size-3.5 shrink-0 place-items-center rounded-[3px] border border-line-strong", checked && "border-ink bg-ink text-page")}>
                  {checked && <Check className="size-2.5" />}
                </span>
                {option.label}
                <span className="ml-auto font-mono text-[0.68rem] text-ink-dim">{option.count}</span>
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {categories.length > 0 && (
        <FilterGroup title="Subcategory">
          <div className="space-y-[9px]">
            {categoryTaxonomy
              .filter((category) => categories.includes(category.slug))
              .flatMap((category) => category.subcategories)
              .filter((subcategory, index, options) => options.indexOf(subcategory) === index)
              .map((subcategory) => {
                const checked = subcategories.includes(subcategory);
                const count = catalogProducts.filter(
                  (product) => categories.includes(product.categorySlug) && product.subcategory === subcategory,
                ).length;

                return (
                  <button
                    className="flex w-full items-center gap-[9px] text-left text-[0.8rem] text-ink-dim transition-colors hover:text-ink"
                    key={subcategory}
                    onClick={() => toggleListValue("subcategory", subcategory)}
                    type="button"
                  >
                    <span className={cn("grid size-3.5 shrink-0 place-items-center rounded-[3px] border border-line-strong", checked && "border-ink bg-ink text-page")}>
                      {checked && <Check className="size-2.5" />}
                    </span>
                    {subcategory}
                    <span className="ml-auto font-mono text-[0.68rem] text-ink-dim">{count}</span>
                  </button>
                );
              })}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Rarity">
        <div className="flex flex-wrap gap-2">
          {rarities.map((rarity) => {
            const active = selectedRarities.includes(rarity);
            return (
              <button
                className={cn(
                  "rounded-full border border-line-strong px-3 py-1.5 font-mono text-[0.68rem] font-medium capitalize text-ink-dim",
                  active && rarity === "legendary" && "border-gold bg-gold-fill text-gold",
                  active && rarity === "epic" && "border-purple bg-purple-fill text-purple",
                  active && rarity === "rare" && "border-ink bg-ink text-page",
                )}
                key={rarity}
                onClick={() => toggleListValue("rarity", rarity)}
                type="button"
              >
                {rarity}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Fake price range">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span><PesoSymbol />0</span>
          <input
            aria-label="Maximum fake price"
            className="min-w-0 flex-1 accent-ink"
            max="650000"
            min="0"
            onChange={(event) => setParam("maxPrice", event.target.value)}
            step="10000"
            type="range"
            value={maxPrice}
          />
          <span><PesoSymbol />{hasPriceFilter ? `${Math.round(maxPrice / 1000)}k` : "650k"}</span>
        </div>
      </FilterGroup>

      <FilterGroup title="Brand" last>
        <div className="space-y-[9px]">
          {brandOptions.map((option) => {
            const checked = brands.includes(option.value);
            return (
              <button
                className="flex w-full items-center gap-[9px] text-left text-[0.8rem] text-ink-dim transition-colors hover:text-ink"
                key={option.value}
                onClick={() => toggleListValue("brand", option.value)}
                type="button"
              >
                <span className={cn("grid size-3.5 shrink-0 place-items-center rounded-[3px] border border-line-strong", checked && "border-ink bg-ink text-page")}>
                  {checked && <Check className="size-2.5" />}
                </span>
                {option.label}
                <span className="ml-auto font-mono text-[0.68rem] text-ink-dim">{option.count}</span>
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <button className="w-fit font-mono text-[0.68rem] text-ink-dim underline underline-offset-2 hover:text-ink" onClick={clearFilters} type="button">
        Clear all filters
      </button>
    </div>
  );
}

function FilterGroup({ title, children, last = false }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <section className={cn("border-b border-line pb-5", last && "border-0 pb-0")}>
      <h2 className="mb-3 flex items-center justify-between font-display text-[0.8rem] font-semibold">
        {title}<ChevronDown className="size-3 text-ink-dim" />
      </h2>
      {children}
    </section>
  );
}

function filterAndSortProducts(
  products: Product[],
  search: string,
  categories: string[],
  subcategories: string[],
  brands: string[],
  raritiesFilter: string[],
  maxPrice: number | null,
  sort: string,
) {
  const filtered = products.filter((product) => {
    if (search) {
      const haystack = [product.name, product.brand, product.category, product.subcategory, ...product.attributes]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search.toLowerCase())) return false;
    }
    if (categories.length && !categories.includes(product.categorySlug)) return false;
    if (subcategories.length && !subcategories.includes(product.subcategory)) return false;
    if (brands.length && !brands.includes(product.brand)) return false;
    if (raritiesFilter.length && !raritiesFilter.includes(product.rarity)) return false;
    if (maxPrice !== null && product.displayPrice > maxPrice) return false;
    return true;
  });

  if (sort === "price") return [...filtered].sort((a, b) => a.displayPrice - b.displayPrice);
  if (sort === "newest") return [...filtered].reverse();
  return filtered;
}

export function CatalogView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categories = readList(searchParams.get("category"));
  const search = searchParams.get("search")?.trim() ?? "";
  const subcategories = readList(searchParams.get("subcategory"));
  const brands = readList(searchParams.get("brand"));
  const selectedRarities = readList(searchParams.get("rarity"));
  const hasPriceFilter = searchParams.has("maxPrice");
  const maxPrice = Number(searchParams.get("maxPrice") ?? 650_000);
  const sort = searchParams.get("sort") ?? "hoarded";
  const sentinelRef = useRef<HTMLDivElement>(null);

  function setParam(key: string, value?: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function toggleListValue(key: "category" | "subcategory" | "brand" | "rarity", value: string) {
    const current = readList(searchParams.get(key));
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];

    if (key === "category") {
      const params = new URLSearchParams(searchParams.toString());
      if (next.length) params.set("category", next.join(","));
      else params.delete("category");
      params.delete("subcategory");
      params.delete("page");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      return;
    }

    setParam(key, next.join(","));
  }

  const queryKey = useMemo(
    () => ["catalog", search, categories.join(), subcategories.join(), brands.join(), selectedRarities.join(), hasPriceFilter ? maxPrice : null, sort],
    [brands, categories, hasPriceFilter, maxPrice, search, selectedRarities, sort, subcategories],
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useInfiniteQuery({
    queryKey,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const filteredProducts = filterAndSortProducts(
        catalogProducts,
        search,
        categories,
        subcategories,
        brands,
        selectedRarities,
        hasPriceFilter ? maxPrice : null,
        sort,
      );
      const start = pageParam * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      return {
        items: filteredProducts.slice(start, end),
        total: filteredProducts.length,
        nextPage: end < filteredProducts.length ? pageParam + 1 : undefined,
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

  const loadedProducts = data?.pages.flatMap((page) => page.items) ?? [];
  const filteredCount = data?.pages[0]?.total ?? 0;

  const filterProps: FiltersProps = {
    categories,
    subcategories,
    brands,
    selectedRarities,
    maxPrice,
    hasPriceFilter,
    toggleListValue,
    setParam,
    clearFilters: () => router.replace(pathname, { scroll: false }),
  };

  return (
    <div className="mx-auto mb-[60px] mt-8 grid max-w-[1280px] gap-9 px-5 md:px-10 lg:grid-cols-[240px_1fr]">
      <aside className="hidden self-start lg:sticky lg:top-24 lg:block" aria-label="Catalog filters">
        <div className="max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
          <FilterPanel {...filterProps} />
        </div>
      </aside>

      <div className="min-w-0">
        <details className="mb-5 rounded-[14px] border border-line bg-raised p-4 lg:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal className="size-4" /> Filters
          </summary>
          <div className="mt-5 border-t border-line pt-5"><FilterPanel {...filterProps} /></div>
        </details>

        <div className="mb-[22px] flex items-center justify-between gap-4">
          <p className="font-mono text-xs text-ink-dim">{filteredCount} RESULTS · {loadedProducts.length} LOADED</p>
          <select
            aria-label="Sort catalog"
            className="rounded-lg border border-line bg-raised px-3.5 py-2 text-[0.8rem] text-ink"
            onChange={(event) => setParam("sort", event.target.value === "hoarded" ? undefined : event.target.value)}
            value={sort}
          >
            <option value="hoarded">Sort: Most hoarded</option>
            <option value="price">Sort: Price (low to high)</option>
            <option value="newest">Sort: Newest fake arrivals</option>
          </select>
        </div>

        {isPending ? (
          <div className="grid min-h-80 place-items-center font-mono text-xs uppercase tracking-[0.1em] text-ink-dim">
            Locating premium inventory…
          </div>
        ) : loadedProducts.length ? (
          <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
            {loadedProducts.map((product) => <ProductCard product={product} key={product.id} />)}
          </div>
        ) : (
          <div className="grid min-h-80 place-items-center rounded-[14px] border border-dashed border-line-strong bg-raised p-8 text-center">
            <div>
              <p className="font-display text-xl font-bold">No imaginary stock found.</p>
              <p className="mt-2 text-sm text-ink-dim">The filters have become unreasonably specific.</p>
              <Button className="mt-5" variant="outline" onClick={() => router.replace(pathname)}>Clear filters</Button>
            </div>
          </div>
        )}

        {loadedProducts.length > 0 && (
          <div
            ref={sentinelRef}
            className="grid min-h-24 place-items-center pt-8 text-center font-mono text-[0.68rem] uppercase tracking-[0.1em] text-ink-dim"
            aria-live="polite"
          >
            {isFetchingNextPage
              ? "Loading more premium decisions…"
              : hasNextPage
                ? "Scroll for more loot"
                : `All ${filteredCount} products loaded · restraint remains unavailable`}
          </div>
        )}
      </div>
    </div>
  );
}
