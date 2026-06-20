"use client";

import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/utils";
import { AnimatedCartButton } from "./animated-cart-button";
import { MiniCartDrawer } from "./mini-cart-drawer";
import { ProductSearchDialog } from "./product-search-dialog";
import { ThemeToggle } from "./theme-toggle";

const nav = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
  { href: "/deals", label: "Deals" },
  { href: "/collection/gpu-hunters-picks", label: "Collections" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const setOpen = useCartStore((state) => state.setOpen);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => setMounted(true), []);
  const count = mounted ? items.reduce((total, item) => total + item.quantity, 0) : 0;

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    if (href === "/catalog") return pathname === "/catalog" || pathname.startsWith("/product/");
    if (href.startsWith("/collection/")) return pathname.startsWith("/collection/");
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-raised/95 backdrop-blur-xl">
        <div className="page-shell flex h-18 items-center gap-4">
          <Link href="/" className="group flex items-center gap-2 font-display text-xl font-bold tracking-tight">
            <span className="relative size-5 rounded-[4px] border-[1.5px] border-ink transition-transform group-hover:-rotate-6 after:absolute after:inset-[4px] after:rounded-[2px] after:border-[1.5px] after:border-gold" />
            <span>Loot<span className="text-gold">Hoarding</span></span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 lg:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((current) => !current)}
          >
            <Menu className="size-5" />
          </Button>

          <nav className="hidden shrink-0 items-center gap-6 lg:flex" aria-label="Main navigation">
            {nav.map((item) => (
              <Link
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "relative py-2 text-sm font-medium text-ink-dim transition-colors hover:text-ink after:absolute after:inset-x-1 after:-bottom-0.5 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-gold after:transition-transform",
                  isActive(item.href) && "text-ink after:scale-x-100",
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className={cn(
              "hidden h-11 min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-raised px-4 transition-colors hover:border-line-strong md:flex",
              pathname === "/search" && "border-purple bg-purple-fill",
            )}
            aria-label="Open product search"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-4 shrink-0 text-ink-dim" />
            <span className="text-sm text-ink-dim">Search loot</span>
          </button>

          <div className="ml-auto flex shrink-0 items-center gap-1">
            <AnimatedCartButton count={count} onOpen={() => setOpen(true)} />
            <ThemeToggle />
          </div>
        </div>
        {menuOpen && (
          <nav className="page-shell grid gap-1 border-t border-line py-3 lg:hidden" aria-label="Mobile navigation">
            <button
              type="button"
              className="mb-2 flex h-11 items-center gap-2 rounded-[10px] border border-line bg-page px-3 text-left md:hidden"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
            >
              <Search className="size-4 text-ink-dim" />
              <span className="text-sm text-ink-dim">Search loot</span>
            </button>
            {nav.map((item) => (
              <Link
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "rounded-[10px] px-3 py-2.5 text-sm font-medium hover:bg-sunken",
                  isActive(item.href) && "bg-sunken text-ink",
                )}
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
      <ProductSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
