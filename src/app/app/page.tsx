import AppInstallPageContent from "@/components/AppInstallPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Install GymTrack · Hybrid Pro",
  description:
    "Scan the QR code or open gym.clawdage.com, then add GymTrack to your home screen on iPhone or Android.",
};

export default function AppInstallPage() {
  return <AppInstallPageContent />;
}
