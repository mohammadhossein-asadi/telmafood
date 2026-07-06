"use client";

import { use } from "react";
import { useRecipe } from "@/lib/hooks/useRecipe";
import { RecipeDetail } from "@/components/recipe/RecipeDetail";
import { RecipeDetailSkeleton } from "@/components/recipe/RecipeDetailSkeleton";

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data, isLoading, isError } = useRecipe(id);

  if (isLoading) {
    return <RecipeDetailSkeleton />;
  }

  if (isError || !data?.recipe) {
    return (
      <div className="container py-12 text-center">
        <h1 className="headline-small text-foreground mb-4">
          Recipe not found
        </h1>
        <p className="body-large text-foreground/60">
          The recipe you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
      </div>
    );
  }

  return <RecipeDetail recipe={data.recipe} />;
}
