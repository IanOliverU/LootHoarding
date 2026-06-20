"use client";

import { Minus, Plus, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PriceBlock } from "@/components/storefront/price-block";
import { ProductVisual } from "@/components/storefront/product-visual";
import { RarityTag } from "@/components/storefront/rarity-tag";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { getProductDescription, getProductSpecs, productReviews } from "@/lib/product-details";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const specs = getProductSpecs(product);
  const description = getProductDescription(product);

  function hoardNow() {
    addItem(product, quantity);
    setCartOpen(false);
    router.push("/checkout");
  }

  return (
    <>
      <div className="mx-auto mt-6 grid max-w-[1280px] gap-10 px-5 md:px-10 lg:grid-cols-[1fr_420px] lg:gap-14">
        <section aria-label="Product gallery">
          <div className="group relative mb-3.5">
            <ProductVisual
              className={cn(
                "aspect-auto h-[340px] rounded-2xl border border-line sm:h-[440px]",
                activeImage === 1 && "[&>svg]:rotate-6",
                activeImage === 2 && "[&>svg]:-rotate-6 [&>svg]:scale-90",
                activeImage === 3 && "[&>svg]:scale-110",
              )}
              product={product}
            />
            <RarityTag className="absolute left-4 top-4" rarity={product.rarity} />
          </div>
          <div className="flex gap-2.5">
            {Array.from({ length: 4 }).map((_, index) => (
              <button
                aria-label={`View product angle ${index + 1}`}
                aria-pressed={activeImage === index}
                className={cn("group size-[72px] overflow-hidden rounded-[10px] border border-line sm:size-[84px]", activeImage === index && "border-[1.5px] border-ink")}
                key={index}
                onClick={() => setActiveImage(index)}
                type="button"
              >
                <ProductVisual
                  className={cn(
                    "size-full rounded-none",
                    index === 1 && "[&>svg]:rotate-6",
                    index === 2 && "[&>svg]:-rotate-6 [&>svg]:scale-90",
                    index === 3 && "[&>svg]:scale-110",
                  )}
                  product={product}
                  showBrand={false}
                />
              </button>
            ))}
          </div>
        </section>

        <section className="pt-1" aria-labelledby="product-title">
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.05em] text-ink-dim">{product.brand}</span>
            <span className="font-mono text-[0.68rem] font-semibold text-red">0 IN STOCK — INFINITE AVAILABILITY</span>
          </div>
          <h1 id="product-title" className="font-display text-[1.75rem] font-bold leading-[1.2] tracking-[-0.01em]">{product.name}</h1>

          <div className="mb-[22px] mt-3 flex flex-wrap items-center gap-2.5">
            <span className="flex gap-0.5 text-gold" aria-label="Five out of five stars">
              {Array.from({ length: 5 }).map((_, index) => <Star className="size-3.5 fill-current" key={index} />)}
            </span>
            <span className="text-[0.8rem] text-ink-dim"><a className="text-ink underline underline-offset-2" href="#reviews">128 reviews</a> · all five stars, none verified</span>
          </div>

          <div className="mb-[22px] rounded-[14px] border border-line p-[22px]">
            <PriceBlock displayPrice={product.displayPrice} size="hero" />
            <p className="mb-[18px] mt-2 text-xs leading-5 text-ink-dim">
              Price drops to zero the moment you add it to cart. This is not a discount. This is the entire business model.
            </p>

            <div className="mb-3.5 flex gap-3">
              <div className="flex shrink-0 items-center overflow-hidden rounded-lg border border-line-strong">
                <button
                  aria-label="Decrease quantity"
                  className="grid h-[42px] w-9 place-items-center bg-page hover:bg-sunken"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  type="button"
                ><Minus className="size-3.5" /></button>
                <span className="w-[42px] text-center font-mono text-sm">{quantity}</span>
                <button
                  aria-label="Increase quantity"
                  className="grid h-[42px] w-9 place-items-center bg-page hover:bg-sunken"
                  onClick={() => setQuantity((current) => Math.min(99, current + 1))}
                  type="button"
                ><Plus className="size-3.5" /></button>
              </div>
              <Button className="flex-1 rounded-lg" onClick={() => addItem(product, quantity)}>Add to cart</Button>
            </div>
            <Button className="w-full rounded-lg" variant="outline" onClick={hoardNow}>Hoard it now (skip cart)</Button>

            <div className="mt-[18px] flex items-start gap-2.5 border-t border-line pt-3.5 text-xs leading-5 text-ink-dim">
              <span className="mt-0.5 text-ink" aria-hidden="true">◆</span>
              <p>Ships from a warehouse that does not exist, to an address we will absolutely lose track of. Estimated arrival: never.</p>
            </div>
          </div>

          <table className="w-full text-[0.8rem]">
            <tbody>
              {specs.map(([label, value]) => (
                <tr className="border-b border-line" key={label}>
                  <td className="w-[40%] py-[9px] text-ink-dim">{label}</td>
                  <td className="py-[9px] font-mono text-[0.78rem]">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <div className="mx-auto my-14 grid max-w-[1280px] gap-14 px-5 md:px-10 lg:grid-cols-[1fr_420px]">
        <section>
          <h2 className="mb-[18px] font-display text-lg font-semibold">Description</h2>
          {description.map((paragraph) => (
            <p className="mb-[18px] text-sm leading-[1.7] text-ink/80" key={paragraph}>{paragraph}</p>
          ))}

          <h2 id="reviews" className="mb-[18px] mt-9 font-display text-lg font-semibold">Reviews (128)</h2>
          {productReviews.map((review, reviewIndex) => (
            <article className={cn("border-t border-line py-[18px]", reviewIndex === 0 && "border-0 pt-0")} key={review.author}>
              <div className="mb-1.5 flex items-center justify-between gap-4">
                <h3 className="text-[0.8rem] font-semibold">{review.author}</h3>
                <time className="font-mono text-[0.68rem] text-ink-dim">{review.date}</time>
              </div>
              <span className="mb-2 flex gap-0.5 text-gold" aria-label="Five out of five stars">
                {Array.from({ length: 5 }).map((_, index) => <Star className="size-3 fill-current" key={index} />)}
              </span>
              <p className="text-[0.8rem] leading-[1.6] text-ink/80">{review.body}</p>
            </article>
          ))}
        </section>
        <div aria-hidden="true" />
      </div>
    </>
  );
}
