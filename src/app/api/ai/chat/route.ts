import { NextRequest, NextResponse } from "next/server";
import { createAIRouter } from "@/lib/ai/router";
import { buildAIContext, generateSystemPrompt } from "@/lib/ai/context";
import type { ChatMessage, RecipeContext } from "@/lib/ai/types";
import type { EdamamRecipe } from "@/lib/api/types";

export const runtime = "edge";

interface ChatRequestBody {
  messages: ChatMessage[];
  currentRecipe?: RecipeContext;
  userPreferences?: {
    dietaryRestrictions?: string[];
    preferredCuisines?: string[];
    cookingSkillLevel?: "beginner" | "intermediate" | "advanced";
    allergies?: string[];
    dislikedIngredients?: string[];
  };
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

function getClientIP(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
         request.headers.get("x-real-ip") ||
         "unknown";
}

// Simple in-memory rate limiter (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait before sending more messages." },
        { status: 429 }
      );
    }

    const body: ChatRequestBody = await request.json();
    const { messages, currentRecipe, userPreferences, model, temperature, maxTokens } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Get saved recipes from user's localStorage (passed from client)
    // In a real app, you'd get this from a session/user database
    const savedRecipes: EdamamRecipe[] = []; // Will be populated from client

    // Build AI context
    const context = buildAIContext({
      currentRecipe: currentRecipe ? currentRecipe as unknown as EdamamRecipe : undefined,
      savedRecipes,
      userPreferences,
      conversationHistory: messages.slice(0, -1), // Exclude current message
    });

    // Generate system prompt with context
    const systemPrompt = generateSystemPrompt(context);

    // Create router with environment variables
    const router = createAIRouter({
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
      GROQ_API_KEY: process.env.GROQ_API_KEY,
      HF_DEEPSEEK_API_KEY: process.env.HF_DEEPSEEK_API_KEY,
      HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
      OLLAMA_API_KEY: process.env.OLLAMA_API_KEY,
      OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL,
    });

    // Create a TransformStream for streaming response
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Start streaming in background
    (async () => {
      try {
        let fullContent = "";
        
        for await (const chunk of router.chat(messages, {
          model,
          temperature: temperature ?? 0.7,
          maxTokens: maxTokens ?? 4000,
          systemPrompt,
        })) {
          if (chunk.content) {
            fullContent += chunk.content;
            const data = `data: ${JSON.stringify({ content: chunk.content, done: chunk.done })}\n\n`;
            await writer.write(encoder.encode(data));
          }
          
          if (chunk.done) {
            // Send final usage info if available
            if (chunk.usage) {
              const usageData = `data: ${JSON.stringify({ usage: chunk.usage, done: true })}\n\n`;
              await writer.write(encoder.encode(usageData));
            }
            break;
          }
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
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
