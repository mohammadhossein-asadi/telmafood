"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRecipeStore } from "@/lib/store/recipeStore";
import { toast } from "sonner";
import type { Recipe } from "@/lib/api/types";

interface SaveButtonProps {
  recipeId: string;
  recipe: Recipe;
  size?: "default" | "sm" | "lg" | "icon";
}

export function SaveButton({ recipeId, recipe, size = "icon" }: SaveButtonProps) {
  const { isRecipeSaved, saveRecipe, removeRecipe } = useRecipeStore();
  const isSaved = isRecipeSaved(recipeId);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSaved) {
      removeRecipe(recipeId);
      toast("Removed from recipe book");
    } else {
      saveRecipe(recipeId, recipe);
      toast("Added to recipe book");
    }
  };

  return (
    <Button
      variant="secondary"
      size={size}
      onClick={handleToggle}
      className={`rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors ${
        isSaved ? "text-primary" : "text-foreground/60"
      }`}
      aria-label={isSaved ? "Remove from saved recipes" : "Save recipe"}
    >
      {isSaved ? (
        <BookmarkCheck className="h-5 w-5" />
      ) : (
        <Bookmark className="h-5 w-5" />
      )}
    </Button>
  );
}
