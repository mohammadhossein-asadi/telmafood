import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recipe Details | TelmaFood",
  description: "View recipe details, ingredients, and cooking instructions.",
};

export default function RecipeDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
