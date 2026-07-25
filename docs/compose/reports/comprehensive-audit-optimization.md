---
feature: Comprehensive Audit & Optimization
status: delivered
specs: []
plans:
  - ../plans/2026-07-20-comprehensive-audit-optimization.md
branch: main
commits: none
---

# TelmaFood Comprehensive Audit & Optimization — Final Report

## What Was Built

A complete end-to-end audit and optimization of the TelmaFood recipe discovery application. The work addressed critical bugs, security vulnerabilities, accessibility gaps, SEO deficiencies, dead code, and UI/UX polish across the entire codebase. API keys were moved server-side to prevent client-side exposure, undefined CSS classes were fixed, dead code was removed, and accessibility attributes were added throughout. The application now builds cleanly, passes lint with zero errors, and follows modern Next.js 16 best practices.

## Architecture

The application is a Next.js 16 App Router project using shadcn/ui (base-nova style with base-ui primitives), Tailwind CSS v4, Zustand for client-side state (saved recipes), React Query for server state (Edamam API), and next-themes for dark mode.

### Key Changes

**Security:** API keys moved from `NEXT_PUBLIC_` client-exposed env vars to server-only `EDAMAM_API_ID`/`EDAMAM_API_KEY`. New Next.js API routes (`/api/recipes` and `/api/recipes/[id]`) proxy Edamam API calls, keeping secrets server-side. The client-side `edamam.ts` now calls internal API routes instead of Edamam directly. The global rate-limiter module was removed.

**Bug Fixes:** Fixed undefined CSS classes (`container`, `headline-small`, `body-large`) in the recipe detail error state. Fixed hardcoded Windows path in `next.config.ts` turbopack config. Fixed SearchBar `large` prop migration to `size="large"`.

**Dead Code Removal:** Deleted `filterStore.ts` (unused — FilterBar uses URL search params), `useDebounce.ts` (unused), and duplicate `SavedRecipe` interface from `types.ts`.

**Accessibility:** Added skip-to-content link, `id="main-content"` on `<main>`, `aria-label` on MobileNav and SearchBar form, `role="radiogroup"` on FilterRadio, and `role="search"` on search forms.

**SEO:** Enhanced root metadata with Open Graph, Twitter cards, keywords, and structured description. Added `robots.txt` and `sitemap.ts`. Added `not-found.tsx` page.

**Performance:** Added `loading.tsx` for `/recipes` and `/saved` routes (streaming SSR). Added `not-found.tsx` for 404 handling.

**UI/UX:** Refactored SearchBar to use CVA variants instead of template string class manipulation. Added `prefers-reduced-motion` media query. Fixed lint errors (setState-in-effect, unused imports).

### Files Modified
- `src/app/layout.tsx` — metadata, skip link, main id
- `src/app/page.tsx` — no changes needed
- `src/app/recipes/page.tsx` — error retry button, Button import
- `src/app/recipes/loading.tsx` — new streaming loading state
- `src/app/saved/loading.tsx` — new streaming loading state
- `src/app/not-found.tsx` — new 404 page
- `src/app/sitemap.ts` — new sitemap
- `src/app/recipe/[id]/page.tsx` — fixed CSS classes, added retry + navigation
- `src/app/global-error.tsx` — no changes (error param required by Next.js)
- `src/app/globals.css` — reduced-motion support
- `src/components/layout/Header.tsx` — fixed lint (setState-in-effect, unused var)
- `src/components/layout/MobileNav.tsx` — aria-label
- `src/components/layout/Footer.tsx` — already had rel="noopener noreferrer"
- `src/components/search/SearchBar.tsx` — CVA variants, role="search"
- `src/components/filters/FilterBar.tsx` — fixed lint (setState-in-effect)
- `src/components/filters/FilterAccordion.tsx` — removed unused Accordion import
- `src/components/filters/FilterRadio.tsx` — role="radiogroup", accent-primary styling
- `src/components/home/Hero.tsx` — size="large" prop
- `src/components/recipe/RecipeDetail.tsx` — fixed import order
- `src/lib/api/edamam.ts` — rewrote to use internal API routes
- `src/lib/api/types.ts` — removed duplicate SavedRecipe interface
- `src/lib/store/filterStore.ts` — deleted (unused)
- `src/lib/hooks/useDebounce.ts` — deleted (unused)
- `src/app/api/recipes/route.ts` — new server-side API proxy
- `src/app/api/recipes/[id]/route.ts` — new server-side API proxy
- `public/robots.txt` — new
- `next.config.ts` — dynamic turbopack root path
- `.env.local` — removed NEXT_PUBLIC_ prefix from API keys

### Files Created
- `src/app/api/recipes/route.ts`
- `src/app/api/recipes/[id]/route.ts`
- `src/app/recipes/loading.tsx`
- `src/app/saved/loading.tsx`
- `src/app/not-found.tsx`
- `src/app/sitemap.ts`
- `public/robots.txt`

### Files Deleted
- `src/lib/api/rate-limiter.ts`
- `src/lib/store/filterStore.ts`
- `src/lib/hooks/useDebounce.ts`

## Design Decisions

- **API proxy pattern:** Rather than using Next.js Route Handlers with middleware, we created explicit API routes that forward all query params to Edamam. This keeps the client code simple and the secrets fully server-side.
- **Removed rate-limiter:** The global module-level rate limiter state is not safe in serverless environments. Edamam's own rate limiting handles this. The React Query retry config provides client-side resilience.
- **CVA for SearchBar:** Replaced inline template string class manipulation with `class-variance-authority` variants, following the established shadcn/ui pattern used by Button and Badge.
- **Derived filters via useMemo:** Replaced the anti-pattern of `setState` inside `useEffect` with `useMemo` to derive URL-synced state, keeping local editing state separate.

## Verification

- `npm run build` — passes cleanly with zero TypeScript errors
- `npm run lint` — passes with zero errors (1 acceptable warning: `error` param in `global-error.tsx` required by Next.js API)
- All routes compile and render: `/`, `/recipes`, `/saved`, `/recipe/[id]`, `/api/recipes`, `/api/recipes/[id]`, `/sitemap.xml`, `/_not-found`

## Journey Log

- [lesson] The `NEXT_PUBLIC_` prefix exposes env vars to the client bundle. For API keys that should stay server-side, use unprefixed env vars and create API route proxies.
- [lesson] shadcn/ui base-nova style uses `@base-ui/react` primitives, not Radix. The accordion keyframes reference `--radix-accordion-content-height` which works because base-ui uses the same CSS variable naming.
- [lesson] Next.js `global-error.tsx` requires `error` and `reset` params even if unused — the lint warning is a false positive from the framework API contract.
- [lesson] `useState` inside `useEffect` to sync with props/URL is an anti-pattern in React 19. Use `useMemo` for derived state instead.
