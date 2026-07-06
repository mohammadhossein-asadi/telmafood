import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Recipes | TelmaFood",
  description: "Your saved recipe collection.",
};

export default function SavedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
