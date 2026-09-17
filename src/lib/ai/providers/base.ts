import type {
  AIProvider,
  ChatMessage,
  ChatOptions,
  StreamChunk,
  ChatResponse,
  ProviderConfig,
} from "../types";

export abstract class BaseProvider implements AIProvider {
  protected config: ProviderConfig;
  protected defaultHeaders: Record<string, string>;

  constructor(config: ProviderConfig) {
    this.config = config;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    };
  }

  abstract name: string;

  protected abstract getChatEndpoint(): string;

  protected abstract formatMessages(messages: ChatMessage[], systemPrompt?: string): unknown[];

  protected abstract parseStreamChunk(chunk: string): StreamChunk | null;

  protected abstract parseResponse(data: unknown): ChatResponse;

  async *chat(messages: ChatMessage[], options: ChatOptions = {}): AsyncGenerator<StreamChunk> {
    const payload = this.buildPayload(messages, options, true);

    try {
      const response = await fetch(this.getChatEndpoint(), {
        method: "POST",
        headers: this.defaultHeaders,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(this.config.timeout || 60000),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`${this.name} API error: ${response.status} - ${error}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") {
              yield { content: "", done: true };
              return;
            }
            const parsed = this.parseStreamChunk(data);
            if (parsed) {
              yield parsed;
              if (parsed.done) return;
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`${this.name} streaming error: ${error.message}`);
      }
      throw error;
    }
  }

  async chatNonStreaming(messages: ChatMessage[], options: ChatOptions = {}): Promise<ChatResponse> {
    const payload = this.buildPayload(messages, options, false);

    try {
      const response = await fetch(this.getChatEndpoint(), {
        method: "POST",
        headers: this.defaultHeaders,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(this.config.timeout || 60000),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`${this.name} API error: ${response.status} - ${error}`);
      }

      const data = await response.json();
      return this.parseResponse(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`${this.name} request error: ${error.message}`);
      }
      throw error;
    }
  }

  protected buildPayload(messages: ChatMessage[], options: ChatOptions, stream: boolean): Record<string, unknown> {
    const formattedMessages = this.formatMessages(messages, options.systemPrompt);

    return {
      model: options.model || this.config.defaultModel,
      messages: formattedMessages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? this.config.maxTokens ?? 4000,
      stream,
      tools: options.tools,
      tool_choice: options.toolChoice,
    };
  }
}
