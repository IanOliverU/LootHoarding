import type { Metadata } from "next";
import Link from "next/link";
import { SearchResults } from "@/components/storefront/search-results";

export const metadata: Metadata = {
  title: "Search | LootHoarding",
  description: "Search the premium imaginary inventory.",
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;

  return (
    <main className="mx-auto max-w-[1280px] px-5 pb-[60px] pt-10 md:px-10">
      <nav className="mb-3.5 font-mono text-[0.68rem] tracking-[0.03em] text-ink-dim" aria-label="Breadcrumb">
        <Link className="hover:text-ink" href="/">HOME</Link> / SEARCH
      </nav>
      <h1 className="font-display text-[2rem] font-bold tracking-[-0.01em]">Search results</h1>
      <p className="mt-1.5 text-sm text-ink-dim">
        {q.trim() ? <>Showing premium loot matching “<span className="font-medium text-ink">{q.trim()}</span>”</> : "No keywords supplied yet."}
      </p>
      <section className="mt-8" aria-label="Search results">
        <SearchResults query={q} />
      </section>
    </main>
  );
}
