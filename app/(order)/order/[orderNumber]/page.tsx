import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderConfirmation } from "@/components/order/order-confirmation";
import { getOrderByNumber, isSupabaseConfigured } from "@/lib/supabase/admin";

type OrderPageProps = {
  params: Promise<{ orderNumber: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: OrderPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Order ${orderNumber}`,
    description: "₱0.00 has been deducted from nothing. The paperwork is immaculate.",
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { orderNumber } = await params;
  const serverOrder = await getOrderByNumber(orderNumber);

  if (isSupabaseConfigured() && !serverOrder) notFound();

  return <OrderConfirmation orderNumber={orderNumber} serverOrder={serverOrder} />;
}
