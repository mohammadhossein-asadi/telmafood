import { RecipeCard } from "./RecipeCard";
import type { Recipe } from "@/lib/api/types";

interface RecipeGridProps {
  recipes: Recipe[];
}

export function RecipeGrid({ recipes }: RecipeGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.uri} recipe={recipe} />
      ))}
    </div>
  );
}
