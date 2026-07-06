import type { EdamamResponse, FilterParams } from "./types";
import { fetchWithRetry } from "./rate-limiter";

const API_BASE = "https://api.edamam.com/api/recipes/v2";
const APP_ID = process.env.NEXT_PUBLIC_EDAMAM_API_ID || "";
const API_KEY = process.env.NEXT_PUBLIC_EDAMAM_API_KEY || "";
const TYPE = "public";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function buildQueryString(params: FilterParams): string {
  const queryParts: string[] = [];

  if (params.q) {
    queryParts.push(`q=${encodeURIComponent(params.q)}`);
  }

  if (params.mealType?.length) {
    params.mealType.forEach((type) =>
      queryParts.push(`mealType=${encodeURIComponent(type)}`)
    );
  }

  if (params.health?.length) {
    params.health.forEach((h) =>
      queryParts.push(`health=${encodeURIComponent(h)}`)
    );
  }

  if (params.diet?.length) {
    params.diet.forEach((d) =>
      queryParts.push(`diet=${encodeURIComponent(d)}`)
    );
  }

  if (params.cuisineType?.length) {
    params.cuisineType.forEach((c) =>
      queryParts.push(`cuisineType=${encodeURIComponent(c)}`)
    );
  }

  if (params.dishType?.length) {
    params.dishType.forEach((d) =>
      queryParts.push(`dishType=${encodeURIComponent(d)}`)
    );
  }

  if (params.calories) {
    queryParts.push(`calories=${encodeURIComponent(params.calories)}`);
  }

  if (params.time) {
    queryParts.push(`time=${encodeURIComponent(params.time)}`);
  }

  if (params.ingr) {
    queryParts.push(`ingr=${encodeURIComponent(params.ingr)}`);
  }

  return queryParts.join("&");
}

export async function fetchRecipes(
  params: FilterParams
): Promise<EdamamResponse> {
  const queryString = buildQueryString(params);
  const url = `${API_BASE}?app_id=${APP_ID}&app_key=${API_KEY}&type=${TYPE}${
    queryString ? `&${queryString}` : ""
  }`;

  const response = await fetchWithRetry(url);

  if (!response.ok) {
    throw new ApiError(
      `Failed to fetch recipes: ${response.statusText}`,
      response.status
    );
  }

  return response.json();
}

export async function fetchRecipesByPage(
  url: string
): Promise<EdamamResponse> {
  const separator = url.includes("?") ? "&" : "?";
  const fullUrl = `${url}${separator}app_id=${APP_ID}&app_key=${API_KEY}&type=${TYPE}`;

  const response = await fetchWithRetry(fullUrl);

  if (!response.ok) {
    throw new ApiError(
      `Failed to fetch recipes: ${response.statusText}`,
      response.status
    );
  }

  return response.json();
}

export async function fetchRecipeById(recipeId: string) {
  const url = `${API_BASE}/${recipeId}?app_id=${APP_ID}&app_key=${API_KEY}&type=${TYPE}`;

  const response = await fetchWithRetry(url);

  if (!response.ok) {
    throw new ApiError(
      `Failed to fetch recipe: ${response.statusText}`,
      response.status
    );
  }

  return response.json();
}

export function extractIdFromUri(uri: string): string {
  // Extract the part after the last underscore
  // URI format: http://www.edamam.com/ontologies/edamam.owl#recipe_abc123xyz
  const lastUnderscoreIndex = uri.lastIndexOf("_");
  if (lastUnderscoreIndex !== -1) {
    return uri.slice(lastUnderscoreIndex + 1);
  }
  return uri;
}
