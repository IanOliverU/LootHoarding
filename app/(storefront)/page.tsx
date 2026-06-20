import {
  ArrowRight,
  Armchair,
  Cpu,
  Gamepad2,
  Headphones,
  Keyboard,
  Laptop,
  LockKeyhole,
  Monitor,
  PackageX,
  RotateCcw,
  ShoppingBag,
  Smartphone,
  Star,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { FlashDeals } from "@/components/storefront/flash-deals";
import { Button } from "@/components/ui/button";
import { catalogProducts } from "@/lib/products";

const values = [
  {
    icon: ShoppingBag,
    title: "Always free shipping",
    copy: "Because nothing ships. Same energy, zero logistics.",
  },
  {
    icon: LockKeyhole,
    title: "Bank-grade checkout",
    copy: "A 4-stage payment animation that lies to you politely.",
  },
  {
    icon: Truck,
    title: "Live courier tracking",
    copy: "Watch your order travel, then occasionally get abducted.",
  },
  {
    icon: RotateCcw,
    title: "No-questions returns",
    copy: "Easy, since you never had it to begin with.",
  },
];

const categories = [
  { icon: Monitor, name: "Gaming PCs", slug: "gaming-pcs" },
  { icon: Gamepad2, name: "Graphics Cards", slug: "graphics-cards" },
  { icon: Smartphone, name: "Consoles & Handhelds", slug: "consoles-handhelds" },
  { icon: Wrench, name: "PC Components", slug: "pc-components" },
  { icon: Keyboard, name: "Gaming Peripherals", slug: "gaming-peripherals" },
  { icon: Laptop, name: "Monitors & Displays", slug: "monitors-displays" },
  { icon: Cpu, name: "Laptops & Tablets", slug: "laptops-tablets" },
  { icon: Headphones, name: "Audio & Streaming", slug: "audio-streaming" },
  { icon: Armchair, name: "Desk Setup & Furniture", slug: "desk-setup" },
  { icon: PackageX, name: "Tech Accessories", slug: "tech-accessories" },
].map((category) => ({
  ...category,
  count: catalogProducts.filter((product) => product.categorySlug === category.slug).length,
}));

const reviews = [
  {
    initials: "MP",
    name: "Marco_PH",
    quote: "Added a 5090 to cart at 2am out of pure impulse. Total stayed ₱0.00. Felt amazing. Still don’t have a GPU.",
  },
  {
    initials: "KG",
    name: "keyboardgremlin",
    quote: "My courier got abducted by a UFO during tracking. Still ten out of ten, would hoard again.",
  },
  {
    initials: "NB",
    name: "notarealbuyer",
    quote: "The checkout animation said “bank said yes (lie)” and honestly that’s the most honest thing any store has ever told me.",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="border-b border-line bg-[radial-gradient(ellipse_800px_280px_at_50%_0%,var(--gold-fill),transparent_70%)] px-5 py-16 text-center md:px-10 md:pb-16 md:pt-[84px]">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple bg-purple-fill px-3.5 py-1.5 font-mono text-xs tracking-[0.12em] text-purple">
          <Zap className="size-3.5 fill-current" /> MISHAP ENGINE: ARMED
        </div>
        <h1 className="mt-[18px] font-display text-[2.7rem] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[3.25rem]">
          Hoard the loot.<br />Pay <span className="text-gold">₱0.00</span>.
        </h1>
        <p className="mx-auto mb-[30px] mt-[18px] max-w-[520px] text-base leading-[1.6] text-ink-dim">
          A premium storefront for gear you already want, minus the part where money leaves your account. Add it to cart. Feel the rush. Receive nothing.
        </p>
        <div className="flex flex-wrap justify-center gap-3.5">
          <Button size="lg" asChild><Link href="/catalog">Start hoarding</Link></Button>
          <Button size="lg" variant="outline" asChild><Link href="#deals">See today&apos;s “deals”</Link></Button>
        </div>
        <dl className="mx-auto mt-9 grid max-w-[570px] grid-cols-2 gap-7 sm:grid-cols-4 sm:gap-11">
          {[
            [String(catalogProducts.length), "Fake listings"],
            ["₱0.00", "Avg. order total"],
            ["15%", "Mishap chance"],
            ["9", "Active hoarders"],
          ].map(([number, label]) => (
            <div key={label}>
              <dt className="font-mono text-[1.35rem] font-bold">{number}</dt>
              <dd className="mt-0.5 text-[0.7rem] uppercase tracking-[0.04em] text-ink-dim">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto grid max-w-[1240px] border-b border-line sm:grid-cols-2 lg:grid-cols-4" aria-label="Store promises">
        {values.map(({ icon: Icon, title, copy }) => (
          <article className="flex gap-3.5 border-line px-[30px] py-[26px] sm:border-r sm:even:border-r-0 lg:border-r lg:last:border-r-0" key={title}>
            <Icon className="mt-0.5 size-[18px] shrink-0 text-gold" />
            <div>
              <h2 className="text-[0.84rem] font-semibold">{title}</h2>
              <p className="mt-1 text-xs leading-[1.5] text-ink-dim">{copy}</p>
            </div>
          </article>
        ))}
      </section>

      <div id="deals"><FlashDeals /></div>

      <section className="page-shell py-14" aria-labelledby="category-title">
        <div className="mb-7 flex items-baseline justify-between gap-5">
          <h2 id="category-title" className="font-display text-2xl font-bold">Shop by category</h2>
          <span className="hidden font-mono text-[0.68rem] text-ink-dim sm:block">10 CATEGORIES · {catalogProducts.length} LISTINGS</span>
        </div>
        <div className="grid grid-cols-2 gap-3.5 md:grid-cols-5">
          {categories.map(({ icon: Icon, name, count, slug }) => (
            <Link
              className="group rounded-[14px] border border-line bg-card px-4 py-[22px] text-center transition-all hover:-translate-y-[3px] hover:border-line-strong"
              href={`/catalog?category=${slug}`}
              key={slug}
            >
              <div className="mx-auto grid size-[46px] place-items-center rounded-xl bg-sunken text-ink-dim transition-colors group-hover:text-gold">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-3.5 text-[0.8rem] font-semibold">{name}</h3>
              <p className="mt-1 font-mono text-[0.68rem] text-ink-dim">{count} items</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-shell py-14">
        <div className="relative flex items-center justify-between gap-10 overflow-hidden rounded-[18px] bg-ink px-7 py-11 text-page md:px-12">
          <div className="relative z-10 flex-1">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-gold">Curated collection</p>
            <h2 className="mt-3 font-display text-[1.75rem] font-bold">GPU Hunter&apos;s Picks</h2>
            <p className="mt-3 max-w-[420px] text-sm leading-[1.6] opacity-70">
              For the friend who still refreshes restock pages at 3am out of habit. Every flagship card you&apos;ve argued about in the group chat, priced the only way that makes sense.
            </p>
            <Button className="mt-[22px] bg-page text-ink" asChild>
              <Link href="/collection/gpu-hunters-picks">Browse the collection</Link>
            </Button>
          </div>
          <div className="hidden shrink-0 grid-cols-2 gap-2.5 sm:grid">
            {[Gamepad2, Zap, Cpu, Star].map((Icon, index) => (
              <div className="grid size-[90px] place-items-center rounded-[10px] border border-page/15 bg-page/8" key={index}>
                <Icon className="size-6 text-gold" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-14" aria-labelledby="reviews-title">
        <div className="mb-7 flex items-baseline justify-between gap-5">
          <h2 id="reviews-title" className="font-display text-2xl font-bold">What the group chat says</h2>
          <span className="hidden font-mono text-[0.68rem] text-ink-dim sm:block">128 REVIEWS · ALL FIVE STARS</span>
        </div>
        <div className="grid gap-[18px] md:grid-cols-3">
          {reviews.map((review) => (
            <figure className="rounded-[14px] border border-line bg-card p-[22px]" key={review.name}>
              <div className="flex gap-0.5 text-gold" aria-label="Five stars">
                {Array.from({ length: 5 }).map((_, index) => <Star className="size-3.5 fill-current" key={index} />)}
              </div>
              <blockquote className="mb-4 mt-3 text-[0.84rem] leading-[1.6]">{review.quote}</blockquote>
              <figcaption className="flex items-center gap-2.5">
                <div className="grid size-8 place-items-center rounded-full bg-purple-fill text-[0.68rem] font-bold text-purple">{review.initials}</div>
                <div>
                  <p className="text-[0.78rem] font-semibold">{review.name}</p>
                  <p className="font-mono text-[0.68rem] text-ink-dim">VERIFIED HOARDER</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-[radial-gradient(ellipse_700px_260px_at_50%_100%,var(--purple-fill),transparent_70%)] px-6 py-[70px] text-center">
        <h2 className="font-display text-[2rem] font-bold">Your hoard is waiting.</h2>
        <p className="mx-auto mb-7 mt-3.5 max-w-[460px] text-[0.9rem] leading-[1.6] text-ink-dim">
          {catalogProducts.length} listings. Zero invoices. One mishap engine watching your every shipment with great enthusiasm.
        </p>
        <Button size="lg" asChild><Link href="/catalog">Start hoarding <ArrowRight className="size-4" /></Link></Button>
      </section>
    </main>
  );
}
