import { ShopCheckoutPage } from "@/components/shop/ShopCheckoutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout · Hybrid Pro",
  description: "Pay for Hybrid Pro shop items with Pine Labs.",
};

export default function Page() {
  return <ShopCheckoutPage />;
}
