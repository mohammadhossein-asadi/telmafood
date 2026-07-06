export interface EdamamResponse {
  from: number;
  to: number;
  count: number;
  _links: {
    next?: {
      href: string;
      title: string;
    };
  };
  hits: RecipeHit[];
}

export interface RecipeHit {
  recipe: Recipe;
  _links: {
    self: {
      href: string;
      title: string;
    };
  };
}

export interface Recipe {
  uri: string;
  label: string;
  image: string;
  images: {
    THUMBNAIL?: ImageSize;
    SMALL?: ImageSize;
    REGULAR?: ImageSize;
    LARGE?: ImageSize;
  };
  source: string;
  url: string;
  shareAs: string;
  yield: number;
  dietLabels: string[];
  healthLabels: string[];
  cautions: string[];
  ingredientLines: string[];
  ingredients: Ingredient[];
  calories: number;
  totalWeight: number;
  totalTime: number;
  cuisineType: string[];
  mealType: string[];
  dishType: string[];
  totalNutrients: Record<string, Nutrient>;
  totalDaily: Record<string, Nutrient>;
}

export interface ImageSize {
  url: string;
  width: number;
  height: number;
}

export interface Ingredient {
  text: string;
  quantity: number;
  measure: string;
  food: string;
  weight: number;
  foodCategory: string;
  image: string;
}

export interface Nutrient {
  label: string;
  quantity: number;
  unit: string;
}

export interface FilterParams {
  q?: string;
  mealType?: string[];
  health?: string[];
  diet?: string[];
  cuisineType?: string[];
  dishType?: string[];
  calories?: string;
  time?: string;
  ingr?: string;
}

export interface SavedRecipe {
  id: string;
  recipe: Recipe;
  savedAt: number;
}
