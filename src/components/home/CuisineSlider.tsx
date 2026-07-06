"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { RecipeCardSkeleton } from "@/components/recipe/RecipeCardSkeleton";
import { useRecipes } from "@/lib/hooks/useRecipes";

interface CuisineSliderProps {
  title: string;
  cuisine: string;
}

export function CuisineSlider({ title, cuisine }: CuisineSliderProps) {
  const { data, isLoading } = useRecipes({ cuisineType: [cuisine] });

  const recipes = data?.pages[0]?.hits.map((hit) => hit.recipe) || [];

  return (
    <section className="py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl md:text-3xl text-foreground">{title}</h2>
          <Link href={`/recipes?cuisineType=${encodeURIComponent(cuisine)}`}>
            <Button variant="ghost" className="text-primary hover:text-primary-hover">
              Show more
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          {isLoading ? (
            <div className="flex gap-4 pb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[280px]">
                  <RecipeCardSkeleton />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-4 pb-4">
              {recipes.slice(0, 10).map((recipe) => (
                <div key={recipe.uri} className="flex-shrink-0 w-[280px]">
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
