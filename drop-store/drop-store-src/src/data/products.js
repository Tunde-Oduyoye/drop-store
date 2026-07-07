export const CATEGORIES = [
  { id: 1, name: "Tops",    icon: "👕", count: 42, bg: "from-zinc-800 to-zinc-900" },
  { id: 2, name: "Jeans",   icon: "👖", count: 28, bg: "from-blue-950 to-zinc-900" },
  { id: 3, name: "Caps",    icon: "🧢", count: 19, bg: "from-zinc-700 to-zinc-900" },
  { id: 4, name: "Shoes",   icon: "👟", count: 35, bg: "from-stone-800 to-zinc-900" },
  { id: 5, name: "Watches", icon: "⌚", count: 14, bg: "from-yellow-900 to-zinc-900" },
  { id: 6, name: "Belts",   icon: "🪢", count: 11, bg: "from-amber-950 to-zinc-900" },
  { id: 7, name: "Boxers",  icon: "🩲", count: 22, bg: "from-zinc-800 to-zinc-900" },
];

export const ALL_PRODUCTS = [
  { id: 1,  name: "Void Oversized Tee",    category: "Tops",    price: 12500, oldPrice: null,  badge: "New",     colors: ["#1a1a1a","#f5f5f5","#2d4a22"], sizes: ["S","M","L","XL"],          rating: 4.8, reviews: 24,  desc: "Ultra-soft 300gsm heavyweight cotton. Oversized drop-shoulder cut, ribbed crew neck. Preshrunk — keeps its shape after every wash.", stock: 8 },
  { id: 2,  name: "Carbon Slim Jeans",     category: "Jeans",   price: 28000, oldPrice: 35000, badge: "Sale",    colors: ["#1a2744","#1a1a1a"],            sizes: ["28","30","32","34","36"],  rating: 4.6, reviews: 41,  desc: "Slim-fit stretch denim with a slight taper. 2% elastane for all-day comfort. Double-stitched seams, 5-pocket design.", stock: 15 },
  { id: 3,  name: "Shadow Cap",            category: "Caps",    price: 9500,  oldPrice: null,  badge: "New",     colors: ["#1a1a1a","#f5f5f5","#8B4513"],  sizes: ["One Size"],               rating: 4.9, reviews: 18,  desc: "6-panel structured cap, 100% cotton twill. Embroidered DRØP logo on front. Adjustable snapback — fits all head sizes.", stock: 22 },
  { id: 4,  name: "Stealth Runner",        category: "Shoes",   price: 45000, oldPrice: 52000, badge: "Limited", colors: ["#1a1a1a","#ffffff"],            sizes: ["40","41","42","43","44","45"], rating: 4.7, reviews: 63, desc: "Knit upper with responsive foam midsole. Breathable mesh lining. Rubber outsole with multi-directional grip.", stock: 4 },
  { id: 5,  name: "Recon Hoodie",          category: "Tops",    price: 22000, oldPrice: null,  badge: "New",     colors: ["#2d2d2d","#1a2744","#2d4a22"], sizes: ["S","M","L","XL","XXL"],    rating: 4.5, reviews: 31,  desc: "French terry fleece, 380gsm. Double-lined hood, kangaroo pocket with internal zip. Ribbed cuffs and hem.", stock: 12 },
  { id: 6,  name: "Urban Belt Co.",        category: "Belts",   price: 8500,  oldPrice: 11000, badge: "Sale",    colors: ["#1a1a1a","#8B4513"],            sizes: ["S","M","L"],              rating: 4.4, reviews: 15,  desc: "Full-grain leather, 35mm width. Brushed gunmetal buckle. 5 adjustment holes. Ages beautifully with use.", stock: 19 },
  { id: 7,  name: "Phantom Watch",         category: "Watches", price: 68000, oldPrice: null,  badge: "🔥 Hot",  colors: ["#1a1a1a","#c0c0c0"],            sizes: ["One Size"],               rating: 4.9, reviews: 87,  desc: "42mm stainless steel case. Sapphire crystal glass. Japanese Miyota movement. 50m water resistant. Comes in premium box.", stock: 6 },
  { id: 8,  name: "Drip Cargo Pants",      category: "Jeans",   price: 32000, oldPrice: 38000, badge: "Sale",    colors: ["#2d2d2d","#3d4a22"],            sizes: ["28","30","32","34"],       rating: 4.7, reviews: 112, desc: "Relaxed-fit cargo with 6 functional pockets. Ripstop fabric — lightweight and durable. Adjustable ankle cinches.", stock: 9 },
  { id: 9,  name: "Nite Rider Tee",        category: "Tops",    price: 11000, oldPrice: null,  badge: "🔥 Hot",  colors: ["#1a1a1a","#f5f5f5"],            sizes: ["S","M","L","XL"],          rating: 4.8, reviews: 98,  desc: "Regular-fit graphic tee. Reactive dye print — won't crack or fade. 100% ring-spun cotton, 200gsm.", stock: 30 },
  { id: 10, name: "Air Classic Boxer",     category: "Boxers",  price: 5500,  oldPrice: null,  badge: null,      colors: ["#1a1a1a","#1a2744","#2d4a22"], sizes: ["S","M","L","XL"],          rating: 4.6, reviews: 54,  desc: "Modal-cotton blend. 4-way stretch waistband. Moisture-wicking, anti-odour. Double-stitched for long life.", stock: 50 },
  { id: 11, name: "Void Shorts",           category: "Tops",    price: 14000, oldPrice: null,  badge: "New",     colors: ["#1a1a1a","#2d4a22","#8B4513"], sizes: ["S","M","L","XL"],          rating: 4.5, reviews: 12,  desc: "Woven nylon shorts with 7-inch inseam. Side pockets, internal liner. Elastic waist with drawcord.", stock: 17 },
  { id: 12, name: "Ghost Leather Belt",    category: "Belts",   price: 12000, oldPrice: null,  badge: null,      colors: ["#1a1a1a"],                      sizes: ["S","M","L"],              rating: 4.7, reviews: 8,   desc: "Top-grain leather. 40mm square buckle plated in matte black. Subtle DRØP deboss near tail.", stock: 11 },
  { id: 13, name: "Core Logo Cap",         category: "Caps",    price: 8000,  oldPrice: 10000, badge: "Sale",    colors: ["#1a2744","#2d4a22","#1a1a1a"],  sizes: ["One Size"],               rating: 4.6, reviews: 33,  desc: "Unstructured 6-panel, washed cotton. Low-profile logo embroidery. Adjustable strap with brass clasp.", stock: 25 },
  { id: 14, name: "Recon Watch",           category: "Watches", price: 45000, oldPrice: 55000, badge: "Sale",    colors: ["#1a2744","#1a1a1a"],            sizes: ["One Size"],               rating: 4.5, reviews: 29,  desc: "40mm brushed steel case. 3-hand movement. Silicone strap with quick-release pin. 100m water resistant.", stock: 7 },
  { id: 15, name: "Cloud Step Sneaker",    category: "Shoes",   price: 38000, oldPrice: null,  badge: "New",     colors: ["#f5f5f5","#1a1a1a","#2d4a22"], sizes: ["40","41","42","43","44"],  rating: 4.6, reviews: 21,  desc: "Vulcanised rubber sole. Canvas upper with reinforced toe cap. EVA insole. Minimalist silhouette.", stock: 14 },
  { id: 16, name: "Essential Boxer 3-Pack",category: "Boxers",  price: 14500, oldPrice: 18000, badge: "Sale",    colors: ["#1a1a1a","#1a2744","#f5f5f5"], sizes: ["S","M","L","XL"],          rating: 4.8, reviews: 76,  desc: "Three-pack of our bestselling boxer. Same premium modal-cotton blend. Three colourways in one pack.", stock: 35 },
];

export const REVIEWS_DATA = [
  { id: 1, name: "Emeka O.",   rating: 5, text: "Quality is insane. The Void Tee fits perfectly and material feels premium. Already ordered two more colours.", product: "Void Oversized Tee", date: "2 days ago",  avatar: "E", productId: 1 },
  { id: 2, name: "Tunde A.",   rating: 5, text: "Stealth Runners are the most comfortable shoes I've worn. True to size, arrived in 3 days. Packaging was clean.", product: "Stealth Runner",    date: "1 week ago",  avatar: "T", productId: 4 },
  { id: 3, name: "Chioma B.",  rating: 5, text: "The Phantom Watch is absolutely stunning in person. Photos don't do it justice. Worth every kobo.",              product: "Phantom Watch",     date: "5 days ago",  avatar: "C", productId: 7 },
  { id: 4, name: "Kelechi M.", rating: 4, text: "Carbon Slim Jeans are fire. Slim fit without being tight. Stretch is just right. Fast delivery too.",             product: "Carbon Slim Jeans", date: "3 days ago",  avatar: "K", productId: 2 },
  { id: 5, name: "Fatima S.",  rating: 5, text: "Bought the Recon Hoodie and it's the warmest, softest thing I own. Worth every naira. Will buy again.",           product: "Recon Hoodie",      date: "2 weeks ago", avatar: "F", productId: 5 },
  { id: 6, name: "Dayo R.",    rating: 5, text: "Shadow Cap is clean. Simple, minimal, fits my head perfectly. Got compliments the first day I wore it.",           product: "Shadow Cap",        date: "4 days ago",  avatar: "D", productId: 3 },
];

export const LOOKS = [
  { id: 1, title: "The Night Shift", desc: "Phantom Watch + Void Tee + Carbon Jeans", tag: "Full Look — ₦106,500", icon: "⌚", productIds: [7,1,2] },
  { id: 2, title: "Street Ready",    desc: "Recon Hoodie + Drip Cargos + Shadow Cap", tag: "Full Look — ₦63,500",  icon: "🧢", productIds: [5,8,3] },
  { id: 3, title: "Clean Energy",    desc: "Nite Rider Tee + Air Classic + Stealth Runners", tag: "Full Look — ₦61,500", icon: "👟", productIds: [9,10,4] },
];

export const ANNOUNCEMENTS = [
  "🔥 NEW DROP: Void Oversized Tee — Available Now",
  "🚚 Free delivery on orders above ₦30,000",
  "⚡ Limited stock — Phantom Watch almost sold out",
  "🎁 Use code DRØP15 for 15% off your first order",
];

export const fmt = (n) => `₦${Number(n).toLocaleString()}`;

// ── Slugs ─────────────────────────────────────────────────
// Turns a product name into a clean URL segment, e.g.
// "Stealth Runner" -> "stealth-runner". Used for /products/:slug routes.
export const slugify = (str) =>
  String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Attach a slug to every mock product (skips ones that already have one,
// e.g. if they came from a real API that already provides slugs).
ALL_PRODUCTS.forEach(p => { if (!p.slug) p.slug = slugify(p.name); });

export const getProductBySlug = (slug) => ALL_PRODUCTS.find(p => p.slug === slug);
