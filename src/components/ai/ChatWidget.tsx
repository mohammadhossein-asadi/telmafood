"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, X, ChefHat, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "./ChatInterface";
import { cn } from "@/lib/utils";

interface ChatWidgetProps {
  currentRecipe?: {
    id: string;
    title: string;
    ingredients: string[];
  } | null;
  className?: string;
  triggerClassName?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

export function ChatWidget({
  currentRecipe,
  className,
  triggerClassName,
  position = "bottom-right",
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  const positionStyles = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  };

  const panelPositionStyles = {
    "bottom-right": "bottom-16 right-0",
    "bottom-left": "bottom-16 left-0",
    "top-right": "top-16 right-0",
    "top-left": "top-16 left-0",
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Trap focus when open
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setIsOpen(false);
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setHasInteracted(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const quickPrompts = currentRecipe
    ? [
        `How do I make this recipe healthier?`,
        `What can I substitute for ${currentRecipe.ingredients[0] || "an ingredient"}?`,
        `Can I make this in a slow cooker?`,
        `What sides go well with this?`,
      ]
    : [
        "Plan 3 dinners under 500 calories",
        "Quick vegetarian dinner ideas",
        "Ingredient substitutions for baking",
        "Meal prep tips for the week",
      ];

  return (
    <div
      ref={widgetRef}
      className={cn(
        "fixed z-50 transition-all duration-300",
        positionStyles[position],
        className
      )}
    >
      {/* Floating Action Button */}
      <Button
        onClick={handleOpen}
        className={cn(
          "fixed h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg",
          "hover:shadow-xl hover:scale-105 transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "flex items-center justify-center",
          !hasInteracted && "animate-bounce",
          triggerClassName
        )}
        aria-label="Open cooking assistant"
        aria-expanded={isOpen}
      >
        <MessageSquare className="h-7 w-7" />
        {!hasInteracted && (
          <span className="absolute -top-2 -right-2 h-5 w-5 bg-primary-foreground text-primary text-xs font-bold rounded-full flex items-center justify-center">
            1
          </span>
        )}
      </Button>

      {/* Tooltip */}
      {!hasInteracted && !isOpen && (
        <div
          className={cn(
            "absolute bottom-16 left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-card text-card-foreground text-sm rounded-lg shadow-lg border border-border whitespace-nowrap animate-fade-in",
            position === "bottom-left" && "left-auto right-4",
            position === "top-right" && "bottom-auto top-16",
            position === "top-left" && "bottom-auto top-16 left-auto right-4"
          )}
        >
          Click to chat with your cooking assistant!
        </div>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={cn(
            "absolute w-[380px] sm:w-[420px] max-h-[600px] h-[600px] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-slide-up",
            panelPositionStyles[position]
          )}
          role="dialog"
          aria-label="Cooking assistant chat"
          aria-modal="true"
        >
          <ChatInterface
            currentRecipe={currentRecipe}
            onClose={handleClose}
            quickPrompts={quickPrompts}
            welcomeMessage={currentRecipe
              ? `Hi! I can help you with "${currentRecipe.title}". Ask me about substitutions, techniques, or modifications!`
              : "Hi! I'm your cooking assistant. Ask me anything about recipes, ingredients, techniques, or meal planning!"
            }
          />
        </div>
      )}
    </div>
  );
}
