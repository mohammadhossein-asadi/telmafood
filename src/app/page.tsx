import { Hero } from "@/components/home/Hero";
import { MealTabs } from "@/components/home/MealTabs";
import { CuisineSlider } from "@/components/home/CuisineSlider";
import { CUISINE_SLIDERS } from "@/lib/utils/constants";

export default function HomePage() {
  return (
    <div>
      <Hero />

      <section className="py-8">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-6">
            Browse by Meal Type
          </h2>
          <MealTabs />
        </div>
      </section>

      {CUISINE_SLIDERS.map((slider) => (
        <CuisineSlider
          key={slider.cuisine}
          title={slider.title}
          cuisine={slider.cuisine}
        />
      ))}
    </div>
  );
}
