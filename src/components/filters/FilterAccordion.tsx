"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FilterAccordionProps {
  value: string;
  title: string;
  children: React.ReactNode;
}

export function FilterAccordion({
  value,
  title,
  children,
}: FilterAccordionProps) {
  return (
    <AccordionItem value={value} className="border-b border-border">
      <AccordionTrigger className="py-3 text-base font-medium text-foreground hover:no-underline hover:text-primary">
        {title}
      </AccordionTrigger>
      <AccordionContent className="pb-4">{children}</AccordionContent>
    </AccordionItem>
  );
}
