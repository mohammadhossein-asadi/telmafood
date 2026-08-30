import { cn } from "@/lib/utils";

export function AdCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card overflow-hidden", className)} aria-hidden>
      <div className="ad-skeleton-shimmer aspect-[4/3] w-full" />
      <div className="p-4 space-y-3">
        <div className="ad-skeleton-shimmer h-3 w-28 rounded-full" />
        <div className="ad-skeleton-shimmer h-4 w-3/4 rounded-lg" />
        <div className="ad-skeleton-shimmer h-3 w-full rounded-lg" />
        <div className="ad-skeleton-shimmer h-9 w-32 rounded-full mt-2" />
      </div>
    </div>
  );
}

export function AdEditorialSkeleton() {
  return (
    <div className="rounded-[20px] border border-border bg-card overflow-hidden grid md:grid-cols-2" aria-hidden>
      <div className="ad-skeleton-shimmer aspect-[4/3] md:aspect-[3/2]" />
      <div className="p-6 md:p-8 space-y-4 flex flex-col justify-center">
        <div className="ad-skeleton-shimmer h-3 w-24 rounded-full" />
        <div className="ad-skeleton-shimmer h-7 w-3/4 rounded-lg" />
        <div className="ad-skeleton-shimmer h-3 w-full rounded-lg" />
        <div className="ad-skeleton-shimmer h-3 w-5/6 rounded-lg" />
        <div className="ad-skeleton-shimmer h-9 w-36 rounded-full mt-2" />
      </div>
    </div>
  );
}
