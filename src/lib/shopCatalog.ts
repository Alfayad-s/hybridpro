export type ShopCategory = string;

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

/** Database image: a Cloudinary URL, or a member-app asset path. */
export function shopImageSrc(imageUrl: string | null | undefined) {
  if (!imageUrl) return "/shop/ebook-3d.png";
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  const asset = imageUrl.startsWith("asset:") ? imageUrl.slice("asset:".length) : imageUrl;
  const file = asset.replace(/^assets\/store\//, "");
  if (file && !file.includes("/") && !file.includes("..")) return `/shop/${file}`;
  return "/shop/ebook-3d.png";
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
  { slug: "ebooks", label: "E-Books" },
];

/** Same merch catalog as the member app store. Coaching plans stay on /pricing. */
export const shopProducts: ShopProduct[] = [
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
  {
    slug: "glute-ultimate-workouts",
    title: "Glute Ultimate Workouts",
    subtitle: "Digital download",
    priceLabel: "₹799",
    image:
      "https://res.cloudinary.com/dxfj2ocp/image/upload/v1791223533/gymtrack/store/products/product-muvk8rq8.jpg",
    category: "ebooks",
    description:
      "Hybrid Pro Glute Ultimate Workouts — a complete guide to building stronger, sculpted glutes with targeted workouts, progressive programs, exercise guidance, and practical form cues.",
  },
  {
    slug: "monster-back-workouts",
    title: "Monster Back Workouts",
    subtitle: "Digital download",
    priceLabel: "₹799",
    image:
      "https://res.cloudinary.com/dxfj2ocp/image/upload/v1791223567/gymtrack/store/products/product-muvk9hji.jpg",
    category: "ebooks",
    description:
      "Hybrid Pro Monster Back Workouts — build a wider, thicker, stronger back with science-based workouts, progressive programs, exercise guidance, and form-focused training.",
  },
  {
    slug: "gun-biceps-workouts",
    title: "Gun Biceps Workouts",
    subtitle: "Digital download",
    priceLabel: "₹799",
    image:
      "https://res.cloudinary.com/dxfj2ocp/image/upload/v1791223612/gymtrack/store/products/product-muvkagis.jpg",
    category: "ebooks",
    description:
      "Hybrid Pro Gun Biceps Workouts — build bigger, stronger and more defined arms with targeted biceps training, progressive overload, exercise guidance, and proven workout programs.",
  },
  {
    slug: "titan-chest-workouts",
    title: "Titan Chest Workouts",
    subtitle: "Digital download",
    priceLabel: "₹799",
    image:
      "https://res.cloudinary.com/dxfj2ocp/image/upload/v1791223627/gymtrack/store/products/product-muvkasas.jpg",
    category: "ebooks",
    description:
      "Hybrid Pro Titan Chest Workouts — build a bigger, stronger and more defined chest with structured training, progressive programs, exercise guidance, and practical form cues.",
  },
  {
    slug: "quad-beast-workouts",
    title: "Quad Beast Workouts",
    subtitle: "Digital download",
    priceLabel: "₹799",
    image:
      "https://res.cloudinary.com/dxfj2ocp/image/upload/v1791223638/gymtrack/store/products/product-muvkb0gg.jpg",
    category: "ebooks",
    description:
      "Hybrid Pro Quad Beast Workouts — develop bigger, stronger and more defined legs with quad-focused exercises, progressive training programs, workout guidance, and form cues.",
  },
  {
    slug: "3d-shoulder-workouts",
    title: "3D Shoulder Workouts",
    subtitle: "Digital download",
    priceLabel: "₹799",
    image:
      "https://res.cloudinary.com/dxfj2ocp/image/upload/v1791223670/gymtrack/store/products/product-muvkbpan.jpg",
    category: "ebooks",
    description:
      "Hybrid Pro 3D Shoulder Workouts — build wider, rounder and stronger shoulders with targeted delt training, progressive programs, anatomy guidance, and exercise-specific form cues.",
  },
  {
    slug: "triceps-x-workouts",
    title: "Triceps X Workouts",
    subtitle: "Digital download",
    priceLabel: "₹799",
    image:
      "https://res.cloudinary.com/dxfj2ocp/image/upload/v1791223682/gymtrack/store/products/product-muvkbykj.jpg",
    category: "ebooks",
    description:
      "Hybrid Pro Triceps X Workouts — build bigger and stronger triceps with targeted training, progressive overload, activation-focused exercises, form guidance, and structured workout programs.",
  },
  {
    slug: "armor-core-abs-workout",
    title: "Armor Core",
    subtitle: "Digital download",
    priceLabel: "₹799",
    image:
      "https://res.cloudinary.com/dxfj2ocp/image/upload/v1791223697/gymtrack/store/products/product-muvkca6o.jpg",
    category: "ebooks",
    description:
      "Hybrid Pro Armor Core — a complete abs workout guide for building a stronger, leaner and more defined core with progressive programs, targeted exercises, form guidance, and practical training strategies.",
  },
];
