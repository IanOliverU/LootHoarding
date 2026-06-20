"use client";

import { useQuery } from "@tanstack/react-query";
import { TriangleAlert, Zap } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getLocalOrderByTrackingToken, type OrderSnapshot, updateLocalOrderMishap } from "@/lib/orders";
import { cn } from "@/lib/utils";
import { TrackingMap } from "./tracking-map";

export function TrackingView({ token, serverOrder, backendConfigured }: { token: string; serverOrder: OrderSnapshot | null; backendConfigured: boolean }) {
  const [localOrder, setLocalOrder] = useState<OrderSnapshot | null>(null);
  const [resolved, setResolved] = useState(backendConfigured || Boolean(serverOrder));
  const [eta, setEta] = useState(14);
  const [arrived, setArrived] = useState(false);
  const [showMishap, setShowMishap] = useState(false);
  const [forcedMishap, setForcedMishap] = useState<OrderSnapshot["mishap"]>(null);
  const [triggeringMishap, setTriggeringMishap] = useState(false);
  const [mishapError, setMishapError] = useState("");

  const query = useQuery<OrderSnapshot | null>({
    queryKey: ["tracking", token],
    enabled: backendConfigured,
    initialData: serverOrder,
    refetchInterval: 10_000,
    queryFn: async () => {
      const response = await fetch(`/api/track/${encodeURIComponent(token)}`, { cache: "no-store" });
      if (!response.ok) return null;
      return response.json() as Promise<OrderSnapshot>;
    },
  });

  const storedOrder = query.data ?? localOrder;
  const order = storedOrder ? { ...storedOrder, mishap: forcedMishap ?? storedOrder.mishap } : null;

  useEffect(() => {
    if (!backendConfigured) {
      setLocalOrder(getLocalOrderByTrackingToken(token));
      setResolved(true);
    }
  }, [backendConfigured, token]);

  useEffect(() => {
    const mishap = order?.mishap;
    if (!mishap || mishap.resolvedAt) return setShowMishap(false);
    const remaining = Math.max(0, 6_000 - (Date.now() - new Date(mishap.triggeredAt).getTime()));
    if (!remaining) return setShowMishap(false);
    setShowMishap(true);
    const timer = window.setTimeout(() => setShowMishap(false), remaining);
    return () => window.clearTimeout(timer);
  }, [order?.mishap]);

  const updateProgress = useCallback((minutes: number, isArrived: boolean) => {
    setEta(minutes);
    setArrived(isArrived);
  }, []);

  async function forceMishap() {
    if (!order || triggeringMishap) return;
    setTriggeringMishap(true);
    setMishapError("");
    try {
      const response = await fetch(`/api/track/${encodeURIComponent(token)}/mishap`, { method: "POST" });
      if (!response.ok) throw new Error("Mishap request failed");
      const result = await response.json() as { mishap: NonNullable<OrderSnapshot["mishap"]> };
      setForcedMishap(result.mishap);
      if (!backendConfigured) {
        const updated = updateLocalOrderMishap(token, result.mishap);
        if (updated) setLocalOrder(updated);
      } else {
        void query.refetch();
      }
    } catch {
      setMishapError("The chaos engine is temporarily behaving itself.");
    } finally {
      setTriggeringMishap(false);
    }
  }

  if (!resolved) return <main className="grid min-h-[560px] place-items-center font-mono text-xs text-ink-dim">LOCATING COURIER…</main>;
  if (!order) {
    return (
      <main className="grid min-h-[560px] place-items-center px-6 text-center"><div><h1 className="font-display text-2xl font-bold">Tracking token not found</h1><p className="mt-2 text-sm text-ink-dim">The courier denies ever seeing it.</p><Button className="mt-6" asChild><Link href="/track">Try another token</Link></Button></div></main>
    );
  }

  const destination = `${order.shipping.city}, ${order.shipping.province}`;
  const status = showMishap ? "Mishap in progress" : arrived ? "Arrived (allegedly)" : "En route";
  const createdAt = new Date(order.createdAt);
  const time = (offsetMinutes: number) => new Intl.DateTimeFormat("en-PH", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Manila" }).format(new Date(createdAt.getTime() + offsetMinutes * 60_000));

  return (
    <main>
      <header className="mx-auto max-w-[1180px] px-5 pt-7 md:px-10">
        <p className="mb-3 font-mono text-[0.68rem] text-ink-dim">ORDER {order.orderNumber}</p>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><h1 className="font-display text-[1.62rem] font-bold">Tracking your loot</h1><p className="mt-1.5 text-[0.8rem] text-ink-dim">Last updated just now · token: {token}</p></div>
          <div className={cn("flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[0.72rem] font-semibold", showMishap ? "border-red bg-red-fill text-red" : "border-green bg-green-fill text-green")}><span className={cn("size-[7px] animate-pulse rounded-full", showMishap ? "bg-red" : "bg-green")} />{status}</div>
        </div>
      </header>

      <div className="mx-auto mb-[60px] mt-[22px] grid max-w-[1180px] gap-7 px-5 md:px-10 lg:grid-cols-[1fr_360px]">
        <section className="relative h-[420px] overflow-hidden rounded-[14px] border border-line sm:h-[480px]" aria-label="Live shipment map">
          {showMishap && order.mishap && (
            <div className="absolute left-3.5 right-3.5 top-3.5 z-[500] flex items-center gap-2.5 rounded-[10px] bg-red px-4 py-3 text-[0.8rem] font-semibold text-white shadow-soft"><TriangleAlert className="size-4 shrink-0" />{order.mishap.text}</div>
          )}
          <TrackingMap paused={showMishap} onProgress={updateProgress} />
        </section>

        <aside className="flex flex-col gap-5">
          <section className="rounded-[14px] border border-line bg-card p-[22px]">
            <h2 className="mb-4 font-display text-[0.94rem] font-semibold">Shipment details</h2>
            <MetaRow label="Courier" value={'"Bites" (scooter, unlicensed)'} />
            <MetaRow label="Origin" value="Joke Warehouse #4" />
            <MetaRow label="Destination" value={destination} />
            <MetaRow label="ETA" value={showMishap ? "???" : arrived ? "0 min" : `${eta} min`} last />
          </section>

          <section className="rounded-[14px] border border-line bg-card p-[22px]">
            <h2 className="mb-4 font-display text-[0.94rem] font-semibold">Status timeline</h2>
            <TimelineItem title="Order confirmed" detail={time(0)} />
            <TimelineItem title="Left the warehouse that doesn’t exist" detail={time(9)} />
            <TimelineItem title="Courier en route" detail={time(12)} />
            {order.mishap && <TimelineItem title={order.mishap.text} detail="mishap recorded" mishap />}
            <TimelineItem title={arrived ? "Arrived (allegedly)" : "Arriving (never)"} detail={arrived ? "just now" : "pending"} pending={!arrived} last />
          </section>

          <button
            className="flex w-full items-center justify-center gap-2 rounded-[9px] border border-dashed border-line-strong bg-transparent px-3 py-3 font-mono text-[0.75rem] text-ink-dim transition-colors hover:border-red hover:text-red disabled:cursor-wait disabled:opacity-60"
            disabled={triggeringMishap || showMishap}
            onClick={forceMishap}
            type="button"
          >
            <Zap className="size-3.5" />
            {triggeringMishap ? "Consulting chaos engine…" : "Force a mishap (15% normally, 100% here)"}
          </button>
          {mishapError && <p className="-mt-3 text-center text-xs text-red">{mishapError}</p>}
        </aside>
      </div>
    </main>
  );
}

function MetaRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return <div className={cn("flex justify-between gap-4 border-b border-line py-2 text-[0.8rem]", last && "border-0")}><span className="text-ink-dim">{label}</span><span className="max-w-[65%] text-right font-mono text-[0.75rem] font-semibold">{value}</span></div>;
}

function TimelineItem({ title, detail, pending = false, mishap = false, last = false }: { title: string; detail: string; pending?: boolean; mishap?: boolean; last?: boolean }) {
  return (
    <div className={cn("relative flex gap-3 pb-[18px] before:absolute before:bottom-0 before:left-[5px] before:top-4 before:w-px before:bg-line", last && "pb-0 before:hidden")}>
      <span className={cn("mt-0.5 size-[11px] shrink-0 rounded-full border-2 border-card bg-green shadow-[0_0_0_1px_var(--green)]", pending && "bg-line shadow-[0_0_0_1px_var(--border-strong)]", mishap && "bg-red shadow-[0_0_0_1px_var(--red)]")} />
      <div className={pending ? "text-ink-dim" : ""}><p className="text-[0.8rem] font-semibold leading-5">{title}</p><p className="font-mono text-[0.68rem] text-ink-dim">{detail}</p></div>
    </div>
  );
}
