import { BaseProvider } from "./base";
import type { ChatMessage, StreamChunk, ChatResponse, ProviderConfig } from "../types";

export class HuggingFaceProvider extends BaseProvider {
  name = "huggingface";

  protected getChatEndpoint(): string {
    return `${this.config.baseURL || "https://router.huggingface.co/v1"}/chat/completions`;
  }

  protected formatMessages(messages: ChatMessage[], systemPrompt?: string): unknown[] {
    const formatted: Array<{ role: string; content: string }> = [];

    if (systemPrompt) {
      formatted.push({ role: "system", content: systemPrompt });
    }

    for (const msg of messages) {
      formatted.push({ role: msg.role, content: msg.content });
    }

    return formatted;
  }

  protected parseStreamChunk(chunk: string): StreamChunk | null {
    try {
      const data = JSON.parse(chunk);
      const choice = data.choices?.[0];
      if (!choice) return null;

      const content = choice.delta?.content || "";
      const done = choice.finish_reason !== null && choice.finish_reason !== undefined;

      return {
        content,
        done,
        usage: data.usage
          ? {
              promptTokens: data.usage.prompt_tokens,
              completionTokens: data.usage.completion_tokens,
              totalTokens: data.usage.total_tokens,
            }
          : undefined,
      };
    } catch {
      return null;
    }
  }

  protected parseResponse(data: unknown): ChatResponse {
    const response = data as {
      choices?: Array<{ message?: { content: string } }>;
      usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
    };

    return {
      content: response.choices?.[0]?.message?.content || "",
      usage: response.usage
        ? {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          }
        : undefined,
    };
  }
}

export function createHuggingFaceProvider(config: ProviderConfig): HuggingFaceProvider {
  return new HuggingFaceProvider({
    ...config,
    baseURL: config.baseURL || "https://router.huggingface.co/v1",
    defaultModel: config.defaultModel || "deepseek-ai/DeepSeek-R1:fastest",
    maxTokens: config.maxTokens || 4000,
  });
}
