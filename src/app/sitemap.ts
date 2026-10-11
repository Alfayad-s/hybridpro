import { blogPosts } from "@/lib/blogPosts";
import { SITE_URL } from "@/lib/seo";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-10-11");
  const paths = [
    "/",
    "/about",
    "/programs",
    "/coaching",
    "/pricing",
    "/studio",
    "/blog",
    "/app",
    "/shop",
    "/privacy",
    "/delete-account",
    ...blogPosts.map((post) => `/blog/${post.slug}`),
  ];

  return paths.map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: now,
  }));
}
