import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.edamam.com/api/recipes/v2";
const APP_ID = process.env.EDAMAM_API_ID || "";
const API_KEY = process.env.EDAMAM_API_KEY || "";
const TYPE = "public";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const params = new URLSearchParams();
  params.set("app_id", APP_ID);
  params.set("app_key", API_KEY);
  params.set("type", TYPE);

  for (const [key, value] of searchParams.entries()) {
    params.append(key, value);
  }

  const url = `${API_BASE}?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json(
        { error: `API error: ${response.statusText}` },
        { status: response.status }
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
