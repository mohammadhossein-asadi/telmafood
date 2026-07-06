"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRecipeById } from "@/lib/api/edamam";

export function useRecipe(recipeId: string | null) {
  return useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => fetchRecipeById(recipeId!),
    enabled: !!recipeId,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
