"use client";

import { cn } from "@/lib/utils";
import type { Question } from "@/content/questionnaire";

interface PriceScaleProps {
  options: NonNullable<Question["options"]>;
  value?: string;
  onChange: (value: string) => void;
}

export function PriceScaleField({ options, value, onChange }: PriceScaleProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex w-full overflow-hidden rounded-lg border border-neutral-200">
        {options.map((opt, i) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "flex-1 border-r border-neutral-200 px-2 py-4 text-sm font-medium transition-colors last:border-r-0",
                selected
                  ? "bg-accent-300 text-neutral-900"
                  : "bg-white text-neutral-500 hover:bg-accent-50"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-neutral-400">
        <span>€</span>
        <span>€€€€</span>
      </div>
    </div>
  );
}
