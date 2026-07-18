import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://numeriainstitute.vercel.app";
  const staticPages = [
    { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/cours", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/blog", priority: 0.7, changeFrequency: "daily" as const },
    { url: "/communaute", priority: 0.6, changeFrequency: "daily" as const },
    { url: "/a-propos", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "/contact", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "/visioconference", priority: 0.5, changeFrequency: "weekly" as const },
    { url: "/formations", priority: 0.5, changeFrequency: "weekly" as const },
    { url: "/admissions", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "/login", priority: 0.3, changeFrequency: "yearly" as const },
    { url: "/signup", priority: 0.4, changeFrequency: "yearly" as const },
  ];

  const courses = await db.course.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } });
  const coursePages = courses.map((c) => ({ url: `/cours/${c.slug}`, priority: 0.8, changeFrequency: "weekly" as const }));

  const posts = await db.blogPost.findMany({ where: { isPublished: true }, select: { slug: true } });
  const blogPages = posts.map((p) => ({ url: `/blog/${p.slug}`, priority: 0.6, changeFrequency: "monthly" as const }));

  return [...staticPages, ...coursePages, ...blogPages].map((p) => ({
    url: `${baseUrl}${p.url}`,
    lastModified: new Date(),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
