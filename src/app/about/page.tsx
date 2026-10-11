import AboutPageContent from "@/components/AboutPageContent";
import JsonLd from "@/components/JsonLd";
import { pageMeta, personJsonLd } from "@/lib/seo";

export const metadata = pageMeta({
  title: "About Akash",
  description:
    "Akash is the founder of Hybrid Pro, a personal trainer with Active IQ Level 3 and REPs UAE credentials. Coaching is online now, with a studio opening in Bengaluru.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={personJsonLd} />
      <AboutPageContent />
    </>
  );
}
