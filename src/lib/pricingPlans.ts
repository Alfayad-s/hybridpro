export type PricingPlanId = "self-guided" | "hybrid-coaching" | "elite";

export type PricingPlan = {
  id: PricingPlanId;
  name: string;
  saveLabel: string | null;
  originalPrice: string;
  price: string;
  /** Amount in paise (INR smallest unit) for Pine Labs */
  amountPaise: number;
  cadence: string;
  billingNote: string;
  blurb: string;
  included: string[];
  excluded: string[];
  cta: string;
  featured: boolean;
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "self-guided",
    name: "Self-guided",
    saveLabel: null,
    originalPrice: "₹4,999",
    price: "₹3,999",
    amountPaise: 3999_00,
    cadence: "/ month",
    billingNote: "Billed monthly · cancel anytime",
    blurb:
      "Structured Hybrid Pro programming you run on your own schedule, with app tracking built in.",
    included: [
      "Full program library",
      "App-based tracking",
      "Monthly plan refresh",
      "Progressive overload templates",
    ],
    excluded: [
      "Video form reviews",
      "Direct coach messaging",
      "Weekly video call",
    ],
    cta: "Buy Self-guided",
    featured: false,
  },
  {
    id: "hybrid-coaching",
    name: "Hybrid Coaching",
    saveLabel: "Save 20%",
    originalPrice: "₹14,999",
    price: "₹11,999",
    amountPaise: 11999_00,
    cadence: "/ month",
    billingNote: "Most popular · billed monthly",
    blurb:
      "The full system, a personalised plan plus a coach in your corner for form, nutrition, and accountability.",
    included: [
      "Custom weekly programming",
      "Video form reviews",
      "Nutrition targets",
      "Direct message support",
      "App-based tracking",
      "Monthly plan adjustments",
    ],
    excluded: ["Weekly video call", "Competition prep"],
    cta: "Buy Hybrid Coaching",
    featured: true,
  },
  {
    id: "elite",
    name: "1-to-1 Elite",
    saveLabel: "Save 15%",
    originalPrice: "₹29,999",
    price: "₹24,999",
    amountPaise: 24999_00,
    cadence: "/ month",
    billingNote: "Limited spots · billed monthly",
    blurb:
      "Deep, high-touch coaching for serious goals, with weekly calls and priority support from Akash.",
    included: [
      "Everything in Hybrid Coaching",
      "Weekly video call",
      "Competition prep",
      "24h response time",
      "Custom nutrition coaching",
      "Priority form reviews",
    ],
    excluded: [],
    cta: "Buy 1-to-1 Elite",
    featured: false,
  },
];

export function getPricingPlan(id: string): PricingPlan | undefined {
  return pricingPlans.find((p) => p.id === id);
}
