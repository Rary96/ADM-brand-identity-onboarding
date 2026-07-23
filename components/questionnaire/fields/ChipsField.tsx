"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChipsFieldProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  altro?: string;
  onAltroChange?: (value: string) => void;
  altroLabel?: string;
}

/**
 * Input a "chip": digita e premi Invio (o virgola) per aggiungere un tag.
 * Usato per i campi array liberi dello schema (valori, canaliVendita,
 * supportiEVincoli.supporti, formatiRichiesti) — lo schema li accetta come
 * z.array(z.string()) senza enum fissa, quindi il testo libero è corretto.
 */
export function ChipsField({
  values,
  onChange,
  placeholder,
  suggestions,
  altro,
  onAltroChange,
  altroLabel,
}: ChipsFieldProps) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addChip(raw: string) {
    const chip = raw.trim();
    if (!chip || values.includes(chip)) return;
    onChange([...values, chip]);
    setDraft("");
  }

  function removeChip(chip: string) {
    onChange(values.filter((v) => v !== chip));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-neutral-200 p-3 focus-within:border-accent-400">
        {values.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-3 py-1 text-sm text-neutral-800"
          >
            {chip}
            <button
              type="button"
              onClick={() => removeChip(chip)}
              aria-label={`Rimuovi ${chip}`}
              className="text-neutral-500 hover:text-neutral-800"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          data-testid="chip-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addChip(draft);
            } else if (e.key === "Backspace" && draft === "" && values.length > 0) {
              removeChip(values[values.length - 1]);
            }
          }}
          onBlur={() => addChip(draft)}
          placeholder={values.length === 0 ? placeholder : ""}
          className="min-w-[8ch] flex-1 border-0 bg-transparent p-1 text-base outline-none placeholder:text-neutral-400"
        />
      </div>

      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions
            .filter((s) => !values.includes(s))
            .map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addChip(s)}
                className={cn(
                  "rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-600 transition-colors",
                  "hover:border-accent-300 hover:bg-accent-50"
                )}
              >
                + {s}
              </button>
            ))}
        </div>
      )}

      {onAltroChange && (
        <Textarea
          value={altro ?? ""}
          onChange={(e) => onAltroChange(e.target.value)}
          placeholder={altroLabel ?? "Altro (facoltativo)"}
          rows={2}
          className="resize-none border-0 border-b-2 border-neutral-200 rounded-none px-1 text-base focus-visible:ring-0 focus-visible:border-accent-400"
        />
      )}
    </div>
  );
}
