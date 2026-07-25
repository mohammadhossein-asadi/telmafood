import { SearchBar } from "@/components/search/SearchBar";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary-container py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
          Discover Delicious Recipes
        </h1>
        <p className="text-base md:text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
          Explore thousands of recipes from around the world. Search by
          ingredients, cuisine, or dietary preferences.
        </p>
        <div className="max-w-xl mx-auto">
          <SearchBar size="large" placeholder="What would you like to cook?" />
        </div>
      </div>
    </section>
  );
}
