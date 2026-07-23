"use client";

import { cn } from "@/lib/utils";
import type { Question } from "@/content/questionnaire";

interface PillMultiSelectProps {
  options: NonNullable<Question["options"]>;
  values: string[];
  onChange: (values: string[]) => void;
  max?: number;
}

export function PillMultiSelectField({ options, values, onChange, max }: PillMultiSelectProps) {
  function toggle(value: string) {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
      return;
    }
    if (max && values.length >= max) {
      onChange([...values.slice(1), value]);
      return;
    }
    onChange([...values, value]);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2.5">
        {options.map((opt) => {
          const selected = values.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                selected
                  ? "border-accent-400 bg-accent-300 text-neutral-900"
                  : "border-neutral-200 text-neutral-600 hover:border-accent-300 hover:bg-accent-50"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {max && (
        <p className="text-sm text-neutral-400">
          {values.length}/{max} selezionati
        </p>
      )}
    </div>
  );
}
