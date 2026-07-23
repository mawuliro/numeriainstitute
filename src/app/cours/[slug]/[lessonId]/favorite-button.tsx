"use client";
import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";

export function FavoriteButton({
  lessonId,
  courseId,
  isFavorited,
}: {
  lessonId: string;
  courseId: string;
  isFavorited: boolean;
}) {
  const [favorited, setFavorited] = useState(isFavorited);

  const handleToggle = async () => {
    const prev = favorited;
    // Optimistic update
    setFavorited(!prev);

    try {
      const { toggleFavoriteAction } = await import("./favorite-actions");
      const formData = new FormData();
      formData.set("lessonId", lessonId);
      formData.set("courseId", courseId);
      await toggleFavoriteAction(formData);
    } catch (err) {
      // Rollback on failure
      setFavorited(prev);
      console.error("Failed to toggle favorite:", err);
      toast.error("Impossible de sauvegarder. Réessaie.");
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        favorited
          ? "text-[#C9A227]"
          : "text-muted-foreground hover:text-foreground"
      }`}
      aria-pressed={favorited}
      aria-label={favorited ? "Retirer des favoris" : "Sauvegarder en favori"}
    >
      {favorited ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      {favorited ? "Sauvegardé" : "Sauvegarder"}
    </button>
  );
}
