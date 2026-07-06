"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Accordion } from "@/components/ui/accordion";
import { FilterAccordion } from "./FilterAccordion";
import { FilterCheckbox } from "./FilterCheckbox";
import { FilterRadio } from "./FilterRadio";
import {
  DIET_LABELS,
  HEALTH_LABELS,
  MEAL_TYPES,
  CUISINE_TYPES,
  DISH_TYPES,
  COOKING_TIME_FILTERS,
  INGREDIENT_FILTERS,
  CALORIE_FILTERS,
} from "@/lib/utils/constants";

interface ActiveFilters {
  diet: string[];
  health: string[];
  mealType: string[];
  cuisineType: string[];
  dishType: string[];
  time: string;
  ingr: string;
  calories: string;
}

function parseSearchParams(searchParams: URLSearchParams): ActiveFilters {
  return {
    diet: searchParams.getAll("diet"),
    health: searchParams.getAll("health"),
    mealType: searchParams.getAll("mealType"),
    cuisineType: searchParams.getAll("cuisineType"),
    dishType: searchParams.getAll("dishType"),
    time: searchParams.get("time") || "",
    ingr: searchParams.get("ingr") || "",
    calories: searchParams.get("calories") || "",
  };
}

function buildSearchParams(filters: ActiveFilters, q: string): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  filters.diet.forEach((d) => params.append("diet", d));
  filters.health.forEach((h) => params.append("health", h));
  filters.mealType.forEach((m) => params.append("mealType", m));
  filters.cuisineType.forEach((c) => params.append("cuisineType", c));
  filters.dishType.forEach((d) => params.append("dishType", d));
  if (filters.time) params.set("time", filters.time);
  if (filters.ingr) params.set("ingr", filters.ingr);
  if (filters.calories) params.set("calories", filters.calories);
  return params.toString();
}

function getActiveCount(filters: ActiveFilters): number {
  let count = 0;
  count += filters.diet.length;
  count += filters.health.length;
  count += filters.mealType.length;
  count += filters.cuisineType.length;
  count += filters.dishType.length;
  if (filters.time) count++;
  if (filters.ingr) count++;
  if (filters.calories) count++;
  return count;
}

function FilterContent({
  filters,
  setFilters,
}: {
  filters: ActiveFilters;
  setFilters: (f: ActiveFilters) => void;
}) {
  const toggleArrayFilter = (
    key: keyof ActiveFilters,
    value: string
  ) => {
    const arr = filters[key] as string[];
    const newArr = arr.includes(value)
      ? arr.filter((v) => v !== value)
      : [...arr, value];
    setFilters({ ...filters, [key]: newArr });
  };

  return (
    <Accordion className="w-full">
      <FilterAccordion value="time" title="Cooking Time">
        <FilterRadio
          name="time"
          options={COOKING_TIME_FILTERS}
          value={filters.time}
          onChange={(v) => setFilters({ ...filters, time: v })}
        />
      </FilterAccordion>

      <FilterAccordion value="ingr" title="Ingredients">
        <FilterRadio
          name="ingr"
          options={INGREDIENT_FILTERS}
          value={filters.ingr}
          onChange={(v) => setFilters({ ...filters, ingr: v })}
        />
      </FilterAccordion>

      <FilterAccordion value="calories" title="Calories">
        <FilterRadio
          name="calories"
          options={CALORIE_FILTERS}
          value={filters.calories}
          onChange={(v) => setFilters({ ...filters, calories: v })}
        />
      </FilterAccordion>

      <FilterAccordion value="diet" title="Diet">
        {DIET_LABELS.map((diet) => (
          <FilterCheckbox
            key={diet}
            id={`diet-${diet}`}
            label={diet}
            checked={filters.diet.includes(diet)}
            onChange={() => toggleArrayFilter("diet", diet)}
          />
        ))}
      </FilterAccordion>

      <FilterAccordion value="health" title="Health">
        {HEALTH_LABELS.map((health) => (
          <FilterCheckbox
            key={health}
            id={`health-${health}`}
            label={health}
            checked={filters.health.includes(health)}
            onChange={() => toggleArrayFilter("health", health)}
          />
        ))}
      </FilterAccordion>

      <FilterAccordion value="mealType" title="Meal Type">
        {MEAL_TYPES.map((meal) => (
          <FilterCheckbox
            key={meal}
            id={`mealType-${meal}`}
            label={meal}
            checked={filters.mealType.includes(meal)}
            onChange={() => toggleArrayFilter("mealType", meal)}
          />
        ))}
      </FilterAccordion>

      <FilterAccordion value="dishType" title="Dish Type">
        {DISH_TYPES.map((dish) => (
          <FilterCheckbox
            key={dish}
            id={`dishType-${dish}`}
            label={dish}
            checked={filters.dishType.includes(dish)}
            onChange={() => toggleArrayFilter("dishType", dish)}
          />
        ))}
      </FilterAccordion>

      <FilterAccordion value="cuisineType" title="Cuisine">
        {CUISINE_TYPES.map((cuisine) => (
          <FilterCheckbox
            key={cuisine}
            id={`cuisineType-${cuisine}`}
            label={cuisine}
            checked={filters.cuisineType.includes(cuisine)}
            onChange={() => toggleArrayFilter("cuisineType", cuisine)}
          />
        ))}
      </FilterAccordion>
    </Accordion>
  );
}

export function FilterBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";

  const [filters, setFilters] = useState<ActiveFilters>(() =>
    parseSearchParams(searchParams)
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    setFilters(parseSearchParams(searchParams));
  }, [searchParams]);

  const applyFilters = useCallback(() => {
    const queryString = buildSearchParams(filters, q);
    router.push(`/recipes?${queryString}`);
    setSheetOpen(false);
  }, [filters, q, router]);

  const clearFilters = useCallback(() => {
    setFilters({
      diet: [],
      health: [],
      mealType: [],
      cuisineType: [],
      dishType: [],
      time: "",
      ingr: "",
      calories: "",
    });
    if (q) {
      router.push(`/recipes?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/recipes");
    }
  }, [q, router]);

  const activeCount = getActiveCount(filters);

  const filterContent = (
    <div className="space-y-4">
      <FilterContent filters={filters} setFilters={setFilters} />

      <div className="flex gap-2 pt-4">
        <Button onClick={applyFilters} className="flex-1">
          Apply Filters
        </Button>
        {activeCount > 0 && (
          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile filter button */}
      <div className="lg:hidden mb-4">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger
            render={
              <Button variant="outline" className="w-full">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeCount}
                  </Badge>
                )}
              </Button>
            }
          />
          <SheetContent side="left" className="w-[300px] sm:w-[350px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4 overflow-y-auto h-[calc(100vh-8rem)]">
              {filterContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block sticky top-24 w-[280px] flex-shrink-0">
        <div className="p-4 border border-border rounded-lg bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-foreground">Filters</h3>
            {activeCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>
          <div className="overflow-y-auto h-[calc(100vh-16rem)]">
            {filterContent}
          </div>
        </div>
      </div>
    </>
  );
}
