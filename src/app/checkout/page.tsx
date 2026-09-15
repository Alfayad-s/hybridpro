import CheckoutPageContent from "@/components/CheckoutPageContent";
import { getHybridAppLoginUrl } from "@/lib/hybridAppApi";
import { getPricingPlan } from "@/lib/pricingPlans";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Checkout · Hybrid Pro",
  description: "Complete your Hybrid Pro coaching plan purchase securely via Pine Labs.",
};

type CheckoutSearch = {
  plan?: string;
  email?: string;
  userId?: string;
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<CheckoutSearch>;
}) {
  const params = await searchParams;
  const plan = getPricingPlan(params.plan || "");
  const email = params.email?.trim() || "";
  const userId = params.userId?.trim() || "";

  if (plan && (!email || !userId)) {
    redirect(getHybridAppLoginUrl(undefined, { checkoutPlan: plan.id }));
  }

  return <CheckoutPageContent />;
}
