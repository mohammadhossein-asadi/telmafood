"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SaveButton } from "./SaveButton";
import type { EdamamRecipe as Recipe } from "@/lib/api/types";
import { extractIdFromUri } from "@/lib/api/edamam";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const recipeId = extractIdFromUri(recipe.uri);

  return (
    <article className="group overflow-hidden rounded-[16px] border-border/80 transition-all hover:shadow-md ad-card animate-fade-in" data-testid="recipe-card">
      <Link href={`/recipe/${encodeURIComponent(recipeId)}`} aria-label={`View recipe: ${recipe.label}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-stone">
          {recipe.image ? (
            <Image
              src={recipe.image}
              alt=""
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink-muted" aria-hidden="true">
              <span className="text-sm tracking-wide">No image</span>
            </div>
          )}
          <div className="absolute top-2.5 right-2.5">
            <SaveButton recipeId={recipeId} recipe={recipe} />
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/recipe/${encodeURIComponent(recipeId)}`} aria-label={`View recipe: ${recipe.label}`}>
          <h3 className="text-[15px] font-medium leading-snug text-foreground line-clamp-2 mb-2 hover:text-primary transition-colors tracking-[-0.01em]">
            {recipe.label}
          </h3>
        </Link>

        <div className="flex items-center gap-3.5 text-muted-foreground" role="list" aria-label="Recipe details">
          {recipe.totalTime > 0 && (
            <span className="inline-flex items-center gap-1 text-xs tracking-wide" role="listitem">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{recipe.totalTime} min</span>
            </span>
          )}
          {recipe.yield > 0 && (
            <span className="inline-flex items-center gap-1 text-xs tracking-wide" role="listitem">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{recipe.yield} servings</span>
            </span>
          )}
        </div>

        {recipe.cuisineType?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3" role="list" aria-label="Cuisine types">
            {recipe.cuisineType.slice(0, 2).map((cuisine) => (
              <Badge key={cuisine} variant="secondary" className="text-[11px] tracking-wide" role="listitem">
                {cuisine}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </article>
  );
}
