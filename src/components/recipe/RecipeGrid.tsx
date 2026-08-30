"use client";

import { RecipeCard } from "./RecipeCard";
import { SponsoredCard } from "@/components/ad/SponsoredCard";
import { AdContainer } from "@/components/ad/AdContainer";
import { pickAd } from "@/lib/ads/mockAds";
import type { Recipe } from "@/lib/api/types";

interface RecipeGridProps {
  recipes: Recipe[];
  adPlacement?: string;
  adEvery?: number; // inject ad every N recipes
}

export function RecipeGrid({ recipes, adPlacement = "grid", adEvery = 8 }: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.uri} recipe={recipe} />
        ))}
      </div>
    );
  }

  // Interleave sponsored cards — stable deterministic pick per position
  const items: React.ReactNode[] = [];
  let adCount = 0;

  recipes.forEach((recipe, idx) => {
    items.push(<RecipeCard key={recipe.uri} recipe={recipe} />);
    const pos = idx + 1;
    // first ad after 5, then every adEvery
    if (pos >= 5 && pos % adEvery === 0) {
      const ad = pickAd(adCount, adPlacement);
      adCount += 1;
      items.push(
        <AdContainer
          key={`ad-${ad.id}-${pos}`}
          ad={ad}
          placement={`${adPlacement}-${pos}`}
          minHeight="340px"
          dismissible
          className="h-full"
        >
          <SponsoredCard ad={ad} placement={`${adPlacement}-${pos}`} />
        </AdContainer>
      );
    }
  });

  // If recipes <5 (e.g., home tabs 6 cards) still show one contextual ad at end for discovery
  if (recipes.length >= 6 && recipes.length < 8 && adEvery === 8) {
    const ad = pickAd(adCount, adPlacement);
    items.push(
      <AdContainer key={`ad-tail-${ad.id}`} ad={ad} placement={`${adPlacement}-tail`} minHeight="340px" dismissible className="h-full">
        <SponsoredCard ad={ad} placement={`${adPlacement}-tail`} />
      </AdContainer>
    );
  }

  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ad-stagger">{items}</div>;
}
