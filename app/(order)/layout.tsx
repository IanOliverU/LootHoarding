import { OrderHeader } from "@/components/order/order-header";
import { Marquee } from "@/components/storefront/marquee";
import { SiteFooter } from "@/components/storefront/site-footer";

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-page text-ink">
      <Marquee />
      <OrderHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
