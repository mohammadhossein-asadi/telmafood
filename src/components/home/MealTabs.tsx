"use client";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";
import { RecipeCardSkeleton } from "@/components/recipe/RecipeCardSkeleton";
import { useRecipes } from "@/lib/hooks/useRecipes";
import { MEAL_TYPES } from "@/lib/utils/constants";

const TABS = [
  { id: "all", label: "All Recipes", mealType: undefined },
  ...MEAL_TYPES.map((type) => ({ id: type.toLowerCase(), label: type, mealType: type })),
];

export function MealTabs() {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="w-full justify-start h-auto p-1 bg-transparent gap-2 overflow-x-auto flex-wrap">
        {TABS.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="rounded-full px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {TABS.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-6">
          <MealTabContent mealType={tab.mealType} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function MealTabContent({ mealType }: { mealType?: string }) {
  const { data, isLoading } = useRecipes(mealType ? { mealType: [mealType] } : {});

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
      <RecipeGrid recipes={recipes.slice(0, 12)} adPlacement={mealType ? `meal-${mealType.toLowerCase()}` : "meal-all"} />
      <div className="mt-7 flex justify-center">
        <Link href={mealType ? `/recipes?mealType=${encodeURIComponent(mealType)}` : "/recipes"}>
          <Button variant="outline" className="rounded-full px-6">
            {mealType ? `Show more ${mealType.toLowerCase()} recipes` : "Explore all recipes"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
