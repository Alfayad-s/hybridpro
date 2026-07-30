import AboutPageContent from "@/components/AboutPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Akash · Hybrid Pro",
  description:
    "Meet Akash, Founder & CEO of Hybrid Pro — certified personal trainer helping clients build strength, lose fat, and create lasting habits.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
