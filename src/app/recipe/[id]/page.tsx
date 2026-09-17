"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRecipe } from "@/lib/hooks/useRecipe";
import { RecipeDetail } from "@/components/recipe/RecipeDetail";
import { RecipeDetailSkeleton } from "@/components/recipe/RecipeDetailSkeleton";
import { Button } from "@/components/ui/button";
import { RecipeChatWidget } from "@/components/ai/RecipeChatWidget";

interface RecipeDetailPageProps {
  params: Promise<{ id: string }>;
}

function RecipeDetailContent({ params }: RecipeDetailPageProps) {
  const [recipeId, setRecipeId] = useState<string>("");
  const { data, isLoading, isError } = useRecipe(recipeId);

  useEffect(() => {
    params.then((p) => setRecipeId(p.id));
  }, [params]);

  if (!recipeId || isLoading) {
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

  return (
    <>
      <RecipeDetail recipe={data.recipe} />
      <RecipeChatWidget recipeId={recipeId} />
    </>
  );
}

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  return (
    <Suspense fallback={<RecipeDetailSkeleton />}>
      <RecipeDetailContent params={params} />
    </Suspense>
  );
}
