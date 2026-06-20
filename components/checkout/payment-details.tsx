"use client";

import { ArrowLeft, Gem, Paperclip, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CheckoutProgress } from "@/components/checkout/checkout-progress";
import { PaymentProcessingDialog, usePaymentProcessor } from "@/components/checkout/payment-processing";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { hasCompleteShipping, type PaymentMethod, useCheckoutStore } from "@/lib/checkout-store";
import type { PaymentSummary } from "@/lib/orders";
import { cn } from "@/lib/utils";

const inputClass = "w-full rounded-[9px] border border-line-strong bg-page px-3.5 py-3 text-sm text-ink outline-none transition-colors focus:border-purple";

const finalLabels: Record<PaymentMethod, string> = {
  card: "Card details",
  gcash: "GCash details",
  bank: "Bank details",
  hoardcoin: "HoardCoin",
};

export function PaymentDetails({ method }: { method: PaymentMethod }) {
  const hydrated = useCheckoutStore((state) => state.hydrated);
  const shipping = useCheckoutStore((state) => state.shipping);
  const items = useCartStore((state) => state.items);
  const processor = usePaymentProcessor();
  const paymentIsActive = processor.open || processor.processing || Boolean(processor.order);

  if (!hydrated) return <main className="grid min-h-[520px] place-items-center font-mono text-xs text-ink-dim">ASSEMBLING PAYMENT THEATER…</main>;
  if ((!hasCompleteShipping(shipping) || !items.length) && !paymentIsActive) {
    return (
      <main className="grid min-h-[520px] place-items-center px-6 text-center">
        <div><h1 className="font-display text-2xl font-bold">Checkout details missing</h1><p className="mt-2 text-sm text-ink-dim">Shipping and at least one unnecessary item are required.</p><Button className="mt-6" asChild><Link href="/checkout">Return to shipping</Link></Button></div>
      </main>
    );
  }

  return (
    <main>
      <CheckoutProgress current={3} finalLabel={finalLabels[method]} />
      {method === "card" && <CardPayment onPay={processor.process} processing={processor.processing} />}
      {method === "gcash" && <GCashPayment onPay={processor.process} processing={processor.processing} />}
      {method === "bank" && <BankPayment onPay={processor.process} processing={processor.processing} />}
      {method === "hoardcoin" && <HoardCoinPayment onPay={processor.process} processing={processor.processing} />}
      <PaymentProcessingDialog state={processor} />
    </main>
  );
}

function PaymentShell({ title, subtitle, children, width = "max-w-[520px]" }: { title: string; subtitle?: string; children: React.ReactNode; width?: string }) {
  return (
    <div className={cn("mx-auto mb-[70px] mt-9 px-5 md:px-10", width)}>
      <Link className="mb-[18px] inline-flex items-center gap-1.5 text-[0.78rem] text-ink-dim hover:text-ink" href="/checkout/payment"><ArrowLeft className="size-3.5" /> other methods</Link>
      <h1 className="font-display text-[1.38rem] font-bold">{title}</h1>
      {subtitle && <p className="mb-[26px] mt-1.5 text-[0.8rem] leading-5 text-ink-dim">{subtitle}</p>}
      {!subtitle && <div className="mb-[26px]" />}
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-1.5 block font-mono text-xs tracking-[0.02em] text-ink-dim">{children}</span>;
}

function CardPayment({ onPay, processing }: PaymentProps) {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [error, setError] = useState("");
  const digits = number.replace(/\D/g, "");
  const padded = digits.padEnd(16, "•");
  const groups = [padded.slice(0, 4), padded.slice(4, 8), padded.slice(8, 12), padded.slice(12, 16)];

  function autofill() {
    setNumber("4242 4242 4242 4242"); setName("TEST HOARDER"); setExpiry("12/29"); setCvv("420"); setFlipped(false); setError("");
  }
  function pay() {
    if (digits.length !== 16 || !name.trim() || expiry.length !== 5 || cvv.length < 3) return setError("Complete the entirely fictional card details first.");
    onPay({ method: "card", label: `LootHoardCard •••• ${digits.slice(-4)}`, reference: digits.slice(-4) });
  }

  return (
    <PaymentShell title="Pay by card">
      <div className="mx-auto mb-[30px] w-full max-w-[420px] [perspective:1100px]">
        <div className={cn("payment-card-3d relative aspect-[1.586] w-full", flipped && "is-flipped")}>
          <div className="payment-card-face loot-card-front absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[18px] p-6 shadow-soft sm:px-7">
            <div className="relative z-10 flex items-start justify-between"><span className="loot-card-chip h-7 w-[38px] rounded-md" /><span className="flex items-center gap-1.5 font-display text-base font-bold text-[var(--card-gold-bright)]"><span className="loot-card-brand-mark" />LootHoardCard</span></div>
            <div className="relative z-10 flex gap-2 font-mono text-[clamp(0.74rem,3.4vw,1.2rem)] tracking-[0.08em] sm:gap-3.5">{groups.map((group, index) => <span className={group.includes("•") ? "opacity-50" : "opacity-95"} key={index}>{group}</span>)}</div>
            <div className="relative z-10 flex items-end justify-between gap-3 font-mono"><div className="min-w-0 flex-1"><p className="text-[0.58rem] uppercase tracking-[0.08em] opacity-65">cardholder</p><p className="truncate text-sm tracking-[0.04em]">{name.toUpperCase() || "YOUR NAME HERE"}</p></div><div className="text-right"><p className="text-[0.58rem] uppercase tracking-[0.08em] opacity-65">expires</p><p className="text-sm">{expiry || "MM/YY"}</p></div></div>
          </div>
          <div className="payment-card-face payment-card-back loot-card-back absolute inset-0 flex flex-col overflow-hidden rounded-[18px] shadow-soft">
            <div className="mt-[18%] h-[16%] bg-[var(--card-stripe)]" />
            <div className="flex flex-1 flex-col gap-3 px-6 py-[18px]"><div className="loot-card-signature flex h-[34px] items-center justify-end rounded-md pr-3.5"><span className="min-w-12 rounded border-[1.5px] border-[var(--card-gold-bright)] bg-white px-2.5 py-1.5 text-center font-mono text-sm tracking-[0.1em] text-[var(--card-surface-mid)]">{cvv.padEnd(3, "·") || "···"}</span></div><p className="text-right font-mono text-[0.52rem] opacity-70">security code</p><p className="mt-auto text-[0.65rem] leading-4 opacity-80">LootHoardCard — 100% fictional, worth nothing. Not the number, not the limit. <span className="text-[var(--card-gold-bright)]">(Spent $0 for everything)</span></p></div>
          </div>
        </div>
      </div>

      <button className="mb-[18px] flex w-full items-center justify-center gap-2 rounded-[10px] border-[1.5px] border-dashed border-purple bg-purple-fill p-[13px] text-[0.84rem] font-semibold text-purple" onClick={autofill} type="button"><Sparkles className="size-4" /> autofill</button>
      <div className="space-y-4">
        <label><FieldLabel>Card number</FieldLabel><input className={inputClass} inputMode="numeric" maxLength={19} onChange={(event) => { const value = event.target.value.replace(/\D/g, "").slice(0, 16); setNumber(value.replace(/(.{4})/g, "$1 ").trim()); setError(""); }} onFocus={() => setFlipped(false)} placeholder="1234 5678 9012 3456" value={number} /></label>
        <label><FieldLabel>Name on card</FieldLabel><input className={inputClass} maxLength={24} onChange={(event) => setName(event.target.value)} onFocus={() => setFlipped(false)} placeholder="YOUR NAME HERE" value={name} /></label>
        <div className="grid grid-cols-2 gap-3.5">
          <label><FieldLabel>Expiry MM/YY</FieldLabel><input className={inputClass} maxLength={5} onChange={(event) => { let value = event.target.value.replace(/\D/g, "").slice(0, 4); if (value.length >= 3) value = `${value.slice(0, 2)}/${value.slice(2)}`; setExpiry(value); }} onFocus={() => setFlipped(false)} placeholder="MM/YY" value={expiry} /></label>
          <label><FieldLabel>CVV</FieldLabel><input className={inputClass} inputMode="numeric" maxLength={4} onBlur={() => setFlipped(false)} onChange={(event) => setCvv(event.target.value.replace(/\D/g, "").slice(0, 4))} onFocus={() => setFlipped(true)} placeholder="123" value={cvv} /></label>
        </div>
      </div>
      {error && <p className="mt-3 text-center text-xs text-red">{error}</p>}
      <Button className="mt-5 w-full rounded-[11px] py-[15px] text-[0.94rem]" disabled={processing} onClick={pay}>Confirm payment — ₱0.00</Button>
      <p className="mt-3 text-center text-[0.72rem] text-ink-dim">Put any number you want. No one is getting charged.</p>
    </PaymentShell>
  );
}

const gcashStatuses = [
  ["Waiting for scan...", "This QR code resolves to absolutely nothing."],
  ["Scan detected...", "Probably. Hard to say, honestly."],
  ["Verifying with GCash...", "GCash has not been contacted."],
  ["Almost there...", "There is no “there.”"],
  ["Re-waiting for scan...", "Back to square one. As intended."],
];

function GCashPayment({ onPay, processing }: PaymentProps) {
  const [status, setStatus] = useState(0);
  const [mobile, setMobile] = useState("");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { const timer = window.setInterval(() => setStatus((value) => (value + 1) % gcashStatuses.length), 3_200); return () => window.clearInterval(timer); }, []);
  const qrCells = useMemo(() => Array.from({ length: 81 }, (_, index) => ((index * 7 + Math.floor(index / 9) * 3) % 11) > 4), []);

  function pay() {
    const digits = mobile.replace(/\D/g, "");
    if (digits.length < 10 || !reference.trim()) return setError("Add a plausible mobile and made-up reference number.");
    onPay({ method: "gcash", label: `GCash •••• ${digits.slice(-4)}`, reference });
  }
  return (
    <PaymentShell title="Pay by GCash" subtitle="Scan the code below. It will never finish scanning, by design." width="max-w-[480px]">
      <div className="mb-[22px] rounded-2xl border border-line bg-card p-8 text-center">
        <div className="relative mx-auto mb-[18px] grid size-[220px] place-items-center overflow-hidden rounded-[14px] border-2 border-gold bg-gold-fill"><div className="grid size-[170px] grid-cols-9 grid-rows-9 gap-0.5">{qrCells.map((on, index) => <span className={cn("rounded-[1px]", on && "bg-ink")} key={index} />)}</div><span className="absolute left-[8%] right-[8%] top-[10%] h-[3px] animate-[qrscan_2.4s_ease-in-out_infinite] bg-purple shadow-[0_0_12px_var(--purple)]" /></div>
        <p className="flex items-center justify-center gap-2 font-mono text-xs text-purple"><span className="size-1.5 animate-pulse rounded-full bg-purple" />{gcashStatuses[status][0]}</p><p className="mt-1.5 text-[0.72rem] text-ink-dim">{gcashStatuses[status][1]}</p>
      </div>
      <div className="my-[26px] flex items-center gap-3 text-xs text-ink-dim before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">or enter manually</div>
      <div className="space-y-4"><label><FieldLabel>GCash mobile number</FieldLabel><input className={inputClass} inputMode="numeric" maxLength={13} onChange={(event) => setMobile(event.target.value)} placeholder="09XX XXX XXXX" value={mobile} /></label><label><FieldLabel>Reference number (made up is fine)</FieldLabel><input className={inputClass} onChange={(event) => setReference(event.target.value)} placeholder="e.g. 8842091193" value={reference} /></label></div>
      {error && <p className="mt-3 text-center text-xs text-red">{error}</p>}
      <Button className="mt-[22px] w-full rounded-[11px] py-[15px] text-[0.94rem]" disabled={processing} onClick={pay}>Confirm payment — ₱0.00</Button><p className="mt-3 text-center text-[0.72rem] text-ink-dim">We will pretend to verify this for a believable amount of time.</p>
      <style>{`@keyframes qrscan { 0%,100% { top:10%; opacity:.2 } 50% { top:88%; opacity:1 } }`}</style>
    </PaymentShell>
  );
}

function BankPayment({ onPay, processing }: PaymentProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [reference, setReference] = useState("");
  const [fileName, setFileName] = useState("");
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");
  function copy(value: string) { navigator.clipboard?.writeText(value).catch(() => undefined); setCopied(value); window.setTimeout(() => setCopied(""), 1_500); }
  function pay() { if (!reference.trim() || !fileName) return setError("Add a reference and upload literally anything as proof."); onPay({ method: "bank", label: "Banco de Nada transfer", reference }); }
  return (
    <PaymentShell title="Pay by bank transfer" subtitle="Transfer to the account below, then upload literally anything as proof.">
      <div className="mb-[22px] rounded-2xl border border-line bg-card p-6"><BankRow label="Bank" value="Banco de Nada" /><BankRow label="Account name" value="LootHoarding Holdings Inc." /><BankRow label="Account number" value="0000-0000-00" copy={() => copy("0000-0000-00")} copied={copied === "0000-0000-00"} /><BankRow label="Swift code" value="NADAPHXX" copy={() => copy("NADAPHXX")} copied={copied === "NADAPHXX"} last /></div>
      <div className="mb-[22px] flex items-center justify-between rounded-xl border border-gold bg-gold-fill px-[18px] py-4"><span className="text-[0.78rem]">Amount to transfer</span><span className="font-mono text-xl font-bold text-green">₱0.00</span></div>
      <label><FieldLabel>Reference number (made up is fine)</FieldLabel><input className={inputClass} onChange={(event) => setReference(event.target.value)} placeholder="e.g. BDN-88291-XYZ" value={reference} /></label>
      <input className="hidden" onChange={(event) => { setFileName(event.target.files?.[0]?.name ?? ""); setError(""); }} ref={fileInput} type="file" />
      <button className={cn("mt-[22px] w-full rounded-xl border-[1.5px] border-dashed border-line-strong px-5 py-[30px] text-center transition-colors hover:border-purple hover:bg-purple-fill", fileName && "border-green bg-green-fill")} onClick={() => fileInput.current?.click()} type="button"><Paperclip className="mx-auto mb-2 size-5" /><span className="block text-[0.8rem] font-semibold">{fileName || "Upload proof of payment"}</span><span className="mt-1 block text-[0.72rem] text-ink-dim">{fileName ? "Accepted. We did not open this file." : "Any screenshot works. We’re not checking."}</span></button>
      {error && <p className="mt-3 text-center text-xs text-red">{error}</p>}
      <Button className="mt-[22px] w-full rounded-[11px] py-[15px] text-[0.94rem]" disabled={processing} onClick={pay}>Confirm transfer — ₱0.00</Button><p className="mt-3 text-center text-[0.72rem] text-ink-dim">Allow 3–5 imaginary business days for non-processing.</p>
    </PaymentShell>
  );
}

function BankRow({ label, value, copy, copied, last = false }: { label: string; value: string; copy?: () => void; copied?: boolean; last?: boolean }) {
  return <div className={cn("flex items-center gap-3 border-b border-line py-[13px] first:pt-0", last && "border-0 pb-0")}><span className="shrink-0 font-mono text-[0.7rem] uppercase tracking-[0.04em] text-ink-dim">{label}</span><span className="ml-auto text-right font-mono text-[0.8rem] font-semibold">{value}</span>{copy && <button className={cn("rounded-md border border-line-strong bg-page px-2.5 py-1 font-mono text-[0.64rem] text-ink-dim", copied && "border-green text-green")} onClick={copy} type="button">{copied ? "copied" : "copy"}</button>}</div>;
}

const ledgerMessages = ["Block #00001 mined by nobody", "Transaction broadcast to 0 peers", "Confirmation pending forever", "Re-broadcasting to the same 0 peers", "Block #00002 also mined by nobody", "Network consensus: undecided"];

function HoardCoinPayment({ onPay, processing }: PaymentProps) {
  const [connected, setConnected] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => {
    if (!connected) return;
    let index = 0;
    const add = () => { const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }); setLines((current) => [`${time} — ${ledgerMessages[index++ % ledgerMessages.length]}`, ...current].slice(0, 5)); };
    add(); const timer = window.setInterval(add, 2_600); return () => window.clearInterval(timer);
  }, [connected]);
  return (
    <PaymentShell title="Pay by HoardCoin" subtitle="Decentralized, untraceable, and worth exactly as much as everything else here.">
      {!connected ? (
        <div className="mb-[22px] rounded-2xl border border-line bg-card px-7 py-9 text-center"><span className="mx-auto mb-4 grid size-14 place-items-center rounded-full border-2 border-purple bg-purple-fill text-purple"><Gem className="size-6" /></span><h2 className="text-[0.94rem] font-semibold">No wallet connected</h2><p className="mx-auto mb-[22px] mt-1.5 max-w-xs text-[0.78rem] leading-5 text-ink-dim">Connect a wallet to pay with HoardCoin™. This will succeed immediately and mean nothing.</p><Button onClick={() => setConnected(true)}>Connect wallet</Button></div>
      ) : (
        <>
          <div className="mb-[18px] rounded-2xl border border-line bg-card p-[22px]"><BankRow label="Wallet" value="● Connected" /><BankRow label="Address" value="0xH0ARD...DE4D" /><BankRow label="Balance" value="∞ HRDC" last /></div>
          <div className="mb-[22px] flex items-center justify-between rounded-xl border border-gold bg-gold-fill px-[18px] py-4"><div><p className="text-[0.78rem]">Amount due</p><p className="mt-0.5 text-[0.64rem] text-ink-dim">≈ ₱0.00 at current fictional rate</p></div><span className="font-mono text-xl font-bold text-green">0 HRDC</span></div>
          <div className="mb-[22px] rounded-[14px] border border-line bg-card p-[18px]"><h2 className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.04em] text-ink-dim">Block confirmations</h2><div className="min-h-20">{lines.map((line) => <p className="flex gap-2.5 py-1.5 text-xs leading-5 text-ink-dim" key={line}><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-purple" /><span><strong className="font-mono text-ink">{line.split(" — ")[0]}</strong> — {line.split(" — ")[1]}</span></p>)}</div></div>
          <Button className="w-full rounded-[11px] py-[15px] text-[0.94rem]" disabled={processing} onClick={() => onPay({ method: "hoardcoin", label: "HoardCoin wallet", reference: "0xH0ARD...DE4D" })}>Sign and broadcast transaction</Button><p className="mt-3 text-center text-[0.72rem] text-ink-dim">Gas fee: ₱0.00. Network: imaginary. Finality: never.</p>
        </>
      )}
    </PaymentShell>
  );
}

type PaymentProps = { onPay: (payment: PaymentSummary) => void; processing: boolean };
