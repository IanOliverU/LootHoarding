import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaymentDetails } from "@/components/checkout/payment-details";
import type { PaymentMethod } from "@/lib/checkout-store";

const methods: PaymentMethod[] = ["card", "gcash", "bank", "hoardcoin"];

export const dynamicParams = false;

export function generateStaticParams() {
  return methods.map((method) => ({ method }));
}

export async function generateMetadata({ params }: { params: Promise<{ method: string }> }): Promise<Metadata> {
  const { method } = await params;
  return { title: `Pay by ${method === "hoardcoin" ? "HoardCoin" : method}` };
}

export default async function PaymentDetailPage({ params }: { params: Promise<{ method: string }> }) {
  const { method } = await params;
  if (!methods.includes(method as PaymentMethod)) notFound();
  return <PaymentDetails method={method as PaymentMethod} />;
}
