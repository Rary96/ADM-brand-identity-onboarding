"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import type { Questionario } from "@/lib/schema";

type ColorValue = NonNullable<Questionario["colori"]>;

interface ColorFieldProps {
  value: ColorValue;
  onChange: (value: ColorValue) => void;
}

function ColorList({
  label,
  colors,
  onAdd,
  onRemove,
}: {
  label: string;
  colors: string[];
  onAdd: (hex: string) => void;
  onRemove: (hex: string) => void;
}) {
  const [picker, setPicker] = useState("#C6C2CD");
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-neutral-500">{label}</p>
      <div className="flex flex-wrap items-center gap-2">
        {colors.map((hex) => (
          <span
            key={hex}
            className="group relative inline-flex items-center gap-2 rounded-full border border-neutral-200 py-1 pl-1 pr-3 text-sm"
          >
            <span
              className="h-5 w-5 rounded-full border border-neutral-200"
              style={{ backgroundColor: hex }}
            />
            {hex}
            <button
              type="button"
              onClick={() => onRemove(hex)}
              aria-label={`Rimuovi ${hex}`}
              className="text-neutral-400 hover:text-neutral-800"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
        <div className="flex items-center gap-1.5 rounded-full border border-dashed border-neutral-300 py-1 pl-1.5 pr-2.5">
          <input
            type="color"
            value={picker}
            onChange={(e) => setPicker(e.target.value)}
            className="h-6 w-6 cursor-pointer rounded-full border-0 bg-transparent p-0"
          />
          <button
            type="button"
            onClick={() => onAdd(picker)}
            className="text-sm text-neutral-500 hover:text-accent-600"
          >
            Aggiungi
          </button>
        </div>
      </div>
    </div>
  );
}

export function ColorField({ value, onChange }: ColorFieldProps) {
  return (
    <div className="flex flex-col gap-6">
      <ColorList
        label="Colori che ami"
        colors={value.preferiti}
        onAdd={(hex) =>
          !value.preferiti.includes(hex) &&
          onChange({ ...value, preferiti: [...value.preferiti, hex] })
        }
        onRemove={(hex) =>
          onChange({ ...value, preferiti: value.preferiti.filter((c) => c !== hex) })
        }
      />
      <ColorList
        label="Colori da evitare"
        colors={value.daEvitare}
        onAdd={(hex) =>
          !value.daEvitare.includes(hex) &&
          onChange({ ...value, daEvitare: [...value.daEvitare, hex] })
        }
        onRemove={(hex) =>
          onChange({ ...value, daEvitare: value.daEvitare.filter((c) => c !== hex) })
        }
      />
      <Textarea
        value={value.note ?? ""}
        onChange={(e) => onChange({ ...value, note: e.target.value })}
        placeholder="Vincoli aziendali/settoriali sul colore (facoltativo)"
        rows={2}
        className="resize-none border-0 border-b-2 border-neutral-200 rounded-none px-1 focus-visible:ring-0 focus-visible:border-accent-400"
      />
    </div>
  );
}
