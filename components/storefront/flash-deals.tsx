"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { featuredProducts, type Product } from "@/lib/products";
import { PriceBlock } from "./price-block";
import { ProductVisual } from "./product-visual";

const dealMeta = [
  { seed: 9_678, discount: "-100% TODAY ONLY (EVERY DAY)" },
  { seed: 4_132, discount: "-100% WHILE SUPPLIES IMAGINARY" },
  { seed: 17_703, discount: "-100% FLASH HOARD" },
  { seed: 1_967, discount: "-100% LAST CHANCE (THERE IS NO CHANCE)" },
  { seed: 11_970, discount: "-100% DOORBUSTER" },
];

function formatTime(total: number) {
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

function GlitchTimer({ seed, index }: { seed: number; index: number }) {
  const [remaining, setRemaining] = useState(seed);
  const [glitched, setGlitched] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const roll = Math.random();
      if (roll < 0.06) {
        setGlitched(true);
        window.setTimeout(() => setGlitched(false), 550);
        return;
      }
      setRemaining((current) => {
        if (current <= 1) return seed;
        if (roll < 0.16) return Math.min(seed + 1800, current + 73);
        if (roll < 0.24) return Math.max(1, current - 47);
        return current - 1;
      });
    }, 1000 + index * 130);
    return () => window.clearInterval(interval);
  }, [seed]);

  return (
    <span className={`font-mono text-[0.68rem] font-bold tabular-nums ${glitched ? "text-red" : "text-page"}`}>
      {glitched ? "??:??:??" : formatTime(remaining)}
    </span>
  );
}

function DealCard({ product, index }: { product: Product; index: number }) {
  const meta = dealMeta[index];
  return (
    <article className="mr-[18px] min-w-0 flex-[0_0_260px] overflow-hidden rounded-[14px] border border-line bg-card transition-all hover:-translate-y-[3px] hover:shadow-soft">
      <div className="flex items-center gap-2 bg-ink px-3 py-[7px] font-mono text-[0.68rem] font-semibold text-page">
        <span className="size-1.5 animate-pulse rounded-full bg-red" />
        ENDING SOON · <GlitchTimer seed={meta.seed} index={index} />
      </div>
      <ProductVisual product={product} className="aspect-auto h-[140px] rounded-none border-b border-line" />
      <div className="p-[14px]">
        <div className="font-mono text-[0.62rem] font-bold text-red">
          {meta.discount}
        </div>
        <h3 className="mt-1.5 min-h-[34px] text-[0.84rem] font-semibold leading-snug">{product.name}</h3>
        <div className="mt-2.5">
          <PriceBlock displayPrice={product.displayPrice} size="compact" />
        </div>
      </div>
    </article>
  );
}

export function FlashDeals() {
  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true }, [autoplay.current]);

  return (
    <section className="page-shell py-14" aria-labelledby="flash-deals-title">
      <div>
        <div className="mb-8 flex items-end justify-between gap-5">
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.06em] text-purple">Ends in 03:14:09</p>
            <h2 id="flash-deals-title" className="mt-1.5 font-display text-2xl font-bold">
              Flash “deals”
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <Button variant="outline" size="icon" onClick={() => emblaApi?.scrollPrev()} aria-label="Previous deals">
              <ArrowLeft className="size-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => emblaApi?.scrollNext()} aria-label="Next deals">
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {featuredProducts.map((product, index) => (
              <DealCard product={product} index={index} key={product.id} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
