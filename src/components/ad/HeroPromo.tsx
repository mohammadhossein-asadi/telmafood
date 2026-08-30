import Link from "next/link";
import { SponsoredLabel } from "./SponsoredLabel";
import { AdMedia } from "./AdMedia";
import { AdCTA } from "./AdCTA";
import type { SponsoredMeta } from "@/lib/ads/types";

export function HeroPromo({ ad, placement }: { ad: SponsoredMeta; placement: string }) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-border bg-card shadow-sm group/ad">
      <Link href={ad.href} className="block">
        <AdMedia
          src={ad.image}
          alt={ad.imageAlt}
          sizes="(max-width:768px)100vw,420px"
          aspect="aspect-[16/10]"
          rounded="rounded-none"
          className="rounded-t-[19px]"
        />
      </Link>
      <div className="p-5 space-y-3">
        <SponsoredLabel partner={ad.partner} />
        <h3 className="font-heading text-xl leading-tight tracking-[-0.02em] text-foreground">
          <Link href={ad.href} className="hover:text-primary transition-colors">
            {ad.title}
          </Link>
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">{ad.description}</p>
        <AdCTA href={ad.href} variant="primary" placement={placement} className="w-full justify-center sm:w-auto">
          {ad.cta}
        </AdCTA>
        <p className="text-[11px] tracking-wide text-muted-foreground">Supports our free recipe collection</p>
      </div>
    </div>
  );
}
