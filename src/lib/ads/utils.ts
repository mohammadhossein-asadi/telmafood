"use client";

const DISMISS_KEY = "telma_dismissed_ads";

export function getDismissedAds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = sessionStorage.getItem(DISMISS_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function dismissAd(id: string) {
  const set = getDismissedAds();
  set.add(id);
  try {
    sessionStorage.setItem(DISMISS_KEY, JSON.stringify([...set]));
  } catch {}
}

export function isAdDismissed(id: string) {
  return getDismissedAds().has(id);
}

// Interleave ads into generic arrays (e.g., recipes) — preserves layout stability.
export function interleaveAds<T>(items: T[], ads: T[], every: number, startAfter = 5): (T | { _ad: true; ad: T })[] {
  if (ads.length === 0) return items as unknown as (T | { _ad: true; ad: T })[];
  const out: (T | { _ad: true; ad: T })[] = [];
  let adIdx = 0;
  for (let i = 0; i < items.length; i++) {
    out.push(items[i] as unknown as T);
    const pos = i + 1;
    if (pos >= startAfter && pos % every === 0 && adIdx < ads.length) {
      out.push({ _ad: true, ad: ads[adIdx++] } as unknown as T);
    }
  }
  return out;
}

export function emitAdEvent(
  name: "ad_impression" | "ad_click" | "ad_dismiss",
  payload: { adId: string; variant: string; partner: string; placement: string }
) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[ad] ${name}`, payload);
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(name, { detail: payload }));
  }
}
