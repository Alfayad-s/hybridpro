import type { Metadata } from "next";
import { faqs } from "@/lib/faqs";
import { pricingPlans } from "@/lib/pricingPlans";
import { trainer } from "@/lib/trainerContent";

export const SITE_URL = "https://hybridpro.in";
export const SITE_NAME = "Hybrid Pro";
export const SITE_EMAIL = "hello@hybridpro.fit";

const ogImage = {
  url: "/icon-512.png",
  width: 512,
  height: 512,
  alt: "Hybrid Pro",
};

export function pageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} · ${SITE_NAME}`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
      images: [ogImage],
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
      images: [ogImage.url],
    },
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      email: SITE_EMAIL,
      logo: `${SITE_URL}/icon-512.png`,
      description:
        "Personal coaching for strength, fat loss, and habits. Online now, with Hybrid Pro Fitness Studio opening in Bengaluru.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: trainer.name,
  jobTitle: "Founder and CEO",
  worksFor: { "@id": `${SITE_URL}/#organization` },
  url: `${SITE_URL}/about`,
  description: `${trainer.credentials}. ${trainer.teaser}`,
};

export const offersJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Hybrid Pro coaching plans",
  itemListElement: pricingPlans.map((plan, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Offer",
      name: plan.name,
      description: plan.blurb,
      price: String(plan.amountPaise / 100),
      priceCurrency: "INR",
      url: `${SITE_URL}/pricing`,
    },
  })),
};

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Hybrid Pro",
  applicationCategory: "HealthApplication",
  operatingSystem: "Android, Web",
  url: "https://app.hybridpro.in",
  installUrl: "https://app.hybridpro.in",
  identifier: "in.hybridpro.hybrid_pro_app",
  description:
    "Member app for today’s workout, progress, coach chat, and the Hybrid Pro shop. Meals are included on Performance and Elite.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
};
