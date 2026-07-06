import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recipes | TelmaFood",
  description:
    "Search and filter recipes by cuisine, diet, meal type, and more.",
};

export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
