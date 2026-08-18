import { PaymentFailureContent } from "@/components/PaymentResultContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment failed · Hybrid Pro",
};

export default function PaymentFailurePage() {
  return <PaymentFailureContent />;
}
