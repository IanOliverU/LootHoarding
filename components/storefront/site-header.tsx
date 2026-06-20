"use client";

import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { AnimatedCartButton } from "./animated-cart-button";
import { MiniCartDrawer } from "./mini-cart-drawer";
import { ThemeToggle } from "./theme-toggle";

const nav = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
  { href: "/deals", label: "Deals" },
  { href: "/collection/gpu-hunters-picks", label: "Collections" },
];

export function SiteHeader() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const setOpen = useCartStore((state) => state.setOpen);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => setMounted(true), []);
  const count = mounted ? items.reduce((total, item) => total + item.quantity, 0) : 0;

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim();
    router.push(query ? `/catalog?search=${encodeURIComponent(query)}` : "/catalog");
    setMenuOpen(false);
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
              <Link className="text-sm font-medium text-ink-dim transition-colors hover:text-ink" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <form
            className="hidden h-11 min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-raised px-4 transition-colors focus-within:border-line-strong md:flex"
            onSubmit={submitSearch}
            role="search"
          >
            <Search className="size-4 shrink-0 text-ink-dim" />
            <input
              aria-label="Search loot"
              className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-ink-dim focus:outline-none"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search loot"
              type="search"
              value={search}
            />
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-1">
            <AnimatedCartButton count={count} onOpen={() => setOpen(true)} />
            <ThemeToggle />
          </div>
        </div>
        {menuOpen && (
          <nav className="page-shell grid gap-1 border-t border-line py-3 lg:hidden" aria-label="Mobile navigation">
            <form className="mb-2 flex h-11 items-center gap-2 rounded-[10px] border border-line bg-page px-3 md:hidden" onSubmit={submitSearch} role="search">
              <Search className="size-4 text-ink-dim" />
              <input
                aria-label="Search loot"
                className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-ink-dim focus:outline-none"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search loot"
                type="search"
                value={search}
              />
            </form>
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
