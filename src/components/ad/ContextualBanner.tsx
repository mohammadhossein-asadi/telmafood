import { SponsoredLabel } from "./SponsoredLabel";
import { AdMedia } from "./AdMedia";
import { AdCTA } from "./AdCTA";
import type { SponsoredMeta } from "@/lib/ads/types";

export function ContextualBanner({ ad, placement }: { ad: SponsoredMeta; placement: string }) {
  return (
    <aside
      aria-label={`Sponsored recommendation from ${ad.partner}`}
      className="overflow-hidden rounded-2xl border border-sponsored-border bg-sponsored-bg"
    >
      <div className="p-4 pb-3">
        <SponsoredLabel partner={ad.partner} />
      </div>

      <div className="px-4">
        <AdMedia
          src={ad.image}
          alt={ad.imageAlt}
          sizes="(max-width:1024px)100vw,340px"
          aspect="aspect-[16/10]"
          rounded="rounded-xl"
        />
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-heading text-lg leading-tight tracking-[-0.02em] text-foreground">{ad.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">{ad.description}</p>
        {ad.contextLine && <p className="text-xs tracking-wide text-ink-muted">{ad.contextLine}</p>}
        <AdCTA href={ad.href} variant="primary" placement={placement} className="w-full justify-center">
          {ad.cta}
        </AdCTA>
        <p className="text-center text-[11px] tracking-wide text-muted-foreground">Sponsored · Why this?</p>
      </div>
    </aside>
  );
}

export function ContextualInline({ ad, placement }: { ad: SponsoredMeta; placement: string }) {
  return (
    <aside
      aria-label={`Sponsored from ${ad.partner}`}
      className="flex gap-4 rounded-2xl border border-sponsored-border bg-sponsored-bg p-3 pr-4 items-center"
    >
      <AdMedia
        src={ad.image}
        alt={ad.imageAlt}
        sizes="96px"
        aspect="aspect-square"
        rounded="rounded-xl"
        className="w-24 h-24 shrink-0"
      />
      <div className="min-w-0 flex-1 space-y-1.5">
        <SponsoredLabel partner={ad.partner} compact className="text-[9px]" />
        <h3 className="font-heading text-[15px] leading-tight tracking-[-0.015em] text-foreground line-clamp-1">{ad.title}</h3>
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2 hidden sm:block">{ad.description}</p>
        <AdCTA href={ad.href} variant="ghost" placement={placement} className="h-8 min-h-8 px-3 text-xs">
          {ad.cta}
        </AdCTA>
      </div>
    </aside>
  );
}
