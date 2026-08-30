"use client";

import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdImpression } from "./useAdImpression";
import { dismissAd, isAdDismissed, emitAdEvent } from "@/lib/ads/utils";
import type { SponsoredMeta } from "@/lib/ads/types";

interface AdContainerProps {
  ad: SponsoredMeta;
  placement: string;
  children: React.ReactNode;
  className?: string;
  minHeight?: string; // reserve CLS
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function AdContainer({ ad, placement, children, className, minHeight, dismissible = true, onDismiss }: AdContainerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAdDismissed(ad.id)) setDismissed(true);
  }, [ad.id]);

  const impressionRef = useAdImpression({
    adId: ad.id,
    variant: ad.variant,
    partner: ad.partner,
    placement,
    disabled: dismissed || !mounted,
  }) as React.RefObject<HTMLDivElement>;

  const handleDismiss = useCallback(() => {
    dismissAd(ad.id);
    setDismissed(true);
    emitAdEvent("ad_dismiss", { adId: ad.id, variant: ad.variant, partner: ad.partner, placement });
    onDismiss?.();
  }, [ad.id, ad.partner, ad.variant, placement, onDismiss]);

  const handleClick = useCallback(() => {
    emitAdEvent("ad_click", { adId: ad.id, variant: ad.variant, partner: ad.partner, placement });
  }, [ad.id, ad.partner, ad.variant, placement]);

  if (dismissed) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-dashed border-border bg-stone/50 flex items-center justify-center px-4 py-6 text-center",
          className
        )}
        style={minHeight ? { minHeight } : undefined}
        aria-live="polite"
      >
        <p className="text-xs tracking-wide text-muted-foreground">Ad hidden — you can refresh to restore.</p>
      </div>
    );
  }

  return (
    <div
      ref={impressionRef}
      data-ad-id={ad.id}
      data-placement={placement}
      onClick={handleClick}
      className={cn("relative ad-enter group/ad", className)}
      style={minHeight ? { minHeight } : undefined}
      role="complementary"
      aria-label={`Sponsored content from ${ad.partner}`}
    >
      {dismissible && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDismiss();
          }}
          aria-label="Dismiss sponsored content"
          className="absolute right-2 top-2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-card/90 backdrop-blur border border-border text-muted-foreground hover:text-foreground hover:bg-card transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {children}
    </div>
  );
}
