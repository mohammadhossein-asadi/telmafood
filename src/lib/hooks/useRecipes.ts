"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchRecipes, fetchRecipesByPage } from "@/lib/api/edamam";
import type { FilterParams } from "@/lib/api/types";

export function useRecipes(params: FilterParams) {
  return useInfiniteQuery({
    queryKey: ["recipes", params],
    queryFn: ({ pageParam }) => {
      if (pageParam) {
        return fetchRecipesByPage(pageParam);
      }
      return fetchRecipes(params);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage._links?.next?.href;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
