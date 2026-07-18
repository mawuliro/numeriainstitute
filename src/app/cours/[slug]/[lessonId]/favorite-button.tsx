"use client";
import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

export function FavoriteButton({ lessonId, courseId, isFavorited }: { lessonId: string; courseId: string; isFavorited: boolean }) {
  const [favorited, setFavorited] = useState(isFavorited);
  const handleToggle = async () => {
    setFavorited(!favorited);
    const { toggleFavoriteAction } = await import("./favorite-actions");
    const formData = new FormData();
    formData.set("lessonId", lessonId);
    formData.set("courseId", courseId);
    await toggleFavoriteAction(formData);
  };
  return (
    <button onClick={handleToggle} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${favorited ? "text-[#C9A227]" : "text-muted-foreground hover:text-foreground"}`}>
      {favorited ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {favorited ? "Sauvegardé" : "Sauvegarder"}
    </button>
  );
}
