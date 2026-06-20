import { NextResponse } from "next/server";
import { triggerMishap } from "@/lib/mishap-engine";
import { isSupabaseConfigured, recordMishapForTrackingToken } from "@/lib/supabase/admin";

export async function POST(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const mishap = triggerMishap(true);
  if (!mishap) return NextResponse.json({ error: "Mishap engine declined" }, { status: 500 });

  if (isSupabaseConfigured()) {
    const recorded = await recordMishapForTrackingToken(token, mishap);
    if (recorded === null) return NextResponse.json({ error: "Tracking token not found" }, { status: 404 });
  }

  return NextResponse.json({ mishap });
}
