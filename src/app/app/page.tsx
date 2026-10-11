import AppInstallPageContent from "@/components/AppInstallPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hybrid Pro app",
  description:
    "Open Hybrid Pro on your phone. Log sessions, track progress, and keep coaching with you.",
};

export default function AppInstallPage() {
  return <AppInstallPageContent />;
}
