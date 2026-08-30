"use client";

import { useEffect, useRef } from "react";
import { emitAdEvent } from "@/lib/ads/utils";

interface UseAdImpressionOptions {
  adId: string;
  variant: string;
  partner: string;
  placement: string;
  threshold?: number;
  delayMs?: number;
  disabled?: boolean;
}

export function useAdImpression({
  adId,
  variant,
  partner,
  placement,
  threshold = 0.5,
  delayMs = 1000,
  disabled = false,
}: UseAdImpressionOptions) {
  const ref = useRef<HTMLElement | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (disabled || fired.current) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      fired.current = true;
      emitAdEvent("ad_impression", { adId, variant, partner, placement });
      return;
    }
    let timer: number | null = null;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting && e.intersectionRatio >= threshold) {
          if (timer === null) {
            timer = window.setTimeout(() => {
              if (!fired.current) {
                fired.current = true;
                emitAdEvent("ad_impression", { adId, variant, partner, placement });
                io.disconnect();
              }
            }, delayMs);
          }
        } else if (timer !== null) {
          window.clearTimeout(timer);
          timer = null;
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [adId, variant, partner, placement, threshold, delayMs, disabled]);

  return ref;
}
