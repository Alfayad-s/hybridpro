import AppInstallPageContent from "@/components/AppInstallPageContent";
import JsonLd from "@/components/JsonLd";
import { appJsonLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Hybrid Pro app",
  description:
    "The Hybrid Pro member app for today’s workout, progress, coach chat, and the shop. Meals are on Performance and Elite.",
  path: "/app",
});

export default function AppInstallPage() {
  return (
    <>
      <JsonLd data={appJsonLd} />
      <AppInstallPageContent />
    </>
  );
}
