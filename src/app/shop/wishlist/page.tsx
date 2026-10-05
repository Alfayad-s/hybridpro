import { WishlistPage } from "@/components/shop/WishlistPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved · Hybrid Pro",
  description: "Products you saved from the Hybrid Pro shop.",
};

export default function Page() {
  return <WishlistPage />;
}
