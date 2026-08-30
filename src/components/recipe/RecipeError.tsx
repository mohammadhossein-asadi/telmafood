"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecipeErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function RecipeError({ message, onRetry }: RecipeErrorProps) {
  return (
    <div className="mx-auto max-w-md text-center py-14">
      <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-sponsored-bg text-sponsored">
        <AlertCircle className="h-6 w-6" aria-hidden />
      </div>
      <h2 className="font-heading text-xl tracking-[-0.02em] text-foreground mb-2">
        Recipes couldn&rsquo;t be loaded
      </h2>
      <p className="text-sm leading-relaxed text-muted-foreground mb-6">
        {message || "Something went wrong while fetching recipes. Please try again."}
      </p>
      <Button
        variant="outline"
        onClick={() => (onRetry ? onRetry() : window.location.reload())}
      >
        Try again
      </Button>
    </div>
  );
}
