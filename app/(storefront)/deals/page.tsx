import type { Metadata } from "next";
import { DealsView } from "@/components/storefront/deals-view";

export const metadata: Metadata = {
  title: "Flash Deals | LootHoarding",
  description: "Every timer is lying. Every product is still free.",
};

export default function DealsPage() {
  return <DealsView />;
}
