export type AdVariant = "card" | "editorial" | "banner" | "hero" | "context";
export type AdTone = "warm" | "ink";

export interface SponsoredMeta {
  id: string;
  partner: string;
  label: string; // e.g. "Olive Atelier"
  href: string;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  contextLine?: string; // "Paired with Mediterranean recipes"
  cta: string;
  variant: AdVariant;
  tone?: AdTone;
  badge?: string; // e.g. "New", "Editor's pick"
}

export interface AdEventPayload {
  adId: string;
  variant: AdVariant;
  partner: string;
  placement: string;
}
