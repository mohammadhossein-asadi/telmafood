import type {
  EdamamResponse,
  EdamamRecipe as Recipe,
  RecipeHit,
  FilterParams,
  Ingredient,
} from "./types";
import { apiRateLimiter } from "./rate-limiter";

// ---------------------------------------------------------------------------
// TheMealDB — https://www.themealdb.com/api/json/v1/1/
// ---------------------------------------------------------------------------

const MEALDB_BASE = "https://www.themealdb.com/api/json/v1/1";

interface MealDBMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string | null;
  strCategory: string | null;
  strArea: string | null;
  strTags: string | null;
  strSource: string | null;
  strIngredient1: string | null;
  strIngredient2: string | null;
  strIngredient3: string | null;
  strIngredient4: string | null;
  strIngredient5: string | null;
  strIngredient6: string | null;
  strIngredient7: string | null;
  strIngredient8: string | null;
  strIngredient9: string | null;
  strIngredient10: string | null;
  strIngredient11: string | null;
  strIngredient12: string | null;
  strIngredient13: string | null;
  strIngredient14: string | null;
  strIngredient15: string | null;
  strIngredient16: string | null;
  strIngredient17: string | null;
  strIngredient18: string | null;
  strIngredient19: string | null;
  strIngredient20: string | null;
  strMeasure1: string | null;
  strMeasure2: string | null;
  strMeasure3: string | null;
  strMeasure4: string | null;
  strMeasure5: string | null;
  strMeasure6: string | null;
  strMeasure7: string | null;
  strMeasure8: string | null;
  strMeasure9: string | null;
  strMeasure10: string | null;
  strMeasure11: string | null;
  strMeasure12: string | null;
  strMeasure13: string | null;
  strMeasure14: string | null;
  strMeasure15: string | null;
  strMeasure16: string | null;
  strMeasure17: string | null;
  strMeasure18: string | null;
  strMeasure19: string | null;
  strMeasure20: string | null;
}

function mealdbToRecipe(meal: MealDBMeal): Recipe {
  const ingredients: Ingredient[] = [];
  const ingredientLines: string[] = [];

  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}` as keyof MealDBMeal];
    const meas = meal[`strMeasure${i}` as keyof MealDBMeal];
    if (ing && ing.trim()) {
      const text = meas && meas.trim() ? `${meas.trim()} ${ing.trim()}` : ing.trim();
      ingredientLines.push(text);
      ingredients.push({
        text,
        quantity: 0,
        measure: meas?.trim() || "",
        food: ing.trim(),
        weight: 0,
        foodCategory: "",
        image: "",
      });
    }
  }

  const tags = meal.strTags
    ? meal.strTags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return {
    uri: `http://www.themealdb.com/meal/${meal.idMeal}`,
    label: meal.strMeal,
    image: meal.strMealThumb,
    images: {
      THUMBNAIL: { url: meal.strMealThumb, width: 120, height: 120 },
      SMALL: { url: meal.strMealThumb, width: 240, height: 240 },
      REGULAR: { url: meal.strMealThumb, width: 500, height: 500 },
    },
    source: meal.strSource || "TheMealDB",
    url: meal.strSource || `https://www.themealdb.com/meal/${meal.idMeal}`,
    shareAs: "",
    yield: 4,
    dietLabels: [],
    healthLabels: [],
    cautions: [],
    ingredientLines,
    ingredients,
    calories: 0,
    totalWeight: 0,
    totalTime: 0,
    cuisineType: meal.strArea ? [meal.strArea] : [],
    mealType: meal.strCategory ? [meal.strCategory] : [],
    dishType: tags,
    totalNutrients: {},
    totalDaily: {},
  };
}

function mealdbToEdamam(meals: MealDBMeal[] | null, params?: FilterParams): EdamamResponse {
  if (!meals || meals.length === 0) {
    return { from: 0, to: 0, count: 0, _links: {}, hits: [] };
  }
  const hits: RecipeHit[] = meals.map((m) => ({
    recipe: mealdbToRecipe(m),
    _links: { self: { href: "", title: "" } },
  }));

  const page = Number(params?.page) || 1;
  const limit = Number(params?.limit) || 12;
  const startIndex = (page - 1) * limit;
  const pagedHits = hits.slice(startIndex, startIndex + limit);
  const hasNextPage = startIndex + limit < hits.length;

  const nextParams = new URLSearchParams();
  if (params?.q) nextParams.set("q", params.q);
  if (params?.cuisineType?.length) params.cuisineType.forEach((c) => nextParams.append("cuisineType", c));
  if (params?.mealType?.length) params.mealType.forEach((m) => nextParams.append("mealType", m));
  if (params?.dishType?.length) params.dishType.forEach((d) => nextParams.append("dishType", d));
  nextParams.set("page", String(page + 1));
  nextParams.set("limit", String(limit));

  return {
    from: startIndex + 1,
    to: startIndex + (pagedHits.length > 0 ? pagedHits.length : hits.length),
    count: hits.length,
    _links: hasNextPage
      ? {
          next: {
            href: `/api/recipes?${nextParams.toString()}`,
            title: "Next Page",
          },
        }
      : {},
    hits: pagedHits.length > 0 ? pagedHits : hits,
  };
}

// Build TheMealDB search URL from FilterParams
function buildMealDbUrl(params: FilterParams): string {
  const q = params.q || "";

  // If there's a cuisine type filter, use area filter
  if (params.cuisineType?.length && params.cuisineType[0]) {
    return `${MEALDB_BASE}/filter.php?a=${encodeURIComponent(params.cuisineType[0])}`;
  }

  // If there's a category filter, use category filter
  if (params.mealType?.length && params.mealType[0]) {
    return `${MEALDB_BASE}/filter.php?c=${encodeURIComponent(params.mealType[0])}`;
  }

  // If there's an ingredient search, use ingredient filter
  if (params.ingr) {
    const ingredient = params.ingr.split(",")[0]?.trim() || params.ingr;
    return `${MEALDB_BASE}/filter.php?i=${encodeURIComponent(ingredient)}`;
  }

  // Default: search by name or general catalog
  return `${MEALDB_BASE}/search.php?s=${encodeURIComponent(q)}`;
}

export async function fetchFromMealDb(
  params: FilterParams
): Promise<EdamamResponse> {
  const url = buildMealDbUrl(params);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TheMealDB error: ${response.statusText}`);
  }
  const data = (await response.json()) as { meals: MealDBMeal[] | null };
  return mealdbToEdamam(data.meals, params);
}

export async function fetchFromMealDbById(id: string): Promise<Recipe | null> {
  const response = await fetch(`${MEALDB_BASE}/lookup.php?i=${id}`);
  if (!response.ok) {
    throw new Error(`TheMealDB error: ${response.statusText}`);
  }
  const data = (await response.json()) as { meals: MealDBMeal[] | null };
  if (!data.meals || data.meals.length === 0) return null;
  return mealdbToRecipe(data.meals[0]);
}

// ---------------------------------------------------------------------------
// DummyJSON — https://dummyjson.com/recipes
// ---------------------------------------------------------------------------

const DUMMY_BASE = "https://dummyjson.com";

interface DummyRecipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
}

interface DummySearchResponse {
  recipes: DummyRecipe[];
  total: number;
  skip: number;
  limit: number;
}

function dummyToRecipe(r: DummyRecipe): Recipe {
  return {
    uri: `https://dummyjson.com/recipes/${r.id}`,
    label: r.name,
    image: r.image,
    images: {
      THUMBNAIL: { url: r.image, width: 120, height: 120 },
      SMALL: { url: r.image, width: 240, height: 240 },
      REGULAR: { url: r.image, width: 500, height: 500 },
    },
    source: "DummyJSON",
    url: `https://dummyjson.com/recipes/${r.id}`,
    shareAs: "",
    yield: r.servings || 4,
    dietLabels: [],
    healthLabels: [],
    cautions: [],
    ingredientLines: r.ingredients || [],
    ingredients: (r.ingredients || []).map((text) => ({
      text,
      quantity: 0,
      measure: "",
      food: text,
      weight: 0,
      foodCategory: "",
      image: "",
    })),
    calories: (r.caloriesPerServing || 0) * (r.servings || 4),
    totalWeight: 0,
    totalTime: (r.prepTimeMinutes || 0) + (r.cookTimeMinutes || 0),
    cuisineType: r.cuisine ? [r.cuisine] : [],
    mealType: r.mealType || [],
    dishType: r.tags || [],
    totalNutrients: {},
    totalDaily: {},
  };
}

function dummyToEdamam(data: DummySearchResponse, params?: FilterParams): EdamamResponse {
  if (!data.recipes || data.recipes.length === 0) {
    return { from: 0, to: 0, count: 0, _links: {}, hits: [] };
  }
  const hits: RecipeHit[] = data.recipes.map((r) => ({
    recipe: dummyToRecipe(r),
    _links: { self: { href: "", title: "" } },
  }));

  const nextSkip = data.skip + data.recipes.length;
  const hasNext = nextSkip < data.total;

  const nextParams = new URLSearchParams();
  if (params?.q) nextParams.set("q", params.q);
  nextParams.set("skip", String(nextSkip));
  nextParams.set("limit", String(data.limit || 12));

  return {
    from: data.skip + 1,
    to: data.skip + hits.length,
    count: data.total,
    _links: hasNext
      ? {
          next: {
            href: `/api/recipes?${nextParams.toString()}`,
            title: "Next Page",
          },
        }
      : {},
    hits,
  };
}

export async function fetchFromDummyJson(
  params: FilterParams
): Promise<EdamamResponse> {
  const q = params.q || "";
  const skip = params.skip || 0;
  const limit = params.limit || 12;
  const url = q
    ? `${DUMMY_BASE}/recipes/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`
    : `${DUMMY_BASE}/recipes?limit=${limit}&skip=${skip}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`DummyJSON error: ${response.statusText}`);
  }
  const data = (await response.json()) as DummySearchResponse;
  return dummyToEdamam(data, params);
}

export async function fetchFromDummyJsonById(
  id: string
): Promise<Recipe | null> {
  const response = await fetch(`${DUMMY_BASE}/recipes/${id}`);
  if (!response.ok) {
    throw new Error(`DummyJSON error: ${response.statusText}`);
  }
  const r = (await response.json()) as DummyRecipe;
  return dummyToRecipe(r);
}

// ---------------------------------------------------------------------------
// Edamam — https://api.edamam.com/api/recipes/v2
// ---------------------------------------------------------------------------

const EDAMAM_BASE = "https://api.edamam.com/api/recipes/v2";
const EDAMAM_APP_ID = process.env.EDAMAM_API_ID || "";
const EDAMAM_APP_KEY = process.env.EDAMAM_API_KEY || "";
const EDAMAM_TYPE = "public";

interface EdamamRecipe {
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

interface EdamamApiResponse {
  from: number;
  to: number;
  count: number;
  _links: {
    next?: {
      href: string;
      title: string;
    };
  };
  hits: Array<{ recipe: EdamamRecipe }>;
}

interface ImageSize {
  url: string;
  width: number;
  height: number;
}

interface Nutrient {
  label: string;
  quantity: number;
  unit: string;
}

function edamamToRecipe(recipe: EdamamRecipe): Recipe {
  return {
    uri: recipe.uri,
    label: recipe.label,
    image: recipe.image,
    images: recipe.images,
    source: recipe.source,
    url: recipe.url,
    shareAs: recipe.shareAs,
    yield: recipe.yield,
    dietLabels: recipe.dietLabels,
    healthLabels: recipe.healthLabels,
    cautions: recipe.cautions,
    ingredientLines: recipe.ingredientLines,
    ingredients: recipe.ingredients,
    calories: recipe.calories,
    totalWeight: recipe.totalWeight,
    totalTime: recipe.totalTime,
    cuisineType: recipe.cuisineType,
    mealType: recipe.mealType,
    dishType: recipe.dishType,
    totalNutrients: recipe.totalNutrients,
    totalDaily: recipe.totalDaily,
  };
}

function edamamToEdamamResponse(data: EdamamApiResponse): EdamamResponse {
  return {
    from: data.from,
    to: data.to,
    count: data.count,
    _links: data._links,
    hits: data.hits.map((hit) => ({
      recipe: edamamToRecipe(hit.recipe),
      _links: { self: { href: "", title: "" } },
    })),
  };
}

async function fetchWithRateLimit(url: string): Promise<Response> {
  await apiRateLimiter.acquire("edamam");
  const response = await fetch(url);
  
  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After");
    const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 1000;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
    await apiRateLimiter.acquire("edamam");
    return fetch(url);
  }
  
  return response;
}

export async function fetchFromEdamam(
  params: FilterParams
): Promise<EdamamResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("app_id", EDAMAM_APP_ID);
  searchParams.set("app_key", EDAMAM_APP_KEY);
  searchParams.set("type", EDAMAM_TYPE);
  
  if (params.q) searchParams.set("q", params.q);
  params.mealType?.forEach((t) => searchParams.append("mealType", t));
  params.health?.forEach((h) => searchParams.append("health", h));
  params.diet?.forEach((d) => searchParams.append("diet", d));
  params.cuisineType?.forEach((c) => searchParams.append("cuisineType", c));
  params.dishType?.forEach((d) => searchParams.append("dishType", d));
  if (params.calories) searchParams.set("calories", params.calories);
  if (params.time) searchParams.set("time", params.time);
  if (params.ingr) searchParams.set("ingr", params.ingr);

  const url = `${EDAMAM_BASE}?${searchParams.toString()}`;
  const response = await fetchWithRateLimit(url);
  
  if (!response.ok) {
    throw new Error(`Edamam error: ${response.statusText}`);
  }
  
  const data = (await response.json()) as EdamamApiResponse;
  return edamamToEdamamResponse(data);
}

export async function fetchFromEdamamById(id: string): Promise<Recipe | null> {
  const searchParams = new URLSearchParams();
  searchParams.set("app_id", EDAMAM_APP_ID);
  searchParams.set("app_key", EDAMAM_APP_KEY);
  searchParams.set("type", EDAMAM_TYPE);

  const url = `${EDAMAM_BASE}/${id}?${searchParams.toString()}`;
  const response = await fetchWithRateLimit(url);
  
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Edamam error: ${response.statusText}`);
  }
  
  const data = (await response.json()) as EdamamRecipe;
  return edamamToRecipe(data);
}
