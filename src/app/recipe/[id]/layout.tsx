import type { Metadata } from "next";
import { fetchRecipeById } from "@/lib/api/edamam";
import { extractIdFromUri } from "@/lib/api/edamam";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const data = await fetchRecipeById(id);
    const recipe = data.recipe || data;
    
    if (!recipe) {
      return {
        title: "Recipe Not Found | TelmaFood",
        description: "The recipe you're looking for doesn't exist or has been removed.",
      };
    }

    const bestImage =
      recipe.images?.LARGE?.url ||
      recipe.images?.REGULAR?.url ||
      recipe.images?.SMALL?.url ||
      recipe.images?.THUMBNAIL?.url ||
      recipe.image;

    const recipeId = extractIdFromUri(recipe.uri);
    const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://telmafood.com"}/recipe/${encodeURIComponent(recipeId)}`;

    return {
      title: `${recipe.label} | TelmaFood`,
      description: `View the complete recipe for ${recipe.label} including ingredients, cooking instructions, and nutrition information. From ${recipe.source}.`,
      openGraph: {
        type: "website",
        locale: "en_US",
        siteName: "TelmaFood",
        title: `${recipe.label} | TelmaFood`,
        description: `View the complete recipe for ${recipe.label} including ingredients, cooking instructions, and nutrition information.`,
        url: canonicalUrl,
        images: bestImage ? [
          {
            url: bestImage,
            width: 1200,
            height: 630,
            alt: recipe.label,
          },
        ] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${recipe.label} | TelmaFood`,
        description: `View the complete recipe for ${recipe.label} including ingredients, cooking instructions, and nutrition information.`,
        images: bestImage ? [bestImage] : [],
      },
      robots: {
        index: true,
        follow: true,
      },
      other: {
        "recipe:id": recipeId,
        "recipe:source": recipe.source,
      },
    };
  } catch {
    return {
      title: "Recipe Details | TelmaFood",
      description: "View recipe details, ingredients, and cooking instructions.",
    };
  }
}

export default function RecipeDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
