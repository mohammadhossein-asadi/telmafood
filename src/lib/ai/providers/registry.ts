import type { AIProvider, ProviderConfig, ProviderName, ProviderRegistry } from "../types";
import { createOpenRouterProvider } from "./openrouter";
import { createGroqProvider } from "./groq";
import { createHuggingFaceProvider } from "./huggingface";
import { createOllamaProvider } from "./ollama";

export const providerRegistry: ProviderRegistry = {
  openrouter: {
    create: createOpenRouterProvider,
    models: [
      "openai/gpt-4o",
      "openai/gpt-4o-mini",
      "anthropic/claude-3.5-sonnet",
      "anthropic/claude-3-haiku",
      "google/gemini-pro-1.5",
      "google/gemini-flash-1.5",
      "meta-llama/llama-3.3-70b-instruct",
      "mistralai/mistral-large",
      "deepseek/deepseek-chat",
    ],
    supportsStreaming: true,
    supportsTools: true,
  },
  groq: {
    create: createGroqProvider,
    models: [
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",
      "mixtral-8x7b-32768",
      "gemma2-9b-it",
    ],
    supportsStreaming: true,
    supportsTools: true,
  },
  huggingface: {
    create: createHuggingFaceProvider,
    models: [
      "deepseek-ai/DeepSeek-R1:fastest",
      "zai-org/GLM-4-9B:fastest",
      "meta-llama/Meta-Llama-3.1-70B-Instruct:fastest",
      "mistralai/Mistral-7B-Instruct-v0.3:fastest",
    ],
    supportsStreaming: true,
    supportsTools: false,
  },
  ollama: {
    create: createOllamaProvider,
    models: [
      "llama3.2:latest",
      "llama3.1:latest",
      "mistral:latest",
      "codellama:latest",
      "gemma2:latest",
    ],
    supportsStreaming: true,
    supportsTools: false,
  },
};

export type ProviderFactory = (config: ProviderConfig) => AIProvider;

export function getProviderFactory(name: ProviderName): ProviderFactory | undefined {
  return providerRegistry[name]?.create;
}

export function getAvailableModels(provider: ProviderName): string[] {
  return providerRegistry[provider]?.models || [];
}

export function createProvider(name: ProviderName, config: ProviderConfig): AIProvider | null {
  const factory = getProviderFactory(name);
  if (!factory) return null;
  return factory(config);
}

export function getDefaultProviderOrder(): ProviderName[] {
  return ["openrouter", "groq", "huggingface", "ollama"];
}

export function validateProviderConfig(name: ProviderName, config: ProviderConfig): boolean {
  if (!config.apiKey && name !== "ollama") return false;
  if (name === "ollama" && !config.baseURL) return false;
  return true;
}
