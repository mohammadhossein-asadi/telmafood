# TelmaFood Comprehensive Audit & Optimization Plan

> [!NOTE]
> This document may not reflect the current implementation.
> See the final report for up-to-date state:
> [Final Report](../reports/comprehensive-audit-optimization.md)

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform TelmaFood from a working prototype into a production-grade, accessible, SEO-optimized, secure, and performant recipe discovery application.

**Architecture:** Next.js 16 App Router with shadcn/ui (base-nova), Tailwind v4, Zustand for client state, React Query for server state, Edamam API for recipe data. The audit covers bugs, security, accessibility, SEO, performance, code quality, and production readiness.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (base-ui), Zustand, React Query, next-themes, Sonner, Lucide icons

## Global Constraints
- All changes must pass `npm run build` with zero errors
- Follow existing shadcn/ui component patterns (base-nova style, base-ui primitives)
- Maintain backwards compatibility with existing saved recipes in localStorage
- API keys must never be exposed to client bundle
- All interactive elements must be keyboard accessible
- All images must have meaningful alt text

---

## Task 1: Fix Critical Bugs

**Covers:** Bug fixes, correctness

**Files:**
- Modify: `src/app/recipe/[id]/page.tsx`
- Modify: `next.config.ts`
- Modify: `src/app/global-error.tsx`

- [ ] **Step 1: Fix undefined CSS classes in RecipeDetail error state**

In `src/app/recipe/[id]/page.tsx:24,28`, the error state uses `container`, `headline-small`, and `body-large` classes that don't exist in the CSS or Tailwind config. Replace with valid Tailwind classes:

```tsx
// src/app/recipe/[id]/page.tsx - replace lines 23-31
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="font-heading text-3xl text-foreground mb-4">
          Recipe not found
        </h1>
        <p className="text-base text-foreground/60">
          The recipe you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
      </div>
    );
```

- [ ] **Step 2: Fix hardcoded Windows path in next.config.ts**

Replace the hardcoded absolute path with a dynamic relative path:

```ts
// next.config.ts
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "edamam-product-images.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 3: Fix global-error.tsx missing use client directive**

The `global-error.tsx` already has `"use client"` — verify it works. The file is correct as-is.

- [ ] **Step 4: Verify build passes**

Run: `npm run build`
Expected: Build succeeds with no errors

---

## Task 2: Fix Security Issues — Move API Keys Server-Side

**Covers:** Security, secret management

**Files:**
- Modify: `src/lib/api/edamam.ts`
- Modify: `src/app/api/` (create API routes)
- Create: `src/app/api/recipes/route.ts`
- Create: `src/app/api/recipes/[id]/route.ts`

- [ ] **Step 1: Create server-side API route for recipe search**

```ts
// src/app/api/recipes/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.edamam.com/api/recipes/v2";
const APP_ID = process.env.EDAMAM_API_ID || "";
const API_KEY = process.env.EDAMAM_API_KEY || "";
const TYPE = "public";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const params = new URLSearchParams();
  params.set("app_id", APP_ID);
  params.set("app_key", API_KEY);
  params.set("type", TYPE);

  // Forward all filter params
  for (const [key, value] of searchParams.entries()) {
    params.append(key, value);
  }

  const url = `${API_BASE}?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json(
        { error: `API error: ${response.statusText}` },
        { status: response.status }
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Create server-side API route for recipe by ID**

```ts
// src/app/api/recipes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.edamam.com/api/recipes/v2";
const APP_ID = process.env.EDAMAM_API_ID || "";
const API_KEY = process.env.EDAMAM_API_KEY || "";
const TYPE = "public";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = `${API_BASE}/${id}?app_id=${APP_ID}&app_key=${API_KEY}&type=${TYPE}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json(
        { error: `API error: ${response.statusText}` },
        { status: response.status }
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch recipe" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Update edamam.ts to use internal API routes**

Replace the entire file to use `/api/recipes` instead of direct Edamam calls:

```ts
// src/lib/api/edamam.ts
import type { EdamamResponse, FilterParams } from "./types";

function buildQueryString(params: FilterParams): string {
  const parts: string[] = [];

  if (params.q) parts.push(`q=${encodeURIComponent(params.q)}`);
  if (params.mealType?.length) {
    params.mealType.forEach((t) => parts.push(`mealType=${encodeURIComponent(t)}`));
  }
  if (params.health?.length) {
    params.health.forEach((h) => parts.push(`health=${encodeURIComponent(h)}`));
  }
  if (params.diet?.length) {
    params.diet.forEach((d) => parts.push(`diet=${encodeURIComponent(d)}`));
  }
  if (params.cuisineType?.length) {
    params.cuisineType.forEach((c) => parts.push(`cuisineType=${encodeURIComponent(c)}`));
  }
  if (params.dishType?.length) {
    params.dishType.forEach((d) => parts.push(`dishType=${encodeURIComponent(d)}`));
  }
  if (params.calories) parts.push(`calories=${encodeURIComponent(params.calories)}`);
  if (params.time) parts.push(`time=${encodeURIComponent(params.time)}`);
  if (params.ingr) parts.push(`ingr=${encodeURIComponent(params.ingr)}`);

  return parts.join("&");
}

export async function fetchRecipes(params: FilterParams): Promise<EdamamResponse> {
  const queryString = buildQueryString(params);
  const url = `/api/recipes${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch recipes: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchRecipesByPage(url: string): Promise<EdamamResponse> {
  // The next page URL from Edamam includes full path - extract query string
  const urlObj = new URL(url);
  const queryString = urlObj.searchParams.toString();
  const internalUrl = `/api/recipes?${queryString}`;

  const response = await fetch(internalUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch recipes: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchRecipeById(recipeId: string) {
  const response = await fetch(`/api/recipes/${encodeURIComponent(recipeId)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch recipe: ${response.statusText}`);
  }
  return response.json();
}

export function extractIdFromUri(uri: string): string {
  const lastUnderscoreIndex = uri.lastIndexOf("_");
  if (lastUnderscoreIndex !== -1) {
    return uri.slice(lastUnderscoreIndex + 1);
  }
  return uri;
}
```

- [ ] **Step 4: Delete rate-limiter.ts (no longer needed with server routes)**

Delete: `src/lib/api/rate-limiter.ts`

- [ ] **Step 5: Rename env vars (remove NEXT_PUBLIC prefix)**

Update `.env.local`:
```
EDAMAM_API_ID=your_value_here
EDAMAM_API_KEY=your_value_here
```

Update `next.config.ts` to remove the turbopack hardcoding if not needed, and ensure env vars are loaded.

- [ ] **Step 6: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

---

## Task 3: Remove Dead Code and Fix Duplicates

**Covers:** Code quality, dead code removal

**Files:**
- Delete: `src/lib/store/filterStore.ts`
- Delete: `src/lib/hooks/useDebounce.ts`
- Modify: `src/lib/api/types.ts`
- Modify: `src/components/recipe/RecipeDetail.tsx`

- [ ] **Step 1: Delete unused filterStore.ts**

This store is unused — FilterBar manages its own state via URL search params.

```bash
rm src/lib/store/filterStore.ts
```

- [ ] **Step 2: Delete unused useDebounce.ts**

This hook is not imported anywhere in the codebase.

```bash
rm src/lib/hooks/useDebounce.ts
```

- [ ] **Step 3: Remove duplicate SavedRecipe interface from types.ts**

The `SavedRecipe` interface in `types.ts:87-91` duplicates the one in `recipeStore.ts`. Remove it from types.ts since the store owns this type:

```ts
// src/lib/api/types.ts — remove lines 87-91
// Delete the SavedRecipe interface (it's defined in recipeStore.ts)
```

- [ ] **Step 4: Fix inconsistent imports in RecipeDetail.tsx**

Line 11 uses relative import `Link` from `next/link` while all other imports use `@/` alias. Fix:

```tsx
// src/components/recipe/RecipeDetail.tsx — move Link import to top with others
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, ExternalLink } from "lucide-react";
```

Remove the duplicate `import Link from "next/link";` at line 11.

- [ ] **Step 5: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

---

## Task 4: Accessibility Improvements

**Covers:** Accessibility, WCAG compliance

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/layout/MobileNav.tsx`
- Modify: `src/components/search/SearchBar.tsx`
- Modify: `src/components/filters/FilterRadio.tsx`
- Modify: `src/components/home/Hero.tsx`

- [ ] **Step 1: Add skip-to-content link in root layout**

```tsx
// src/app/layout.tsx — add inside <body>, before <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-primary focus:text-white"
          >
            Skip to content
          </a>
```

Also add `id="main-content"` to the `<main>` tag:
```tsx
<main id="main-content" className="flex-1 pb-20 md:pb-0">
```

- [ ] **Step 2: Add rel="noopener noreferrer" to footer external link**

```tsx
// src/components/layout/Footer.tsx — line 9
          <a
            href="https://github.com/mohammadhossein-asadi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-hover transition-colors"
          >
```

- [ ] **Step 3: Add semantic navigation landmark to MobileNav**

```tsx
// src/components/layout/MobileNav.tsx — line 18
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-background border-t border-border md:hidden" aria-label="Mobile navigation">
```

- [ ] **Step 4: Fix FilterRadio to use accessible radio group**

Replace native radio inputs with proper accessible radio buttons:

```tsx
// src/components/filters/FilterRadio.tsx
"use client";

import { Label } from "@/components/ui/label";

interface FilterRadioOption {
  label: string;
  value: string;
}

interface FilterRadioProps {
  name: string;
  options: FilterRadioOption[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterRadio({ name, options, value, onChange }: FilterRadioProps) {
  return (
    <div role="radiogroup" aria-label={name} className="space-y-2">
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-2 py-1">
          <input
            type="radio"
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 accent-primary cursor-pointer"
          />
          <Label
            htmlFor={`${name}-${option.value}`}
            className="text-sm text-foreground cursor-pointer"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Add aria-label to SearchBar form**

```tsx
// src/components/search/SearchBar.tsx — line 32
    <form onSubmit={handleSubmit} className="relative w-full" role="search" aria-label="Search recipes">
```

- [ ] **Step 6: Add meaningful alt text pattern to Hero**

The Hero is already fine — it doesn't have an image. No changes needed.

- [ ] **Step 7: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

---

## Task 5: SEO Improvements

**Covers:** SEO, metadata, structured data

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/recipe/[id]/page.tsx`
- Modify: `src/app/recipe/[id]/layout.tsx`
- Create: `public/robots.txt`
- Create: `src/app/sitemap.ts`

- [ ] **Step 1: Enhance root layout metadata**

```tsx
// src/app/layout.tsx — update metadata export
export const metadata: Metadata = {
  title: {
    default: "TelmaFood - Recipe Discovery",
    template: "%s | TelmaFood",
  },
  description:
    "Explore, search, and save your favorite recipes from around the world. Filter by cuisine, diet, meal type, and more.",
  keywords: ["recipes", "cooking", "food", "cuisine", "diet", "meal planning"],
  authors: [{ name: "Mohammadhossein Asadi" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "TelmaFood",
    title: "TelmaFood - Recipe Discovery",
    description:
      "Explore, search, and save your favorite recipes from around the world.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TelmaFood - Recipe Discovery",
    description:
      "Explore, search, and save your favorite recipes from around the world.",
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

- [ ] **Step 2: Remove manual <head> tag from layout**

The manual `<head>` with theme script conflicts with Next.js Metadata API. Move the theme script to a separate component:

```tsx
// src/components/ThemeScript.tsx — create new file
export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var theme = sessionStorage.getItem('theme');
            if (theme) {
              document.documentElement.setAttribute('data-theme', theme);
            } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
              document.documentElement.setAttribute('data-theme', 'dark');
            } else {
              document.documentElement.setAttribute('data-theme', 'light');
            }
          })();
        `,
      }}
    />
  );
}
```

Then in layout.tsx, remove the `<head>` block and import `ThemeScript`:
```tsx
import { ThemeScript } from "@/components/ThemeScript";

// In the layout, replace <head>...</head> with:
      <head>
        <ThemeScript />
      </head>
```

Actually, keep the `<head>` tag but use the component — this is fine for the flash-prevention script.

- [ ] **Step 3: Add dynamic metadata for recipe detail pages**

```tsx
// src/app/recipe/[id]/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recipe Details",
  description: "View recipe details, ingredients, and cooking instructions.",
};

export default function RecipeDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

Note: Dynamic OG metadata per recipe would require a client-side approach or generateMetadata with fetch. For now, the static metadata is an improvement. A full dynamic OG implementation can be a follow-up.

- [ ] **Step 4: Create robots.txt**

```txt
// public/robots.txt
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://telmafood.vercel.app/sitemap.xml
```

- [ ] **Step 5: Create sitemap**

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://telmafood.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/recipes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/saved`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
```

- [ ] **Step 6: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

---

## Task 6: Performance Optimizations

**Covers:** Performance, Core Web Vitals

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/home/CuisineSlider.tsx`
- Modify: `src/components/home/MealTabs.tsx`
- Modify: `src/components/recipe/RecipeCard.tsx`

- [ ] **Step 1: Add loading.tsx for route-level streaming**

```tsx
// src/app/recipes/loading.tsx
import { RecipeCardSkeleton } from "@/components/recipe/RecipeCardSkeleton";

export default function RecipesLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <div className="h-12 w-full rounded-lg bg-muted animate-pulse" />
      </div>
      <div className="flex gap-6">
        <div className="hidden lg:block w-[280px] space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-full rounded bg-muted animate-pulse" />
          ))}
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

```tsx
// src/app/saved/loading.tsx
import { RecipeCardSkeleton } from "@/components/recipe/RecipeCardSkeleton";

export default function SavedLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="h-8 w-48 rounded bg-muted animate-pulse mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <RecipeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add not-found.tsx page**

```tsx
// src/app/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 text-center">
      <h1 className="font-heading text-4xl text-foreground mb-4">Page not found</h1>
      <p className="text-base text-foreground/60 mb-8">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/">
        <Button>Go home</Button>
      </Link>
    </div>
  );
}
```

- [ ] **Step 3: Optimize RecipeCard with memo and proper image sizing**

The RecipeCard already uses `sizes` prop correctly. No changes needed — the component is already well-optimized.

- [ ] **Step 4: Add proper font display strategy**

The fonts are already loaded via `next/font/google` which handles optimization. No changes needed.

- [ ] **Step 5: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

---

## Task 7: UI/UX Polish

**Covers:** UI consistency, responsive design, visual polish

**Files:**
- Modify: `src/components/search/SearchBar.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/components/recipe/RecipeDetail.tsx`

- [ ] **Step 1: Convert SearchBar large prop to proper CVA variants**

```tsx
// src/components/search/SearchBar.tsx
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
```

- [ ] **Step 2: Add reduced-motion support in globals.css**

```css
/* src/app/globals.css — add at the end */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Add focus-visible styles for keyboard navigation**

Already handled by shadcn/ui components. No additional changes needed.

- [ ] **Step 4: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

---

## Task 8: Error Handling Improvements

**Covers:** Error handling, resilience

**Files:**
- Modify: `src/app/recipes/page.tsx`
- Modify: `src/lib/hooks/useRecipes.ts`
- Modify: `src/lib/hooks/useRecipe.ts`

- [ ] **Step 1: Add error retry UI to recipes page**

The current error state is minimal. Add a retry button:

```tsx
// src/app/recipes/page.tsx — replace the error state (lines 57-62)
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-base text-foreground/60 mb-4">
                Failed to load recipes. Please try again.
              </p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try again
              </Button>
            </div>
```

Import Button at the top:
```tsx
import { Button } from "@/components/ui/button";
```

- [ ] **Step 2: Add error retry to recipe detail page**

```tsx
// src/app/recipe/[id]/page.tsx
"use client";

import { use } from "react";
import Link from "next/link";
import { useRecipe } from "@/lib/hooks/useRecipe";
import { RecipeDetail } from "@/components/recipe/RecipeDetail";
import { RecipeDetailSkeleton } from "@/components/recipe/RecipeDetailSkeleton";
import { Button } from "@/components/ui/button";

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError } = useRecipe(id);

  if (isLoading) {
    return <RecipeDetailSkeleton />;
  }

  if (isError || !data?.recipe) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="font-heading text-3xl text-foreground mb-4">
          Recipe not found
        </h1>
        <p className="text-base text-foreground/60 mb-6">
          The recipe you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try again
          </Button>
          <Link href="/recipes">
            <Button>Browse recipes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <RecipeDetail recipe={data.recipe} />;
}
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

---

## Task 9: Final Verification

**Covers:** All areas, regression testing

- [ ] **Step 1: Full build verification**

Run: `npm run build`
Expected: Clean build with no errors or warnings

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: No lint errors

- [ ] **Step 3: Review all changes**

Verify:
- All files compile
- No unused imports
- No TypeScript errors
- All components render
- API routes work server-side only
- Environment variables are server-only
- Accessibility attributes present
- SEO metadata complete
- Error states have retry mechanisms
- Dead code removed
