"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/search/SearchBar";
import { FilterBar } from "@/components/filters/FilterBar";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";
import { RecipeCardSkeleton } from "@/components/recipe/RecipeCardSkeleton";
import { Button } from "@/components/ui/button";
import { useRecipes } from "@/lib/hooks/useRecipes";
import type { FilterParams } from "@/lib/api/types";

function RecipesContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const params: FilterParams = {
    q: q || undefined,
    mealType: searchParams.getAll("mealType") || undefined,
    health: searchParams.getAll("health") || undefined,
    diet: searchParams.getAll("diet") || undefined,
    cuisineType: searchParams.getAll("cuisineType") || undefined,
    dishType: searchParams.getAll("dishType") || undefined,
    time: searchParams.get("time") || undefined,
    ingr: searchParams.get("ingr") || undefined,
    calories: searchParams.get("calories") || undefined,
  };

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useRecipes(params);

  const recipes = data?.pages.flatMap((page) =>
    page.hits.map((hit) => hit.recipe)
  ) || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
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
            <div className="text-center py-12">
              <p className="text-base text-foreground/60 mb-4">
                Failed to load recipes. Please try again.
              </p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try again
              </Button>
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-base text-foreground/60">
                No recipes found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <>
              <RecipeGrid recipes={recipes} />

              {hasNextPage && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load more recipes"
                    )}
                  </button>
                </div>
              )}

              {!hasNextPage && recipes.length > 0 && (
                <p className="text-center text-sm text-foreground/60 mt-8">
                  No more recipes to show
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
        <div className="mx-auto max-w-6xl px-4 py-8">
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
