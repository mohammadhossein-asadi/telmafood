"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { Sun, Moon, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      setMounted(true);
    }
  }, [setMounted]);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <header className="sticky top-0 z-50 h-16 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-[1280px] px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-xl font-medium text-primary">
            TelmaFood
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/recipes"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Recipes
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Link href="/saved">
            <Button variant="ghost" size="icon" aria-label="Saved recipes">
              <Bookmark className="h-5 w-5" />
              <span className="sr-only">Saved recipes</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
