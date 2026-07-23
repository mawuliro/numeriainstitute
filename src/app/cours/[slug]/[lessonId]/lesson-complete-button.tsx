"use client";

import { useTransition } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function LessonCompleteButton({
  lessonId,
  courseId,
  isCompleted,
}: {
  lessonId: string;
  courseId: string;
  isCompleted: boolean;
}) {
  const [pending, startTransition] = useTransition();

  const handleComplete = () => {
    const formData = new FormData();
    formData.set("lessonId", lessonId);
    formData.set("courseId", courseId);

    startTransition(async () => {
      try {
        const { markLessonCompleteAction } = await import("./lesson-actions");
        await markLessonCompleteAction(formData);
      } catch (err) {
        // M40: show error toast instead of leaving the button in "loading" forever
        console.error("Failed to mark lesson complete:", err);
        toast.error("Impossible d'enregistrer ta progression. Réessaie.");
      }
    });
  };

  if (isCompleted) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 px-4 py-2.5 text-sm font-semibold text-green-700 dark:text-green-300">
        <CheckCircle2 className="h-4 w-4" />
        Leçon terminée ✓
      </div>
    );
  }

  return (
    <Button
      onClick={handleComplete}
      disabled={pending}
      className="bg-[#2DD4BF] text-[#1B2A4E] hover:bg-[#2DD4BF]/80"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Enregistrement...
        </>
      ) : (
        <>
          <CheckCircle2 className="h-4 w-4" />
          Marquer comme terminé
        </>
      )}
    </Button>
  );
}
