import { NextRequest, NextResponse } from "next/server";
import { fetchFromMealDb } from "@/lib/api/backup";
import { fetchFromDummyJson } from "@/lib/api/backup";
import type { FilterParams } from "@/lib/api/types";

const API_BASE = "https://api.edamam.com/api/recipes/v2";
const APP_ID = process.env.EDAMAM_API_ID || "";
const API_KEY = process.env.EDAMAM_API_KEY || "";
const TYPE = "public";

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
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // --- 1. Try Edamam first ---
  const params = new URLSearchParams();
  params.set("app_id", APP_ID);
  params.set("app_key", API_KEY);
  params.set("type", TYPE);
  for (const [key, value] of searchParams.entries()) {
    params.append(key, value);
  }

  const edamamUrl = `${API_BASE}?${params.toString()}`;
  try {
    const response = await fetch(edamamUrl);
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }
    // If Edamam fails (including 429), fall through to backups
  } catch {
    // Network error — fall through to backups
  }

  // --- 2. Fallback: TheMealDB ---
  const filterParams = searchParamsToFilterParams(searchParams);
  try {
    const mealDbData = await fetchFromMealDb(filterParams);
    if (mealDbData.hits.length > 0) {
      return NextResponse.json(mealDbData);
    }
  } catch {
    // TheMealDB failed — try DummyJSON
  }

  // --- 3. Fallback: DummyJSON ---
  try {
    const dummyData = await fetchFromDummyJson(filterParams);
    if (dummyData.hits.length > 0) {
      return NextResponse.json(dummyData);
    }
  } catch {
    // DummyJSON also failed
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
