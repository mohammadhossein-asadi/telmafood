"use client";

import { SearchBar } from "@/components/search/SearchBar";
import { HeroPromo } from "@/components/ad/HeroPromo";
import { AdContainer } from "@/components/ad/AdContainer";
import { MOCK_ADS } from "@/lib/ads/mockAds";

export function Hero() {
  const heroAd = MOCK_ADS[1]; // Hearth & Grain editorial — stable pick

  return (
    <section className="relative overflow-hidden bg-paper border-b border-border">
      {/* subtle editorial texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, hsl(28 84% 52% / 0.6) 0, transparent 55%), radial-gradient(circle at 90% 80%, hsl(200 30% 70% / 0.4) 0, transparent 40%)`,
        }}
      />
      <div className="relative mx-auto max-w-[1280px] px-4 py-10 md:py-14 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 items-center">
          {/* Copy + Search */}
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-sponsored-border bg-sponsored-bg px-3 py-1 text-xs font-medium tracking-wide text-sponsored mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-sponsored animate-pulse" aria-hidden />
              12,000+ recipes · Test kitchen approved
            </p>
            <h1 className="font-heading text-[32px] md:text-[44px] lg:text-[54px] leading-[0.95] tracking-[-0.035em] text-foreground">
              Discover
              <span className="font-heading italic font-normal text-primary"> delicious</span>
              <br />
              recipes
            </h1>
            <p className="mt-4 text-[15px] md:text-[16px] leading-relaxed text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Explore thousands of recipes from around the world. Search by ingredients, cuisine, or dietary preferences — then cook with confidence.
            </p>
            <div className="mt-8 max-w-xl mx-auto lg:mx-0">
              <SearchBar size="large" placeholder="What would you like to cook?" />
              <p className="mt-3 text-xs tracking-wide text-muted-foreground text-center lg:text-left">
                Try: <span className="text-foreground">“30-min pasta”</span> · <span className="text-foreground">“vegan curry”</span> · <span className="text-foreground">“sourdough”</span>
              </p>
            </div>
          </div>

          {/* Promo — hidden on very small, visible from sm */}
          <div className="hidden sm:block">
            <AdContainer ad={heroAd} placement="hero" minHeight="420px" dismissible>
              <HeroPromo ad={heroAd} placement="hero" />
            </AdContainer>
          </div>
        </div>

        {/* Mobile promo as compact bar when hidden above */}
        <div className="sm:hidden mt-8">
          <AdContainer ad={heroAd} placement="hero-mobile" minHeight="180px" dismissible>
            <div className="flex gap-3 rounded-2xl border border-sponsored-border bg-sponsored-bg p-3 items-center">
              <div className="h-14 w-14 rounded-xl bg-stone overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroAd.image} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] tracking-[0.14em] uppercase text-ink-muted">Sponsored · {heroAd.partner}</p>
                <p className="text-sm font-medium text-foreground leading-tight line-clamp-1">{heroAd.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{heroAd.description}</p>
              </div>
              <a
                href={heroAd.href}
                className="shrink-0 inline-flex h-9 px-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium"
              >
                Visit
              </a>
            </div>
          </AdContainer>
        </div>
      </div>
    </section>
  );
}
