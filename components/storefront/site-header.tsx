"use client";

import { Menu, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { MiniCartDrawer } from "./mini-cart-drawer";
import { ThemeToggle } from "./theme-toggle";

const nav = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
  { href: "/catalog?deals=true", label: "Deals" },
  { href: "/catalog?collection=all", label: "Collections" },
  { href: "/track", label: "Track order" },
];

export function SiteHeader() {
  const items = useCartStore((state) => state.items);
  const setOpen = useCartStore((state) => state.setOpen);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);
  const count = mounted ? items.reduce((total, item) => total + item.quantity, 0) : 0;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-raised/95 backdrop-blur-xl">
        <div className="page-shell flex h-18 items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-2 font-display text-xl font-bold tracking-tight">
            <span className="relative size-5 rounded-[4px] border-[1.5px] border-ink transition-transform group-hover:-rotate-6 after:absolute after:inset-[4px] after:rounded-[2px] after:border-[1.5px] after:border-gold" />
            <span>Loot<span className="text-gold">Hoarding</span></span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            {nav.map((item) => (
              <Link className="text-sm font-medium text-ink-dim transition-colors hover:text-ink" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href="/catalog"
              className="mr-1 hidden h-10 w-44 items-center gap-2 rounded-full border border-line bg-raised px-4 text-sm text-ink-dim transition-colors hover:border-line-strong md:flex"
            >
              <Search className="size-4" />
              Search loot
            </Link>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative" onClick={() => setOpen(true)}>
              <ShoppingBag className="size-4" />
              {count > 0 && (
                <span className="absolute right-0 top-0 grid min-w-4 place-items-center rounded-full bg-purple px-1 font-mono text-[0.6rem] font-bold text-white">
                  {count}
                </span>
              )}
              <span className="sr-only">Open cart with {count} items</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-expanded={menuOpen}
              aria-label="Toggle navigation"
              onClick={() => setMenuOpen((current) => !current)}
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </div>
        {menuOpen && (
          <nav className="page-shell grid gap-1 border-t border-line py-3 lg:hidden" aria-label="Mobile navigation">
            {nav.map((item) => (
              <Link
                className="rounded-[10px] px-3 py-2.5 text-sm font-medium hover:bg-sunken"
                href={item.href}
                key={item.href}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <MiniCartDrawer />
    </>
  );
}
