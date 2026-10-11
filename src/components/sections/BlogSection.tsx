"use client";

import { blogPosts } from "@/lib/blogPosts";
import {
  Eyebrow,
  FLUORO_GREEN,
  Reveal,
  SectionShell,
  SectionTitle,
} from "./Reveal";

export default function BlogSection() {
  return (
    <SectionShell id="blog">
      <Reveal>
        <Eyebrow>Blog</Eyebrow>
        <SectionTitle>Notes from the coaching floor.</SectionTitle>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:mt-16 sm:gap-5 md:grid-cols-3">
        {blogPosts.map((post, i) => (
          <Reveal key={post.slug} delay={0.08 * i}>
            <a
              href={`/blog/${post.slug}`}
              className="flex h-full flex-col rounded-2xl border border-[color:var(--border)] bg-[var(--card)] p-6 transition-colors duration-300 hover:border-[color:var(--border)] sm:p-7"
            >
              <div className="flex items-center gap-3 text-[0.7rem] tracking-[0.25em] uppercase">
                <span style={{ color: FLUORO_GREEN }}>{post.category}</span>
                <span className="text-[color:var(--muted-soft)]">
                  {post.date}
                </span>
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
