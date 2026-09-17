import { NextRequest, NextResponse } from "next/server";
import { createAIRouter } from "@/lib/ai/router";
import { buildAIContext, generateSystemPrompt } from "@/lib/ai/context";
import type { ChatMessage, RecipeContext } from "@/lib/ai/types";
import type { EdamamRecipe } from "@/lib/api/types";

export const runtime = "edge";

interface MealPlanRequest {
  days: number;
  mealsPerDay: number;
  dietaryRestrictions?: string[];
  preferredCuisines?: string[];
  calorieTarget?: number;
  savedRecipes?: RecipeContext[];
  excludeIngredients?: string[];
}

const MEAL_PLAN_SYSTEM_PROMPT = `You are a professional meal planner. Create a detailed weekly meal plan based on user preferences.

Return a JSON object with this exact structure:
{
  "weekStart": "YYYY-MM-DD",
  "days": [
    {
      "day": "Monday",
      "date": "YYYY-MM-DD",
      "meals": [
        {
          "type": "breakfast|lunch|dinner|snack",
          "title": "Recipe name",
          "description": "Brief description",
          "estimatedCalories": number,
          "prepTimeMinutes": number,
          "ingredients": ["ingredient1", "ingredient2"],
          "instructions": ["step1", "step2"],
          "tags": ["vegetarian", "quick", "meal-prep"]
        }
      ],
      "totalCalories": number,
      "shoppingList": ["item1", "item2"]
    }
  ],
  "shoppingList": {
    "produce": ["item1"],
    "protein": ["item2"],
    "pantry": ["item3"],
    "dairy": ["item4"],
    "other": ["item5"]
  },
  "notes": "Any important notes about the meal plan"
}

Guidelines:
- Balance nutrients across the week
- Include variety in cuisines and proteins
- Consider meal prep (leftovers for lunch)
- Respect dietary restrictions strictly
- Keep total daily calories near target
- Make shopping list organized by store section
- Provide realistic prep times`;

export async function POST(request: NextRequest) {
  try {
    const body: MealPlanRequest = await request.json();
    const {
      days = 7,
      mealsPerDay = 3,
      dietaryRestrictions = [],
      preferredCuisines = [],
      calorieTarget = 2000,
      savedRecipes = [],
      excludeIngredients = [],
    } = body;

    if (days < 1 || days > 14) {
      return NextResponse.json(
        { error: "Days must be between 1 and 14" },
        { status: 400 }
      );
    }

    // Build context with saved recipes
    const context = buildAIContext({
      savedRecipes: savedRecipes as unknown as EdamamRecipe[],
      userPreferences: {
        dietaryRestrictions,
        preferredCuisines,
        cookingSkillLevel: "intermediate",
        allergies: [],
        dislikedIngredients: excludeIngredients,
      },
    });

    const systemPrompt = generateSystemPrompt(context) + "\n\n" + MEAL_PLAN_SYSTEM_PROMPT;

    const router = createAIRouter({
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
      GROQ_API_KEY: process.env.GROQ_API_KEY,
      HF_DEEPSEEK_API_KEY: process.env.HF_DEEPSEEK_API_KEY,
      HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
    });

    const messages: ChatMessage[] = [
      {
        role: "user",
        content: `Create a ${days}-day meal plan with ${mealsPerDay} meals per day. 
Target calories per day: ~${calorieTarget}.
Dietary restrictions: ${dietaryRestrictions.join(", ") || "None"}
Preferred cuisines: ${preferredCuisines.join(", ") || "Any"}
Exclude ingredients: ${excludeIngredients.join(", ") || "None"}
${savedRecipes.length > 0 ? `Incorporate these saved recipes: ${savedRecipes.map(r => r.title).join(", ")}` : ""}

Return ONLY valid JSON matching the specified structure.`,
        timestamp: Date.now(),
      },
    ];

    const response = await router.chatNonStreaming(messages, {
      systemPrompt,
      temperature: 0.7,
      maxTokens: 8000,
    });

    try {
      const mealPlan = JSON.parse(response.content);
      return NextResponse.json(mealPlan);
    } catch (parseError) {
      // Try to extract JSON from response
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const mealPlan = JSON.parse(jsonMatch[0]);
          return NextResponse.json(mealPlan);
        } catch {
          // Fall through to error
        }
      }
      return NextResponse.json(
        { error: "Failed to parse meal plan response", raw: response.content },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Meal plan API error:", error);
    return NextResponse.json(
      { error: "Failed to generate meal plan" },
      { status: 500 }
    );
  }
}
