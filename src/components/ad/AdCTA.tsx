import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdCTAProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "ink";
  onClick?: () => void;
  className?: string;
  placement?: string;
}

export function AdCTA({ href, children, variant = "primary", onClick, className }: AdCTAProps) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-11";

  const variants: Record<string, string> = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary-hover active:translate-y-px px-6 py-2.5 shadow-sm hover:shadow-md",
    ink: "bg-foreground text-background hover:bg-foreground/90 px-6 py-2.5",
    ghost:
      "bg-transparent text-foreground border border-border hover:bg-stone px-5 py-2.5",
  };

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(base, variants[variant], "group/cta", className)}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" aria-hidden />
    </Link>
  );
}
