"use client";

import { Textarea } from "@/components/ui/textarea";
import { ChipsField } from "@/components/questionnaire/fields/ChipsField";
import type { Questionario } from "@/lib/schema";

type SupportsValue = NonNullable<Questionario["supportiEVincoli"]>;

interface SupportsFieldProps {
  value: SupportsValue;
  onChange: (value: SupportsValue) => void;
}

const suggestions = [
  "Sito web",
  "Social media",
  "Packaging",
  "Insegna negozio",
  "Divise/uniformi",
  "Stampa (biglietti, flyer)",
];

export function SupportsField({ value, onChange }: SupportsFieldProps) {
  return (
    <div className="flex flex-col gap-6">
      <ChipsField
        values={value.supporti}
        onChange={(supporti) => onChange({ ...value, supporti })}
        placeholder="Aggiungi un supporto e premi Invio"
        suggestions={suggestions}
      />
      <Textarea
        value={value.vincoliTecnici ?? ""}
        onChange={(e) => onChange({ ...value, vincoliTecnici: e.target.value })}
        placeholder="Vincoli tecnici o normativi (facoltativo)"
        rows={3}
        className="resize-none border-0 border-b-2 border-neutral-200 rounded-none px-1 focus-visible:ring-0 focus-visible:border-accent-400"
      />
    </div>
  );
}
