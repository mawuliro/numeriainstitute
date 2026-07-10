import { db } from "@/lib/db";

export async function getCourses() {
  return db.course.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "asc" },
    include: {
      _count: {
        select: {
          modules: true,
          enrollments: true,
        },
      },
    },
  });
}

export async function getCourseBySlug(slug: string) {
  return db.course.findUnique({
    where: { slug },
    include: {
      modules: {
        where: { isActive: true },
        orderBy: { order: "asc" },
        include: {
          lessons: {
            where: { isActive: true },
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });
}

export async function getCourseForCatalog(slug: string) {
  return db.course.findUnique({
    where: { slug },
    include: {
      modules: {
        where: { isActive: true },
        orderBy: { order: "asc" },
        include: {
          lessons: {
            where: { isActive: true },
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              slug: true,
              order: true,
              estimatedMinutes: true,
              isFreePreview: true,
            },
          },
        },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  });
}

export async function getLessonById(lessonId: string) {
  return db.courseLesson.findUnique({
    where: { id: lessonId },
    include: {
      course: {
        include: {
          modules: {
            where: { isActive: true },
            orderBy: { order: "asc" },
            include: {
              lessons: {
                where: { isActive: true },
                orderBy: { order: "asc" },
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  order: true,
                  estimatedMinutes: true,
                  isFreePreview: true,
                },
              },
            },
          },
        },
      },
      module: true,
      blocks: {
        orderBy: { order: "asc" },
        include: {
          mcq: { include: { choices: { orderBy: { order: "asc" } } } },
          fillBlank: true,
          trueFalse: true,
          codeEx: true,
          lab: true,
        },
      },
    },
  });
}
