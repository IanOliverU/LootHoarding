import { phpNumber } from "@/lib/products";

export function PesoSymbol() {
  return <span className="peso-sign">₱</span>;
}

export function PesoAmount({ amount = 0 }: { amount?: number }) {
  return <><PesoSymbol />{phpNumber.format(amount)}</>;
}
