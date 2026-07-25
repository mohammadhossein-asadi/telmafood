"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Users, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SaveButton } from "./SaveButton";
import { extractIdFromUri } from "@/lib/api/edamam";
import type { Recipe } from "@/lib/api/types";

interface RecipeDetailProps {
  recipe: Recipe;
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  const recipeId = extractIdFromUri(recipe.uri);

  const bestImage =
    recipe.images?.LARGE?.url ||
    recipe.images?.REGULAR?.url ||
    recipe.images?.SMALL?.url ||
    recipe.images?.THUMBNAIL?.url ||
    recipe.image;

  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      {/* Banner */}
      <div className="relative aspect-[21/9] md:aspect-[3/1] rounded-xl overflow-hidden bg-image-background mb-8">
        {bestImage ? (
          <Image
            src={bestImage}
            alt={recipe.label}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) calc(100vw - 2rem), 864px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-foreground/40">
            <span className="text-sm">No image available</span>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-2">
            {recipe.label}
          </h1>
          <p className="text-base text-foreground/60">
            by {recipe.source}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SaveButton recipeId={recipeId} recipe={recipe} size="lg" />
          <a href={recipe.url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg">
              <ExternalLink className="h-4 w-4 mr-2" />
              View original
            </Button>
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-6 mb-8 p-4 bg-primary-container rounded-lg">
        {recipe.yield > 0 && (
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-foreground/60">Servings</p>
              <p className="text-base font-medium text-foreground">{recipe.yield}</p>
            </div>
          </div>
        )}
        {recipe.totalTime > 0 && (
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-foreground/60">Cook time</p>
              <p className="text-base font-medium text-foreground">
                {recipe.totalTime} min
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 text-primary font-bold flex items-center justify-center text-xs">
            Cal
          </div>
          <div>
            <p className="text-xs text-foreground/60">Calories</p>
            <p className="text-base font-medium text-foreground">
              {Math.round(recipe.calories)}
            </p>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {recipe.cuisineType?.map((cuisine) => (
          <Link key={cuisine} href={`/recipes?cuisineType=${encodeURIComponent(cuisine)}`}>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
              {cuisine}
            </Badge>
          </Link>
        ))}
        {recipe.dietLabels?.map((diet) => (
          <Link key={diet} href={`/recipes?diet=${encodeURIComponent(diet)}`}>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
              {diet}
            </Badge>
          </Link>
        ))}
        {recipe.dishType?.map((dish) => (
          <Link key={dish} href={`/recipes?dishType=${encodeURIComponent(dish)}`}>
            <Badge className="cursor-pointer hover:bg-primary-hover transition-colors">
              {dish}
            </Badge>
          </Link>
        ))}
      </div>

      <Separator className="my-8" />

      {/* Ingredients */}
      <div className="mb-8">
        <h2 className="font-heading text-2xl text-foreground mb-4">Ingredients</h2>
        <ul className="space-y-3">
          {recipe.ingredientLines.map((ingredient, index) => (
            <li
              key={index}
              className="text-base text-foreground flex items-start gap-3"
            >
              <span className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              {ingredient}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
