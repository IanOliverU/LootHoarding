import type { Metadata } from "next";
import { TrackingLookup } from "@/components/tracking/tracking-lookup";

export const metadata: Metadata = { title: "Track your loot" };

export default function TrackLookupPage() {
  return <TrackingLookup />;
}
