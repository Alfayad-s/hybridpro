import { PaymentFailureContent } from "@/components/PaymentResultContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment failed · Hybrid Pro",
  robots: { index: false, follow: false },
};

export default function PaymentFailurePage() {
  return <PaymentFailureContent />;
}
