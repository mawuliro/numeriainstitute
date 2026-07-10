export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Clock, Users } from "lucide-react";

export default async function AdminCoursesPage() {
  const courses = await db.course.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      modules: { where: { isActive: true } },
      _count: { select: { enrollments: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cours</h1>
          <p className="text-sm text-muted-foreground">
            {courses.length} cours publiés
          </p>
        </div>
        <Link href="/admin/cours/nouveau">
          <Button className="bg-[#1B2A4E] hover:bg-[#1B2A4E]/90">
            <Plus className="h-4 w-4" />
            Nouveau cours
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {courses.map((course) => {
          const totalLessons = course.modules.reduce(
            (sum, m) => sum + (m.lessons?.length ?? 0),
            0,
          );
          return (
            <Link key={course.id} href={`/admin/cours/${course.id}`}>
              <Card className="transition-all hover:shadow-md">
                <CardContent className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold">{course.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {course.shortDescription}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <BookOpen className="h-3.5 w-3.5" />
                      {totalLessons} leçons
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {course.estimatedHours}h
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      {course._count.enrollments}
                    </div>
                    <Badge variant={course.status === "PUBLISHED" ? "default" : "secondary"}>
                      {course.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
