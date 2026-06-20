"use client";

import { Check, CircleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createOrderAction } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useCartStore } from "@/lib/cart-store";
import { useCheckoutStore } from "@/lib/checkout-store";
import { saveLocalOrder, type OrderSnapshot, type PaymentSummary } from "@/lib/orders";

const baseStages = [
  { text: "Authorizing...", sub: "Contacting a financial institution that does not exist", progress: 20 },
  { text: "Provider said yes (lie)...", sub: "No verification was actually performed", progress: 50 },
  { text: "Deducting ₱0.00...", sub: "Nothing is leaving any account, anywhere", progress: 80 },
  { text: "Finalizing...", sub: "Generating paperwork for a payment that never happened", progress: 100 },
];

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function usePaymentProcessor() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const shipping = useCheckoutStore((state) => state.shipping);
  const resetCheckout = useCheckoutStore((state) => state.reset);
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [order, setOrder] = useState<OrderSnapshot | null>(null);
  const [error, setError] = useState("");

  async function process(payment: PaymentSummary) {
    if (processing || !items.length) return;
    setProcessing(true);
    setOrder(null);
    setError("");
    setStageIndex(0);
    setOpen(true);
    try {
      for (let index = 0; index < baseStages.length; index += 1) {
        setStageIndex(index);
        await sleep(900);
      }
      const result = await createOrderAction({ shipping, items, payment });
      if (!result.persisted) saveLocalOrder(result.order);
      setOrder(result.order);
      clearCart();
      resetCheckout();
    } catch {
      setError("The order could not be recorded. The imaginary payment provider has declined to comment.");
    } finally {
      setProcessing(false);
    }
  }

  return { open, setOpen, processing, stageIndex, order, error, process };
}

export function PaymentProcessingDialog({ state }: { state: ReturnType<typeof usePaymentProcessor> }) {
  const router = useRouter();
  const stage = baseStages[state.stageIndex];

  useEffect(() => {
    if (!state.order) return;
    const timer = window.setTimeout(() => {
      router.push(`/order/${state.order?.orderNumber}`);
    }, 1_000);
    return () => window.clearTimeout(timer);
  }, [router, state.order]);

  return (
    <Dialog open={state.open} onOpenChange={(open) => { if (!state.processing) state.setOpen(open); }}>
      <DialogContent onEscapeKeyDown={(event) => { if (state.processing) event.preventDefault(); }} onInteractOutside={(event) => event.preventDefault()}>
        {state.order ? (
          <div>
            <div className="mx-auto mb-5 grid size-[54px] place-items-center rounded-full bg-green text-raised"><Check className="size-6" /></div>
            <DialogTitle>Order placed</DialogTitle>
            <DialogDescription className="mb-6 mt-2 leading-5">Your chosen payment method successfully transferred absolutely nothing.</DialogDescription>
            <Button className="w-full" onClick={() => router.push(`/order/${state.order?.orderNumber}`)}>Continue to order confirmation</Button>
          </div>
        ) : state.error ? (
          <div>
            <div className="mx-auto mb-5 grid size-[54px] place-items-center rounded-full bg-red-fill text-red"><CircleAlert className="size-6" /></div>
            <DialogTitle>Payment wandered off</DialogTitle>
            <DialogDescription className="mb-6 mt-2 leading-5">{state.error}</DialogDescription>
            <Button className="w-full" variant="outline" onClick={() => state.setOpen(false)}>Return to details</Button>
          </div>
        ) : (
          <div>
            <div className="mx-auto mb-[26px] size-[54px] animate-spin rounded-full border-[3px] border-line border-t-gold" />
            <DialogTitle className="font-mono text-sm">{stage.text}</DialogTitle>
            <DialogDescription className="mb-7 mt-2 min-h-4">{stage.sub}</DialogDescription>
            <div className="mb-6 h-1 overflow-hidden rounded-full bg-line"><div className="h-full bg-gold transition-[width] duration-500" style={{ width: `${stage.progress}%` }} /></div>
            <p className="font-mono text-3xl font-bold text-green">₱0.00</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
