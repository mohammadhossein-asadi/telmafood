<div align="center">

# TelmaFood

### Recipe Discovery Platform — Search, Filter, Save & Cook

A modern recipe discovery app built with Next.js 16, featuring advanced multi-criteria filtering, infinite pagination, saved recipes, and a polished mobile-first UI — powered by the Edamam Recipe API.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Coming_Soon-0a0a0a?style=for-the-badge&labelColor=0a0a0a&color=3b82f6)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-0a0a0a?style=for-the-badge&labelColor=0a0a0a&color=22c55e)](#)

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
| **Rate Limiting** | Client-side rate limiter (3 req/s, retry on 429) |
| **URL-as-State** | Filter state synced with URL params for shareable links |
| **Skeleton Loading** | Card and detail page loading skeletons |

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
| **API** | Edamam Recipe Search API v2 |
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
│   │   ├── recipes/page.tsx     # Search + filter + infinite grid
│   │   ├── recipe/[id]/page.tsx # Recipe detail
│   │   ├── saved/page.tsx       # Saved recipes
│   │   └── layout.tsx           # Root layout
│   ├── components/
│   │   ├── filters/             # FilterBar, FilterAccordion, checkboxes, radios
│   │   ├── home/                # Hero, MealTabs, CuisineSlider
│   │   ├── layout/              # Header, Footer, MobileNav
│   │   ├── recipe/              # RecipeCard, RecipeDetail, skeletons, SaveButton
│   │   ├── search/              # SearchBar
│   │   └── ui/                  # 14 shadcn/ui components
│   ├── lib/
│   │   ├── api/
│   │   │   ├── edamam.ts        # API client
│   │   │   ├── rate-limiter.ts  # Rate limiter (3 req/s)
│   │   │   └── types.ts         # TypeScript interfaces
│   │   ├── hooks/               # useRecipes, useRecipe, useDebounce
│   │   ├── store/               # recipeStore, filterStore
│   │   └── utils/               # constants (filter options)
│   └── providers/               # QueryProvider, ThemeProvider
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

Create a `.env.local` file:

```env
NEXT_PUBLIC_EDAMAM_API_ID="your-api-id"
NEXT_PUBLIC_EDAMAM_API_KEY="your-api-key"
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

---

## Author

**Mohammadhossein Asadi** — Frontend & Full-Stack Engineer

[![GitHub](https://img.shields.io/badge/GitHub-mohammadhossein--asadi-0a0a0a?style=flat-square&logo=github)](https://github.com/mohammadhossein-asadi)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-mohammadhossein--asadi-0a66c2?style=flat-square&logo=linkedin)](https://linkedin.com/in/mohammadhossein-asadi)

---

## License

This project is licensed under the [MIT License](LICENSE).
