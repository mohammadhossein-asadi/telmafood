import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function RecipeDetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Banner skeleton */}
      <Skeleton className="aspect-[21/9] md:aspect-[3/1] rounded-xl mb-8" />

      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-1/4" />
        </div>
        <Skeleton className="h-12 w-32" />
      </div>

      {/* Stats skeleton */}
      <div className="flex gap-6 mb-8 p-4">
        <Skeleton className="h-16 w-24" />
        <Skeleton className="h-16 w-24" />
        <Skeleton className="h-16 w-24" />
      </div>

      {/* Tags skeleton */}
      <div className="flex gap-2 mb-8">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
      </div>

      <Separator className="my-8" />

      {/* Ingredients skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-40 mb-4" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>
    </div>
  );
}
