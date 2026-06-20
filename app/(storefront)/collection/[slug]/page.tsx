import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/storefront/collection-view";
import { getCollection, getCollectionProducts, storeCollections } from "@/lib/collections";

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return storeCollections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);

  if (!collection) return { title: "Collection not found" };

  return {
    title: `${collection.name} | LootHoarding`,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollection(slug);

  if (!collection) notFound();

  return (
    <CollectionView
      collection={collection}
      collections={storeCollections}
      products={getCollectionProducts(collection)}
    />
  );
}
