import Link from "next/link";
import { ThemeToggle } from "@/components/storefront/theme-toggle";

export function OrderHeader() {
  return (
    <header className="border-b border-line bg-raised">
      <div className="mx-auto flex h-18 max-w-[1000px] items-center justify-between gap-4 px-5 md:px-10">
        <Link href="/" className="group flex items-center gap-2 font-display text-xl font-bold tracking-tight">
          <span className="relative size-5 rounded-[4px] border-[1.5px] border-ink transition-transform group-hover:-rotate-6 after:absolute after:inset-[4px] after:rounded-[2px] after:border-[1.5px] after:border-gold" />
          <span>Loot<span className="text-gold">Hoarding</span></span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
