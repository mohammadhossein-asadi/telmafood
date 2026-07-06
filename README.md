# TelmaFood

TelmaFood is a modern recipe discovery app built with Next.js, React, Tailwind CSS, Zustand, and the Edamam Recipe Search API. It delivers a smooth browsing experience for users who want to search, filter, and save recipes while exploring meal types and cuisines.

## 🚀 Features

- Keyword search for recipe discovery
- Advanced filters: meal type, diet, health, cuisine type, dish type, calories, cook time, and ingredient count
- Home page with featured meal tabs and cuisine slider carousels
- Recipe detail pages with ingredient lists, servings, cook time, calories, and source links
- Save favorite recipes persistently in browser storage via Zustand
- Infinite pagination / load more support
- Responsive design for mobile and desktop
- Error and empty state handling

## 📦 What’s Included

- `Home` route to browse curated meal types and cuisines
- `Recipes` route to search and filter recipe results
- `Recipe Detail` route to inspect a single recipe and save favorites
- `Saved` route to see saved recipes in one place
- Custom search UI, filters panel, and recipe grid components
- API abstraction for Edamam recipe search and pagination
- Persistent local state for saved recipes

## 🧱 Project Structure

- `src/app/`
  - `page.tsx` — home page
  - `recipes/page.tsx` — recipe search and filter page
  - `recipe/[id]/page.tsx` — recipe detail page
  - `saved/page.tsx` — saved recipes page
  - `layout.tsx` — global app layout and providers
- `src/components/` — page sections and reusable components
- `src/lib/api/` — Edamam client, query builder, rate limiter, types, and helpers
- `src/lib/hooks/` — custom React hooks for fetching recipes and recipe details
- `src/lib/store/` — Zustand store for saved recipes
- `src/components/ui/` — shared UI primitives and shadcn components
- `src/lib/utils/` — constants and helper utilities

## 🔧 Local Setup

### Prerequisites

- Node.js 20 or later
- npm, pnpm, or yarn

### Install dependencies

```bash
npm install
```

Or with pnpm:

```bash
pnpm install
```

### Configure environment variables

Create a `.env.local` file at the root of the project and add:

```env
NEXT_PUBLIC_EDAMAM_API_ID=your_edamam_app_id
NEXT_PUBLIC_EDAMAM_API_KEY=your_edamam_api_key
```

> The client uses public environment variables to call the Edamam Recipe Search API from the browser.

### Run development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## ⚙️ Available Scripts

- `npm run dev` — Start the Next.js development server
- `npm run build` — Build the app for production
- `npm run start` — Start the production server after build
- `npm run lint` — Run ESLint

## 🌐 Routing Overview

- `/` — Home page
- `/recipes` — Recipe search and filters
- `/recipe/[id]` — Single recipe detail view
- `/saved` — User saved recipes

## 📌 App Behavior

### Search and filters

The `Recipes` page reads URL query params and builds requests for the Edamam API. Filters include:

- `q` — search keywords
- `mealType`, `diet`, `health`, `cuisineType`, `dishType`
- `calories`, `time`, `ingr`

### Pagination

The app uses React Query’s infinite query pattern to load extra pages from Edamam when the user clicks `Load more recipes`.

### Saved recipes

Saved recipes are stored locally using Zustand persistence keyed to `telmafood-saved-recipes`. This means favorites persist across browser sessions.

## 🧠 Implementation Notes

- `src/lib/api/edamam.ts` handles request building, error wrapping, and pagination URLs
- `src/lib/hooks/useRecipes.ts` encapsulates infinite query logic
- `src/lib/store/recipeStore.ts` defines save/remove state for favorites
- `src/components/recipe/RecipeDetail.tsx` renders recipe details and original source link
- `src/components/filters/FilterBar.tsx` and `SearchBar.tsx` provide the search/filter UI

## 🚀 Deployment

### Vercel

1. Push the repo to GitHub
2. Create a new Vercel project
3. Add environment variables in Vercel dashboard
4. Deploy

### Production build locally

```bash
npm run build
npm run start
```

## 🧰 Notes for Developers

- The app is built using the Next.js App Router
- UI components use Tailwind CSS and shadcn primitives
- React Query handles remote data fetching and caching
- Zustand persistence stores local favorites without a backend
- The app currently depends on Edamam API rate limits and API credentials

## 🐞 Troubleshooting

- If recipe results fail to load, verify `.env.local` is set and contains valid Edamam credentials
- If the page is blank, run `npm run lint` or inspect browser console for missing imports
- If saved recipes disappear, ensure browser local storage is enabled

## 💡 Suggestions for Improvement

- Add user authentication and backend storage for saved recipes
- Add server-side API routes to hide Edamam keys and support private keys
- Add recipe categories, meal planners, or shopping list export
- Add unit/integration tests for search and save flows

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/my-change`
3. Install dependencies: `npm install`
4. Make your changes
5. Submit a pull request

## 📄 License

This repository does not include a license file. Add `LICENSE` to define reuse and distribution terms.
