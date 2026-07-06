"use client";

import { Label } from "@/components/ui/label";

interface FilterRadioOption {
  label: string;
  value: string;
}

interface FilterRadioProps {
  name: string;
  options: FilterRadioOption[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterRadio({ name, options, value, onChange }: FilterRadioProps) {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-2 py-1">
          <input
            type="radio"
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 text-primary border-border focus:ring-primary"
          />
          <Label
            htmlFor={`${name}-${option.value}`}
            className="text-sm text-foreground cursor-pointer"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  );
}
