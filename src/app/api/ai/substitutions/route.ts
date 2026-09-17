import { NextRequest, NextResponse } from "next/server";
import { createAIRouter } from "@/lib/ai/router";
import { buildAIContext, generateSystemPrompt } from "@/lib/ai/context";
import type { ChatMessage, RecipeContext } from "@/lib/ai/types";
import type { EdamamRecipe } from "@/lib/api/types";

export const runtime = "edge";

interface SubstitutionRequest {
  ingredient: string;
  recipeContext?: RecipeContext;
  dietaryRestrictions?: string[];
  allergies?: string[];
  reason?: "allergy" | "dietary" | "availability" | "preference" | "health";
}

const SUBSTITUTION_SYSTEM_PROMPT = `You are a culinary expert specializing in ingredient substitutions. Provide practical, tested alternatives.

Return a JSON object with this exact structure:
{
  "originalIngredient": "ingredient name",
  "reason": "why substitution is needed",
  "substitutes": [
    {
      "ingredient": "substitute name",
      "ratio": "1:1 or 1 cup = 3/4 cup etc",
      "notes": "impact on flavor, texture, cooking time",
      "bestFor": ["baking", "cooking", "raw"],
      "availability": "common|specialty|hard-to-find"
    }
  ],
  "generalTips": "Additional advice for successful substitution"
}

Guidelines:
- Provide 3-5 substitutes ranked by similarity
- Include exact ratios when possible
- Explain impact on taste, texture, moisture, structure
- Note if adjustments needed (liquid, leavening, cooking time)
- Consider dietary restrictions and allergies
- Mark availability (common pantry vs specialty store)`;

export async function POST(request: NextRequest) {
  try {
    const body: SubstitutionRequest = await request.json();
    const { ingredient, recipeContext, dietaryRestrictions = [], allergies = [], reason = "availability" } = body;

    if (!ingredient || !ingredient.trim()) {
      return NextResponse.json(
        { error: "Ingredient is required" },
        { status: 400 }
      );
    }

    // Build context
    const context = buildAIContext({
      currentRecipe: recipeContext as unknown as EdamamRecipe,
      userPreferences: {
        dietaryRestrictions,
        allergies,
        cookingSkillLevel: "intermediate",
        preferredCuisines: [],
        dislikedIngredients: [],
      },
    });

    const systemPrompt = generateSystemPrompt(context) + "\n\n" + SUBSTITUTION_SYSTEM_PROMPT;

    const router = createAIRouter({
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
      GROQ_API_KEY: process.env.GROQ_API_KEY,
      HF_DEEPSEEK_API_KEY: process.env.HF_DEEPSEEK_API_KEY,
      HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
    });

    const messages: ChatMessage[] = [
      {
        role: "user",
        content: `I need a substitution for: ${ingredient.trim()}
Reason: ${reason}
${recipeContext ? `Recipe context: ${recipeContext.title} (${recipeContext.cuisineType?.join(", ") || "various"})` : ""}
${dietaryRestrictions.length > 0 ? `Dietary restrictions: ${dietaryRestrictions.join(", ")}` : ""}
${allergies.length > 0 ? `Allergies: ${allergies.join(", ")}` : ""}

Return ONLY valid JSON matching the specified structure.`,
        timestamp: Date.now(),
      },
    ];

    const response = await router.chatNonStreaming(messages, {
      systemPrompt,
      temperature: 0.5,
      maxTokens: 3000,
    });

    try {
      const substitutions = JSON.parse(response.content);
      return NextResponse.json(substitutions);
    } catch (parseError) {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const substitutions = JSON.parse(jsonMatch[0]);
          return NextResponse.json(substitutions);
        } catch {
          // Fall through
        }
      }
      return NextResponse.json(
        { error: "Failed to parse substitution response", raw: response.content },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Substitution API error:", error);
    return NextResponse.json(
      { error: "Failed to generate substitutions" },
      { status: 500 }
    );
  }
}
