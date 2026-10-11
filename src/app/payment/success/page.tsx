import { PaymentSuccessContent } from "@/components/PaymentResultContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment successful · Hybrid Pro",
  robots: { index: false, follow: false },
};

export default function PaymentSuccessPage() {
  return <PaymentSuccessContent />;
}
