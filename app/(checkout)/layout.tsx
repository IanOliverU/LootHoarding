import { CheckoutHeader } from "@/components/checkout/checkout-header";
import { Marquee } from "@/components/storefront/marquee";
import { SiteFooter } from "@/components/storefront/site-footer";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-page text-ink">
      <Marquee />
      <CheckoutHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
