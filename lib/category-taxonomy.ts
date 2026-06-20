export type CategoryTaxonomy = {
  slug: string;
  name: string;
  subcategories: string[];
};

export const categoryTaxonomy: CategoryTaxonomy[] = [
  { slug: "gaming-peripherals", name: "Gaming Peripherals", subcategories: ["Keyboards", "Mice"] },
  { slug: "monitors-displays", name: "Monitors & Displays", subcategories: ["OLED", "QD-OLED", "Mini-LED"] },
  { slug: "graphics-cards", name: "Graphics Cards", subcategories: ["Flagship", "High-end"] },
  { slug: "pc-components", name: "PC Components", subcategories: ["CPUs", "RAM", "Storage", "PC Cases", "Power Supplies"] },
  { slug: "gaming-pcs", name: "Gaming PCs", subcategories: ["1440p Enthusiast", "4K Flagship", "Small Form Factor", "Creator Workstation"] },
  { slug: "consoles-handhelds", name: "Consoles & Handhelds", subcategories: ["Home Consoles", "Hybrid Consoles", "Dedicated Handhelds"] },
  { slug: "laptops-tablets", name: "Laptops & Tablets", subcategories: ["Gaming Laptops", "Creator Laptops", "Creator Tablets", "Gaming Tablets"] },
  { slug: "audio-streaming", name: "Audio & Streaming", subcategories: ["Headsets & Headphones", "Microphones", "Streaming Gear"] },
  { slug: "desk-setup", name: "Desk Setup & Furniture", subcategories: ["Chairs", "Desks", "Lighting"] },
  { slug: "tech-accessories", name: "Tech Accessories", subcategories: ["Cable Management", "Chargers", "Cases & Pouches", "Mousepads", "Wrist Rests", "Privacy Accessories"] },
];
