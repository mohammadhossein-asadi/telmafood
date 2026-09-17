import { NextRequest, NextResponse } from "next/server";
import { createAIRouter } from "@/lib/ai/router";
import { buildAIContext, generateSystemPrompt } from "@/lib/ai/context";
import type { ChatMessage, RecipeContext } from "@/lib/ai/types";
import type { EdamamRecipe } from "@/lib/api/types";

export const runtime = "edge";

interface RecipeQnARequest {
  question: string;
  recipeContext?: RecipeContext;
  conversationHistory?: ChatMessage[];
}

const RECIPE_QNA_SYSTEM_PROMPT = `You are a knowledgeable cooking assistant helping with specific recipe questions.

Guidelines:
- Answer the specific question about the recipe
- Be practical and actionable
- Consider the recipe context (cuisine, dietary labels, ingredients)
- If asked about modifications, explain impact on taste/texture
- If asked about techniques, give step-by-step guidance
- If asked about substitutions, provide ratios and notes
- If asked about storage/reheating, give food safety info
- Ask clarifying questions if the question is ambiguous
- Keep responses focused and concise`;

export async function POST(request: NextRequest) {
  try {
    const body: RecipeQnARequest = await request.json();
    const { question, recipeContext, conversationHistory = [] } = body;

    if (!question || !question.trim()) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    // Build context
    const context = buildAIContext({
      currentRecipe: recipeContext as unknown as EdamamRecipe,
      conversationHistory,
      userPreferences: {
        dietaryRestrictions: [],
        preferredCuisines: [],
        cookingSkillLevel: "intermediate",
        allergies: [],
        dislikedIngredients: [],
      },
    });

    const systemPrompt = generateSystemPrompt(context) + "\n\n" + RECIPE_QNA_SYSTEM_PROMPT;

    const router = createAIRouter({
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
      GROQ_API_KEY: process.env.GROQ_API_KEY,
      HF_DEEPSEEK_API_KEY: process.env.HF_DEEPSEEK_API_KEY,
      HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
    });

    const messages: ChatMessage[] = [
      ...conversationHistory.slice(-6), // Last 6 messages for context
      {
        role: "user",
        content: question.trim(),
        timestamp: Date.now(),
      },
    ];

    // Use streaming for real-time feel
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    (async () => {
      try {
        for await (const chunk of router.chat(messages, {
          systemPrompt,
          temperature: 0.6,
          maxTokens: 3000,
        })) {
          if (chunk.content) {
            const data = `data: ${JSON.stringify({ content: chunk.content, done: chunk.done })}\n\n`;
            await writer.write(encoder.encode(data));
          }
          if (chunk.done) break;
        }
        await writer.close();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        const errorData = `data: ${JSON.stringify({ error: errorMessage, done: true })}\n\n`;
        await writer.write(encoder.encode(errorData));
        await writer.close();
      }
    })();

    return new NextResponse(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Recipe Q&A API error:", error);
    return NextResponse.json(
      { error: "Failed to process question" },
      { status: 500 }
    );
  }
}
