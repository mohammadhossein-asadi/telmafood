import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.edamam.com/api/recipes/v2";
const APP_ID = process.env.EDAMAM_API_ID || "";
const API_KEY = process.env.EDAMAM_API_KEY || "";
const TYPE = "public";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = `${API_BASE}/${id}?app_id=${APP_ID}&app_key=${API_KEY}&type=${TYPE}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const message =
        response.status === 429
          ? "We've hit our recipe provider's rate limit. Please try again in a minute."
          : `Recipe provider error: ${response.statusText}`;
      return NextResponse.json({ error: message }, { status: response.status });
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch recipe" },
      { status: 500 }
    );
  }
}
