import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CatalogView } from "@/components/storefront/catalog-view";

export const metadata: Metadata = {
  title: "Full catalog",
  description: "Every imaginary listing, priced with unusual restraint.",
};

export default function CatalogPage() {
  return (
    <main>
      <header className="mx-auto max-w-[1280px] px-5 pt-10 md:px-10">
        <nav className="mb-3.5 font-mono text-[0.68rem] tracking-[0.03em] text-ink-dim" aria-label="Breadcrumb">
          <Link className="hover:text-ink" href="/">HOME</Link> / CATALOG
        </nav>
        <h1 className="font-display text-[2rem] font-bold tracking-[-0.01em]">Full catalog</h1>
        <p className="mt-1.5 text-sm text-ink-dim">120 listings, all imaginary, all yours</p>
      </header>
      <Suspense fallback={<div className="mx-auto min-h-[600px] max-w-[1280px] px-10 py-8 font-mono text-xs text-ink-dim">LOCATING INVENTORY…</div>}>
        <CatalogView />
      </Suspense>
    </main>
  );
}
