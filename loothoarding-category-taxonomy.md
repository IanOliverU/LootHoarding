# LootHoarding — Category & Subcategory Taxonomy (Premium-Only)

Reference list for seeding `categories` (and a `subcategory` or `attributes` field on `products`) in Supabase, and for building out the catalog filter sidebar.

**Scope decision:** every category below is filtered to flagship/high-end tier only. No budget, entry-level, or mid-range subcategories — the whole catalog should look like a wishlist no one can actually afford, which fits the platform's core joke better than a normal price spread. If a tier isn't listed here (e.g. "entry-level CPU," "TN panel," "membrane keyboard"), it's intentionally excluded.

---

## 1. Gaming Peripherals → Keyboards

**By size/layout:** *(premium boutique layouts only — the sizes enthusiasts actually chase)*
- 75% (premium aluminum builds)
- 65% (premium aluminum builds)
- 60% (premium aluminum builds)
- Full-size — flagship typing/gaming hybrids (104+ keys, premium build only)

**By switch type:** *(high-end switch tech only)*
- Hall-effect / magnetic switches (adjustable actuation, top-tier gaming feel)
- Premium tactile (factory-lubed, e.g. boutique tactile switches)
- Premium linear (factory-lubed, e.g. boutique linear switches)
- Optical switches (high-end, ultra-low latency)

**By build/mount style:** *(all premium boards use one of these — no tray-mount/budget builds)*
- Gasket-mount (aluminum/polycarbonate case)
- Top-mount, CNC-machined aluminum case
- Hot-swappable PCB (standard on all premium boards listed)

**By connectivity:**
- Tri-mode (wired + 2.4GHz + Bluetooth) — flagship standard
- Wired-only, ultra-low-latency (competitive/esports flagship boards)

---

## 2. Gaming Peripherals → Mice

**By sensor/grip type:** *(flagship esports-grade shapes only)*
- Symmetrical, flagship esports shape
- Ergonomic, flagship esports shape

**By connectivity:**
- Wireless (2.4GHz), flagship low-latency dongle — standard for all premium mice listed
- Tri-mode (wired + 2.4GHz + Bluetooth), flagship

**By weight class:** *(ultralight flagship only — this is the premium-tier signature)*
- Ultralight (<55g, flagship hollow-shell builds)
- Lightweight (55–75g, flagship)

**By sensor tech:**
- Flagship optical sensor (highest-end DPI/tracking tier)

---

## 3. Monitors & Displays

**By panel type:** *(no TN, no standard VA/IPS — premium panel tech only)*
- OLED
- QD-OLED
- Mini-LED (high-zone-count, flagship)

**By refresh rate:** *(160Hz and up only)*
- 165Hz
- 240Hz
- 360Hz+

**By resolution:** *(1440p minimum)*
- 1440p (QHD)
- 4K (UHD)
- 5K / Ultra-wide QHD

**By form factor:**
- Curved
- Ultrawide (21:9)
- Super ultrawide (32:9)

---

## 4. Graphics Cards

**By tier:** *(only the top two tiers qualify — nothing xx60 or below)*
- Flagship (xx90 / xx90 Ti class)
- High-end (xx80 / xx80 Ti class)

**By cooling design:**
- Air-cooled — open-air (premium dual/triple fan, flagship cooler design)
- Hybrid (AIO + fan)
- Full liquid-cooled

**By VRAM:** *(16GB minimum)*
- 16GB
- 20–24GB
- 32GB+

---

## 5. PC Components

**CPUs — by class:** *(no entry-level or mid-range)*
- High-end desktop (HEDT), flagship consumer chip
- Workstation/server-class

**RAM — by type:** *(DDR5 only — DDR4 is last-gen, doesn't qualify as premium)*
- DDR5, high-frequency/low-latency kits
- ECC (workstation-grade)

**Storage — by type:** *(no SATA SSD, no HDD — premium NVMe only)*
- NVMe SSD, PCIe Gen4 (flagship consumer tier)
- NVMe SSD, PCIe Gen5 (current top tier)

**PC Cases — by form factor:** *(premium build quality across all sizes is fine — this is about materials/design, not size)*
- Mini-ITX, premium aluminum/tempered glass
- Mid-tower (ATX), flagship premium build
- Full tower (E-ATX), flagship premium build

**PSU — by efficiency rating:** *(no Bronze/Gold — Platinum minimum)*
- 80+ Platinum
- 80+ Titanium

---

## 6. Gaming PCs (Prebuilt/Custom Builds)

**By use case:** *(no budget/entry builds)*
- 1440p enthusiast
- 4K flagship
- Small form factor (SFF), premium/boutique build
- Streaming/content-creation flagship rig

**By cooling:** *(no plain air-cooled budget builds)*
- AIO liquid-cooled build, premium
- Custom loop (full liquid), boutique build

---

## 7. Consoles & Handhelds

**By type:** *(flagship/top-spec variant of each only)*
- Home console, flagship/Pro variant (top spec tier)
- Hybrid console (dockable), flagship OLED/high-spec model
- Dedicated handheld (PC-based), flagship/top-spec model

**By storage tier:** *(top storage tier only)*
- High storage (1TB+)

---

## 8. Laptops & Tablets

**Laptops — by category:** *(no standard ultrabooks or mid-range gaming laptops)*
- Gaming laptop — flagship/desktop-replacement (top-spec GPU tier)
- Workstation/creator laptop, flagship spec

**Tablets — by category:** *(flagship tier only)*
- Drawing/creator tablet, flagship (active stylus, top-spec display)
- Gaming-oriented tablet, flagship spec

---

## 9. Audio & Streaming

**Headsets/Headphones — by type:**
- Closed-back gaming headset
- Open-back headphones
- In-ear monitors (IEMs)
- Wireless gaming headset

**Microphones — by type:**
- USB condenser mic
- XLR condenser mic (needs audio interface)
- Dynamic mic (broadcast-style)
- Lavalier/clip mic

**Streaming gear:**
- Capture cards
- Stream decks / macro pads
- Ring lights / key lights
- Green screens

---

## 10. Desk Setup & Furniture

**Chairs — by type:**
- Ergonomic mesh chair
- Racing-style gaming chair
- Ergonomic office chair (ortho-focused)

**Desks — by type:**
- Fixed-height desk
- Electric standing desk
- Manual crank standing desk

**Lighting/ambience:**
- RGB light bars (monitor-mounted)
- Smart LED strips
- Desk lamps (ambient/task)

---

## 11. Tech Accessories

**By type:**
- Cable management (braided cables, sleeves, clips)
- Multi-port chargers / GaN chargers
- Carrying cases / EDC pouches
- Mousepads (cloth, hard, extended)
- Wrist rests
- Webcam covers / privacy accessories

---

## Suggested data model note

Rather than a flat `category` string on each product, consider a two-level structure:

```
categories table:        Keyboards, Mice, Monitors, Graphics Cards, ... (10 top-level buckets)
subcategories table:     belongs to a category_id, e.g. "TKL", "OLED", "DDR5"
products table:          category_id (required), subcategory_id (optional, can be multiple via join table if a product spans tags — e.g. a keyboard that's both "65%" and "hot-swap")
```

This lets the catalog sidebar filter by category first, then reveal relevant subcategory checkboxes dynamically (showing "Panel type" options when "Monitors" is selected, "Switch type" when "Keyboards" is selected, etc.) — matching the filter sidebar pattern already built in the catalog page mockup.
