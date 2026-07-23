export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { checkIpRateLimit } from "@/lib/security";

export async function GET(req: NextRequest) {
  // H10: rate limit per IP (max 30 searches per minute)
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const rateLimit = checkIpRateLimit(`search:${ip}`, 30, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Trop de recherches. Réessaie dans un instant." },
      { status: 429 },
    );
  }

  const q = req.nextUrl.searchParams.get("q")?.toLowerCase().trim();
  if (!q || q.length < 2) return NextResponse.json({ results: [] });
  if (q.length > 100) {
    return NextResponse.json({ error: "Requête trop longue." }, { status: 400 });
  }

  // Optional auth — guests can still search, but we know who they are
  const session = await auth().catch(() => null);

  const [courses, lessons, posts] = await Promise.all([
    db.course
      .findMany({
        where: { OR: [{ title: { contains: q } }, { description: { contains: q } }], status: "PUBLISHED" },
        select: { id: true, title: true, slug: true, category: true },
        take: 5,
      })
      .catch(() => []),
    db.courseLesson
      .findMany({
        where: { title: { contains: q } },
        select: { id: true, title: true, slug: true, course: { select: { slug: true } } },
        take: 5,
      })
      .catch(() => []),
    db.blogPost
      .findMany({
        where: { title: { contains: q }, isPublished: true },
        select: { id: true, title: true, slug: true },
        take: 3,
      })
      .catch(() => []),
  ]);

  return NextResponse.json({
    results: [
      ...courses.map((c) => ({ type: "course", title: c.title, href: `/cours/${c.slug}`, category: c.category })),
      ...lessons.map((l) => ({ type: "lesson", title: l.title, href: `/cours/${l.course.slug}/${l.id}` })),
      ...posts.map((p) => ({ type: "blog", title: p.title, href: `/blog/${p.slug}` })),
    ],
  });
}
