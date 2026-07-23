export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.toLowerCase().trim();
  if (!q || q.length < 2) return NextResponse.json({ results: [] });

  const [courses, lessons, posts] = await Promise.all([
    db.course.findMany({ where: { OR: [{ title: { contains: q } }, { description: { contains: q } }], status: "PUBLISHED" }, select: { id: true, title: true, slug: true, category: true }, take: 5 }),
    db.courseLesson.findMany({ where: { title: { contains: q } }, select: { id: true, title: true, slug: true, course: { select: { slug: true } } }, take: 5 }),
    db.blogPost.findMany({ where: { title: { contains: q }, isPublished: true }, select: { id: true, title: true, slug: true }, take: 3 }),
  ]);

  return NextResponse.json({
    results: [
      ...courses.map(c => ({ type: "course", title: c.title, href: `/cours/${c.slug}`, category: c.category })),
      ...lessons.map(l => ({ type: "lesson", title: l.title, href: `/cours/${l.course.slug}/${l.id}` })),
      ...posts.map(p => ({ type: "blog", title: p.title, href: `/blog/${p.slug}` })),
    ],
  });
}
