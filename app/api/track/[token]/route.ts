import { NextResponse } from "next/server";
import { getOrderByTrackingToken } from "@/lib/supabase/admin";

export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const order = await getOrderByTrackingToken(token);
  if (!order) return NextResponse.json({ error: "Tracking token not found" }, { status: 404 });
  return NextResponse.json(order, { headers: { "Cache-Control": "no-store" } });
}
