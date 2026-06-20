import { catalogProducts, type Product } from "./products";

export type StoreCollection = {
  slug: string;
  name: string;
  description: string;
  productIds: string[];
};

export const storeCollections: StoreCollection[] = [
  {
    slug: "gpu-hunters-picks",
    name: "GPU Hunter's Picks",
    description:
      "For the friend who still refreshes restock pages at 3am out of habit. Every flagship card you've argued about in the group chat, priced the only way that makes sense.",
    productIds: [
      "gpu-5090",
      "rtx-5090-liquid-cooled-build",
      "msi-suprim-rtx-5080",
      "rog-matrix-rtx-5090",
      "sapphire-nitro-rx-9070-xt",
      "proart-rtx-5080",
      "rtx-5080-16gb-triple-fan",
      "rtx-5090-ti-liquid-metal",
      "asrock-taichi-rx-9070-xt",
      "powercolor-red-devil-rx-9070-xt",
      "gigabyte-aorus-rtx-5080-master",
      "zotac-amp-extreme-rtx-5090",
      "pny-xlr8-rtx-5080",
      "msi-vanguard-rtx-5090",
    ],
  },
  {
    slug: "handheld-heaven",
    name: "Handheld Heaven",
    description:
      "Entire gaming libraries, now available to ignore from the sofa. Battery percentage remains a personal matter.",
    productIds: ["deck-oled", "steam-deck-oled-limited", "asus-rog-ally-x", "lenovo-legion-go-2tb", "playstation-5-pro", "ipad-pro-m4-13"],
  },
  {
    slug: "streamer-starter-kit",
    name: "Streamer Starter Kit",
    description:
      "Everything required to broadcast to three loyal viewers, including the person checking whether the microphone is muted.",
    productIds: ["shure-sm7db", "steelseries-arctis-nova-pro", "elgato-stream-deck-plus", "audeze-maxwell", "wooting-80he", "logitech-g-pro-x-superlight-2"],
  },
  {
    slug: "ultimate-rgb-disaster",
    name: "Ultimate RGB Disaster",
    description:
      "A carefully synchronized collection of lights that will immediately forget their settings after the next driver update.",
    productIds: ["rog-matrix-rtx-5090", "asus-rog-azoth-extreme", "razer-huntsman-v3-pro-mini", "razer-viper-v3-pro", "corsair-dominator-64gb", "rog-strix-scar-18", "rog-swift-pg27aqdp"],
  },
  {
    slug: "keyboard-addicts",
    name: "Keyboard Addicts",
    description:
      "For people who can identify switch materials by sound but still type the password incorrectly on the first attempt.",
    productIds: ["keychron-q1-max", "wooting-80he", "razer-huntsman-v3-pro-mini", "asus-rog-azoth-extreme", "mode-sonnet", "logitech-g915-x-lightspeed", "elgato-stream-deck-plus"],
  },
  {
    slug: "console-wars-2026",
    name: "Console Wars 2026",
    description:
      "Choose a side, then quietly buy the other side's exclusives six months later. Diplomacy remains fully stocked.",
    productIds: ["playstation-5-pro", "deck-oled", "steam-deck-oled-limited", "asus-rog-ally-x", "lenovo-legion-go-2tb"],
  },
];

export function getCollection(slug: string) {
  return storeCollections.find((collection) => collection.slug === slug);
}

export function getCollectionProducts(collection: StoreCollection): Product[] {
  return collection.productIds
    .map((id) => catalogProducts.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));
}
