import Link from "next/link";
import { SponsoredLabel } from "./SponsoredLabel";
import { AdMedia } from "./AdMedia";
import { AdCTA } from "./AdCTA";
import type { SponsoredMeta } from "@/lib/ads/types";
import { cn } from "@/lib/utils";

export function SponsoredCard({ ad, placement }: { ad: SponsoredMeta; placement: string }) {
  return (
    <article
      className={cn(
        "group/ad sponsored-accent flex flex-col overflow-hidden bg-paper border border-sponsored-border",
        "rounded-[16px] ad-card text-card-foreground"
      )}
      aria-label={`Sponsored card from ${ad.partner}`}
    >
      <Link href={ad.href} className="block">
        <AdMedia
          src={ad.image}
          alt={ad.imageAlt}
          sizes="(max-width:640px)100vw,(max-width:1024px)50vw,33vw"
          aspect="aspect-[4/3]"
          rounded="rounded-none"
          className="rounded-t-[15px]"
        />
      </Link>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <SponsoredLabel partner={ad.partner} />

        {ad.badge && (
          <span className="self-start inline-flex rounded-full bg-foreground text-background px-2.5 py-1 text-[11px] font-medium tracking-wide">
            {ad.badge}
          </span>
        )}

        <div className="space-y-1.5">
          <h3 className="font-heading text-[18px] leading-tight tracking-[-0.015em] text-foreground line-clamp-2">
            <Link href={ad.href} className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline">
              {ad.title}
            </Link>
          </h3>
          <p className="text-[13px] leading-relaxed text-muted-foreground line-clamp-2">{ad.description}</p>
          {ad.contextLine && (
            <p className="text-[11px] tracking-wide text-ink-muted flex items-center gap-1.5">
              <span className="h-px w-4 bg-border shrink-0" aria-hidden />
              {ad.contextLine}
            </p>
          )}
        </div>

        <div className="pt-1 mt-auto">
          <AdCTA href={ad.href} variant="primary" placement={placement}>
            {ad.cta}
          </AdCTA>
        </div>
      </div>
    </article>
  );
}
