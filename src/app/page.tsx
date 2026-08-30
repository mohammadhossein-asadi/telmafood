import { Hero } from "@/components/home/Hero";
import { MealTabs } from "@/components/home/MealTabs";
import { CuisineSlider } from "@/components/home/CuisineSlider";
import { PremiumPromoBlock } from "@/components/ad/PremiumPromoBlock";
import { AdContainer } from "@/components/ad/AdContainer";
import { MOCK_ADS } from "@/lib/ads/mockAds";
import { CUISINE_SLIDERS } from "@/lib/utils/constants";

export default function HomePage() {
  const editorialAd = MOCK_ADS[1]; // Hearth & Grain warm
  const pantryAd = MOCK_ADS[4]; // Asia Pantry ink

  return (
    <div>
      <Hero />

      <section className="py-10 md:py-12">
        <div className="mx-auto max-w-[1280px] px-4">
          <div className="flex items-baseline justify-between gap-4 mb-6">
            <h2 className="font-heading text-[24px] md:text-[30px] tracking-[-0.02em] text-foreground">Browse by Meal Type</h2>
            <span className="hidden sm:inline text-xs tracking-[0.12em] uppercase text-muted-foreground">Curated · Fresh daily</span>
          </div>
          <MealTabs />
        </div>
      </section>

      {/* First slider */}
      <CuisineSlider
        key={CUISINE_SLIDERS[0].cuisine}
        title={CUISINE_SLIDERS[0].title}
        cuisine={CUISINE_SLIDERS[0].cuisine}
      />

      {/* Editorial break — premium promo between sliders */}
      <AdContainer ad={editorialAd} placement="home-editorial-break" className="my-2" dismissible>
        <PremiumPromoBlock ad={editorialAd} placement="home-editorial-break" />
      </AdContainer>

      {/* Second slider */}
      <CuisineSlider
        key={CUISINE_SLIDERS[1].cuisine}
        title={CUISINE_SLIDERS[1].title}
        cuisine={CUISINE_SLIDERS[1].cuisine}
      />

      {/* Secondary editorial — ink variant near footer for A/B contrast */}
      <AdContainer ad={pantryAd} placement="home-secondary-editorial" className="my-2" dismissible>
        <PremiumPromoBlock ad={pantryAd} placement="home-secondary-editorial" />
      </AdContainer>
    </div>
  );
}
