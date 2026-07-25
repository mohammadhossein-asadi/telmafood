"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const searchVariants = cva("relative w-full", {
  variants: {
    size: {
      default: "",
      large: "",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface SearchBarProps extends VariantProps<typeof searchVariants> {
  defaultValue?: string;
  placeholder?: string;
}

export function SearchBar({
  defaultValue = "",
  placeholder = "Search recipes...",
  size = "default",
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/recipes?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(searchVariants({ size }))}
      role="search"
      aria-label="Search recipes"
    >
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "bg-background",
          size === "large"
            ? "h-14 text-lg pl-10 pr-24 rounded-full"
            : "h-12 pl-10 pr-24 rounded-lg"
        )}
        aria-label="Search recipes"
      />
      <Button
        type="submit"
        className={cn(
          "absolute right-1 top-1/2 -translate-y-1/2",
          size === "large"
            ? "h-12 px-6 rounded-full"
            : "h-10 px-4 rounded-md"
        )}
      >
        Search
      </Button>
    </form>
  );
}
