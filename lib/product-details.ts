import type { Product } from "@/lib/products";

export type ProductReview = {
  author: string;
  date: string;
  body: string;
};

export const productReviews: ProductReview[] = [
  {
    author: "Marco_PH",
    date: "2 days ago",
    body: "Added it to cart at 2am out of pure impulse. Total stayed ₱0.00. Felt amazing. Still don’t have the hardware.",
  },
  {
    author: "keyboardgremlin",
    date: "1 week ago",
    body: "My courier got abducted by a UFO during tracking. Still ten out of ten, would hoard again.",
  },
  {
    author: "notarealbuyer",
    date: "3 weeks ago",
    body: "The checkout animation said “bank said yes (lie)” and honestly that’s the most honest thing any store has ever told me.",
  },
];

const categorySpecs: Record<string, Array<[string, string]>> = {
  "graphics-cards": [
    ["Memory", "32GB GDDR7"],
    ["Boost clock", "2.81 GHz"],
    ["Interface", "PCIe 5.0 x16"],
    ["Power draw", "575W (your dignity: 0W)"],
  ],
  "gaming-peripherals": [
    ["Connection", "2.4GHz / USB-C"],
    ["Polling rate", "8,000Hz, unnecessarily"],
    ["Latency", "Lower than group-chat replies"],
    ["RGB", "Yes, despite all advice"],
  ],
  "monitors-displays": [
    ["Panel", "QD-OLED"],
    ["Refresh rate", "240Hz"],
    ["Response time", "0.03ms"],
    ["Burn-in anxiety", "Factory calibrated"],
  ],
  "consoles-handhelds": [
    ["Storage", "1TB NVMe"],
    ["Display", "OLED, suspiciously vivid"],
    ["Battery", "Long enough for one more run"],
    ["Portability", "Bag technically required"],
  ],
  "pc-components": [
    ["Interface", "Latest available standard"],
    ["Cooling", "Aggressively adequate"],
    ["Compatibility", "Check twice, order never"],
    ["Power draw", "Between reasonable and heroic"],
  ],
  "laptops-tablets": [
    ["Display", "High-refresh OLED"],
    ["Memory", "32GB unified ambition"],
    ["Storage", "1TB NVMe"],
    ["Battery", "Manufacturer remains optimistic"],
  ],
  "audio-streaming": [
    ["Connection", "USB-C / Wireless"],
    ["Sample rate", "96kHz / 24-bit"],
    ["Noise floor", "Below keyboard volume"],
    ["Mute button", "Career preserving"],
  ],
  "desk-setup": [
    ["Material", "Premium, visibly so"],
    ["Assembly", "One hex key, two opinions"],
    ["Desk footprint", "Negotiable"],
    ["Productivity gain", "Pending peer review"],
  ],
  "tech-accessories": [
    ["Material", "Weatherproof recycled nylon"],
    ["Capacity", "Every cable except the needed one"],
    ["Warranty", "Fabricated, three years"],
    ["Rarity tier", "Rare"],
  ],
};

export function getProductSpecs(product: Product) {
  const exact = product.slug === "rtx-5090-founders-edition"
    ? [
        ["Memory", "32GB GDDR7"],
        ["CUDA cores", "21,760"],
        ["Boost clock", "2.41 GHz"],
        ["Power draw", "575W (your dignity: 0W)"],
      ]
    : categorySpecs[product.categorySlug] ?? categorySpecs["tech-accessories"];

  return [...exact, ["Rarity tier", product.rarity[0].toUpperCase() + product.rarity.slice(1)]];
}

export function getProductDescription(product: Product) {
  return [
    `The ${product.name} is the ${product.category.toLowerCase()} your group chat has already discussed beyond any reasonable limit. Real specifications, real upgrade temptation, and a real-looking ${product.brand} badge — none of which you will pay for. Add it to your cart, watch the total remain at zero, and enjoy retail therapy with none of the financial consequences.`,
    "Comes with a fabricated 3-year warranty that covers nothing, because there is nothing to cover.",
  ];
}
