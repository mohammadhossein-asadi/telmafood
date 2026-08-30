import { SponsoredLabel } from "./SponsoredLabel";
import { AdMedia } from "./AdMedia";
import { AdCTA } from "./AdCTA";
import type { SponsoredMeta } from "@/lib/ads/types";

export function PremiumPromoBlock({ ad, placement }: { ad: SponsoredMeta; placement: string }) {
  const isInk = ad.tone === "ink";
  return (
    <section
      aria-label={`Sponsored editorial from ${ad.partner}`}
      className="relative overflow-hidden border-y border-border bg-card"
    >
      <div className="mx-auto max-w-[1280px] px-4">
        <div
          className={
            isInk
              ? "grid md:grid-cols-[1.1fr_0.9fr] gap-0 rounded-[20px] overflow-hidden my-8 md:my-10 bg-foreground text-background"
              : "grid md:grid-cols-2 gap-0 rounded-[20px] overflow-hidden my-8 md:my-10 bg-paper border border-border shadow-sm"
          }
        >
          {/* Media */}
          <div className="relative">
            <AdMedia
              src={ad.image}
              alt={ad.imageAlt}
              sizes="(max-width:768px)100vw,50vw"
              aspect={isInk ? "aspect-[4/3] md:aspect-[4/3]" : "aspect-[16/10] md:aspect-[4/3]"}
              rounded="rounded-none"
              className="h-full min-h-[280px]"
            />
            {/* subtle editorial corner label on image */}
            <div className="absolute left-3 top-3 rounded-full bg-card/90 backdrop-blur px-3 py-1.5 border border-border shadow-sm">
              <SponsoredLabel partner={ad.partner} compact className="text-foreground" />
            </div>
          </div>

          {/* Copy */}
          <div className="flex flex-col justify-center gap-5 p-6 md:p-8 lg:p-10">
            <div className="space-y-3">
              <p
                className={
                  isInk
                    ? "text-[11px] tracking-[0.16em] uppercase text-white/60"
                    : "text-[11px] tracking-[0.16em] uppercase text-muted-foreground"
                }
              >
                From the Test Kitchen — Partner Story
              </p>
              <h2
                className={
                  isInk
                    ? "font-heading text-[28px] md:text-[34px] leading-[0.95] tracking-[-0.03em] text-white"
                    : "font-heading text-[28px] md:text-[34px] leading-[0.95] tracking-[-0.03em] text-foreground"
                }
              >
                {ad.title}
              </h2>
              <p className={isInk ? "text-[15px] leading-relaxed text-white/75 max-w-prose" : "text-[15px] leading-relaxed text-muted-foreground max-w-prose"}>
                {ad.description}
              </p>
              {ad.contextLine && (
                <p className={isInk ? "text-xs tracking-wide text-white/60" : "text-xs tracking-wide text-ink-muted"}>{ad.contextLine}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <AdCTA href={ad.href} variant={isInk ? "primary" : "primary"} placement={placement}>
                {ad.cta}
              </AdCTA>
              <span
                className={
                  isInk ? "inline-flex items-center text-xs tracking-wide text-white/55" : "inline-flex items-center text-xs tracking-wide text-muted-foreground"
                }
              >
                No extra cost · Supports free recipes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative hairline rule */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sponsored/20 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sponsored/20 to-transparent" aria-hidden />
    </section>
  );
}
