"use client";

import { Trash2 } from "lucide-react";

export function DeleteUserButton() {
  return (
    <button
      type="submit"
      className="rounded-md p-1.5 text-red-500 hover:bg-red-50"
      title="Supprimer (désactiver) cet utilisateur"
      onClick={(e) => {
        if (!window.confirm("Supprimer (désactiver) cet utilisateur ? Cette action désactivera le compte mais conservera l'historique.")) {
          e.preventDefault();
        }
      }}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
