export type Rarity = "rare" | "epic" | "legendary";

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  categorySlug: string;
  rarity: Rarity;
  displayPrice: number;
  icon: "gpu" | "keyboard" | "handheld" | "monitor" | "headset" | "mouse";
};

export const featuredProducts: Product[] = [
  {
    id: "gpu-5090",
    slug: "rtx-5090-founders-edition",
    name: "RTX 5090 Founders Edition",
    brand: "NVIDIA",
    category: "Graphics Cards",
    categorySlug: "graphics-cards",
    rarity: "legendary",
    displayPrice: 149_999,
    icon: "gpu",
  },
  {
    id: "monitor-ultrawide",
    slug: "34-ultrawide-oled-240hz",
    name: "34\" Ultrawide OLED, 240Hz",
    brand: "Alienware",
    category: "Monitors & Displays",
    categorySlug: "monitors-displays",
    rarity: "epic",
    displayPrice: 62_990,
    icon: "monitor",
  },
  {
    id: "kb-gasket-65",
    slug: "65-gasket-mount-board-lubed",
    name: "65% Gasket-Mount Board, Lubed",
    brand: "Keychron",
    category: "Gaming Peripherals",
    categorySlug: "gaming-peripherals",
    rarity: "epic",
    displayPrice: 11_200,
    icon: "keyboard",
  },
  {
    id: "deck-oled",
    slug: "steam-deck-oled-1tb",
    name: "Steam Deck OLED, 1TB",
    brand: "Valve",
    category: "Consoles & Handhelds",
    categorySlug: "consoles-handhelds",
    rarity: "rare",
    displayPrice: 38_500,
    icon: "handheld",
  },
  {
    id: "mouse-8k",
    slug: "8k-polling-wireless-mouse",
    name: "8K Polling Wireless Mouse",
    brand: "Razer",
    category: "Gaming Peripherals",
    categorySlug: "gaming-peripherals",
    rarity: "rare",
    displayPrice: 8_990,
    icon: "mouse",
  },
];

type CatalogSeed = Omit<Product, "id" | "slug"> & { slug: string };

const moreProducts: CatalogSeed[] = [
  { slug: "rog-matrix-rtx-5090", name: "ROG Matrix RTX 5090 Platinum", brand: "ASUS ROG", category: "Graphics Cards", categorySlug: "graphics-cards", rarity: "legendary", displayPrice: 189_995, icon: "gpu" },
  { slug: "msi-suprim-rtx-5080", name: "Suprim Liquid RTX 5080", brand: "MSI", category: "Graphics Cards", categorySlug: "graphics-cards", rarity: "epic", displayPrice: 98_750, icon: "gpu" },
  { slug: "gigabyte-aorus-rtx-5070-ti", name: "AORUS Master RTX 5070 Ti", brand: "Gigabyte", category: "Graphics Cards", categorySlug: "graphics-cards", rarity: "epic", displayPrice: 67_990, icon: "gpu" },
  { slug: "sapphire-nitro-rx-9070-xt", name: "NITRO+ Radeon RX 9070 XT", brand: "Sapphire", category: "Graphics Cards", categorySlug: "graphics-cards", rarity: "rare", displayPrice: 54_500, icon: "gpu" },
  { slug: "proart-rtx-5080", name: "ProArt GeForce RTX 5080 OC", brand: "ASUS ROG", category: "Graphics Cards", categorySlug: "graphics-cards", rarity: "epic", displayPrice: 91_995, icon: "gpu" },
  { slug: "wooting-80he", name: "80HE Hall Effect Keyboard", brand: "Wooting", category: "Gaming Peripherals", categorySlug: "gaming-peripherals", rarity: "epic", displayPrice: 14_990, icon: "keyboard" },
  { slug: "razer-huntsman-v3-pro-mini", name: "Huntsman V3 Pro Mini", brand: "Razer", category: "Gaming Peripherals", categorySlug: "gaming-peripherals", rarity: "rare", displayPrice: 12_450, icon: "keyboard" },
  { slug: "logitech-g-pro-x-superlight-2", name: "G Pro X Superlight 2", brand: "Logitech", category: "Gaming Peripherals", categorySlug: "gaming-peripherals", rarity: "rare", displayPrice: 9_995, icon: "mouse" },
  { slug: "razer-viper-v3-pro", name: "Viper V3 Pro Wireless", brand: "Razer", category: "Gaming Peripherals", categorySlug: "gaming-peripherals", rarity: "epic", displayPrice: 10_890, icon: "mouse" },
  { slug: "asus-rog-azoth-extreme", name: "ROG Azoth Extreme", brand: "ASUS ROG", category: "Gaming Peripherals", categorySlug: "gaming-peripherals", rarity: "legendary", displayPrice: 29_995, icon: "keyboard" },
  { slug: "mode-sonnet", name: "Sonnet Custom Mechanical Keyboard", brand: "Mode", category: "Gaming Peripherals", categorySlug: "gaming-peripherals", rarity: "legendary", displayPrice: 27_500, icon: "keyboard" },
  { slug: "lg-ultragear-32gs95ue", name: "UltraGear 32\" Dual-Mode OLED", brand: "LG", category: "Monitors & Displays", categorySlug: "monitors-displays", rarity: "legendary", displayPrice: 82_990, icon: "monitor" },
  { slug: "rog-swift-pg27aqdp", name: "ROG Swift 27\" 480Hz OLED", brand: "ASUS ROG", category: "Monitors & Displays", categorySlug: "monitors-displays", rarity: "legendary", displayPrice: 79_995, icon: "monitor" },
  { slug: "samsung-odyssey-g9-oled", name: "Odyssey OLED G9 49\"", brand: "Samsung", category: "Monitors & Displays", categorySlug: "monitors-displays", rarity: "epic", displayPrice: 88_500, icon: "monitor" },
  { slug: "alienware-aw2725df", name: "AW2725DF 360Hz QD-OLED", brand: "Alienware", category: "Monitors & Displays", categorySlug: "monitors-displays", rarity: "epic", displayPrice: 54_990, icon: "monitor" },
  { slug: "steam-deck-oled-limited", name: "Steam Deck OLED Limited Edition", brand: "Valve", category: "Consoles & Handhelds", categorySlug: "consoles-handhelds", rarity: "epic", displayPrice: 44_995, icon: "handheld" },
  { slug: "asus-rog-ally-x", name: "ROG Ally X 1TB", brand: "ASUS ROG", category: "Consoles & Handhelds", categorySlug: "consoles-handhelds", rarity: "epic", displayPrice: 49_995, icon: "handheld" },
  { slug: "lenovo-legion-go", name: "Legion Go 8.8\" QHD+", brand: "Lenovo", category: "Consoles & Handhelds", categorySlug: "consoles-handhelds", rarity: "rare", displayPrice: 42_995, icon: "handheld" },
  { slug: "playstation-5-pro", name: "PlayStation 5 Pro", brand: "Sony", category: "Consoles & Handhelds", categorySlug: "consoles-handhelds", rarity: "legendary", displayPrice: 48_790, icon: "handheld" },
  { slug: "ryzen-9-9950x3d", name: "Ryzen 9 9950X3D", brand: "AMD", category: "PC Components", categorySlug: "pc-components", rarity: "legendary", displayPrice: 44_950, icon: "gpu" },
  { slug: "rog-crosshair-x870e-hero", name: "ROG Crosshair X870E Hero", brand: "ASUS ROG", category: "PC Components", categorySlug: "pc-components", rarity: "epic", displayPrice: 42_995, icon: "gpu" },
  { slug: "corsair-dominator-64gb", name: "Dominator Titanium 64GB DDR5", brand: "Corsair", category: "PC Components", categorySlug: "pc-components", rarity: "epic", displayPrice: 21_500, icon: "gpu" },
  { slug: "samsung-990-pro-4tb", name: "990 Pro 4TB NVMe SSD", brand: "Samsung", category: "PC Components", categorySlug: "pc-components", rarity: "rare", displayPrice: 24_990, icon: "gpu" },
  { slug: "noctua-nh-d15-g2", name: "NH-D15 G2 CPU Cooler", brand: "Noctua", category: "PC Components", categorySlug: "pc-components", rarity: "rare", displayPrice: 9_850, icon: "gpu" },
  { slug: "rog-strix-scar-18", name: "ROG Strix SCAR 18 RTX 5090", brand: "ASUS ROG", category: "Laptops & Tablets", categorySlug: "laptops-tablets", rarity: "legendary", displayPrice: 289_995, icon: "monitor" },
  { slug: "razer-blade-16", name: "Blade 16 OLED RTX 5080", brand: "Razer", category: "Laptops & Tablets", categorySlug: "laptops-tablets", rarity: "legendary", displayPrice: 259_990, icon: "monitor" },
  { slug: "lenovo-legion-pro-7i", name: "Legion Pro 7i Gen 10", brand: "Lenovo", category: "Laptops & Tablets", categorySlug: "laptops-tablets", rarity: "epic", displayPrice: 189_995, icon: "monitor" },
  { slug: "ipad-pro-m4-13", name: "iPad Pro 13-inch M4", brand: "Apple", category: "Laptops & Tablets", categorySlug: "laptops-tablets", rarity: "rare", displayPrice: 92_990, icon: "monitor" },
  { slug: "shure-sm7db", name: "SM7dB Active Dynamic Microphone", brand: "Shure", category: "Audio & Streaming", categorySlug: "audio-streaming", rarity: "epic", displayPrice: 31_500, icon: "headset" },
  { slug: "steelseries-arctis-nova-pro", name: "Arctis Nova Pro Wireless", brand: "SteelSeries", category: "Audio & Streaming", categorySlug: "audio-streaming", rarity: "rare", displayPrice: 21_499, icon: "headset" },
  { slug: "elgato-stream-deck-plus", name: "Stream Deck +", brand: "Elgato", category: "Audio & Streaming", categorySlug: "audio-streaming", rarity: "epic", displayPrice: 13_990, icon: "keyboard" },
  { slug: "audeze-maxwell", name: "Maxwell Wireless Gaming Headset", brand: "Audeze", category: "Audio & Streaming", categorySlug: "audio-streaming", rarity: "legendary", displayPrice: 19_995, icon: "headset" },
  { slug: "secretlab-titan-evo", name: "Titan Evo Nanogen Chair", brand: "Secretlab", category: "Desk Setup", categorySlug: "desk-setup", rarity: "epic", displayPrice: 42_500, icon: "monitor" },
  { slug: "grovemade-desk-shelf", name: "Solid Walnut Desk Shelf", brand: "Grovemade", category: "Desk Setup", categorySlug: "desk-setup", rarity: "rare", displayPrice: 22_990, icon: "monitor" },
  { slug: "balolo-setup-cockpit", name: "Setup Cockpit Large", brand: "Balolo", category: "Desk Setup", categorySlug: "desk-setup", rarity: "epic", displayPrice: 18_500, icon: "monitor" },
  { slug: "orbitkey-desk-mat", name: "Premium Leather Desk Mat", brand: "Orbitkey", category: "Desk Setup", categorySlug: "desk-setup", rarity: "rare", displayPrice: 6_450, icon: "keyboard" },
  { slug: "peak-design-tech-pouch", name: "Tech Pouch V2", brand: "Peak Design", category: "Tech Accessories", categorySlug: "tech-accessories", rarity: "rare", displayPrice: 4_990, icon: "headset" },
];

export const catalogProducts: Product[] = [
  ...featuredProducts,
  ...moreProducts.map((product) => ({ ...product, id: product.slug })),
];

export const php = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
});
