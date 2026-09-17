"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { ChatMessage, ChatState, UseChatOptions, StreamingResponse } from "./types";

const STORAGE_KEY = "telmafood-chat-history";
const MAX_HISTORY = 50;

export function useChat(options: UseChatOptions = {}) {
  const { initialMessages = [], currentRecipeId, onError } = options;
  
  const [state, setState] = useState<ChatState>({
    messages: initialMessages,
    isLoading: false,
    error: null,
    currentRecipeId,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const messageIdCounter = useRef(0);

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setState((prev) => ({
            ...prev,
            messages: [...parsed.slice(-MAX_HISTORY), ...initialMessages],
          }));
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, [initialMessages]);

  // Save chat history to localStorage
  useEffect(() => {
    if (state.messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.messages.slice(-MAX_HISTORY)));
      } catch {
        // Ignore storage errors
      }
    }
  }, [state.messages]);

  const generateId = useCallback(() => {
    return `msg-${Date.now()}-${messageIdCounter.current++}`;
  }, []);

  const sendMessage = useCallback(
    async (content: string, recipeContext?: { id: string; title: string; ingredients: string[] }) => {
      if (!content.trim() || state.isLoading) return;

      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
        metadata: recipeContext ? { recipeId: recipeContext.id } : undefined,
      };

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        isStreaming: true,
      };

      // Update state with user message and placeholder assistant message
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage, assistantMessage],
        isLoading: true,
        error: null,
      }));

      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              ...state.messages.map((m) => ({ role: m.role, content: m.content })),
              { role: "user", content: content.trim() },
            ],
            currentRecipe: recipeContext,
            userPreferences: {
              dietaryRestrictions: [],
              preferredCuisines: [],
              cookingSkillLevel: "intermediate",
              allergies: [],
              dislikedIngredients: [],
            },
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response stream");
        }

        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data: StreamingResponse = JSON.parse(line.slice(6));
                
                if (data.error) {
                  throw new Error(data.error);
                }

                if (data.content) {
                  fullContent += data.content;
                  setState((prev) => ({
                    ...prev,
                    messages: prev.messages.map((msg) =>
                      msg.id === assistantMessage.id
                        ? { ...msg, content: fullContent, isStreaming: !data.done }
                        : msg
                    ),
                  }));
                }

                if (data.done) {
                  setState((prev) => ({
                    ...prev,
                    messages: prev.messages.map((msg) =>
                      msg.id === assistantMessage.id
                        ? { ...msg, isStreaming: false, metadata: { ...msg.metadata, tokensUsed: data.usage?.totalTokens } }
                        : msg
                    ),
                    isLoading: false,
                  }));
                }
              } catch (parseError) {
                // Ignore parse errors for incomplete chunks
              }
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          // User cancelled, remove the assistant message
          setState((prev) => ({
            ...prev,
            messages: prev.messages.filter((msg) => msg.id !== assistantMessage.id),
            isLoading: false,
          }));
          return;
        }

        const errorMessage = error instanceof Error ? error.message : "Failed to send message";
        
        setState((prev) => ({
          ...prev,
          messages: prev.messages.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, content: "Sorry, I encountered an error. Please try again.", isStreaming: false }
              : msg
          ),
          isLoading: false,
          error: errorMessage,
        }));

        onError?.(error instanceof Error ? error : new Error(errorMessage));
      }
    },
    [state.messages, state.isLoading, generateId, onError]
  );

  const clearHistory = useCallback(() => {
    setState((prev) => ({
      ...prev,
      messages: [],
      error: null,
    }));
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const retryLastMessage = useCallback(() => {
    const lastUserMessage = [...state.messages].reverse().find((m) => m.role === "user");
    if (lastUserMessage) {
      // Remove the failed assistant message
      setState((prev) => ({
        ...prev,
        messages: prev.messages.filter((msg) => msg.id !== lastUserMessage.id && msg.role !== "assistant"),
      }));
      sendMessage(lastUserMessage.content);
    }
  }, [state.messages, sendMessage]);

  const deleteMessage = useCallback((messageId: string) => {
    setState((prev) => ({
      ...prev,
      messages: prev.messages.filter((msg) => msg.id !== messageId),
    }));
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearHistory,
    retryLastMessage,
    deleteMessage,
  };
}
