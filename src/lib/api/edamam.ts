import type { EdamamResponse, FilterParams } from "./types";

function buildQueryString(params: FilterParams): string {
  const parts: string[] = [];

  if (params.q) parts.push(`q=${encodeURIComponent(params.q)}`);
  if (params.mealType?.length) {
    params.mealType.forEach((t) =>
      parts.push(`mealType=${encodeURIComponent(t)}`)
    );
  }
  if (params.health?.length) {
    params.health.forEach((h) =>
      parts.push(`health=${encodeURIComponent(h)}`)
    );
  }
  if (params.diet?.length) {
    params.diet.forEach((d) => parts.push(`diet=${encodeURIComponent(d)}`));
  }
  if (params.cuisineType?.length) {
    params.cuisineType.forEach((c) =>
      parts.push(`cuisineType=${encodeURIComponent(c)}`)
    );
  }
  if (params.dishType?.length) {
    params.dishType.forEach((d) =>
      parts.push(`dishType=${encodeURIComponent(d)}`)
    );
  }
  if (params.calories)
    parts.push(`calories=${encodeURIComponent(params.calories)}`);
  if (params.time) parts.push(`time=${encodeURIComponent(params.time)}`);
  if (params.ingr) parts.push(`ingr=${encodeURIComponent(params.ingr)}`);

  return parts.join("&");
}

interface ApiErrorPayload {
  error?: string;
}

async function toErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    if (response.headers.get("content-type")?.includes("application/json")) {
      const body = (await response.json()) as ApiErrorPayload;
      return body.error || fallback;
    }
  } catch {
    // ignore parse errors, fall through to fallback
  }
  return fallback;
}

export async function fetchRecipes(
  params: FilterParams
): Promise<EdamamResponse> {
  const queryString = buildQueryString(params);
  const url = `/api/recipes${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);
  if (!response.ok) {
    const message = await toErrorMessage(response, `Failed to fetch recipes: ${response.statusText}`);
    throw new Error(message);
  }
  return response.json();
}

export async function fetchRecipesByPage(
  url: string
): Promise<EdamamResponse> {
  const urlObj = new URL(url);
  const queryString = urlObj.searchParams.toString();
  const internalUrl = `/api/recipes?${queryString}`;

  const response = await fetch(internalUrl);
  if (!response.ok) {
    const message = await toErrorMessage(response, `Failed to fetch recipes: ${response.statusText}`);
    throw new Error(message);
  }
  return response.json();
}

export async function fetchRecipeById(recipeId: string) {
  const response = await fetch(
    `/api/recipes/${encodeURIComponent(recipeId)}`
  );
  if (!response.ok) {
    const message = await toErrorMessage(response, `Failed to fetch recipe: ${response.statusText}`);
    throw new Error(message);
  }
  return response.json();
}

export function extractIdFromUri(uri: string): string {
  const lastUnderscoreIndex = uri.lastIndexOf("_");
  if (lastUnderscoreIndex !== -1) {
    return uri.slice(lastUnderscoreIndex + 1);
  }
  return uri;
}
