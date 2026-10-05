export type ShopCategory = "tees" | "shorts" | "ebooks";

export type ShopProduct = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: ShopCategory;
  priceLabel: string;
  image: string;
  images?: string[];
  sizes?: string[];
};

export function productImages(product: ShopProduct) {
  const extras = product.images?.filter((src) => src && src !== product.image) ?? [];
  return [product.image, ...extras];
}

export function shopPricePaise(priceLabel: string) {
  return Number(priceLabel.replace(/[^\d]/g, "")) * 100;
}

export function getShopProduct(slug: string) {
  return shopProducts.find((product) => product.slug === slug) ?? null;
}

export function formatInr(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

export const shopCategories: { slug: ShopCategory | "all"; label: string }[] = [
  { slug: "all", label: "All" },
  { slug: "tees", label: "Tees" },
  { slug: "shorts", label: "Shorts" },
  { slug: "ebooks", label: "Guides" },
];

/** Same merch catalog as the member app store. Coaching plans stay on /pricing. */
export const shopProducts: ShopProduct[] = [
  {
    slug: "tee-black",
    title: "Hybrid Tee",
    subtitle: "Available sizes",
    priceLabel: "₹1,499",
    image: "/shop/tshirt-3d.png",
    category: "tees",
    description:
      "Black performance tee with the Hybrid Pro mark on the chest. Soft stretch fabric for training and everyday wear.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    slug: "tee-charcoal",
    title: "Mark Tee",
    subtitle: "Available sizes",
    priceLabel: "₹1,599",
    image: "/shop/tshirt-charcoal-3d.png",
    category: "tees",
    description:
      "Charcoal athletic tee with a bold neon Hybrid Pro logo print. Lightweight and breathable.",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    slug: "tee-white",
    title: "Core Tee",
    subtitle: "Available sizes",
    priceLabel: "₹1,499",
    image: "/shop/tee-white-3d.png",
    category: "tees",
    description:
      "White performance tee with lime Hybrid Pro logo. Clean everyday training staple.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    slug: "tee-lime",
    title: "Volt Tee",
    subtitle: "Available sizes",
    priceLabel: "₹1,699",
    image: "/shop/tee-lime-3d.png",
    category: "tees",
    description:
      "Neon lime statement tee with black Hybrid Pro mark. Made to stand out in the gym.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    slug: "tee-navy",
    title: "Night Tee",
    subtitle: "Available sizes",
    priceLabel: "₹1,549",
    image: "/shop/tee-navy-3d.png",
    category: "tees",
    description:
      "Navy athletic tee with lime Hybrid Pro logo. Soft mesh fabric for heavy sessions.",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    slug: "shorts-black",
    title: "Train Shorts",
    subtitle: "Available sizes",
    priceLabel: "₹1,299",
    image: "/shop/shorts-3d.png",
    category: "shorts",
    description:
      "Black training shorts with Hybrid Pro logo on the thigh. Built for lifts, runs, and rest days.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    slug: "shorts-olive",
    title: "Studio Shorts",
    subtitle: "Available sizes",
    priceLabel: "₹1,399",
    image: "/shop/shorts-olive-3d.png",
    category: "shorts",
    description:
      "Olive performance shorts with a discreet Hybrid Pro mark. Soft waistband and quick-dry fabric.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    slug: "shorts-heather",
    title: "Drift Shorts",
    subtitle: "Available sizes",
    priceLabel: "₹1,349",
    image: "/shop/shorts-heather-3d.png",
    category: "shorts",
    description:
      "Heather grey training shorts with lime Hybrid Pro logo. Everyday gym essential.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    slug: "shorts-navy",
    title: "Pulse Shorts",
    subtitle: "Available sizes",
    priceLabel: "₹1,399",
    image: "/shop/shorts-navy-3d.png",
    category: "shorts",
    description:
      "Navy performance shorts with Hybrid Pro mark. Breathable mesh for hard sessions.",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    slug: "shorts-white",
    title: "Air Shorts",
    subtitle: "Available sizes",
    priceLabel: "₹1,299",
    image: "/shop/shorts-white-3d.png",
    category: "shorts",
    description:
      "White training shorts with lime Hybrid Pro logo. Light, clean, and ready to train.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    slug: "ebook-training",
    title: "Training Guide",
    subtitle: "Digital download",
    priceLabel: "₹799",
    image: "/shop/ebook-3d.png",
    category: "ebooks",
    description:
      "Hybrid Pro Training Guide — progressive programming, form cues, and weekly templates in one digital book.",
  },
  {
    slug: "ebook-nutrition",
    title: "Nutrition Playbook",
    subtitle: "Digital download",
    priceLabel: "₹699",
    image: "/shop/ebook-nutrition-3d.png",
    category: "ebooks",
    description:
      "Hybrid Pro Nutrition Playbook — macros, meal structure, and habit systems for fat loss and muscle gain.",
  },
  {
    slug: "ebook-strength",
    title: "Strength Codex",
    subtitle: "Digital download",
    priceLabel: "₹849",
    image: "/shop/ebook-strength-3d.png",
    category: "ebooks",
    description:
      "Strength Codex — progressive overload templates, accessory work, and deload planning.",
  },
  {
    slug: "ebook-recovery",
    title: "Recovery Manual",
    subtitle: "Digital download",
    priceLabel: "₹649",
    image: "/shop/ebook-recovery-3d.png",
    category: "ebooks",
    description:
      "Recovery Manual — sleep, mobility, and reset protocols for consistent progress.",
  },
  {
    slug: "ebook-habits",
    title: "Hybrid Habits",
    subtitle: "Digital download",
    priceLabel: "₹599",
    image: "/shop/ebook-habits-3d.png",
    category: "ebooks",
    description:
      "Hybrid Habits — daily systems for training consistency, nutrition adherence, and mindset.",
  },
];
