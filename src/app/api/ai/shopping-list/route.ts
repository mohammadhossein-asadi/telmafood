import { NextRequest, NextResponse } from "next/server";
import { createAIRouter } from "@/lib/ai/router";
import { buildAIContext, generateSystemPrompt } from "@/lib/ai/context";
import type { ChatMessage, RecipeContext } from "@/lib/ai/types";
import type { EdamamRecipe } from "@/lib/api/types";

export const runtime = "edge";

interface ShoppingListRequest {
  recipes: RecipeContext[];
  servings?: number;
  organizeByStore?: boolean;
  includePantryStaples?: boolean;
}

const SHOPPING_LIST_SYSTEM_PROMPT = `You are a professional grocery list organizer. Create an optimized shopping list from recipes.

Return a JSON object with this exact structure:
{
  "items": [
    {
      "name": "ingredient name",
      "quantity": "amount with unit",
      "category": "produce|meat|seafood|dairy|pantry|frozen|bakery|spices|beverages|other",
      "notes": "optional notes (e.g., 'fresh', 'organic', 'low-sodium')",
      "recipes": ["recipe1", "recipe2"]
    }
  ],
  "categories": {
    "produce": ["item1", "item2"],
    "meat": ["item3"],
    "seafood": [],
    "dairy": ["item4"],
    "pantry": ["item5", "item6"],
    "frozen": [],
    "bakery": [],
    "spices": ["item7"],
    "beverages": [],
    "other": []
  },
  "estimatedCost": "optional rough estimate",
  "tips": ["tip1", "tip2"]
}

Guidelines:
- Combine duplicate ingredients across recipes
- Scale quantities for servings
- Group by store section for efficient shopping
- Mark pantry staples (oil, salt, pepper, flour) if requested
- Suggest fresh vs frozen vs canned when relevant
- Include prep notes (chopped, minced, etc.)`;

export async function POST(request: NextRequest) {
  try {
    const body: ShoppingListRequest = await request.json();
    const { recipes, servings, organizeByStore = true, includePantryStaples = false } = body;

    if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
      return NextResponse.json(
        { error: "At least one recipe is required" },
        { status: 400 }
      );
    }

    // Build context
    const context = buildAIContext({
      savedRecipes: recipes as unknown as EdamamRecipe[],
      userPreferences: {
        dietaryRestrictions: [],
        preferredCuisines: [],
        cookingSkillLevel: "intermediate",
        allergies: [],
        dislikedIngredients: [],
      },
    });

    const systemPrompt = generateSystemPrompt(context) + "\n\n" + SHOPPING_LIST_SYSTEM_PROMPT;

    const router = createAIRouter({
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
      GROQ_API_KEY: process.env.GROQ_API_KEY,
      HF_DEEPSEEK_API_KEY: process.env.HF_DEEPSEEK_API_KEY,
      HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
    });

    const recipeDetails = recipes.map((r) => 
      `${r.title}${r.yield ? ` (${r.yield} servings)` : ""}: ${r.ingredients.join(", ")}`
    ).join("\n");

    const messages: ChatMessage[] = [
      {
        role: "user",
        content: `Create a shopping list for these recipes:
${recipeDetails}

${servings ? `Scale all quantities for ${servings} servings per recipe.` : ""}
${organizeByStore ? "Organize by store section for efficient shopping." : ""}
${includePantryStaples ? "Include pantry staples (oil, salt, pepper, flour, sugar, etc.)." : "Exclude common pantry staples."}

Return ONLY valid JSON matching the specified structure.`,
        timestamp: Date.now(),
      },
    ];

    const response = await router.chatNonStreaming(messages, {
      systemPrompt,
      temperature: 0.3,
      maxTokens: 4000,
    });

    try {
      const shoppingList = JSON.parse(response.content);
      return NextResponse.json(shoppingList);
    } catch (parseError) {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const shoppingList = JSON.parse(jsonMatch[0]);
          return NextResponse.json(shoppingList);
        } catch {
          // Fall through
        }
      }
      return NextResponse.json(
        { error: "Failed to parse shopping list response", raw: response.content },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Shopping list API error:", error);
    return NextResponse.json(
      { error: "Failed to generate shopping list" },
      { status: 500 }
    );
  }
}
