export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: number;
  metadata?: Record<string, unknown>;
}

export interface StreamChunk {
  content: string;
  done: boolean;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIProvider {
  name: string;
  chat(messages: ChatMessage[], options?: ChatOptions): AsyncGenerator<StreamChunk>;
  chatNonStreaming(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse>;
}

export interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  tools?: Tool[];
  toolChoice?: "auto" | "none" | "required";
}

export interface ChatResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  toolCalls?: ToolCall[];
}

export interface Tool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

export interface AIContext {
  currentRecipe?: RecipeContext;
  savedRecipes?: RecipeContext[];
  userPreferences?: UserPreferences;
  conversationHistory?: ChatMessage[];
}

export interface RecipeContext {
  id: string;
  title: string;
  ingredients: string[];
  instructions?: string;
  cuisineType?: string[];
  dietLabels?: string[];
  healthLabels?: string[];
  calories?: number;
  totalTime?: number;
  yield?: number;
  source?: string;
  url?: string;
}

export interface UserPreferences {
  dietaryRestrictions?: string[];
  preferredCuisines?: string[];
  cookingSkillLevel?: "beginner" | "intermediate" | "advanced";
  allergies?: string[];
  dislikedIngredients?: string[];
}

export interface ProviderConfig {
  apiKey: string;
  baseURL?: string;
  defaultModel?: string;
  maxTokens?: number;
  timeout?: number;
}

export type ProviderName = "openrouter" | "groq" | "huggingface" | "ollama" | "openai" | "mistral" | "anthropic";

export interface ProviderRegistry {
  [key: string]: {
    create: (config: ProviderConfig) => AIProvider;
    models: string[];
    supportsStreaming: boolean;
    supportsTools: boolean;
  };
}
