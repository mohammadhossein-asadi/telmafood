import { NextRequest, NextResponse } from "next/server";
import { fetchFromMealDbById, fetchFromDummyJsonById } from "@/lib/api/backup";

const API_BASE = "https://api.edamam.com/api/recipes/v2";
const APP_ID = process.env.EDAMAM_API_ID || "";
const API_KEY = process.env.EDAMAM_API_KEY || "";
const TYPE = "public";

function withProviderHeader(data: unknown, provider: string) {
  return NextResponse.json(data, {
    headers: { "x-api-provider": provider },
  });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // --- 1. TheMealDB (primary — fast, no limits) ---
  try {
    const meal = await fetchFromMealDbById(id);
    if (meal) {
      return withProviderHeader({ recipe: meal }, "themealdb");
    }
  } catch {
    // Fall through
  }

  // --- 2. DummyJSON (secondary — structured data, no limits) ---
  try {
    const recipe = await fetchFromDummyJsonById(id);
    if (recipe) {
      return withProviderHeader({ recipe }, "dummyjson");
    }
  } catch {
    // Fall through
  }

  // --- 3. Edamam (backup — highest quality, rate-limited) ---
  const edamamUrl = `${API_BASE}/${id}?app_id=${APP_ID}&app_key=${API_KEY}&type=${TYPE}`;
  try {
    const response = await fetch(edamamUrl);
    if (response.ok) {
      const data = await response.json();
      return withProviderHeader(data, "edamam");
    }
  } catch {
    // Fall through
  }

  // --- 4. All providers failed ---
  return NextResponse.json(
    { error: "Recipe not found in any provider." },
    { status: 404 }
  );
}
