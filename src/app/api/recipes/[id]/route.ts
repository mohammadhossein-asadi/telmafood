import { NextRequest, NextResponse } from "next/server";
import { fetchFromMealDbById, fetchFromDummyJsonById } from "@/lib/api/backup";

const API_BASE = "https://api.edamam.com/api/recipes/v2";
const APP_ID = process.env.EDAMAM_API_ID || "";
const API_KEY = process.env.EDAMAM_API_KEY || "";
const TYPE = "public";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // --- 1. Try Edamam first ---
  const edamamUrl = `${API_BASE}/${id}?app_id=${APP_ID}&app_key=${API_KEY}&type=${TYPE}`;
  try {
    const response = await fetch(edamamUrl);
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch {
    // Fall through to backups
  }

  // --- 2. Fallback: TheMealDB ---
  try {
    const meal = await fetchFromMealDbById(id);
    if (meal) {
      return NextResponse.json({ recipe: meal });
    }
  } catch {
    // Fall through
  }

  // --- 3. Fallback: DummyJSON ---
  try {
    const recipe = await fetchFromDummyJsonById(id);
    if (recipe) {
      return NextResponse.json({ recipe });
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
