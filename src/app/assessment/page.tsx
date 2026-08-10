import AssessmentNamePageContent from "@/components/AssessmentNamePageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Body Assessment · Hybrid Pro",
  description:
    "Complete your Hybrid Pro body assessment and get a personalized training and nutrition result from Akash.",
};

export default function AssessmentPage() {
  return <AssessmentNamePageContent />;
}
