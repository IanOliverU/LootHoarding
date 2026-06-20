import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/checkout-flow";

export const metadata: Metadata = {
  title: "Checkout",
  description: "A bank-grade animation for a transaction worth precisely ₱0.00.",
};

export default function CheckoutPage() {
  return <CheckoutFlow />;
}
