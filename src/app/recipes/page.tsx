"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/search/SearchBar";
import { FilterBar } from "@/components/filters/FilterBar";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";
import { RecipeCardSkeleton } from "@/components/recipe/RecipeCardSkeleton";
import { RecipeError } from "@/components/recipe/RecipeError";
import { useRecipes } from "@/lib/hooks/useRecipes";
import { useQueryClient } from "@tanstack/react-query";
import type { FilterParams, Recipe } from "@/lib/api/types";

function filterRecipes(recipes: Recipe[], searchParams: URLSearchParams) {
  const mealType = searchParams.getAll("mealType");
  const health = searchParams.getAll("health");
  const diet = searchParams.getAll("diet");
  const cuisineType = searchParams.getAll("cuisineType");
  const dishType = searchParams.getAll("dishType");
  const time = searchParams.get("time");
  const ingr = searchParams.get("ingr");
  const calories = searchParams.get("calories");

  const hasFilters =
    mealType.length > 0 ||
    health.length > 0 ||
    diet.length > 0 ||
    cuisineType.length > 0 ||
    dishType.length > 0 ||
    !!time ||
    !!ingr ||
    !!calories;

  if (!hasFilters) return recipes;

  return recipes.filter((recipe) => {
    if (mealType.length > 0 && !mealType.some((m) => recipe.mealType.includes(m))) return false;
    if (health.length > 0 && !health.some((h) => recipe.healthLabels.some((rh) => rh.toLowerCase() === h.toLowerCase()))) return false;
    if (diet.length > 0 && !diet.some((d) => recipe.dietLabels.some((rd) => rd.toLowerCase() === d.toLowerCase()))) return false;
    if (cuisineType.length > 0 && !cuisineType.some((c) => recipe.cuisineType.includes(c))) return false;
    if (dishType.length > 0 && !dishType.some((d) => recipe.dishType.includes(d))) return false;

    if (time) {
      const match = time.match(/^(\d+)-(\d+)$/);
      if (match) {
        const [, min, max] = match;
        if (recipe.totalTime < Number(min) || recipe.totalTime > Number(max)) return false;
      } else if (time.endsWith("+")) {
        const min = parseInt(time);
        if (recipe.totalTime < min) return false;
      }
    }

    if (ingr) {
      const match = ingr.match(/^(\d+)-(\d+)$/);
      if (match) {
        const [, min, max] = match;
        const count = recipe.ingredientLines.length;
        if (count < Number(min) || count > Number(max)) return false;
      } else if (ingr.endsWith("+")) {
        const min = parseInt(ingr);
        if (recipe.ingredientLines.length < min) return false;
      }
    }

    if (calories) {
      const match = calories.match(/^(\d+)-(\d+)$/);
      if (match) {
        const [, min, max] = match;
        if (recipe.calories < Number(min) || recipe.calories > Number(max)) return false;
      } else if (calories.endsWith("+")) {
        const min = parseInt(calories);
        if (recipe.calories < min) return false;
      }
    }

    return true;
  });
}

function RecipesContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const queryClient = useQueryClient();

  const params: FilterParams = useMemo(() => ({
    q: q || undefined,
    mealType: searchParams.getAll("mealType"),
    cuisineType: searchParams.getAll("cuisineType"),
    dishType: searchParams.getAll("dishType"),
    health: searchParams.getAll("health"),
    diet: searchParams.getAll("diet"),
  }), [q, searchParams]);

  const { data, isLoading, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useRecipes(params);

  // Auto-fetch next page on scroll using IntersectionObserver
  const sentinelRef = (node: HTMLDivElement | null) => {
    if (!node || !hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: "350px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  };

  const recipes = useMemo(() => {
    const allRecipes =
      data?.pages.flatMap((page) => page.hits.map((hit) => hit.recipe)) || [];
    return filterRecipes(allRecipes, searchParams);
  }, [data, searchParams]);

  const adPlacement = useMemo(() => {
    const cuisine = searchParams.get("cuisineType");
    const meal = searchParams.get("mealType");
    const dish = searchParams.get("dishType");
    if (cuisine) return `recipes-cuisine-${cuisine}`;
    if (meal) return `recipes-meal-${meal}`;
    if (dish) return `recipes-dish-${dish}`;
    if (q) return `recipes-search-${q.slice(0, 12)}`;
    return "recipes-browse";
  }, [searchParams, q]);

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8">
      <div className="mb-6">
        <SearchBar defaultValue={q} placeholder="Search recipes..." />
      </div>

      <div className="flex gap-6">
        <FilterBar />

        <div className="flex-1 min-w-0">
          {q && (
            <h1 className="font-heading text-2xl md:text-3xl text-foreground mb-6">
              Results for &ldquo;{q}&rdquo;
            </h1>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <RecipeCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <RecipeError
              message={(error as Error | undefined)?.message}
              onRetry={() => {
                queryClient.removeQueries({ queryKey: ["recipes"] });
                refetch();
              }}
            />
          ) : recipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-base text-foreground/60">
                No recipes found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <>
              <RecipeGrid recipes={recipes} adPlacement={adPlacement} />

              {/* Infinite Scroll Sentinel & Load More */}
              {hasNextPage && (
                <div ref={sentinelRef} className="mt-10 flex flex-col items-center justify-center p-4">
                  {isFetchingNextPage ? (
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-muted text-foreground/80 text-sm font-medium animate-pulse">
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Loading more recipes...
                    </div>
                  ) : (
                    <button
                      onClick={() => fetchNextPage()}
                      className="inline-flex items-center gap-2 px-6 py-2.5 border border-border bg-card hover:bg-muted text-foreground rounded-full text-sm font-medium transition-all cursor-pointer shadow-xs"
                    >
                      Scroll down to load more or click here
                    </button>
                  )}
                </div>
              )}

              {!hasNextPage && recipes.length > 0 && (
                <p className="text-center text-sm text-foreground/50 mt-10">
                  You&apos;ve reached the end of the recipes
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RecipesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1280px] px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <RecipesContent />
    </Suspense>
  );
}
