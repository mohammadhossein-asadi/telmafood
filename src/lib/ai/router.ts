import type { AIProvider, ChatMessage, ChatOptions, StreamChunk, ChatResponse, ProviderName } from "./types";
import { providerRegistry, getDefaultProviderOrder, createProvider, validateProviderConfig } from "./providers/registry";

export interface RouterConfig {
  providerOrder: ProviderName[];
  providerConfigs: Record<ProviderName, { apiKey?: string; baseURL?: string; defaultModel?: string }>;
  maxRetries: number;
  retryDelay: number;
}

const defaultProviderConfigs: Record<ProviderName, { apiKey?: string; baseURL?: string; defaultModel?: string }> = {
  openrouter: {},
  groq: {},
  huggingface: {},
  ollama: {},
  openai: {},
  mistral: {},
  anthropic: {},
};

export class AIRouter {
  private providers: Map<ProviderName, AIProvider> = new Map();
  private config: RouterConfig;

  constructor(config: Partial<RouterConfig> = {}) {
    this.config = {
      providerOrder: config.providerOrder || getDefaultProviderOrder(),
      providerConfigs: config.providerConfigs || defaultProviderConfigs,
      maxRetries: config.maxRetries || 2,
      retryDelay: config.retryDelay || 1000,
    };
  }

  private getProvider(name: ProviderName): AIProvider | null {
    if (this.providers.has(name)) {
      return this.providers.get(name)!;
    }

    const providerConfig = this.config.providerConfigs[name];
    if (!providerConfig) return null;

    const fullConfig = {
      apiKey: providerConfig.apiKey || "",
      baseURL: providerConfig.baseURL,
      defaultModel: providerConfig.defaultModel,
      maxTokens: 4000,
      timeout: 60000,
    };

    if (!validateProviderConfig(name, fullConfig)) {
      return null;
    }

    const provider = createProvider(name, fullConfig);
    if (provider) {
      this.providers.set(name, provider);
    }

    return provider || null;
  }

  async *chat(messages: ChatMessage[], options: ChatOptions = {}): AsyncGenerator<StreamChunk> {
    const errors: Array<{ provider: ProviderName; error: Error }> = [];

    for (const providerName of this.config.providerOrder) {
      const provider = this.getProvider(providerName);
      if (!provider) {
        errors.push({ provider: providerName, error: new Error("Provider not configured") });
        continue;
      }

      try {
        let hasError = false;
        
        for await (const chunk of provider.chat(messages, options)) {
          if (chunk.done && chunk.content === "" && !hasError) {
            // Empty completion might indicate an issue
            hasError = true;
          }
          yield chunk;
          if (chunk.done) return;
        }
        
        // Success - we got a complete response
        return;
      } catch (error) {
        errors.push({ provider: providerName, error: error instanceof Error ? error : new Error(String(error)) });
        
        // Wait before trying next provider
        await new Promise((resolve) => setTimeout(resolve, this.config.retryDelay));
        continue;
      }
    }

    // All providers failed
    throw new Error(
      `All AI providers failed: ${errors.map((e) => `${e.provider}: ${e.error.message}`).join("; ")}`
    );
  }

  async chatNonStreaming(messages: ChatMessage[], options: ChatOptions = {}): Promise<ChatResponse> {
    const errors: Array<{ provider: ProviderName; error: Error }> = [];

    for (const providerName of this.config.providerOrder) {
      const provider = this.getProvider(providerName);
      if (!provider) {
        errors.push({ provider: providerName, error: new Error("Provider not configured") });
        continue;
      }

      for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
        try {
          const response = await provider.chatNonStreaming(messages, options);
          return response;
        } catch (error) {
          if (attempt < this.config.maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, this.config.retryDelay * (attempt + 1)));
            continue;
          }
          errors.push({ provider: providerName, error: error instanceof Error ? error : new Error(String(error)) });
        }
      }
    }

    throw new Error(
      `All AI providers failed: ${errors.map((e) => `${e.provider}: ${e.error.message}`).join("; ")}`
    );
  }

  getAvailableProviders(): ProviderName[] {
    return this.config.providerOrder.filter((name) => this.getProvider(name) !== null);
  }

  clearCache(): void {
    this.providers.clear();
  }
}

export function createAIRouter(env: Record<string, string | undefined>): AIRouter {
  return new AIRouter({
    providerOrder: ["openrouter", "groq", "huggingface", "ollama"],
    providerConfigs: {
      openrouter: {
        apiKey: env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
        defaultModel: "openai/gpt-4o-mini",
      },
      groq: {
        apiKey: env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
        defaultModel: "llama-3.3-70b-versatile",
      },
      huggingface: {
        apiKey: env.HF_DEEPSEEK_API_KEY || env.HUGGINGFACE_API_KEY,
        baseURL: "https://router.huggingface.co/v1",
        defaultModel: "deepseek-ai/DeepSeek-R1:fastest",
      },
      ollama: {
        apiKey: env.OLLAMA_API_KEY,
        baseURL: env.OLLAMA_BASE_URL || "http://localhost:11434",
        defaultModel: "llama3.2:latest",
      },
      openai: {},
      mistral: {},
      anthropic: {},
    },
  });
}
