"use client";

import { useState, useCallback } from "react";
import type { RecipeContext } from "@/lib/ai/types";

export interface MealPlan {
  weekStart: string;
  days: Array<{
    day: string;
    date: string;
    meals: Array<{
      type: "breakfast" | "lunch" | "dinner" | "snack";
      title: string;
      description: string;
      estimatedCalories: number;
      prepTimeMinutes: number;
      ingredients: string[];
      instructions: string[];
      tags: string[];
    }>;
    totalCalories: number;
    shoppingList: string[];
  }>;
  shoppingList: {
    produce: string[];
    protein: string[];
    pantry: string[];
    dairy: string[];
    other: string[];
  };
  notes: string;
}

export interface Substitution {
  ingredient: string;
  ratio: string;
  notes: string;
  bestFor: string[];
  availability: "common" | "specialty" | "hard-to-find";
}

export interface SubstitutionResponse {
  originalIngredient: string;
  reason: string;
  substitutes: Substitution[];
  generalTips: string;
}

export interface ShoppingListItem {
  name: string;
  quantity: string;
  category: string;
  notes: string;
  recipes: string[];
}

export interface ShoppingListResponse {
  items: ShoppingListItem[];
  categories: Record<string, string[]>;
  estimatedCost?: string;
  tips: string[];
}

export function useMealPlan() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);

  const generate = useCallback(async (params: {
    days: number;
    mealsPerDay: number;
    dietaryRestrictions?: string[];
    preferredCuisines?: string[];
    calorieTarget?: number;
    savedRecipes?: RecipeContext[];
    excludeIngredients?: string[];
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error("Failed to generate meal plan");
      }

      const data = await response.json();
      setMealPlan(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate meal plan";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setMealPlan(null);
    setError(null);
  }, []);

  return { generate, mealPlan, isLoading, error, clear };
}

export function useSubstitutions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [substitutions, setSubstitutions] = useState<SubstitutionResponse | null>(null);

  const getSubstitutions = useCallback(async (params: {
    ingredient: string;
    recipeContext?: RecipeContext;
    dietaryRestrictions?: string[];
    allergies?: string[];
    reason?: "allergy" | "dietary" | "availability" | "preference" | "health";
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/substitutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error("Failed to get substitutions");
      }

      const data = await response.json();
      setSubstitutions(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get substitutions";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setSubstitutions(null);
    setError(null);
  }, []);

  return { getSubstitutions, substitutions, isLoading, error, clear };
}

export function useShoppingList() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingListResponse | null>(null);

  const generate = useCallback(async (params: {
    recipes: RecipeContext[];
    servings?: number;
    organizeByStore?: boolean;
    includePantryStaples?: boolean;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/shopping-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error("Failed to generate shopping list");
      }

      const data = await response.json();
      setShoppingList(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate shopping list";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setShoppingList(null);
    setError(null);
  }, []);

  return { generate, shoppingList, isLoading, error, clear };
}

export function useRecipeQnA() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string>("");

  const ask = useCallback(async (params: {
    question: string;
    recipeContext?: RecipeContext;
    conversationHistory?: Array<{ role: string; content: string }>;
  }) => {
    setIsLoading(true);
    setError(null);
    setAnswer("");

    try {
      const response = await fetch("/api/ai/recipe-qna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error("Failed to get answer");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let fullAnswer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                fullAnswer += data.content;
                setAnswer(fullAnswer);
              }
              if (data.error) {
                throw new Error(data.error);
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }

      return fullAnswer;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get answer";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setAnswer("");
    setError(null);
  }, []);

  return { ask, answer, isLoading, error, clear };
}
