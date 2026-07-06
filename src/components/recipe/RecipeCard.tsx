"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SaveButton } from "./SaveButton";
import type { Recipe } from "@/lib/api/types";
import { extractIdFromUri } from "@/lib/api/edamam";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const recipeId = extractIdFromUri(recipe.uri);

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg animate-fade-in">
      <Link href={`/recipe/${encodeURIComponent(recipeId)}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-image-background">
          {recipe.image ? (
            <Image
              src={recipe.image}
              alt={recipe.label}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground/40">
              <span className="text-sm">No image</span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <SaveButton recipeId={recipeId} recipe={recipe} />
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/recipe/${encodeURIComponent(recipeId)}`}>
          <h3 className="text-base font-medium text-foreground line-clamp-2 mb-2 hover:text-primary transition-colors">
            {recipe.label}
          </h3>
        </Link>

        <div className="flex items-center gap-4 text-foreground/60">
          {recipe.totalTime > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium">{recipe.totalTime} min</span>
            </div>
          )}
          {recipe.yield > 0 && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium">{recipe.yield} servings</span>
            </div>
          )}
        </div>

        {recipe.cuisineType?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {recipe.cuisineType.slice(0, 2).map((cuisine) => (
              <Badge key={cuisine} variant="secondary" className="text-xs">
                {cuisine}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
