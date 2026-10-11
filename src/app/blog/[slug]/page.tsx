import JsonLd from "@/components/JsonLd";
import SiteNavbar from "@/components/SiteNavbar";
import FooterSection from "@/components/sections/FooterSection";
import ThemeGlassToggle from "@/components/ui/ThemeGlassToggle";
import { blogPosts, getBlogPost } from "@/lib/blogPosts";
import { SITE_URL, pageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return pageMeta({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published,
    author: {
      "@type": "Person",
      name: "Akash",
      url: `${SITE_URL}/about`,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <JsonLd data={jsonLd} />
      <SiteNavbar />
      <ThemeGlassToggle />
      <article className="mx-auto w-full max-w-3xl px-5 pt-32 pb-20 sm:px-6">
        <p className="text-xs tracking-[0.25em] text-[color:var(--muted)] uppercase">
          {post.category} · {post.date}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-sm text-[color:var(--muted)]">By Akash, Hybrid Pro</p>
        <div className="mt-8 flex flex-col gap-5 text-base leading-relaxed text-[color:var(--muted)]">
          {post.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <p className="mt-10 text-sm">
          <Link href="/blog" className="underline">
            All notes
          </Link>
          <span className="mx-2 text-[color:var(--muted)]">·</span>
          <Link href="/pricing" className="underline">
            Coaching plans
          </Link>
        </p>
      </article>
      <FooterSection />
    </main>
  );
}
