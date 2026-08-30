import { cn } from "@/lib/utils";

interface SponsoredLabelProps {
  partner: string;
  compact?: boolean;
  className?: string;
}

export function SponsoredLabel({ partner, compact, className }: SponsoredLabelProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-[10px] font-medium tracking-[0.14em] uppercase leading-none",
        "text-ink-muted",
        className
      )}
      aria-label={`Sponsored content from ${partner}`}
    >
      <span className="inline-flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-sponsored shrink-0" aria-hidden />
        Sponsored
      </span>
      <span aria-hidden className="text-border font-normal">
        ·
      </span>
      <span className="truncate max-w-[14ch]">{partner}</span>
      {!compact && (
        <span className="hidden sm:inline-flex items-center rounded-full bg-sponsored-bg border border-sponsored-border px-2 py-0.5 text-[10px] tracking-wide normal-case font-medium text-sponsored">
          Partner
        </span>
      )}
    </div>
  );
}
