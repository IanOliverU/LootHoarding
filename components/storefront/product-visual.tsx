import { Cpu, Gamepad2, Headphones, Keyboard, Monitor, Mouse } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/products";

const icons = {
  gpu: Cpu,
  keyboard: Keyboard,
  handheld: Gamepad2,
  monitor: Monitor,
  headset: Headphones,
  mouse: Mouse,
};

const treatments: Record<Product["rarity"], string> = {
  rare: "bg-sunken text-ink-dim",
  epic: "bg-purple-fill text-purple",
  legendary: "bg-gold-fill text-gold",
};

export function ProductVisual({ product, className, showBrand = true }: { product: Product; className?: string; showBrand?: boolean }) {
  const Icon = icons[product.icon];
  return (
    <div
      className={cn(
        "subtle-grid relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl",
        treatments[product.rarity],
        className,
      )}
    >
      <div className="absolute inset-7 rounded-full bg-current opacity-[0.06] blur-xl" />
      <Icon className="relative size-[38%] max-h-20 max-w-20 stroke-[1.15] drop-shadow-sm transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2" />
      {showBrand && (
        <span className="absolute bottom-3 right-3 font-mono text-[0.6rem] font-bold uppercase tracking-[0.2em] opacity-55">
          {product.brand}
        </span>
      )}
    </div>
  );
}
