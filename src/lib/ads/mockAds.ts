import type { SponsoredMeta } from "./types";

// Curated editorial partners — replace with API later.
// Images are unsplash / edamam-friendly placeholders, lazy-loaded.
export const MOCK_ADS: SponsoredMeta[] = [
  {
    id: "ad-olive-atelier",
    partner: "Olive Atelier",
    label: "Olive Atelier",
    href: "/recipes?cuisineType=Mediterranean",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&auto=format&fit=crop&q=60",
    imageAlt: "Bottle of olive oil with olives on stone",
    title: "Cold-pressed, single estate",
    description: "Taste the harvest. Small-batch olive oil from Crete — crafted for dressings & finishing.",
    contextLine: "Perfect with Mediterranean recipes",
    cta: "Explore collection",
    variant: "card",
    badge: "Editor's pick",
  },
  {
    id: "ad-hearth-bake",
    partner: "Hearth & Grain",
    label: "Hearth & Grain",
    href: "/recipes?dishType=Bread",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=60",
    imageAlt: "Fresh sourdough on wooden table",
    title: "Bake like a baker",
    description: "Stone-milled flour, slow fermentation starters & tools — the kit we use in the Telma test kitchen.",
    contextLine: "Featured in our bread & baking stories",
    cta: "Shop the kit",
    variant: "editorial",
    tone: "warm",
  },
  {
    id: "ad-market-fresh",
    partner: "Market Fresh",
    label: "Market Fresh",
    href: "/recipes?q=salad",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=60",
    imageAlt: "Vibrant salad ingredients on market stall",
    title: "Greens delivered before noon",
    description: "Seasonal boxes from local farms. Washed, crisp, ready to toss — free delivery on first box.",
    contextLine: "Paired with salads & light lunches",
    cta: "Get 30% off",
    variant: "card",
  },
  {
    id: "ad-copper-co",
    partner: "Copper & Co.",
    label: "Copper & Co.",
    href: "/recipes?cuisineType=French",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=60",
    imageAlt: "Copper pan on stove",
    title: "Heats evenly. Lasts generations.",
    description: "French copper, hand-tinned. The one pan our editors refuse to return.",
    contextLine: "Why chefs love copper — read the guide",
    cta: "View the pan",
    variant: "context",
  },
  {
    id: "ad-asia-pantry",
    partner: "Asia Pantry",
    label: "Asia Pantry",
    href: "/recipes?cuisineType=Asian",
    image: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=1200&auto=format&fit=crop&q=60",
    imageAlt: "Asian pantry ingredients and bowls",
    title: "Your Asian pantry, stocked",
    description: "Yuzu kosho, kombu, black vinegar — hard-to-find essentials, now in one bundle.",
    contextLine: "Curated for Asian recipes",
    cta: "Build your pantry",
    variant: "editorial",
    tone: "ink",
  },
  {
    id: "ad-zero-waste",
    partner: "Zero Waste Co.",
    label: "Zero Waste Co.",
    href: "/recipes?q=soup",
    image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&auto=format&fit=crop&q=60",
    imageAlt: "Glass jars with grains and beans",
    title: "Cook more. Waste less.",
    description: "Reusable storage, compostable wraps & the guide to stretching every ingredient.",
    contextLine: "Sustainable kitchen companion",
    cta: "Learn how",
    variant: "banner",
  },
];

export function getAdById(id: string) {
  return MOCK_ADS.find((a) => a.id === id);
}

export function getAdsByVariant(variant: SponsoredMeta["variant"]) {
  return MOCK_ADS.filter((a) => a.variant === variant);
}

export function pickAd(index: number, placement: string) {
  // Deterministic rotation per placement — avoids hydration mismatch vs Math.random
  let hash = 0;
  for (let i = 0; i < placement.length; i++) hash = (hash * 31 + placement.charCodeAt(i)) | 0;
  const offset = Math.abs(hash) % MOCK_ADS.length;
  return MOCK_ADS[(offset + index) % MOCK_ADS.length];
}
