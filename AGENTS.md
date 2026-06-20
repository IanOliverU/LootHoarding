# AGENTS.md — LootHoarding

This file gives any coding agent (Codex, etc.) working context for this repo. Read this before generating code. It reflects decisions already made and validated against real HTML/CSS mockups — don't re-derive the design system from scratch, use what's documented here.

---

## What this project is

A parody e-commerce site for a private friend group (gaming / PC building / mechanical keyboards). Every product looks real; every price resolves to **₱0.00**. No real accounts — a single shared site password gates the whole thing. The comedic core is a server-side **mishap engine** that has a 15% chance of derailing a shipment with an absurd event, surfaced on a live Leaflet tracking map.

Single-tenant, friend-group-scale. Don't over-engineer for traffic or multi-tenancy.

Full reference doc (system design + page-by-page breakdown) lives at `docs/loothoarding-project-documentation.md` if present in this repo — treat it as the source of truth for product behavior. This file is the source of truth for *how to write the code*.

---

## Tech stack — use these, don't substitute

| Layer | Use |
|---|---|
| Framework | Next.js 15, App Router, TypeScript, React 19 |
| Styling | Tailwind CSS v4 + CSS custom properties for theme tokens (see below) |
| UI components | shadcn/ui — Button, Card, Dialog, Sheet, Accordion, Toast |
| Animation | Framer Motion |
| Theming | `next-themes` — do not hand-roll theme context |
| Cart state | Zustand + localStorage persist middleware |
| Data fetching | TanStack Query |
| Carousels | Embla Carousel |
| Backend | Supabase (Postgres + Storage) |
| Mapping | Leaflet + OpenStreetMap tiles |
| Geocoding | Nominatim (OSM) or Mapbox Geocoding API, server-side only |
| Deploy target | Vercel |
| Auth | Next.js Middleware, single shared password, signed cookie — no user table for guests |

If a task seems to need a different library than what's listed (e.g. a different map provider, a different state manager), stop and flag it rather than silently substituting — the existing mockups were built assuming this exact stack.

---

## Design tokens — copy these exactly

All screens share one CSS variable system. Light is the default theme; dark is the alternate, toggled via `data-theme="dark"` on `<html>` (this is what `next-themes` manages).

```css
:root{
  --bg: #fafaf8;
  --bg-raised: #ffffff;
  --bg-card: #ffffff;
  --bg-sunken: #f2f1ec;
  --ink: #16161a;
  --ink-dim: #75736c;
  --border: #e8e6e0;
  --border-strong: #d8d5cc;
  --gold: #b08d57;
  --gold-fill: #f6efe2;
  --purple: #5a4fcf;
  --purple-fill: #ece9fb;
  --green: #1f8a4c;
  --green-fill: #e8f5ec;
  --red: #a02828;
  --red-fill: #fbeaea;
  --shadow: rgba(22,22,26,0.12);
}

html[data-theme="dark"]{
  --bg: #0a0a0c;
  --bg-raised: #141417;
  --bg-card: #17171b;
  --bg-sunken: #1c1c20;
  --ink: #f5f3ee;
  --ink-dim: #9a988f;
  --border: #2a2a30;
  --border-strong: #3a3a42;
  --gold: #d4a843;
  --gold-fill: rgba(212,168,67,0.12);
  --purple: #7c5cff;
  --purple-fill: rgba(124,92,255,0.12);
  --green: #5dd17a;
  --green-fill: rgba(93,209,122,0.12);
  --red: #ff5d5d;
  --red-fill: rgba(255,93,93,0.12);
  --shadow: rgba(0,0,0,0.5);
}
```

Wire these into `tailwind.config` as CSS-variable-backed colors (Tailwind v4 native CSS var theming) rather than duplicating hex values in component code. Never hardcode a hex color in a component — always reference the variable/Tailwind token so dark mode stays free.

### Typography
- Display/headings: **Space Grotesk** (weights 400/500/700)
- Body: **Inter** (400/500/600)
- Prices, SKUs, order numbers, timestamps, anything "receipt-like": **JetBrains Mono** (400/500/700) — this is a deliberate pattern, not a stylistic accident. Mono = "this number is the joke." Keep using it for any new price/ID/timer display.

### Rarity system
Three tiers used across product cards, PDP, cart, admin: `rare` (neutral gray, `--ink-dim`), `epic` (`--purple`), `legendary` (`--gold`). Rendered as small uppercase mono labels with a `◆` bullet prefix, no filled background — quiet authentication-tag style, not a loud badge. Reuse this exact pattern (`.rarity-tag` class shape) everywhere a product's tier appears; don't invent a new rarity treatment per screen.

### Price block pattern
Every price display follows: struck-through "fake original price" in `--ink-dim` mono, next to the real `₱0.00` in `--green` mono, bold. This pairing is the platform's core visual joke — never show a price without both halves unless space genuinely doesn't allow it (e.g. compact table cells can drop the strike-through).

---

## Project structure conventions

```
app/
  (storefront)/
    page.tsx                 → homepage
    catalog/page.tsx
    product/[slug]/page.tsx
    cart/                    → if a full cart page is ever added; mini-cart is a Sheet, not a route
    checkout/page.tsx
    order/[orderNumber]/page.tsx
    track/[token]/page.tsx
  admin/
    page.tsx                 → dashboard
    products/page.tsx
    orders/page.tsx
    deals/page.tsx            → not yet designed, build to match sidebar nav pattern
  api/
    track/[token]/route.ts
    geocode/route.ts
components/
  ui/                         → shadcn primitives, don't hand-edit generated files
  storefront/                 → marquee, rarity-tag, price-block, product-card, mini-cart-drawer
  admin/                      → admin-sidebar, data-table, editor-drawer
lib/
  supabase/                   → client + server clients
  mishap-engine.ts             → the real 15% roll + event list, server-only
  cart-store.ts                → Zustand store
```

Keep the **mishap engine in one server-only module** (`lib/mishap-engine.ts`). It should export a roll function and the list of mishap event strings. This is the only place the 15% probability constant should live — don't duplicate the roll logic in route handlers.

---

## Hard rules — do not violate these

1. **Mishap engine vs. homepage timer glitch are NOT the same system.** The homepage's flash-deal countdown timers glitch/jump/reset purely client-side for flavor — this has nothing to do with order state and runs even with zero orders in the database. The real mishap engine is server-authoritative, tied to actual orders, and is the thing the tracking page and admin "Force a mishap" button hit. Do not let these share a probability constant, a module, or an event-name list unless explicitly asked to unify them.
2. **No real payment processing, ever.** The checkout payment modal is theater — a staged `setTimeout`/animation sequence with no real charge. Do not wire up Stripe, PayPal, or any real payment SDK under any circumstances, even if asked to "make it more realistic."
3. **No user accounts.** Don't add sign-up, login, password reset, or session-per-user logic for the public storefront. The only auth is the single shared site password (middleware) and a separate admin login for you.
4. **Orders snapshot their items.** When an order is created, copy the relevant product fields (name, price, rarity) into the order record rather than just storing product IDs — products can be edited/deleted later via the admin panel without corrupting historical orders.
5. **Stock is always infinite.** Don't build real inventory decrementing. The `∞` stock display in the admin product table is intentional, not a placeholder to replace.
6. **Currency is ₱ (PHP) by default.** If asked to internationalize, make it a config value rather than hardcoding a currency swap.
7. **Keep the dry/deadpan copy voice.** Microcopy throughout (delivery notes, stock tags, admin upload-box text, review copy) plays it straight and undercuts with a small absurd detail, rather than over-explaining the joke with exclamation points or excessive jokey framing. Match this tone in any new copy.

---

## When building a new screen

1. Check `docs/loothoarding-project-documentation.md` (if present) for whether this screen was already designed — reuse its layout/component breakdown rather than inventing a new structure.
2. Reuse existing components (`price-block`, `rarity-tag`, `marquee`, theme toggle) instead of rebuilding them per page.
3. New screens must support both themes from the start — never ship a component that only has light-mode styles "for now."
4. If the screen needs sample/seed data and no real Supabase data exists yet, seed realistic-looking gaming/PC/keyboard products (real brand names, real-sounding specs, absurd-but-plausible prices) — this is a design decision already validated in the mockups, not filler to replace later.

---

## Open / not-yet-decided

- `/admin/deals` (marquee + flash-deal management) and a dedicated mishap log view are referenced in the sidebar nav but not yet designed — match the existing admin sidebar + table + drawer pattern when building these.
- `/faq`, `/about`, `/privacy` content pages exist in the original site map but have not been prioritized or written yet.
- Whether the tracking page's "Force a mishap" button should be public or admin-gated in production is still undecided — default to **admin-gated** unless told otherwise, since a guaranteed-trigger button undermines the joke if every guest can spam it.
