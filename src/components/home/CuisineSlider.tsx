"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { RecipeCardSkeleton } from "@/components/recipe/RecipeCardSkeleton";
import { useRecipes } from "@/lib/hooks/useRecipes";

interface CuisineSliderProps {
  title: string;
  cuisine: string;
}

import { AdContainer } from "@/components/ad/AdContainer";
import { SponsoredCard } from "@/components/ad/SponsoredCard";
import { pickAd } from "@/lib/ads/mockAds";

export function CuisineSlider({ title, cuisine }: CuisineSliderProps) {
  const { data, isLoading } = useRecipes({ cuisineType: [cuisine] });

  const recipes = data?.pages[0]?.hits.map((hit) => hit.recipe) || [];
  const sliderAd = pickAd(0, `slider-${cuisine}`);

  return (
    <section className="py-8">
      <div className="mx-auto max-w-[1280px] px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-[22px] md:text-[26px] tracking-[-0.02em] text-foreground">{title}</h2>
          <Link href={`/recipes?cuisineType=${encodeURIComponent(cuisine)}`}>
            <Button variant="ghost" className="rounded-full text-primary hover:text-primary-hover">
              Show more
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto scrollbar-hide scroll-snap-x -mx-4 px-4">
          {isLoading ? (
            <div className="flex gap-4 pb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[280px] scroll-snap-item">
                  <RecipeCardSkeleton />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-4 pb-4">
              {recipes.slice(0, 6).map((recipe) => (
                <div key={recipe.uri} className="flex-shrink-0 w-[280px] scroll-snap-item">
                  <RecipeCard recipe={recipe} />
                </div>
              ))}

              {/* Native ad as last snap item — same dimensions, clearly sponsored */}
              <div className="flex-shrink-0 w-[280px] scroll-snap-item">
                <AdContainer ad={sliderAd} placement={`slider-${cuisine}`} minHeight="360px" dismissible>
                  <SponsoredCard ad={sliderAd} placement={`slider-${cuisine}`} />
                </AdContainer>
              </div>

              {recipes.slice(6, 10).map((recipe) => (
                <div key={recipe.uri} className="flex-shrink-0 w-[280px] scroll-snap-item">
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
