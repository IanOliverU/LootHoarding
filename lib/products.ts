export type Rarity = "rare" | "epic" | "legendary";

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  attributes: string[];
  rarity: Rarity;
  displayPrice: number;
  icon: "gpu" | "keyboard" | "handheld" | "monitor" | "headset" | "mouse";
};

type ProductSeed = Omit<Product, "id"> & { id?: string };

const productSeeds: ProductSeed[] = [
  // Gaming Peripherals — premium keyboards and mice only.
  { slug: "keychron-q1-max", name: "Q1 Max 75% Gasket Keyboard", brand: "Keychron", category: "Gaming Peripherals", categorySlug: "gaming-peripherals", subcategory: "Keyboards", attributes: ["75%", "Premium tactile", "Gasket-mount", "Hot-swappable PCB", "Tri-mode"], rarity: "epic", displayPrice: 14_990, icon: "keyboard" },
  { slug: "wooting-80he", name: "80HE Hall Effect Keyboard", brand: "Wooting", category: "Gaming Peripherals", categorySlug: "gaming-peripherals", subcategory: "Keyboards", attributes: ["75%", "Hall-effect / magnetic", "Gasket-mount", "Hot-swappable PCB", "Wired-only"], rarity: "epic", displayPrice: 14_990, icon: "keyboard" },
  { slug: "razer-huntsman-v3-pro-mini", name: "Huntsman V3 Pro Mini", brand: "Razer", category: "Gaming Peripherals", categorySlug: "gaming-peripherals", subcategory: "Keyboards", attributes: ["60%", "Optical switches", "Hot-swappable PCB", "Wired-only"], rarity: "rare", displayPrice: 12_450, icon: "keyboard" },
  { slug: "asus-rog-azoth-extreme", name: "ROG Azoth Extreme", brand: "ASUS ROG", category: "Gaming Peripherals", categorySlug: "gaming-peripherals", subcategory: "Keyboards", attributes: ["75%", "Premium linear", "Gasket-mount", "Hot-swappable PCB", "Tri-mode"], rarity: "legendary", displayPrice: 29_995, icon: "keyboard" },
  { slug: "mode-sonnet", name: "Sonnet Custom Mechanical Keyboard", brand: "Mode", category: "Gaming Peripherals", categorySlug: "gaming-peripherals", subcategory: "Keyboards", attributes: ["75%", "Premium linear", "Top-mount", "Hot-swappable PCB", "Wired-only"], rarity: "legendary", displayPrice: 27_500, icon: "keyboard" },
  { slug: "logitech-g915-x-lightspeed", name: "G915 X Lightspeed Full-Size", brand: "Logitech", category: "Gaming Peripherals", categorySlug: "gaming-peripherals", subcategory: "Keyboards", attributes: ["Full-size", "Optical switches", "Hot-swappable PCB", "Tri-mode"], rarity: "epic", displayPrice: 15_995, icon: "keyboard" },
  { slug: "logitech-g-pro-x-superlight-2", name: "G Pro X Superlight 2", brand: "Logitech", category: "Gaming Peripherals", categorySlug: "gaming-peripherals", subcategory: "Mice", attributes: ["Symmetrical esports shape", "Wireless 2.4GHz", "Ultralight <55g", "Flagship optical sensor"], rarity: "rare", displayPrice: 9_995, icon: "mouse" },
  { slug: "razer-viper-v3-pro", name: "Viper V3 Pro Wireless", brand: "Razer", category: "Gaming Peripherals", categorySlug: "gaming-peripherals", subcategory: "Mice", attributes: ["Symmetrical esports shape", "Wireless 2.4GHz", "Ultralight <55g", "Flagship optical sensor"], rarity: "epic", displayPrice: 10_890, icon: "mouse" },
  { slug: "razer-deathadder-v3-pro", name: "DeathAdder V3 Pro", brand: "Razer", category: "Gaming Peripherals", categorySlug: "gaming-peripherals", subcategory: "Mice", attributes: ["Ergonomic esports shape", "Wireless 2.4GHz", "Lightweight 55–75g", "Flagship optical sensor"], rarity: "epic", displayPrice: 9_890, icon: "mouse" },
  { slug: "finalmouse-ultralightx-competition", name: "UltralightX Competition", brand: "Finalmouse", category: "Gaming Peripherals", categorySlug: "gaming-peripherals", subcategory: "Mice", attributes: ["Symmetrical esports shape", "Wireless 2.4GHz", "Ultralight <55g", "Flagship optical sensor"], rarity: "legendary", displayPrice: 12_990, icon: "mouse" },

  // Monitors & Displays — OLED, QD-OLED, or high-zone Mini-LED at 160Hz+.
  { slug: "34-ultrawide-oled-240hz", id: "monitor-ultrawide", name: "34\" Ultrawide OLED, 240Hz", brand: "Alienware", category: "Monitors & Displays", categorySlug: "monitors-displays", subcategory: "QD-OLED", attributes: ["240Hz", "Ultra-wide QHD", "Curved", "Ultrawide 21:9"], rarity: "epic", displayPrice: 62_990, icon: "monitor" },
  { slug: "lg-ultragear-32gs95ue", name: "UltraGear 32\" Dual-Mode OLED", brand: "LG", category: "Monitors & Displays", categorySlug: "monitors-displays", subcategory: "OLED", attributes: ["240Hz", "4K UHD"], rarity: "legendary", displayPrice: 82_990, icon: "monitor" },
  { slug: "rog-swift-pg27aqdp", name: "ROG Swift 27\" 480Hz OLED", brand: "ASUS ROG", category: "Monitors & Displays", categorySlug: "monitors-displays", subcategory: "OLED", attributes: ["360Hz+", "1440p QHD"], rarity: "legendary", displayPrice: 79_995, icon: "monitor" },
  { slug: "samsung-odyssey-g9-oled", name: "Odyssey OLED G9 49\"", brand: "Samsung", category: "Monitors & Displays", categorySlug: "monitors-displays", subcategory: "QD-OLED", attributes: ["240Hz", "5K / Ultra-wide QHD", "Curved", "Super ultrawide 32:9"], rarity: "epic", displayPrice: 88_500, icon: "monitor" },
  { slug: "alienware-aw2725df", name: "AW2725DF 360Hz QD-OLED", brand: "Alienware", category: "Monitors & Displays", categorySlug: "monitors-displays", subcategory: "QD-OLED", attributes: ["360Hz+", "1440p QHD"], rarity: "epic", displayPrice: 54_990, icon: "monitor" },
  { slug: "samsung-odyssey-neo-g8", name: "Odyssey Neo G8 32\" Mini-LED", brand: "Samsung", category: "Monitors & Displays", categorySlug: "monitors-displays", subcategory: "Mini-LED", attributes: ["240Hz", "4K UHD", "Curved"], rarity: "legendary", displayPrice: 76_990, icon: "monitor" },

  // Graphics Cards — xx80/xx90-class only, with at least 16GB VRAM.
  { slug: "rtx-5090-founders-edition", id: "gpu-5090", name: "RTX 5090 Founders Edition", brand: "NVIDIA", category: "Graphics Cards", categorySlug: "graphics-cards", subcategory: "Flagship", attributes: ["Air-cooled open-air", "32GB+ VRAM"], rarity: "legendary", displayPrice: 149_999, icon: "gpu" },
  { slug: "rog-matrix-rtx-5090", name: "ROG Matrix RTX 5090 Platinum", brand: "ASUS ROG", category: "Graphics Cards", categorySlug: "graphics-cards", subcategory: "Flagship", attributes: ["Hybrid AIO + fan", "32GB+ VRAM"], rarity: "legendary", displayPrice: 189_995, icon: "gpu" },
  { slug: "msi-suprim-rtx-5080", name: "Suprim Liquid RTX 5080", brand: "MSI", category: "Graphics Cards", categorySlug: "graphics-cards", subcategory: "High-end", attributes: ["Hybrid AIO + fan", "16GB VRAM"], rarity: "epic", displayPrice: 98_750, icon: "gpu" },
  { slug: "sapphire-nitro-rx-9070-xt", name: "NITRO+ Radeon RX 9070 XT", brand: "Sapphire", category: "Graphics Cards", categorySlug: "graphics-cards", subcategory: "High-end", attributes: ["Air-cooled open-air", "16GB VRAM"], rarity: "epic", displayPrice: 54_500, icon: "gpu" },
  { slug: "proart-rtx-5080", name: "ProArt GeForce RTX 5080 OC", brand: "ASUS ROG", category: "Graphics Cards", categorySlug: "graphics-cards", subcategory: "High-end", attributes: ["Air-cooled open-air", "16GB VRAM"], rarity: "epic", displayPrice: 91_995, icon: "gpu" },
  { slug: "rtx-5090-liquid-cooled-build", name: "RTX 5090 32GB Liquid-Cooled Edition", brand: "Corsair", category: "Graphics Cards", categorySlug: "graphics-cards", subcategory: "Flagship", attributes: ["Full liquid-cooled", "32GB+ VRAM"], rarity: "legendary", displayPrice: 310_000, icon: "gpu" },
  { slug: "rtx-5080-16gb-triple-fan", name: "RTX 5080 16GB, Triple Fan", brand: "Palit", category: "Graphics Cards", categorySlug: "graphics-cards", subcategory: "High-end", attributes: ["Air-cooled open-air", "16GB VRAM"], rarity: "epic", displayPrice: 89_990, icon: "gpu" },
  { slug: "rtx-5090-ti-liquid-metal", name: "RTX 5090 Ti, Liquid Metal Edition", brand: "ASUS ROG", category: "Graphics Cards", categorySlug: "graphics-cards", subcategory: "Flagship", attributes: ["Full liquid-cooled", "32GB+ VRAM"], rarity: "epic", displayPrice: 189_999, icon: "gpu" },
  { slug: "asrock-taichi-rx-9070-xt", name: "Taichi Radeon RX 9070 XT", brand: "ASRock", category: "Graphics Cards", categorySlug: "graphics-cards", subcategory: "High-end", attributes: ["Air-cooled open-air", "16GB VRAM"], rarity: "epic", displayPrice: 59_990, icon: "gpu" },
  { slug: "powercolor-red-devil-rx-9070-xt", name: "Red Devil RX 9070 XT", brand: "PowerColor", category: "Graphics Cards", categorySlug: "graphics-cards", subcategory: "High-end", attributes: ["Air-cooled open-air", "16GB VRAM"], rarity: "epic", displayPrice: 61_500, icon: "gpu" },
  { slug: "gigabyte-aorus-rtx-5080-master", name: "AORUS Master RTX 5080", brand: "Gigabyte", category: "Graphics Cards", categorySlug: "graphics-cards", subcategory: "High-end", attributes: ["Air-cooled open-air", "16GB VRAM"], rarity: "epic", displayPrice: 96_990, icon: "gpu" },
  { slug: "zotac-amp-extreme-rtx-5090", name: "AMP Extreme Infinity RTX 5090", brand: "Zotac", category: "Graphics Cards", categorySlug: "graphics-cards", subcategory: "Flagship", attributes: ["Air-cooled open-air", "32GB+ VRAM"], rarity: "epic", displayPrice: 174_990, icon: "gpu" },
  { slug: "pny-xlr8-rtx-5080", name: "XLR8 Gaming RTX 5080 OC", brand: "PNY", category: "Graphics Cards", categorySlug: "graphics-cards", subcategory: "High-end", attributes: ["Air-cooled open-air", "16GB VRAM"], rarity: "epic", displayPrice: 87_500, icon: "gpu" },
  { slug: "msi-vanguard-rtx-5090", name: "Vanguard SOC RTX 5090", brand: "MSI", category: "Graphics Cards", categorySlug: "graphics-cards", subcategory: "Flagship", attributes: ["Air-cooled open-air", "32GB+ VRAM"], rarity: "epic", displayPrice: 179_995, icon: "gpu" },

  // PC Components — flagship CPUs, DDR5/ECC, NVMe, premium cases, Platinum/Titanium PSUs.
  { slug: "ryzen-9-9950x3d", name: "Ryzen 9 9950X3D", brand: "AMD", category: "PC Components", categorySlug: "pc-components", subcategory: "CPUs", attributes: ["Flagship consumer chip", "High-end desktop"], rarity: "legendary", displayPrice: 44_950, icon: "gpu" },
  { slug: "core-ultra-9-285k", name: "Core Ultra 9 285K", brand: "Intel", category: "PC Components", categorySlug: "pc-components", subcategory: "CPUs", attributes: ["Flagship consumer chip", "High-end desktop"], rarity: "epic", displayPrice: 36_995, icon: "gpu" },
  { slug: "threadripper-pro-7995wx", name: "Ryzen Threadripper PRO 7995WX", brand: "AMD", category: "PC Components", categorySlug: "pc-components", subcategory: "CPUs", attributes: ["Workstation/server-class"], rarity: "legendary", displayPrice: 629_995, icon: "gpu" },
  { slug: "corsair-dominator-64gb", name: "Dominator Titanium 64GB DDR5", brand: "Corsair", category: "PC Components", categorySlug: "pc-components", subcategory: "RAM", attributes: ["DDR5", "High-frequency / low-latency"], rarity: "epic", displayPrice: 21_500, icon: "gpu" },
  { slug: "gskill-trident-z5-royal-96gb", name: "Trident Z5 Royal 96GB DDR5", brand: "G.Skill", category: "PC Components", categorySlug: "pc-components", subcategory: "RAM", attributes: ["DDR5", "High-frequency / low-latency"], rarity: "legendary", displayPrice: 34_990, icon: "gpu" },
  { slug: "kingston-server-premier-256gb-ecc", name: "Server Premier 256GB ECC DDR5", brand: "Kingston", category: "PC Components", categorySlug: "pc-components", subcategory: "RAM", attributes: ["DDR5", "ECC workstation-grade"], rarity: "legendary", displayPrice: 79_990, icon: "gpu" },
  { slug: "samsung-990-pro-4tb", name: "990 Pro 4TB NVMe SSD", brand: "Samsung", category: "PC Components", categorySlug: "pc-components", subcategory: "Storage", attributes: ["NVMe SSD", "PCIe Gen4", "Flagship consumer tier"], rarity: "epic", displayPrice: 24_990, icon: "gpu" },
  { slug: "crucial-t705-4tb", name: "T705 4TB PCIe Gen5 NVMe", brand: "Crucial", category: "PC Components", categorySlug: "pc-components", subcategory: "Storage", attributes: ["NVMe SSD", "PCIe Gen5"], rarity: "legendary", displayPrice: 38_990, icon: "gpu" },
  { slug: "formd-t1-titanium", name: "T1 Titanium CNC Mini-ITX Case", brand: "FormD", category: "PC Components", categorySlug: "pc-components", subcategory: "PC Cases", attributes: ["Mini-ITX", "Premium aluminum"], rarity: "legendary", displayPrice: 19_500, icon: "gpu" },
  { slug: "lian-li-o11d-evo-rgb", name: "O11D EVO RGB Mid-Tower", brand: "Lian Li", category: "PC Components", categorySlug: "pc-components", subcategory: "PC Cases", attributes: ["Mid-tower ATX", "Tempered glass"], rarity: "epic", displayPrice: 13_990, icon: "gpu" },
  { slug: "corsair-9000d-airflow", name: "9000D RGB Airflow Full Tower", brand: "Corsair", category: "PC Components", categorySlug: "pc-components", subcategory: "PC Cases", attributes: ["Full tower E-ATX", "Flagship premium build"], rarity: "legendary", displayPrice: 34_995, icon: "gpu" },
  { slug: "corsair-ax1600i", name: "AX1600i Digital Titanium PSU", brand: "Corsair", category: "PC Components", categorySlug: "pc-components", subcategory: "Power Supplies", attributes: ["80+ Titanium", "1600W"], rarity: "legendary", displayPrice: 39_990, icon: "gpu" },
  { slug: "seasonic-prime-px-1600", name: "PRIME PX-1600 Platinum PSU", brand: "Seasonic", category: "PC Components", categorySlug: "pc-components", subcategory: "Power Supplies", attributes: ["80+ Platinum", "1600W"], rarity: "epic", displayPrice: 31_500, icon: "gpu" },

  // Gaming PCs — liquid-cooled enthusiast, flagship, SFF, and creator builds.
  { slug: "origin-millennium-rtx-5090", name: "MILLENNIUM RTX 5090 Custom Loop", brand: "Origin PC", category: "Gaming PCs", categorySlug: "gaming-pcs", subcategory: "4K Flagship", attributes: ["Custom loop", "Boutique build"], rarity: "legendary", displayPrice: 489_995, icon: "monitor" },
  { slug: "falcon-northwest-tiki-5090", name: "TIKI RTX 5090 Boutique SFF", brand: "Falcon Northwest", category: "Gaming PCs", categorySlug: "gaming-pcs", subcategory: "Small Form Factor", attributes: ["AIO liquid-cooled", "Premium boutique build"], rarity: "legendary", displayPrice: 419_990, icon: "monitor" },
  { slug: "corsair-one-i500", name: "ONE i500 Compact Gaming PC", brand: "Corsair", category: "Gaming PCs", categorySlug: "gaming-pcs", subcategory: "Small Form Factor", attributes: ["AIO liquid-cooled", "4K flagship"], rarity: "epic", displayPrice: 289_995, icon: "monitor" },
  { slug: "maingear-rush-5090", name: "RUSH RTX 5090 Apex Build", brand: "Maingear", category: "Gaming PCs", categorySlug: "gaming-pcs", subcategory: "4K Flagship", attributes: ["Custom loop", "Boutique build"], rarity: "legendary", displayPrice: 529_995, icon: "monitor" },
  { slug: "puget-genesis-threadripper", name: "Genesis Threadripper Creator Rig", brand: "Puget Systems", category: "Gaming PCs", categorySlug: "gaming-pcs", subcategory: "Creator Workstation", attributes: ["Custom loop", "Streaming/content-creation flagship"], rarity: "legendary", displayPrice: 649_995, icon: "monitor" },
  { slug: "nzxt-player-three-prime", name: "Player Three Prime Enthusiast PC", brand: "NZXT", category: "Gaming PCs", categorySlug: "gaming-pcs", subcategory: "1440p Enthusiast", attributes: ["AIO liquid-cooled", "Premium build"], rarity: "epic", displayPrice: 229_995, icon: "monitor" },

  // Consoles & Handhelds — flagship variants with 1TB+ storage only.
  { slug: "steam-deck-oled-1tb", id: "deck-oled", name: "Steam Deck OLED, 1TB", brand: "Valve", category: "Consoles & Handhelds", categorySlug: "consoles-handhelds", subcategory: "Dedicated Handhelds", attributes: ["Flagship OLED model", "1TB storage"], rarity: "rare", displayPrice: 38_500, icon: "handheld" },
  { slug: "steam-deck-oled-limited", name: "Steam Deck OLED Limited Edition, 1TB", brand: "Valve", category: "Consoles & Handhelds", categorySlug: "consoles-handhelds", subcategory: "Dedicated Handhelds", attributes: ["Flagship OLED model", "1TB storage"], rarity: "epic", displayPrice: 44_995, icon: "handheld" },
  { slug: "asus-rog-ally-x", name: "ROG Ally X, 1TB", brand: "ASUS ROG", category: "Consoles & Handhelds", categorySlug: "consoles-handhelds", subcategory: "Dedicated Handhelds", attributes: ["Flagship PC handheld", "1TB storage"], rarity: "epic", displayPrice: 49_995, icon: "handheld" },
  { slug: "lenovo-legion-go-2tb", name: "Legion Go 8.8\" QHD+, 2TB", brand: "Lenovo", category: "Consoles & Handhelds", categorySlug: "consoles-handhelds", subcategory: "Hybrid Consoles", attributes: ["Dockable high-spec model", "2TB storage"], rarity: "epic", displayPrice: 52_995, icon: "handheld" },
  { slug: "playstation-5-pro", name: "PlayStation 5 Pro, 2TB", brand: "Sony", category: "Consoles & Handhelds", categorySlug: "consoles-handhelds", subcategory: "Home Consoles", attributes: ["Flagship Pro variant", "2TB storage"], rarity: "legendary", displayPrice: 48_790, icon: "handheld" },

  // Laptops & Tablets — desktop replacements, creator workstations, and flagship tablets.
  { slug: "rog-strix-scar-18", name: "ROG Strix SCAR 18 RTX 5090", brand: "ASUS ROG", category: "Laptops & Tablets", categorySlug: "laptops-tablets", subcategory: "Gaming Laptops", attributes: ["Desktop-replacement", "Top-spec GPU tier"], rarity: "legendary", displayPrice: 289_995, icon: "monitor" },
  { slug: "razer-blade-16", name: "Blade 16 OLED RTX 5080", brand: "Razer", category: "Laptops & Tablets", categorySlug: "laptops-tablets", subcategory: "Gaming Laptops", attributes: ["Flagship gaming laptop", "Top-spec GPU tier"], rarity: "legendary", displayPrice: 259_990, icon: "monitor" },
  { slug: "lenovo-legion-pro-7i", name: "Legion Pro 7i Gen 10", brand: "Lenovo", category: "Laptops & Tablets", categorySlug: "laptops-tablets", subcategory: "Gaming Laptops", attributes: ["Desktop-replacement", "Top-spec GPU tier"], rarity: "epic", displayPrice: 189_995, icon: "monitor" },
  { slug: "macbook-pro-16-m4-max", name: "MacBook Pro 16-inch M4 Max", brand: "Apple", category: "Laptops & Tablets", categorySlug: "laptops-tablets", subcategory: "Creator Laptops", attributes: ["Workstation / creator", "Flagship spec"], rarity: "legendary", displayPrice: 249_990, icon: "monitor" },
  { slug: "ipad-pro-m4-13", name: "iPad Pro 13-inch M4, 2TB", brand: "Apple", category: "Laptops & Tablets", categorySlug: "laptops-tablets", subcategory: "Creator Tablets", attributes: ["Active stylus", "Top-spec display"], rarity: "epic", displayPrice: 149_990, icon: "monitor" },
  { slug: "rog-flow-z13", name: "ROG Flow Z13 Gaming Tablet", brand: "ASUS ROG", category: "Laptops & Tablets", categorySlug: "laptops-tablets", subcategory: "Gaming Tablets", attributes: ["Gaming-oriented tablet", "Flagship spec"], rarity: "legendary", displayPrice: 199_995, icon: "monitor" },

  // Audio & Streaming — flagship listening, recording, and broadcast gear.
  { slug: "steelseries-arctis-nova-pro", name: "Arctis Nova Pro Wireless", brand: "SteelSeries", category: "Audio & Streaming", categorySlug: "audio-streaming", subcategory: "Headsets & Headphones", attributes: ["Wireless gaming headset"], rarity: "epic", displayPrice: 21_499, icon: "headset" },
  { slug: "audeze-maxwell", name: "Maxwell Wireless Gaming Headset", brand: "Audeze", category: "Audio & Streaming", categorySlug: "audio-streaming", subcategory: "Headsets & Headphones", attributes: ["Closed-back gaming headset", "Wireless gaming headset"], rarity: "legendary", displayPrice: 19_995, icon: "headset" },
  { slug: "sennheiser-hd-800-s", name: "HD 800 S Reference Headphones", brand: "Sennheiser", category: "Audio & Streaming", categorySlug: "audio-streaming", subcategory: "Headsets & Headphones", attributes: ["Open-back headphones"], rarity: "legendary", displayPrice: 109_990, icon: "headset" },
  { slug: "64-audio-u12t", name: "U12t Universal In-Ear Monitors", brand: "64 Audio", category: "Audio & Streaming", categorySlug: "audio-streaming", subcategory: "Headsets & Headphones", attributes: ["In-ear monitors (IEMs)"], rarity: "legendary", displayPrice: 129_995, icon: "headset" },
  { slug: "shure-sm7db", name: "SM7dB Active Dynamic Microphone", brand: "Shure", category: "Audio & Streaming", categorySlug: "audio-streaming", subcategory: "Microphones", attributes: ["Dynamic broadcast microphone"], rarity: "epic", displayPrice: 31_500, icon: "headset" },
  { slug: "elgato-wave-3", name: "Wave:3 USB Condenser Microphone", brand: "Elgato", category: "Audio & Streaming", categorySlug: "audio-streaming", subcategory: "Microphones", attributes: ["USB condenser microphone"], rarity: "rare", displayPrice: 9_990, icon: "headset" },
  { slug: "neumann-tlm-103", name: "TLM 103 Studio Microphone", brand: "Neumann", category: "Audio & Streaming", categorySlug: "audio-streaming", subcategory: "Microphones", attributes: ["XLR condenser microphone"], rarity: "legendary", displayPrice: 89_990, icon: "headset" },
  { slug: "elgato-stream-deck-plus", name: "Stream Deck +", brand: "Elgato", category: "Audio & Streaming", categorySlug: "audio-streaming", subcategory: "Streaming Gear", attributes: ["Stream deck / macro pad"], rarity: "epic", displayPrice: 13_990, icon: "keyboard" },
  { slug: "elgato-4k-x", name: "4K X External Capture Card", brand: "Elgato", category: "Audio & Streaming", categorySlug: "audio-streaming", subcategory: "Streaming Gear", attributes: ["Capture card"], rarity: "epic", displayPrice: 16_990, icon: "headset" },
  { slug: "elgato-key-light", name: "Key Light Studio Panel", brand: "Elgato", category: "Audio & Streaming", categorySlug: "audio-streaming", subcategory: "Streaming Gear", attributes: ["Key light"], rarity: "rare", displayPrice: 12_990, icon: "monitor" },

  // Desk Setup & Furniture — premium chairs, desks, and ambience lighting.
  { slug: "herman-miller-aeron", name: "Aeron Remastered Chair", brand: "Herman Miller", category: "Desk Setup & Furniture", categorySlug: "desk-setup", subcategory: "Chairs", attributes: ["Ergonomic mesh chair"], rarity: "legendary", displayPrice: 109_990, icon: "monitor" },
  { slug: "secretlab-titan-evo", name: "Titan Evo Nanogen Chair", brand: "Secretlab", category: "Desk Setup & Furniture", categorySlug: "desk-setup", subcategory: "Chairs", attributes: ["Racing-style gaming chair"], rarity: "epic", displayPrice: 42_500, icon: "monitor" },
  { slug: "steelcase-gesture", name: "Gesture Ergonomic Office Chair", brand: "Steelcase", category: "Desk Setup & Furniture", categorySlug: "desk-setup", subcategory: "Chairs", attributes: ["Ortho-focused ergonomic chair"], rarity: "legendary", displayPrice: 89_990, icon: "monitor" },
  { slug: "grovemade-hardwood-desk", name: "Solid Walnut Hardwood Desk", brand: "Grovemade", category: "Desk Setup & Furniture", categorySlug: "desk-setup", subcategory: "Desks", attributes: ["Fixed-height desk"], rarity: "legendary", displayPrice: 124_990, icon: "monitor" },
  { slug: "secretlab-magnus-pro-xl", name: "MAGNUS Pro XL Standing Desk", brand: "Secretlab", category: "Desk Setup & Furniture", categorySlug: "desk-setup", subcategory: "Desks", attributes: ["Electric standing desk"], rarity: "epic", displayPrice: 69_990, icon: "monitor" },
  { slug: "benq-screenbar-halo", name: "ScreenBar Halo Monitor Light", brand: "BenQ", category: "Desk Setup & Furniture", categorySlug: "desk-setup", subcategory: "Lighting", attributes: ["Desk lamp", "Ambient / task lighting"], rarity: "rare", displayPrice: 10_990, icon: "monitor" },
  { slug: "philips-hue-gradient-lightstrip", name: "Hue Play Gradient Lightstrip", brand: "Philips Hue", category: "Desk Setup & Furniture", categorySlug: "desk-setup", subcategory: "Lighting", attributes: ["Smart LED strip"], rarity: "epic", displayPrice: 14_990, icon: "monitor" },
  { slug: "logitech-litra-beam-lx", name: "Litra Beam LX RGB Light", brand: "Logitech", category: "Desk Setup & Furniture", categorySlug: "desk-setup", subcategory: "Lighting", attributes: ["RGB light bar", "Monitor-mounted"], rarity: "epic", displayPrice: 11_990, icon: "monitor" },

  // Tech Accessories — premium utility, carrying, surfaces, and privacy pieces.
  { slug: "cablemod-pro-modmesh-kit", name: "Pro ModMesh Sleeved Cable Kit", brand: "CableMod", category: "Tech Accessories", categorySlug: "tech-accessories", subcategory: "Cable Management", attributes: ["Braided cables", "Sleeves and clips"], rarity: "epic", displayPrice: 8_990, icon: "headset" },
  { slug: "anker-prime-250w-gan", name: "Prime 250W GaN Charging Station", brand: "Anker", category: "Tech Accessories", categorySlug: "tech-accessories", subcategory: "Chargers", attributes: ["Multi-port charger", "GaN charger"], rarity: "epic", displayPrice: 12_990, icon: "headset" },
  { slug: "peak-design-tech-pouch", name: "Tech Pouch V2", brand: "Peak Design", category: "Tech Accessories", categorySlug: "tech-accessories", subcategory: "Cases & Pouches", attributes: ["EDC pouch", "Carrying case"], rarity: "rare", displayPrice: 4_990, icon: "headset" },
  { slug: "artisan-fx-zero-xl", name: "FX Zero XL Soft Gaming Mousepad", brand: "Artisan", category: "Tech Accessories", categorySlug: "tech-accessories", subcategory: "Mousepads", attributes: ["Premium cloth mousepad"], rarity: "epic", displayPrice: 5_990, icon: "mouse" },
  { slug: "razer-atlas", name: "Atlas Tempered Glass Mouse Mat", brand: "Razer", category: "Tech Accessories", categorySlug: "tech-accessories", subcategory: "Mousepads", attributes: ["Hard mousepad"], rarity: "legendary", displayPrice: 7_990, icon: "mouse" },
  { slug: "grovemade-keyboard-wrist-rest", name: "Walnut Keyboard Wrist Rest", brand: "Grovemade", category: "Tech Accessories", categorySlug: "tech-accessories", subcategory: "Wrist Rests", attributes: ["Premium wrist rest"], rarity: "rare", displayPrice: 6_990, icon: "keyboard" },
  { slug: "cloudvalley-metal-webcam-cover", name: "Machined Metal Webcam Cover", brand: "CloudValley", category: "Tech Accessories", categorySlug: "tech-accessories", subcategory: "Privacy Accessories", attributes: ["Webcam cover", "Privacy accessory"], rarity: "rare", displayPrice: 2_490, icon: "headset" },
];

export const catalogProducts: Product[] = productSeeds.map((product) => ({
  ...product,
  id: product.id ?? product.slug,
}));

const featuredSlugs = [
  "rtx-5090-founders-edition",
  "34-ultrawide-oled-240hz",
  "keychron-q1-max",
  "steam-deck-oled-1tb",
  "razer-viper-v3-pro",
];

export const featuredProducts = featuredSlugs
  .map((slug) => catalogProducts.find((product) => product.slug === slug))
  .filter((product): product is Product => Boolean(product));

export const php = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
});

export const phpNumber = new Intl.NumberFormat("en-PH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
