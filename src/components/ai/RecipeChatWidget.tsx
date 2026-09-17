"use client";

import { useEffect, useState } from "react";
import { useRecipe } from "@/lib/hooks/useRecipe";
import { ChatWidget } from "@/components/ai/ChatWidget";
import type { EdamamRecipe } from "@/lib/api/types";

interface RecipeChatWidgetProps {
  recipeId: string;
}

export function RecipeChatWidget({ recipeId }: RecipeChatWidgetProps) {
  const { data, isLoading } = useRecipe(recipeId);
  const [recipeContext, setRecipeContext] = useState<{
    id: string;
    title: string;
    ingredients: string[];
  } | null>(null);

  useEffect(() => {
    if (data?.recipe && !isLoading) {
      const recipe = data.recipe;
      setRecipeContext({
        id: recipe.uri,
        title: recipe.label,
        ingredients: recipe.ingredientLines || [],
      });
    }
  }, [data, isLoading]);

  if (isLoading || !recipeContext) {
    return <ChatWidget />;
  }

  return <ChatWidget currentRecipe={recipeContext} />;
}
