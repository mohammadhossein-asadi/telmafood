import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Recipe } from "@/lib/api/types";

interface SavedRecipe {
  id: string;
  recipe: Recipe;
  savedAt: number;
}

interface RecipeStore {
  savedRecipes: SavedRecipe[];
  saveRecipe: (id: string, recipe: Recipe) => void;
  removeRecipe: (id: string) => void;
  isRecipeSaved: (id: string) => boolean;
  getRecipe: (id: string) => Recipe | undefined;
}

export const useRecipeStore = create<RecipeStore>()(
  persist(
    (set, get) => ({
      savedRecipes: [],

      saveRecipe: (id: string, recipe: Recipe) => {
        const { savedRecipes } = get();
        if (!savedRecipes.find((r) => r.id === id)) {
          set({
            savedRecipes: [
              ...savedRecipes,
              { id, recipe, savedAt: Date.now() },
            ],
          });
        }
      },

      removeRecipe: (id: string) => {
        const { savedRecipes } = get();
        set({
          savedRecipes: savedRecipes.filter((r) => r.id !== id),
        });
      },

      isRecipeSaved: (id: string) => {
        const { savedRecipes } = get();
        return savedRecipes.some((r) => r.id === id);
      },

      getRecipe: (id: string) => {
        const { savedRecipes } = get();
        return savedRecipes.find((r) => r.id === id)?.recipe;
      },
    }),
    {
      name: "telmafood-saved-recipes",
    }
  )
);
