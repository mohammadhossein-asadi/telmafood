import { create } from "zustand";
import type { FilterParams } from "@/lib/api/types";

interface FilterStore {
  filters: FilterParams;
  setFilter: <K extends keyof FilterParams>(
    key: K,
    value: FilterParams[K]
  ) => void;
  setFilters: (filters: FilterParams) => void;
  clearFilters: () => void;
  getActiveFilterCount: () => number;
}

export const useFilterStore = create<FilterStore>()((set, get) => ({
  filters: {},

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
  },

  setFilters: (filters) => {
    set({ filters });
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  getActiveFilterCount: () => {
    const { filters } = get();
    let count = 0;
    if (filters.mealType?.length) count += filters.mealType.length;
    if (filters.health?.length) count += filters.health.length;
    if (filters.diet?.length) count += filters.diet.length;
    if (filters.cuisineType?.length) count += filters.cuisineType.length;
    if (filters.dishType?.length) count += filters.dishType.length;
    if (filters.calories) count++;
    if (filters.time) count++;
    if (filters.ingr) count++;
    return count;
  },
}));
