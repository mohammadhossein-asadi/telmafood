"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, X, Loader2, ChefHat, Sparkles, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useChat } from "./useChat";
import type { ChatMessage } from "./types";

interface ChatInterfaceProps {
  className?: string;
  currentRecipe?: {
    id: string;
    title: string;
    ingredients: string[];
  } | null;
  onClose?: () => void;
  welcomeMessage?: string;
  quickPrompts?: string[];
}

export function ChatInterface({
  className,
  currentRecipe,
  onClose,
  welcomeMessage = "Hi! I'm your cooking assistant. Ask me anything about recipes, ingredients, techniques, or meal planning!",
  quickPrompts = [],
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, isLoading, sendMessage, clearHistory, deleteMessage } = useChat({
    currentRecipeId: currentRecipe?.id,
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputValue.trim() || isLoading) return;
      
      const content = inputValue;
      setInputValue("");
      setShowQuickPrompts(false);
      sendMessage(content, currentRecipe || undefined);
    },
    [inputValue, isLoading, sendMessage, currentRecipe]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  const handleQuickPrompt = useCallback(
    (prompt: string) => {
      setInputValue(prompt);
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    },
    [handleSubmit]
  );

  const copyToClipboard = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
  }, []);

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br/>");
  };

  return (
    <div className={cn("flex flex-col h-full bg-background border border-border rounded-2xl overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-primary" />
          <span className="font-heading text-lg text-foreground">Cooking Assistant</span>
        </div>
        <div className="flex items-center gap-2">
          {currentRecipe && (
            <span className="text-xs text-muted-foreground px-2 py-1 bg-primary/10 rounded-full">
              {currentRecipe.title}
            </span>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close chat"
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && showQuickPrompts && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Sparkles className="h-12 w-12 text-primary/50 mb-4" />
            <p className="text-foreground/80 mb-6 max-w-sm">{welcomeMessage}</p>
            {quickPrompts.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {quickPrompts.map((prompt, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="text-left w-auto"
                    onClick={() => handleQuickPrompt(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(
                "flex-1 max-w-[80%]",
                message.role === "user" ? "text-right" : "text-left"
              )}
            >
              <div
                className={cn(
                  "inline-block px-4 py-2 rounded-2xl text-sm leading-relaxed",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted text-muted-foreground rounded-tl-none"
                )}
              >
                <div
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                />
              </div>
              {message.role === "assistant" && !message.isStreaming && (
                <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(message.content)}
                    aria-label="Copy message"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            {message.isStreaming && (
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          {quickPrompts.length > 0 && messages.length === 0 && showQuickPrompts && (
            <div className="flex flex-wrap gap-1.5" role="list" aria-label="Suggested prompts">
              {quickPrompts.slice(0, 4).map((prompt, i) => (
                <Button
                  key={i}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleQuickPrompt(prompt)}
                  role="listitem"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about cooking..."
              className={cn(
                "flex-1 min-h-[44px] max-h-32 px-4 py-2.5 bg-background border border-input rounded-xl text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isLoading && "opacity-50"
              )}
              disabled={isLoading}
              rows={1}
              aria-label="Chat input"
            />
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10 rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
              disabled={!inputValue.trim() || isLoading}
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
