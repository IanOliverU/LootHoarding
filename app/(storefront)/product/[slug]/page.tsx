import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/storefront/product-detail";
import { catalogProducts } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return catalogProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = catalogProducts.find((candidate) => candidate.slug === slug);

  if (!product) return { title: "Loot not found" };

  return {
    title: product.name,
    description: `${product.name} by ${product.brand}. Final price: ₱0.00, as accounting intended.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = catalogProducts.find((candidate) => candidate.slug === slug);

  if (!product) notFound();

  return (
    <main>
      <nav className="mx-auto max-w-[1280px] px-5 pt-6 font-mono text-[0.68rem] tracking-[0.03em] text-ink-dim md:px-10" aria-label="Breadcrumb">
        <Link className="hover:text-ink" href="/">HOME</Link>
        <span aria-hidden="true"> / </span>
        <Link className="hover:text-ink" href="/catalog">CATALOG</Link>
        <span aria-hidden="true"> / </span>
        <Link className="hover:text-ink" href={`/catalog?category=${product.categorySlug}`}>{product.category.toUpperCase()}</Link>
        <span aria-hidden="true"> / </span>
        <span className="text-ink">{product.name.toUpperCase()}</span>
      </nav>
      <ProductDetail product={product} />
    </main>
  );
}
