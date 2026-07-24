"use client";

import { Textarea } from "@/components/ui/textarea";
import { PillMultiSelectField } from "@/components/questionnaire/fields/PillMultiSelectField";
import type { Question } from "@/content/questionnaire";
import type { Questionario } from "@/lib/schema";

type SupportsValue = NonNullable<Questionario["supportiEVincoli"]>;

interface SupportsFieldProps {
  options: NonNullable<Question["options"]>;
  value: SupportsValue;
  onChange: (value: SupportsValue) => void;
}

export function SupportsField({ options, value, onChange }: SupportsFieldProps) {
  return (
    <div className="flex flex-col gap-6">
      <PillMultiSelectField
        options={options}
        values={value.supporti.selezionati}
        onChange={(selezionati) =>
          onChange({ ...value, supporti: { ...value.supporti, selezionati } })
        }
      />
      <Textarea
        value={value.supporti.altro ?? ""}
        onChange={(e) =>
          onChange({ ...value, supporti: { ...value.supporti, altro: e.target.value } })
        }
        placeholder="Altro supporto non in lista (facoltativo)"
        rows={2}
        className="resize-none border-0 border-b-2 border-neutral-200 rounded-none px-1 focus-visible:ring-0 focus-visible:border-accent-400"
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
