<div align="center">

# TelmaFood

**Discover Delicious Recipes from Around the World**

A modern recipe discovery web app powered by the Edamam API, built with Next.js 16 and React 19.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

</div>

---

## Features

- **Smart Recipe Search** — Search thousands of recipes by keywords, ingredients, or dish names
- **Advanced Filtering** — Filter by meal type, cuisine, diet, health labels, dish type, calories, cooking time, and ingredient count
- **Recipe Details** — Full recipe view with ingredients, nutrition info, cook time, servings, and more
- **Save Favorites** — Bookmark recipes and access them anytime from your saved collection
- **Dark / Light Theme** — Automatic system preference detection with manual toggle
- **Responsive Design** — Beautiful experience on desktop, tablet, and mobile
- **Infinite Scroll Pagination** — Seamlessly load more results as you browse
- **Smart Rate Limiting** — Built-in API rate limiting with automatic retry on failures

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI Library | [React 19](https://react.dev) |
| Language | [TypeScript 5](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Components | [shadcn/ui](https://ui.shadcn.com) (Base Nova style) |
| State Management | [Zustand](https://zustand-demo.pmnd.rs) (with persistence) |
| Server State | [TanStack React Query](https://tanstack.com/query) |
| Icons | [Lucide React](https://lucide.dev) |
| Fonts | DM Serif Display + DM Sans (via next/font) |
| API | [Edamam Recipe API](https://developer.edamam.com/edamam-docs-recipe-api) |

## Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **Edamam API** credentials ([sign up here](https://developer.edamam.com/edamam-docs-recipe-api))

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/telmafood.git
cd telmafood

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Add your Edamam API credentials to `.env.local`:

```env
NEXT_PUBLIC_EDAMAM_API_ID=your_app_id
NEXT_PUBLIC_EDAMAM_API_KEY=your_app_key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
npm run build
npm run start
```

## Project Structure

```
telmafood/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Home page
│   │   ├── recipes/            # Recipes listing with filters
│   │   ├── recipe/[id]/        # Recipe detail page
│   │   └── saved/              # Saved recipes collection
│   ├── components/
│   │   ├── home/               # Hero, MealTabs, CuisineSlider
│   │   ├── recipe/             # RecipeCard, RecipeDetail, RecipeGrid
│   │   ├── filters/            # FilterBar, FilterAccordion, FilterCheckbox
│   │   ├── search/             # SearchBar
│   │   ├── layout/             # Header, Footer, MobileNav
│   │   └── ui/                 # shadcn/ui components
│   ├── lib/
│   │   ├── api/                # Edamam API client, types, rate limiter
│   │   ├── hooks/              # useRecipes, useRecipe, useDebounce
│   │   ├── store/              # Zustand stores (recipeStore, filterStore)
│   │   └── utils/              # Constants, helpers
│   └── providers/              # ThemeProvider, QueryProvider
├── public/
│   └── images/                 # Static images and logos
└── package.json
```

## How It Works

1. **Browse** the homepage to discover recipes by meal type or cuisine
2. **Search** for specific dishes or ingredients using the search bar
3. **Filter** results using the comprehensive filter sidebar (meal type, cuisine, diet, health labels, calories, cooking time, and more)
4. **View** full recipe details including ingredients, nutrition breakdown, and source link
5. **Save** your favorite recipes — they persist in localStorage via Zustand

## License

This project is licensed under the MIT License.

---

<div align="center">

Built with passion for food lovers everywhere.

</div>
