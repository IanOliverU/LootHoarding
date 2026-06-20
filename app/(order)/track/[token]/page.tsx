import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrackingView } from "@/components/tracking/tracking-view";
import { getOrderByTrackingToken, isSupabaseConfigured } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Track order",
  description: "Live courier tracking, subject to unreasonable events.",
};

export default async function TrackingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const configured = isSupabaseConfigured();
  const serverOrder = await getOrderByTrackingToken(token);
  if (configured && !serverOrder) notFound();
  return <TrackingView token={token} serverOrder={serverOrder} backendConfigured={configured} />;
}
