# LootHoarding — Project Documentation

A parody $0.00 e-commerce platform built for a private friend group centered on gaming, PC building, and mechanical keyboard culture. Everything in the catalog is real-looking, every price resolves to ₱0.00, and a server-side "mishap engine" randomly derails shipments for comedic effect.

This document covers the system design, recommended tech stack, and a full breakdown of every screen designed so far — what it's for, what it does, and what it's built from — so this can be handed directly into development.

---

## 1. System Design

### 1.1 High-level architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                     │
│  Next.js App Router · React 19 · Tailwind v4 · shadcn/ui    │
│  Zustand (cart) · TanStack Query (data) · Framer Motion      │
└───────────────┬───────────────────────────────┬─────────────┘
                │ Server Actions / Route Handlers │
┌───────────────▼───────────────────────────────▼─────────────┐
│                    NEXT.JS SERVER (Vercel)                   │
│  Middleware: site-wide password gate                         │
│  Server Actions: cart→order, checkout, mishap roll           │
│  Route Handlers: /api/track/[token], /api/geocode             │
└───────────────┬───────────────────────────────┬─────────────┘
                │                                 │
┌───────────────▼──────────────┐   ┌─────────────▼─────────────┐
│         SUPABASE              │   │   EXTERNAL SERVICES        │
│  Postgres: products, orders,  │   │  Geocoding (Nominatim/      │
│  categories, collections      │   │  Mapbox) for shipping        │
│  Storage: product images      │   │  address → lat/lng           │
│  Row-Level Security: admin     │   │  Leaflet/Mapbox tiles for     │
│  vs guest read scopes          │   │  the live tracking map        │
└────────────────────────────────┘   └────────────────────────────┘
```

### 1.2 Core design principles

- **No real accounts.** There is no user table beyond an optional `admin_users` table for you. Guests are anonymous; orders are owned by nobody and looked up only by `orderNumber` + `trackingToken` in the URL. This matches the access model in the original brief exactly — one shared site password via middleware, no sign-up flow anywhere.
- **The price is structural, not a field.** Every product has a `display_price` (the fake "was" price shown struck through) and the actual charge is hardcoded to 0 at the order level — there's no discount logic to maintain, because there's no real pricing engine at all.
- **The mishap engine is server-authoritative.** The 15% mishap roll happens in a Server Action or Route Handler when an order is placed or polled, never in client JS, so it can't be inspected or predicted by opening dev tools. The homepage's erratic countdown-timer glitch is a separate, purely decorative client-side effect — it should **not** share code with the real mishap engine, since one is flavor (always-on, harmless) and the other is a gameplay mechanic tied to real order state.
- **Theme is a single CSS variable swap.** Every screen uses the same token set (`--bg`, `--ink`, `--gold`, `--purple`, `--green`, etc.) defined on `:root` for light and overridden under `html[data-theme="dark"]`. This maps directly onto `next-themes`, which manages the `data-theme` attribute and persists the choice to `localStorage` automatically — no per-component dark mode logic needed anywhere in the app.

### 1.3 Data model (suggested)

| Table | Purpose |
|---|---|
| `products` | name, brand, category_id, rarity (`rare`/`epic`/`legendary`), display_price, description, spec JSON, images[], is_live, is_featured |
| `categories` | the 10 taxonomy buckets (Gaming PCs, GPUs, etc.) |
| `collections` | curated groupings ("GPU Hunter's Picks", "Handheld Heaven", etc.) + product_ids |
| `orders` | order_number, tracking_token, shipping JSON, item snapshot JSON, status enum, created_at |
| `mishap_events` | order_id, mishap_type, triggered_at, resolved_at — log of what happened on each shipment |
| `admin_users` | just you; gates `/admin/*` separately from the public site password |

Orders store a **snapshot** of cart items (name, price, rarity) at checkout time rather than live foreign keys — so editing or deleting a product later doesn't corrupt historical order data, which matters once the admin panel's product CRUD is in regular use.

### 1.4 Key flows

**Checkout → confirmation → tracking** is one continuous state machine: `cart` → `shipping_form` → `review` → `payment_animation` (client-side theater only, no real gateway call) → `order created (server)` → `confirmation page` → `/track/[token]`. The mishap roll can fire at order-creation time and/or at intervals while the order is "in transit," surfaced live on the tracking page.

**Theme persistence** should be read once in a root layout (`useTheme` from `next-themes` or an inline script to avoid flash-of-wrong-theme on load) and is otherwise stateless — no DB or cookie round-trip needed since there's no user account to attach a preference to.

---

## 2. Recommended Tech Stack

This matches what's in the original blueprint and what the screens were actually designed against — nothing here introduces a new dependency the mockups don't already assume.

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router)**, React 19, TypeScript | Server Actions make the fake-checkout and mishap-roll logic trivial to keep server-side; App Router gives clean nested routes for `/track/[token]`, `/admin/*`, etc. |
| Styling | **Tailwind CSS v4** + CSS custom properties for the theme tokens | The mockups' entire light/dark system is just CSS variables — Tailwind v4's native CSS-variable theming maps onto this directly without a JS theme object. |
| UI components | **shadcn/ui** (Button, Card, Dialog, Sheet, Accordion, Toast) | The mini-cart drawer, payment modal, and admin editor drawer are all built from Sheet/Dialog primitives in the mockups — shadcn gives accessible versions of exactly these for free. |
| Animation | **Framer Motion** | Cart drawer slide-in, confetti on payment success, card hover lifts — all already prototyped with CSS transitions in the static mockups; Framer Motion is the natural upgrade for spring physics. |
| Theming | **next-themes** | Purpose-built for exactly the `data-theme` attribute + localStorage pattern used throughout every mockup. |
| State (cart) | **Zustand** + localStorage persist middleware | Matches the original spec; cart needs to survive refreshes with no backend session. |
| Data fetching | **TanStack Query** | For catalog filtering/pagination and polling the tracking page for live mishap status. |
| Carousels | **Embla Carousel** | For the homepage flash-deals row and hero banners — currently a scroll-snap div in the mockup, Embla adds drag/snap/autoplay properly. |
| Backend / DB | **Supabase** (Postgres + Storage) | Product images, order records, admin auth — one service for all of it, matches the original blueprint. |
| Mapping | **Leaflet + OpenStreetMap** tiles | Already wired exactly this way in the tracking mockup (`L.map`, `L.polyline`, `L.divIcon` for courier/warehouse/home markers) — ships as-is. |
| Geocoding | **Nominatim** (OSM) or **Mapbox Geocoding API** | Needed server-side to turn the shipping address string into lat/lng for the tracking route — not yet built, since the mockup hardcodes coordinates. |
| Deployment | **Vercel** | Matches the original single-tenant deployment plan; Server Actions and Route Handlers run natively. |
| Auth/gating | **Next.js Middleware** with a signed cookie | Single shared password, no user table — exactly as specified in the original access model. |

---

## 3. Screen-by-Screen Reference

Each entry covers: **purpose**, **what it does / key functions**, **modules & interactive elements**, and **build notes** for translating it into the real app.

---

### 3.1 Homepage (`/`)
**File:** `loothoarding-homepage.html`

**Purpose:** The storefront's front door — has to sell the joke fast to a first-time visitor (a friend clicking a shared link) while doing the normal orienting work of a real e-commerce homepage: show what's here, build a little trust, get people into the catalog.

**Functions:**
- Establishes the core gag immediately via the hero (`Hoard the loot. Pay ₱0.00.`) and a scrolling marquee with the brand's running jokes.
- Surfaces four trust-style value props that mirror real e-commerce copy ("Always free shipping," "Bank-grade checkout") but each one is a setup for its own punchline.
- Flash deals row simulates urgency-marketing with discount countdown timers that are intentionally broken — they tick down normally most of the time but randomly jump backward, skip forward, or glitch into `??:??:??`, then silently reset instead of ever hitting zero. This is **decorative only**, not connected to the real mishap engine.
- Category grid links out to the 10 taxonomy buckets from the content architecture.
- Collection spotlight banner promotes one curated collection ("GPU Hunter's Picks") as a dedicated marketing slot.
- Reviews section shows fabricated five-star testimonials written in the group's in-joke voice (UFO abductions, "bank said yes (lie)").
- Closing CTA repeats the primary action before the footer.

**Modules / components:**
- Sticky header with logo, nav, search pill, theme toggle, cart icon + badge
- Hero with eyebrow badge, headline, dual CTA buttons, stat row
- Value strip (4-column grid)
- Flash deals horizontal scroll row (deal cards × 5, each with timer + struck price + real price)
- Category grid (10 cards, icon + name + count)
- Collection banner (dark inverted block within the page)
- Reviews grid (3 testimonial cards)
- Closing CTA band
- Footer

**Build notes:** The erratic timers are pure client-side `setInterval` logic with random branching (~70% normal tick, ~10% jump back, ~8% jump forward, ~6% glitch flash) — fine to ship as-is, but isolate this from any future real mishap-engine code so the two systems don't get tangled. Deal data, category counts, and review content should all come from Supabase queries rather than being hardcoded once this goes live.

---

### 3.2 Catalog (`/catalog`)
**File:** `loothoarding-catalog.html`

**Purpose:** The main product discovery page — where most browsing happens after the homepage.

**Functions:**
- Lists products in a filterable, sortable grid.
- Sidebar filters by category (with checkbox counts), rarity tier (pill toggles), price range (slider), and brand.
- Toolbar shows live result count and a sort dropdown.
- Each product card shows rarity tag, category, name, struck "real" price next to the actual `₱0.00`, and an add-to-cart button.
- Pagination at the bottom.

**Modules / components:**
- Filter sidebar (category checklist, rarity pill group, price range slider, brand checklist, "clear all filters" link)
- Toolbar (result count + sort select)
- Product grid (3-column cards)
- Pagination control

**Build notes:** Filters should drive a TanStack Query–backed fetch against Supabase with query params reflected in the URL (so filtered views are shareable/bookmarkable among friends). The rarity pill and checkbox states shown are static in the mockup — wire these to real controlled state.

---

### 3.3 Product Detail Page (`/product/[slug]`)
**File:** `loothoarding-pdp.html`

**Purpose:** Where the joke has to land hardest on a single item — plays it straight (real specs, real photography placeholder, normal-looking reviews) right up until the price block.

**Functions:**
- Image gallery with thumbnail strip and a rarity badge overlay.
- Brand row + a "0 in stock — infinite availability" status tag (an inverted scarcity joke).
- Star rating + review count.
- Price block: struck "real" price, glowing `₱0.00`, explanatory copy, quantity selector, add-to-cart, and a "skip cart" direct-hoard button.
- Delivery note explaining (in-joke) that the warehouse doesn't exist.
- Spec table (memory, clock speed, power draw, rarity tier).
- Description and a list of in-character fabricated reviews.

**Modules / components:**
- Gallery (main image + 4 thumbnails)
- Info column (brand/stock row, title, reviews, price block, quantity + CTA buttons, delivery note, specs table)
- Description + reviews section below the fold

**Build notes:** Specs table should pull from a `spec` JSONB column per product so different categories (GPU vs keyboard vs monitor) can have different spec shapes without schema changes. Reviews can stay seeded/fabricated content for now — there's no real review system since there are no real accounts.

---

### 3.4 Mini-Cart Drawer (component, not a route)
**File:** `loothoarding-minicart.html`

**Purpose:** The persistent, most-frequently-seen piece of UI — the dopamine-hit moment every time something's added.

**Functions:**
- Slides in from the right over a scrimmed/dimmed page.
- Lists cart line items with rarity tag, thumbnail, quantity stepper, struck/real price, and a remove link.
- Ledger at the bottom itemizes "what this would have cost," shipping, "tax, fees, regret," and the running total — always ₱0.00.
- Primary CTA proceeds to checkout; secondary link dismisses the drawer.

**Modules / components:**
- Drawer header (title, item count pill, theme toggle, close button)
- Scrollable item list
- Ledger + checkout CTA footer

**Build notes:** This is a `Sheet` (shadcn) backed by the Zustand cart store — quantity changes and removals should update the store directly and re-render reactively, no local component state needed beyond UI transients.

---

### 3.5 Checkout (`/checkout`)
**File:** `loothoarding-checkout.html`

**Purpose:** The two-step flow plus the signature fake payment gateway animation — the comedic centerpiece of the purchase flow.

**Functions:**
- Step 1: shipping address form (name, address, city, province, postal code, phone).
- Step indicator shows progress and marks completed steps.
- Step 2: review screen — recaps shipping info with an edit link, shows a fabricated payment method ("Imaginary Visa •••• 0000, EXP: NEVER"), and a "Place order — ₱0.00" button.
- Order summary sidebar persists across both steps (line items + ledger, same pattern as the mini-cart).
- Clicking "Place order" triggers a full-screen modal: a spinner cycles through four staged messages ("Authorizing..." → "Bank said yes (lie)..." → "Deducting ₱0.00..." → "Finalizing...") with a progress bar, then resolves to a success state with a "Track this order" CTA.

**Modules / components:**
- Step indicator (2 steps, line connector)
- Step 1 panel: shipping form fields
- Step 2 panel: review rows, payment method card
- Order summary sidebar (shared layout with mini-cart's ledger pattern)
- Payment overlay modal (spinner, staged text, progress fill, success state)

**Build notes:** The 4-stage animation is currently a `setTimeout` chain in vanilla JS — directly portable to a React component with `useEffect`/`useState`, or better, driven by the actual Server Action's response timing so the stages can resolve once the order is genuinely created in Supabase rather than running on a fixed fake clock. The form has no validation in the mockup; add real validation before shipping (still no need for an actual address-verification service, just non-empty checks).

---

### 3.6 Order Confirmation (`/order/[orderNumber]`)
**File:** `loothoarding-order-confirmation.html`

**Purpose:** The receipt-style bridge between checkout and tracking — confirms the order looks real and sets expectations for what happens next.

**Functions:**
- Confirmation header with checkmark, order number, timestamp, and status.
- Itemized order panel with the same struck/real price ledger pattern used throughout.
- Shipping details panel (recipient, address, phone, and a joke "carrier" field: "A guy on a scooter, probably").
- "What happens now" panel explains the warehouse/courier/mishap mechanics in plain language rather than oversold jokes.
- Two CTAs: continue shopping, or track this order.

**Modules / components:**
- Confirmation hero (check badge, headline, order meta strip)
- Items panel + ledger
- Shipping panel
- "What happens now" panel with bullet-style next steps
- Action buttons

**Build notes:** `orderNumber` in the URL should resolve via a Server Component fetch against the `orders` table; if the number doesn't exist, render a real 404 rather than the happy path. The order data shown here is the same snapshot structure that the admin orders screen consumes, so the rendering logic for line items can likely be shared between the two.

---

### 3.7 Live Tracking (`/track/[token]`)
**File:** `loothoarding-tracking.html`

**Purpose:** The payoff screen — a real animated map showing a courier traveling toward the delivery address, with a chance of going completely off the rails.

**Functions:**
- Renders an actual Leaflet map (OpenStreetMap tiles) centered between a warehouse origin and the destination.
- A courier marker animates along a winding waypoint path, with ETA updating as it moves.
- Status pill (top right) shows "En route" with a pulsing dot; flips to a red "Mishap in progress" state when triggered.
- Sidebar shows shipment metadata (courier name, origin, destination, ETA) and a status timeline (order confirmed → left warehouse → en route → [mishap, if any] → arriving).
- A dashed "Force a mishap" button lets you manually trigger the chaos engine for demo purposes — picks a random mishap line, shows a banner over the map, updates the status pill and timeline, then auto-recovers after a few seconds.

**Modules / components:**
- Map panel (Leaflet instance, warehouse/home/courier divIcon markers, dashed polyline route, mishap banner overlay)
- Status pill (header)
- Shipment details panel
- Status timeline panel
- Mishap trigger button

**Build notes:** This is the one screen still using **hardcoded coordinates** rather than real geocoding — the real build needs a server step that geocodes the shipping address (Nominatim or Mapbox) into lat/lng before generating the route. The "Force a mishap" button is forced to 100% in the mockup for demo visibility; the production version should respect the real 15% server-side roll and probably drop this manual button entirely (or gate it behind admin-only access, since giving every guest a "force chaos" button undermines the randomness that makes it funny). Live status should be polled via TanStack Query against the order's current state rather than purely animated client-side, so multiple people tracking the same order see the same thing.

---

### 3.8 Admin Dashboard (`/admin`)
**File:** `loothoarding-admin-dashboard.html`

**Purpose:** Your own at-a-glance overview — not customer-facing, so the tone and layout shift to a standard internal admin tool.

**Functions:**
- Stat cards: total orders, "revenue saved," mishaps triggered, active hoarders (i.e., friends).
- Recent orders table (order ID, hoarder name, item count, total, status badge).
- "Top mishaps this week" leaderboard of which chaos events fired most often.
- Quick action shortcuts (add product, edit marquee messages).
- "Mishap engine: armed" live status badge.

**Modules / components:**
- Persistent left sidebar nav (Dashboard / Products / Deals & marquee / Orders / Mishap log) + theme toggle + admin user chip
- Stat card grid (4 cards)
- Recent orders table panel
- Top mishaps panel
- Quick actions list

**Build notes:** Sidebar nav items map 1:1 to admin routes (`/admin`, `/admin/products`, `/admin/orders`, plus a couple not yet built: `/admin/deals` and a mishap log view). Stats should be Supabase aggregate queries (counts, sums) — cheap enough to compute on each dashboard load without caching for a friend-group-scale dataset.

---

### 3.9 Admin Products (`/admin/products`)
**File:** `loothoarding-admin-products.html`

**Purpose:** Full CRUD over the 80–120 item catalog.

**Functions:**
- Searchable, filterable product table (category, rarity filters; live result count).
- Clicking any row opens a slide-in editor drawer pre-filled with that product's data; the pencil/✕ icons in the row are separate quick actions (edit/delete) that don't trigger the row click.
- "＋ Add product" opens the same drawer empty.
- Editor drawer: image upload placeholder, name, category, brand, rarity tier selector (3-way toggle), "real" price input, disabled `₱0.00` actual-price field, description textarea, and two toggle switches ("Live on storefront," "Feature in collection").

**Modules / components:**
- Toolbar (search input, category filter, rarity filter, result count)
- Product table (thumbnail + name/category, rarity tag, price, status badge, stock = `∞`, row actions)
- Slide-in editor drawer (scrim + drawer, rarity selector, toggle switches, save/cancel footer)

**Build notes:** The drawer's pre-fill currently reads from the clicked row's `data-*` attributes as a stand-in — in the real app this becomes a fetch-by-ID (or just passing the already-loaded row object, since the full list is already in memory from TanStack Query). Save should be a Server Action that upserts into `products` and revalidates the catalog/PDP pages via `revalidatePath` so changes show up immediately on the live site.

---

### 3.10 Admin Orders (`/admin/orders`)
**File:** `loothoarding-admin-orders.html`

**Purpose:** Read-mostly view of every order placed by the friend group — for oversight and, frankly, entertainment.

**Functions:**
- Searchable/filterable orders table (by order number, hoarder name, status).
- Clicking a row opens a slide-in detail drawer (same pattern as Products) showing: status badge + timestamp, itemized list with rarity tags, shipping info, tracking token, and a mishap history log for that specific order.
- Drawer's one action button is "Force a mishap" rather than a save/edit action, matching the read-mostly nature of this screen.

**Modules / components:**
- Toolbar (search, status filter, result count)
- Orders table (order ID, hoarder avatar + name, item count, total, status badge, placed date)
- Detail drawer (status row, items section, shipping section, mishap history section)

**Build notes:** Unlike the Products drawer, this one has no editable form fields — it's a structured read view assembled from the order's snapshot JSON plus a join against `mishap_events` for that order. "Force a mishap" should call the same Server Action the real engine uses internally, just invoked manually and logged the same way, so the mishap log stays consistent regardless of how an event was triggered.

---

## 4. Cross-cutting notes

- **Currency/locale:** All mockups use ₱ (PHP) pricing, matching your location. Trivial to swap to USD or make currency a config value if your friend group expects that instead.
- **Voice consistency:** Copy throughout (delivery notes, stock tags, review text, admin microcopy) deliberately stays in the same dry, deadpan register rather than over-explaining the joke — worth keeping as a north star for any new copy you write later, including the FAQ/About/Privacy pages whenever you get to them.
- **Theme system is the one truly shared piece of code** across all 10+ screens — get the `next-themes` setup and the CSS variable token file right once, early, and every other screen inherits it for free.

---

*Last updated alongside the full screen set: homepage, catalog, PDP, mini-cart, checkout, order confirmation, live tracking, and the three admin screens (dashboard, products, orders).*
