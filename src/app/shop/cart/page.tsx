import { CartPage } from "@/components/shop/CartPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart · Hybrid Pro",
  description: "Review your Hybrid Pro shop cart before Pine Labs checkout.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CartPage />;
}
