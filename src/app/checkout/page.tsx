import CheckoutPageContent from "@/components/CheckoutPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout · Hybrid Pro",
  description: "Complete your Hybrid Pro coaching plan purchase securely via Pine Labs.",
};

export default function CheckoutPage() {
  return <CheckoutPageContent />;
}
