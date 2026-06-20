import type { Metadata } from "next";
import { PaymentMethodSelector } from "@/components/checkout/payment-method-selector";

export const metadata: Metadata = { title: "Choose payment method" };

export default function PaymentMethodPage() {
  return <PaymentMethodSelector />;
}
