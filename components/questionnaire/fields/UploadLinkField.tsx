"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { isValidUrl } from "@/lib/validate-step";
import { cn } from "@/lib/utils";

interface UploadOrLinkValue {
  urls: string[];
  note?: string;
}

interface UploadLinkFieldProps {
  value: UploadOrLinkValue;
  onChange: (value: UploadOrLinkValue) => void;
}

/**
 * L'upload diretto dei file su Google Drive arriva nello step API (vedi README).
 * In questa fase raccogliamo link (Drive, Pinterest, Instagram, ecc.) + note.
 */
export function UploadLinkField({ value, onChange }: UploadLinkFieldProps) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  function addUrl() {
    const url = draft.trim();
    if (!url) return;
    if (!isValidUrl(url)) {
      setError("Inserisci un link valido (es. https://...)");
      return;
    }
    onChange({ ...value, urls: [...value.urls, url] });
    setDraft("");
    setError(null);
  }

  function removeUrl(url: string) {
    onChange({ ...value, urls: value.urls.filter((u) => u !== url) });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {value.urls.map((url) => (
          <div
            key={url}
            className="flex items-center justify-between gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700"
          >
            <span className="truncate">{url}</span>
            <button
              type="button"
              onClick={() => removeUrl(url)}
              aria-label="Rimuovi link"
              className="shrink-0 text-neutral-400 hover:text-neutral-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
            placeholder="Incolla un link (Drive, Instagram, Pinterest, sito...)"
            className={cn(
              "h-11 border-0 border-b-2 border-neutral-200 rounded-none px-1 focus-visible:ring-0 focus-visible:border-accent-400",
              error && "border-error"
            )}
          />
          <button
            type="button"
            onClick={addUrl}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:border-accent-300 hover:text-accent-600"
            aria-label="Aggiungi link"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
      </div>

      <Textarea
        value={value.note ?? ""}
        onChange={(e) => onChange({ ...value, note: e.target.value })}
        placeholder="Note (facoltativo)"
        rows={2}
        className="resize-none border-0 border-b-2 border-neutral-200 rounded-none px-1 focus-visible:ring-0 focus-visible:border-accent-400"
      />
    </div>
  );
}
