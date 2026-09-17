export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  metadata?: {
    recipeId?: string;
    tokensUsed?: number;
    model?: string;
  };
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  currentRecipeId?: string;
}

export interface UseChatOptions {
  initialMessages?: ChatMessage[];
  currentRecipeId?: string;
  onError?: (error: Error) => void;
}

export interface StreamingResponse {
  content: string;
  done: boolean;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  error?: string;
}
