"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Questionario } from "@/lib/schema";

type DeadlineValue = NonNullable<Questionario["scadenza"]>;

interface DeadlineFieldProps {
  value: DeadlineValue;
  onChange: (value: DeadlineValue) => void;
}

export function DeadlineField({ value, onChange }: DeadlineFieldProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        type="date"
        value={value.data ?? ""}
        onChange={(e) => onChange({ ...value, data: e.target.value })}
        className="h-14 w-full max-w-xs border-0 border-b-2 border-neutral-200 rounded-none px-1 text-lg focus-visible:ring-0 focus-visible:border-accent-400"
      />
      <Textarea
        value={value.note ?? ""}
        onChange={(e) => onChange({ ...value, note: e.target.value })}
        placeholder="Note sulla scadenza (facoltativo)"
        rows={2}
        className="resize-none border-0 border-b-2 border-neutral-200 rounded-none px-1 focus-visible:ring-0 focus-visible:border-accent-400"
      />
    </div>
  );
}
