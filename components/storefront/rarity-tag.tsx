import { cn } from "@/lib/utils";
import type { Rarity } from "@/lib/products";

const rarityColor: Record<Rarity, string> = {
  rare: "text-ink-dim",
  epic: "text-purple",
  legendary: "text-gold",
};

export function RarityTag({ rarity, className }: { rarity: Rarity; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em]",
        rarityColor[rarity],
        className,
      )}
    >
      <span aria-hidden="true">◆</span>
      {rarity}
    </span>
  );
}
