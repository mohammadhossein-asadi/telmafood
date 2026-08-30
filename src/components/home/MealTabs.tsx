"use client";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";
import { RecipeCardSkeleton } from "@/components/recipe/RecipeCardSkeleton";
import { useRecipes } from "@/lib/hooks/useRecipes";
import { MEAL_TYPES } from "@/lib/utils/constants";

export function MealTabs() {
  return (
    <Tabs defaultValue="Breakfast" className="w-full">
      <TabsList className="w-full justify-start h-auto p-1 bg-transparent gap-2 overflow-x-auto flex-wrap">
        {MEAL_TYPES.map((type) => (
          <TabsTrigger
            key={type}
            value={type}
            className="rounded-full px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            {type}
          </TabsTrigger>
        ))}
      </TabsList>

      {MEAL_TYPES.map((type) => (
        <TabsContent key={type} value={type} className="mt-6">
          <MealTabContent mealType={type} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function MealTabContent({ mealType }: { mealType: string }) {
  const { data, isLoading } = useRecipes({ mealType: [mealType] });

  const recipes = data?.pages[0]?.hits.map((hit) => hit.recipe) || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <RecipeCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <RecipeGrid recipes={recipes.slice(0, 12)} adPlacement={`meal-${mealType.toLowerCase()}`} />
      <div className="mt-7 flex justify-center">
        <Link href={`/recipes?mealType=${encodeURIComponent(mealType)}`}>
          <Button variant="outline" className="rounded-full px-6">
            Show more {mealType.toLowerCase()} recipes
          </Button>
        </Link>
      </div>
    </div>
  );
}
