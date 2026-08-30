"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AdMediaProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  aspect?: string; // e.g. "aspect-[4/3]"
  rounded?: string;
}

export function AdMedia({ src, alt, sizes, priority, className, aspect = "aspect-[4/3]", rounded = "rounded-xl" }: AdMediaProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={cn("ad-image flex items-center justify-center bg-stone text-ink-muted", aspect, rounded, className)}>
        <span className="text-xs tracking-wide">Partner image unavailable</span>
      </div>
    );
  }

  return (
    <div className={cn("ad-image relative overflow-hidden bg-stone", aspect, rounded, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-500 ease-out group-hover/ad:scale-[1.03]"
        onError={() => setError(true)}
      />
    </div>
  );
}
