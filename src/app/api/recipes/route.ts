import { NextRequest, NextResponse } from "next/server";
import { fetchFromMealDb, fetchFromDummyJson, fetchFromEdamam } from "@/lib/api/backup";
import { safeParseEdamamResponse, safeParseFilterParams, type FilterParams } from "@/lib/api/types";

function searchParamsToFilterParams(searchParams: URLSearchParams): FilterParams {
  return {
    q: searchParams.get("q") || undefined,
    mealType: searchParams.getAll("mealType"),
    health: searchParams.getAll("health"),
    diet: searchParams.getAll("diet"),
    cuisineType: searchParams.getAll("cuisineType"),
    dishType: searchParams.getAll("dishType"),
    calories: searchParams.get("calories") || undefined,
    time: searchParams.get("time") || undefined,
    ingr: searchParams.get("ingr") || undefined,
    skip: searchParams.get("skip") || undefined,
    limit: searchParams.get("limit") || undefined,
    page: searchParams.get("page") || undefined,
  };
}

function withProviderHeader(data: unknown, provider: string) {
  return NextResponse.json(data, {
    headers: { "x-api-provider": provider },
  });
}

function validateAndReturn(data: unknown, provider: string) {
  const result = safeParseEdamamResponse(data);
  if (!result.success) {
    console.error(`[${provider}] Invalid response format:`, result.error);
    return null;
  }
  return withProviderHeader(result.data, provider);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filterParams = searchParamsToFilterParams(searchParams);

  // Validate filter params
  const filterValidation = safeParseFilterParams(filterParams);
  if (!filterValidation.success) {
    return NextResponse.json(
      { error: "Invalid filter parameters" },
      { status: 400 }
    );
  }

  // --- 1. TheMealDB (primary — fast, no limits, broad coverage) ---
  try {
    const mealDbData = await fetchFromMealDb(filterValidation.data);
    if (mealDbData.hits.length > 0) {
      const validated = validateAndReturn(mealDbData, "themealdb");
      if (validated) return validated;
    }
  } catch (error) {
    console.error("[themealdb] Error:", error);
  }

  // --- 2. DummyJSON (secondary — structured data, no limits) ---
  try {
    const dummyData = await fetchFromDummyJson(filterValidation.data);
    if (dummyData.hits.length > 0) {
      const validated = validateAndReturn(dummyData, "dummyjson");
      if (validated) return validated;
    }
  } catch (error) {
    console.error("[dummyjson] Error:", error);
  }

  // --- 3. Edamam (backup — highest quality, rate-limited) ---
  try {
    const edamamData = await fetchFromEdamam(filterValidation.data);
    if (edamamData.hits.length > 0) {
      const validated = validateAndReturn(edamamData, "edamam");
      if (validated) return validated;
    }
  } catch (error) {
    console.error("[edamam] Error:", error);
  }

  // --- 4. All providers failed ---
  return NextResponse.json(
    {
      error:
        "All recipe providers are currently unavailable. Please try again shortly.",
    },
    { status: 503 }
  );
}
