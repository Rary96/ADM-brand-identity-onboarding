"use client";

import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import type { Questionario } from "@/lib/schema";

type ToneValue = NonNullable<Questionario["toneEParole"]>;

interface ToneScaleFieldProps {
  value: ToneValue;
  onChange: (value: ToneValue) => void;
}

const axes: { key: keyof ToneValue; left: string; right: string }[] = [
  { key: "formaleInformale", left: "Formale", right: "Informale" },
  { key: "tecnicoSemplice", left: "Tecnico", right: "Semplice" },
  { key: "serioIronico", left: "Serio", right: "Ironico" },
];

export function ToneScaleField({ value, onChange }: ToneScaleFieldProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        {axes.map((axis) => (
          <div key={axis.key} className="flex flex-col gap-2">
            <Slider
              value={[(value[axis.key] as number | undefined) ?? 50]}
              onValueChange={([v]) => onChange({ ...value, [axis.key]: v })}
              max={100}
              step={1}
            />
            <div className="flex justify-between text-sm text-neutral-500">
              <span>{axis.left}</span>
              <span>{axis.right}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-neutral-500">Parole che usereste sempre</label>
          <Input
            value={value.paroleSempre ?? ""}
            onChange={(e) => onChange({ ...value, paroleSempre: e.target.value })}
            placeholder="es. concreto, insieme"
            className="h-11 border-0 border-b-2 border-neutral-200 rounded-none px-1 focus-visible:ring-0 focus-visible:border-accent-400"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-neutral-500">Parole che non usereste mai</label>
          <Input
            value={value.paroleMai ?? ""}
            onChange={(e) => onChange({ ...value, paroleMai: e.target.value })}
            placeholder="es. leader, disruptive"
            className="h-11 border-0 border-b-2 border-neutral-200 rounded-none px-1 focus-visible:ring-0 focus-visible:border-accent-400"
          />
        </div>
      </div>
    </div>
  );
}
