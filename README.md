<div align="center">

# TelmaFood

### Recipe Discovery Platform — Search, Filter, Save & Cook

A modern recipe discovery app built with Next.js 16, featuring advanced multi-criteria filtering, infinite pagination, saved recipes, and a polished mobile-first UI — powered by the Edamam Recipe API.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Coming_Soon-0a0a0a?style=for-the-badge&labelColor=0a0a0a&color=3b82f6)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-0a0a0a?style=for-the-badge&labelColor=0a0a0a&color=22c55e)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## Overview

TelmaFood is a recipe discovery platform that connects to the Edamam Recipe Search API to provide access to thousands of recipes. Users can search by keyword, filter by meal type, diet, health labels, cuisine, dish type, cooking time, ingredient count, and calorie range — then save their favorites for later.

---

## Features

| Feature | Description |
|:--------|:------------|
| **Keyword Search** | Free-text recipe search via Edamam API |
| **8 Filter Categories** | Meal type, diet, health labels (34), cuisine (19), dish type (16), cooking time, ingredients, calories |
| **Infinite Pagination** | "Load more" pattern with React Query infinite queries |
| **Recipe Detail Pages** | Full recipe view with ingredients, nutrition, source link |
| **Save/Bookmark** | Persistent local storage via Zustand with toast notifications |
| **Saved Recipes Page** | View all bookmarked recipes |
| **Home Page** | Hero search, meal type tabs, cuisine slider carousels |
| **Dark/Light Theme** | System-aware with next-themes |
| **Mobile Navigation** | Bottom tab bar for mobile users |
| **AI Assistant** | Streaming recipe chat: ask about a recipe, generate meal plans and shopping lists, get ingredient substitutions (multi-provider router with failover) |
| **Sponsored Placements** | Ad-monetization layer — SponsoredCard, ContextualBanner, HeroPromo, PremiumPromoBlock with impression tracking and disclosure labels |
| **Recipe Data Backup** | Secondary TheMealDB client keeps recipe lookup working when Edamam quota is exhausted, with request rate limiting (3 req/s) |
| **URL-as-State** | Filter state synced with URL params for shareable links |
| **Skeleton Loading** | Card, route (streaming SSR), and detail page loading skeletons |
| **PWA** | Installable app with service worker, offline shell, and manifest |
| **SEO & A11y** | Open Graph/Twitter metadata, robots.txt, sitemap, skip-to-content link, radiogroup/search semantics |

---

## Tech Stack

| Layer | Technologies |
|:------|:-------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **React** | React 19 |
| **Styling** | Tailwind CSS 4, shadcn/ui |
| **Data Fetching** | TanStack React Query 5.101 |
| **State** | Zustand 5 (persisted saved recipes) |
| **Theme** | next-themes 0.4 |
| **API** | Edamam Recipe Search API v2 (server-side) + TheMealDB backup |
| **AI** | Multi-provider streaming router (OpenRouter, Groq, Hugging Face, Ollama) |
| **Validation** | Zod |
| **Testing** | Vitest, Testing Library, Playwright E2E |
| **Icons** | Lucide React |
| **Toast** | Sonner 2 |
| **Font** | DM Sans, DM Serif Display (Google Fonts) |

---

## Project Structure

```
telmafood/
├── src/
│   ├── app/
│   │   ├── page.tsx             # Home (hero + meal tabs + cuisine sliders)
│   │   ├── recipes/             # Search + filter + infinite grid (+ loading.tsx)
│   │   ├── recipe/[id]/page.tsx # Recipe detail
│   │   ├── saved/               # Saved recipes (+ loading.tsx)
│   │   ├── not-found.tsx        # 404 page
│   │   ├── sitemap.ts           # Dynamic sitemap
│   │   ├── global-error.tsx     # Global error boundary
│   │   └── api/
│   │       ├── recipes/         # Server-side Edamam proxy (+ [id] route)
│   │       └── ai/              # Streaming AI endpoints (chat, meal plan,
│   │                            #   recipe Q&A, shopping list, substitutions)
│   ├── components/
│   │   ├── ai/                  # ChatWidget, ChatInterface, useAIFeatures
│   │   ├── ad/                  # AdContainer, SponsoredCard, ContextualBanner,
│   │   │                        #   HeroPromo, PremiumPromoBlock, useAdImpression
│   │   ├── filters/             # FilterBar, FilterAccordion, checkboxes, radios
│   │   ├── home/                # Hero, MealTabs, CuisineSlider
│   │   ├── layout/              # Header, Footer, MobileNav
│   │   ├── recipe/              # RecipeCard/Grid/Detail, skeletons, SaveButton
│   │   ├── search/              # SearchBar
│   │   ├── ui/                  # shadcn/ui primitives (base-nova)
│   │   ├── ErrorBoundary.tsx    # App-level error boundary
│   │   └── ServiceWorkerRegistration.tsx
│   ├── lib/
│   │   ├── ai/                  # Provider router (groq, openrouter, hf, ollama)
│   │   ├── ads/                 # Mock ads, types, utils
│   │   ├── api/
│   │   │   ├── edamam.ts        # API client (calls internal /api/recipes)
│   │   │   ├── backup.ts        # TheMealDB fallback with rate limiting
│   │   │   ├── rate-limiter.ts  # Request pacing used by the backup client
│   │   │   ├── schemas.ts       # Zod validation
│   │   │   └── types.ts         # TypeScript interfaces
│   │   ├── hooks/               # useRecipes, useRecipe
│   │   ├── store/               # recipeStore (persisted saved recipes)
│   │   └── utils/               # constants (filter options)
│   ├── providers/               # QueryProvider, ThemeProvider
│   └── test/                    # Vitest setup
├── public/                      # manifest.json, sw.js, robots.txt, images
├── components.json
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Filtering System

| Filter | Options |
|:-------|:--------|
| **Meal Type** | Breakfast, Lunch, Dinner, Snack, Teatime |
| **Diet** | Balanced, High-Fiber, High-Protein, Low-Carb, Low-Fat, Low-Sodium |
| **Health Labels** | 34 options (Vegan, Vegetarian, Gluten-Free, Keto-Friendly, etc.) |
| **Cuisine** | 19 cuisines (American, Asian, French, Indian, Italian, Japanese, etc.) |
| **Dish Type** | 16 types (Soup, Salad, Main course, Desserts, etc.) |
| **Cooking Time** | 6 ranges (under 5 min to over 1 hour) |
| **Ingredient Count** | 4 ranges |
| **Calorie Range** | 5 ranges (under 200 to over 800) |

---

## Quick Start

### Prerequisites

- **Node.js** >= 18.0.0

### Installation

```bash
git clone https://github.com/mohammadhossein-asadi/telmafood.git
cd telmafood
npm install
```

### Environment Configuration

Create a `.env.local` file (copy from `.env.example`):

```env
# Edamam Recipe API (Primary)
EDAMAM_API_ID="your-edamam-app-id"
EDAMAM_API_KEY="your-edamam-app-key"

# AI Providers (for chat feature - optional)
OPENROUTER_API_KEY="your-openrouter-key"
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:3000`.

### Production Build

```bash
npm run build
npm run start
```

---

## Scripts

| Command | Description |
|:--------|:------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test:run` | Vitest unit tests |
| `npm run test:e2e` | Playwright E2E tests |

---

## Key Architecture Decisions

### URL-as-State for Shareable Links
All filter state is synchronized with URL query parameters, enabling deep linking and shareable recipe searches without server-side state.

### Infinite Query Pattern
React Query's `useInfiniteQuery` powers the "Load more" pagination, with automatic caching and background refetching for smooth UX.

### Server-Side API Proxy
Edamam API keys stay server-side: the client `edamam.ts` calls internal `/api/recipes` route handlers that forward requests to Edamam, so secrets never reach the browser bundle. The rate limiter only paces the secondary TheMealDB backup client.

### Persistent Local Storage
Zustand with `persist` middleware saves bookmarked recipes to localStorage, surviving browser restarts without a backend.

### Multi-Provider AI Router
AI features stream through a pluggable provider router (OpenRouter, Groq, Hugging Face, Ollama) with failover, so the assistant degrades gracefully when a provider is unavailable.

### Mobile-First Responsive Design
Bottom tab navigation on mobile, sidebar on desktop — single codebase with Tailwind's responsive utilities.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Mohammadhossein Asadi** — Frontend & Full-Stack Engineer

[![GitHub](https://img.shields.io/badge/GitHub-mohammadhossein--asadi-0a0a0a?style=flat-square&logo=github)](https://github.com/mohammadhossein-asadi)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-mohammadhossein--asadi-0a66c2?style=flat-square&logo=linkedin)](https://linkedin.com/in/mohammadhossein-asadi)

</div>