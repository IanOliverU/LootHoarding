import { SiteFooter } from "@/components/storefront/site-footer";
import { SiteHeader } from "@/components/storefront/site-header";
import { Marquee } from "@/components/storefront/marquee";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-page text-ink">
      <Marquee />
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
