export type Rarity = "rare" | "epic" | "legendary";

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
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
    rarity: "rare",
    displayPrice: 8_990,
    icon: "mouse",
  },
];

export const php = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
});
