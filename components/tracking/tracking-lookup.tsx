"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function TrackingLookup() {
  const router = useRouter();
  const [token, setToken] = useState("");
  return (
    <main className="grid min-h-[560px] place-items-center px-5">
      <form className="w-full max-w-md rounded-[14px] border border-line bg-card p-7" onSubmit={(event) => { event.preventDefault(); if (token.trim()) router.push(`/track/${encodeURIComponent(token.trim())}`); }}>
        <h1 className="font-display text-2xl font-bold">Track your loot</h1>
        <p className="mb-6 mt-2 text-sm leading-6 text-ink-dim">Enter the tracking token from your order confirmation. The courier may dispute it.</p>
        <label><span className="mb-1.5 block font-mono text-xs text-ink-dim">Tracking token</span><input className="w-full rounded-lg border border-line-strong bg-page px-3.5 py-3 font-mono text-sm" onChange={(event) => setToken(event.target.value)} placeholder="9f2k-88291-trk" value={token} /></label>
        <Button className="mt-4 w-full" type="submit">Track order</Button>
      </form>
    </main>
  );
}
