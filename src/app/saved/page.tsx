"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";
import { useRecipeStore } from "@/lib/store/recipeStore";

export default function SavedRecipesPage() {
  const { savedRecipes } = useRecipeStore();

  const recipes = savedRecipes
    .sort((a, b) => b.savedAt - a.savedAt)
    .map((saved) => saved.recipe);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-heading text-2xl md:text-3xl text-foreground mb-6">Saved Recipes</h1>

      {recipes.length === 0 ? (
        <div className="text-center py-16">
          <Bookmark className="h-16 w-16 text-foreground/20 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-foreground mb-2">
            No saved recipes yet
          </h2>
          <p className="text-base text-foreground/60 mb-6">
            Start exploring recipes and save your favorites!
          </p>
          <Link href="/recipes">
            <Button>Browse recipes</Button>
          </Link>
        </div>
      ) : (
        <RecipeGrid recipes={recipes} />
      )}
    </div>
  );
}
