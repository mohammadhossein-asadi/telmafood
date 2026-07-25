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
