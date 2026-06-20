import { PesoSymbol } from "./peso-amount";

const messages = [
  "FINAL PRICE: ALWAYS ₱0.00",
  "THE INVOICE NEVER ARRIVES",
  "100% FAKE — 100% SATISFYING",
  "YOUR CARD WILL NOT BE CHARGED (PROBABLY)",
];

export function Marquee() {
  return (
    <div className="overflow-hidden bg-ink py-[7px] text-page" aria-label="Store notices">
      <div className="flex w-max animate-[marquee_28s_linear_infinite] items-center">
        {[...messages, ...messages].map((message, index) => (
          <span
            className="flex items-center whitespace-nowrap font-mono text-[0.68rem] font-medium tracking-[0.08em]"
            key={`${message}-${index}`}
          >
            {message.includes("₱") ? <>{message.split("₱")[0]}<PesoSymbol />{message.split("₱")[1]}</> : message}
            <span className="mx-7" aria-hidden="true">·</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
