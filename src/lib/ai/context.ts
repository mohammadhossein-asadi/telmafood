import type { AIContext, RecipeContext, UserPreferences } from "./types";
import type { EdamamRecipe as Recipe } from "@/lib/api/types";

export function buildRecipeContext(recipe: Recipe): RecipeContext {
  return {
    id: recipe.uri,
    title: recipe.label,
    ingredients: recipe.ingredientLines || [],
    cuisineType: recipe.cuisineType,
    dietLabels: recipe.dietLabels,
    healthLabels: recipe.healthLabels,
    calories: recipe.calories,
    totalTime: recipe.totalTime,
    yield: recipe.yield,
    source: recipe.source,
    url: recipe.url,
  };
}

export function buildAIContext(options: {
  currentRecipe?: Recipe;
  savedRecipes?: Recipe[];
  userPreferences?: UserPreferences;
  conversationHistory?: Array<{ role: string; content: string }>;
}): AIContext {
  const context: AIContext = {};

  if (options.currentRecipe) {
    context.currentRecipe = buildRecipeContext(options.currentRecipe);
  }

  if (options.savedRecipes && options.savedRecipes.length > 0) {
    context.savedRecipes = options.savedRecipes.slice(0, 10).map(buildRecipeContext);
  }

  if (options.userPreferences) {
    context.userPreferences = options.userPreferences;
  }

  if (options.conversationHistory) {
    context.conversationHistory = options.conversationHistory.map((msg) => ({
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
      timestamp: Date.now(),
    }));
  }

  return context;
}

export function generateSystemPrompt(context: AIContext): string {
  const basePrompt = `You are TelmaFood's AI cooking assistant. You help users with recipe questions, meal planning, ingredient substitutions, cooking techniques, and dietary guidance.

Your capabilities:
- Answer questions about specific recipes (ingredients, techniques, modifications)
- Suggest meal plans based on dietary needs and preferences
- Provide ingredient substitutions for allergies, dietary restrictions, or missing items
- Explain cooking techniques and methods
- Help with meal planning and grocery lists
- Adapt recipes for different diets (vegan, keto, gluten-free, etc.)

Guidelines:
- Be concise but thorough
- Always consider dietary restrictions and allergies
- Provide practical, actionable advice
- When suggesting modifications, explain the impact on taste/texture
- Reference specific recipes when relevant
- Ask clarifying questions when needed
- Never provide medical or nutritional advice beyond general cooking knowledge

Format responses with clear sections when appropriate. Use bullet points for lists.`;

  let contextPrompt = "";

  if (context.currentRecipe) {
    const recipe = context.currentRecipe;
    contextPrompt += `\n\nCURRENT RECIPE CONTEXT:
Title: ${recipe.title}
Cuisine: ${recipe.cuisineType?.join(", ") || "Not specified"}
Diet labels: ${recipe.dietLabels?.join(", ") || "None"}
Health labels: ${recipe.healthLabels?.join(", ") || "None"}
Cook time: ${recipe.totalTime ? `${recipe.totalTime} minutes` : "Not specified"}
Servings: ${recipe.yield || "Not specified"}
Calories per serving: ${recipe.calories ? Math.round(recipe.calories / (recipe.yield || 1)) : "Not specified"}
Ingredients: ${recipe.ingredients.join(", ")}
Source: ${recipe.source || "Unknown"}`;
  }

  if (context.savedRecipes && context.savedRecipes.length > 0) {
    contextPrompt += `\n\nUSER'S SAVED RECIPES (${context.savedRecipes.length}):
${context.savedRecipes.map((r) => `- ${r.title} (${r.cuisineType?.join(", ") || "various"})`).join("\n")}`;
  }

  if (context.userPreferences) {
    const prefs = context.userPreferences;
    contextPrompt += `\n\nUSER PREFERENCES:
${prefs.dietaryRestrictions?.length ? `Dietary restrictions: ${prefs.dietaryRestrictions.join(", ")}` : ""}
${prefs.preferredCuisines?.length ? `Preferred cuisines: ${prefs.preferredCuisines.join(", ")}` : ""}
${prefs.cookingSkillLevel ? `Skill level: ${prefs.cookingSkillLevel}` : ""}
${prefs.allergies?.length ? `Allergies: ${prefs.allergies.join(", ")}` : ""}
${prefs.dislikedIngredients?.length ? `Disliked ingredients: ${prefs.dislikedIngredients.join(", ")}` : ""}`;
  }

  return basePrompt + contextPrompt;
}

export function generateQuickPrompts(context: AIContext): string[] {
  const prompts: string[] = [];

  if (context.currentRecipe) {
    const recipe = context.currentRecipe;
    prompts.push(
      `How do I make this recipe ${context.userPreferences?.dietaryRestrictions?.[0] || "healthier"}?`,
      `What can I substitute for ${recipe.ingredients[0] || "an ingredient"}?`,
      `Can I make this recipe in a slow cooker/Instant Pot?`,
      `What side dishes go well with this?`,
      `How do I store and reheat leftovers?`
    );
  } else {
    prompts.push(
      "Plan 3 dinners for this week under 500 calories each",
      "What can I make with chicken, rice, and broccoli?",
      "Suggest a quick vegetarian dinner for tonight",
      "How do I meal prep for the week?",
      "What's a good substitution for butter in baking?"
    );
  }

  return prompts.slice(0, 5);
}
