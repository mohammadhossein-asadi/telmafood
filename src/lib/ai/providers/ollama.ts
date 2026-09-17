import { BaseProvider } from "./base";
import type { ChatMessage, ChatOptions, StreamChunk, ChatResponse, ProviderConfig } from "../types";

export class OllamaProvider extends BaseProvider {
  name = "ollama";

  protected getChatEndpoint(): string {
    return `${this.config.baseURL || "http://localhost:11434"}/api/chat`;
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
      const content = data.message?.content || "";
      const done = data.done === true;

      return {
        content,
        done,
        usage: data.eval_count
          ? {
              promptTokens: data.prompt_eval_count || 0,
              completionTokens: data.eval_count || 0,
              totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
            }
          : undefined,
      };
    } catch {
      return null;
    }
  }

  protected parseResponse(data: unknown): ChatResponse {
    const response = data as {
      message?: { content: string };
      eval_count?: number;
      prompt_eval_count?: number;
    };

    return {
      content: response.message?.content || "",
      usage: response.eval_count
        ? {
            promptTokens: response.prompt_eval_count || 0,
            completionTokens: response.eval_count,
            totalTokens: (response.prompt_eval_count || 0) + response.eval_count,
          }
        : undefined,
    };
  }

  protected buildPayload(messages: ChatMessage[], options: ChatOptions, stream: boolean): Record<string, unknown> {
    return {
      model: options.model || this.config.defaultModel,
      messages: this.formatMessages(messages),
      stream,
      options: {
        temperature: options.temperature ?? 0.7,
        num_predict: options.maxTokens ?? this.config.maxTokens ?? 4000,
      },
    };
  }
}

export function createOllamaProvider(config: ProviderConfig): OllamaProvider {
  return new OllamaProvider({
    ...config,
    baseURL: config.baseURL || "http://localhost:11434",
    defaultModel: config.defaultModel || "llama3.2:latest",
    maxTokens: config.maxTokens || 4000,
  });
}
