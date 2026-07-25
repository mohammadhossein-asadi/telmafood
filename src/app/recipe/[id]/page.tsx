"use client";

import { use } from "react";
import Link from "next/link";
import { useRecipe } from "@/lib/hooks/useRecipe";
import { RecipeDetail } from "@/components/recipe/RecipeDetail";
import { RecipeDetailSkeleton } from "@/components/recipe/RecipeDetailSkeleton";
import { Button } from "@/components/ui/button";

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
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="font-heading text-3xl text-foreground mb-4">
          Recipe not found
        </h1>
        <p className="text-base text-foreground/60 mb-6">
          The recipe you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try again
          </Button>
          <Link href="/recipes">
            <Button>Browse recipes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <RecipeDetail recipe={data.recipe} />;
}
