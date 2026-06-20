"use client";

import { ArrowRight, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { catalogProducts, featuredProducts, type Product } from "@/lib/products";
import { PriceBlock } from "./price-block";
import { ProductVisual } from "./product-visual";
import { RarityTag } from "./rarity-tag";

const suggestedProducts = [
  ...featuredProducts,
  ...catalogProducts.filter((product) => product.rarity === "legendary"),
]
  .filter((product, index, products) => products.findIndex((candidate) => candidate.id === product.id) === index)
  .slice(0, 6);

function searchScore(product: Product, rawQuery: string) {
  const query = rawQuery.toLowerCase().trim();
  const name = product.name.toLowerCase();
  const brand = product.brand.toLowerCase();
  const category = product.category.toLowerCase();
  const subcategory = product.subcategory.toLowerCase();
  const attributes = product.attributes.join(" ").toLowerCase();
  const haystack = `${name} ${brand} ${category} ${subcategory} ${attributes}`;
  const tokens = query.split(/\s+/).filter(Boolean);

  if (!tokens.every((token) => haystack.includes(token))) return -1;

  let score = tokens.reduce((total, token) => {
    if (name.startsWith(token)) return total + 20;
    if (name.includes(token)) return total + 14;
    if (brand.startsWith(token)) return total + 10;
    if (category.includes(token) || subcategory.includes(token)) return total + 7;
    return total + 3;
  }, 0);

  if (name === query) score += 100;
  if (name.startsWith(query)) score += 45;
  if (brand === query) score += 35;
  return score;
}

export function ProductSearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    if (!query.trim()) return suggestedProducts;
    return catalogProducts
      .map((product, index) => ({ product, index, score: searchScore(product, query) }))
      .filter((result) => result.score >= 0)
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .map((result) => result.product);
  }, [query]);

  const visibleProducts = matches.slice(0, 8);
  const isSearching = Boolean(query.trim());

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/catalog?search=${encodeURIComponent(value)}` : "/catalog");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[min(82vh,720px)] max-w-[760px] overflow-hidden p-0 text-left"
        overlayClassName="bg-ink/45 backdrop-blur-md"
      >
        <div className="flex items-start justify-between gap-5 border-b border-line px-5 py-5 sm:px-6">
          <div>
            <DialogTitle className="text-xl">Find something unnecessary</DialogTitle>
            <DialogDescription className="mt-1">Search the premium inventory. It remains financially harmless.</DialogDescription>
          </div>
          <button
            type="button"
            className="grid size-9 shrink-0 place-items-center rounded-full text-ink-dim hover:bg-sunken hover:text-ink"
            aria-label="Close search"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4" />
          </button>
        </div>

        <form className="border-b border-line px-5 py-4 sm:px-6" onSubmit={submitSearch} role="search">
          <div className="flex h-12 items-center gap-3 rounded-xl border border-line-strong bg-page px-4 focus-within:border-purple focus-within:ring-2 focus-within:ring-purple-fill">
            <Search className="size-5 shrink-0 text-ink-dim" />
            <input
              autoFocus
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-ink-dim focus:outline-none"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try ‘OLED’, ‘Razer’, ‘5090’, or ‘wireless’"
              type="search"
              value={query}
            />
            <span className="hidden font-mono text-[0.62rem] uppercase tracking-[0.06em] text-ink-dim sm:block">Enter to view all</span>
          </div>
        </form>

        <div className="max-h-[calc(min(82vh,720px)-190px)] overflow-y-auto px-5 py-5 sm:px-6">
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <h2 className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.08em] text-ink-dim">
              {isSearching ? `${matches.length} matching products` : "Suggested products"}
            </h2>
            {isSearching && matches.length > visibleProducts.length && (
              <button className="inline-flex items-center gap-1 text-xs font-medium text-purple hover:opacity-75" type="button" onClick={() => {
                router.push(`/catalog?search=${encodeURIComponent(query.trim())}`);
                onOpenChange(false);
              }}>
                View all <ArrowRight className="size-3" />
              </button>
            )}
          </div>

          {visibleProducts.length ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {visibleProducts.map((product) => (
                <Link
                  className="group flex min-w-0 gap-3 rounded-xl border border-transparent p-2.5 transition-colors hover:border-line hover:bg-sunken"
                  href={`/product/${product.slug}`}
                  key={product.id}
                  onClick={() => onOpenChange(false)}
                >
                  <ProductVisual className="size-14 shrink-0 rounded-lg" product={product} showBrand={false} />
                  <div className="min-w-0 flex-1">
                    <RarityTag className="text-[0.56rem] tracking-[0.08em]" rarity={product.rarity} />
                    <h3 className="mt-1 truncate text-[0.8rem] font-semibold group-hover:text-gold">{product.name}</h3>
                    <p className="mt-0.5 truncate text-[0.68rem] text-ink-dim">{product.brand} · {product.subcategory}</p>
                    <PriceBlock className="mt-1.5 gap-x-2" displayPrice={product.displayPrice} size="compact" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid min-h-44 place-items-center rounded-xl border border-dashed border-line-strong bg-page p-6 text-center">
              <div>
                <p className="font-display font-semibold">No imaginary stock found.</p>
                <p className="mt-1 text-xs text-ink-dim">Try fewer words. The products are premium, not literate.</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
