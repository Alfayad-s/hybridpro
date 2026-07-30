"use client";

import {
  Eyebrow,
  FLUORO_GREEN,
  Reveal,
  SectionShell,
  SectionTitle,
} from "./Reveal";

const posts = [
  {
    category: "Training",
    date: "Jul 2026",
    title: "Why hybrid athletes out-progress pure lifters",
    excerpt:
      "Mixing strength and conditioning does not blunt your gains — done in the right order, it accelerates them.",
    href: "#blog",
  },
  {
    category: "Nutrition",
    date: "Jun 2026",
    title: "Eating for a heavy training block",
    excerpt:
      "A practical framework for fuelling five sessions a week without tracking every gram.",
    href: "#blog",
  },
  {
    category: "Recovery",
    date: "Jun 2026",
    title: "The recovery habits that actually move the needle",
    excerpt:
      "Sleep, protein and load management beat every gadget on the market. Here is how to structure them.",
    href: "#blog",
  },
];

export default function BlogSection() {
  return (
    <SectionShell id="blog">
      <Reveal>
        <Eyebrow>Blog</Eyebrow>
        <SectionTitle>Notes from the coaching floor.</SectionTitle>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:mt-16 sm:gap-5 md:grid-cols-3">
        {posts.map((post, i) => (
          <Reveal key={post.title} delay={0.08 * i}>
            <a
              href={post.href}
              className="flex h-full flex-col rounded-2xl border border-[color:var(--border)] bg-[var(--card)] p-6 transition-colors duration-300 hover:border-[color:var(--border)] sm:p-7"
            >
              <div className="flex items-center gap-3 text-[0.7rem] tracking-[0.25em] uppercase">
                <span style={{ color: FLUORO_GREEN }}>{post.category}</span>
                <span className="text-[color:var(--muted-soft)]">{post.date}</span>
              </div>
              <h3 className="mt-4 text-xl leading-snug text-[var(--foreground)] sm:text-2xl">
                {post.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted)]">
                {post.excerpt}
              </p>
              <span
                className="mt-6 text-xs tracking-[0.25em] uppercase"
                style={{ color: FLUORO_GREEN }}
              >
                Read more
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
