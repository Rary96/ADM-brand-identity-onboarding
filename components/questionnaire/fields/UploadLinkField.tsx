"use client";

import { useRef, useState } from "react";
import { Paperclip, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { isValidUrl } from "@/lib/validate-step";
import { cn } from "@/lib/utils";
import { useFieldAttachments } from "@/components/questionnaire/AttachmentsContext";
import { ALLOWED_ATTACHMENT_TYPES, MAX_ATTACHMENT_BYTES, formatBytes } from "@/lib/attachment-limits";

interface UploadOrLinkValue {
  urls: string[];
  note?: string;
}

interface UploadLinkFieldProps {
  fieldId: string;
  value: UploadOrLinkValue;
  onChange: (value: UploadOrLinkValue) => void;
}

/**
 * Due modi per fornire un riferimento: allegare direttamente un file piccolo
 * (max 2 in totale su tutta la submission, 2MB ciascuno — inviati come
 * allegati nell'email interna, non su Drive) oppure incollare un link
 * (Drive/WeTransfer/SwissTransfer/Pinterest/ecc.) per file più grandi o
 * numerosi, senza limiti.
 */
export function UploadLinkField({ fieldId, value, onChange }: UploadLinkFieldProps) {
  const [draft, setDraft] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [attachError, setAttachError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { files, remainingSlots, addAttachment, removeAttachment } = useFieldAttachments(fieldId);

  function addUrl() {
    const url = draft.trim();
    if (!url) return;
    if (!isValidUrl(url)) {
      setUrlError("Inserisci un link valido (es. https://...)");
      return;
    }
    onChange({ ...value, urls: [...value.urls, url] });
    setDraft("");
    setUrlError(null);
  }

  function removeUrl(url: string) {
    onChange({ ...value, urls: value.urls.filter((u) => u !== url) });
  }

  function handleFilePicked(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    const message = addAttachment(file);
    setAttachError(message);
    // Allegare un file non tocca urls/note: senza questo, se l'utente non
    // interagisce mai con l'input link, `answers[question.id]` resta
    // `undefined` e la validazione finale Zod fallisce (il campo è un
    // oggetto richiesto, non un array vuoto di default).
    if (!message) onChange(value);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
              setUrlError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
            placeholder="Incolla un link (Drive, WeTransfer, Pinterest, sito...)"
            className={cn(
              "h-11 border-0 border-b-2 border-neutral-200 rounded-none px-1 focus-visible:ring-0 focus-visible:border-accent-400",
              urlError && "border-error"
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
        {urlError && <p className="text-sm text-error">{urlError}</p>}
      </div>

      <div className="flex flex-col gap-2">
        {files.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between gap-2 rounded-lg border border-accent-200 bg-accent-50 px-3 py-2 text-sm text-neutral-700"
          >
            <span className="flex min-w-0 items-center gap-2">
              <Paperclip className="h-4 w-4 shrink-0 text-accent-600" />
              <span className="truncate">{attachment.file.name}</span>
              <span className="shrink-0 text-neutral-400">
                {formatBytes(attachment.file.size)}
              </span>
            </span>
            <button
              type="button"
              onClick={() => removeAttachment(attachment.id)}
              aria-label="Rimuovi allegato"
              className="shrink-0 text-neutral-400 hover:text-neutral-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {remainingSlots > 0 ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_ATTACHMENT_TYPES.join(",")}
              className="hidden"
              onChange={(e) => handleFilePicked(e.target.files)}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 self-start rounded-lg border border-dashed border-neutral-300 px-3 py-2 text-sm text-neutral-500 hover:border-accent-300 hover:text-accent-600"
            >
              <Paperclip className="h-4 w-4" />
              Allega un file ({remainingSlots} rimasti in totale su tutto il form)
            </button>
            <p className="text-xs text-neutral-400">
              JPG, PNG, WEBP, SVG o PDF — max {formatBytes(MAX_ATTACHMENT_BYTES)} ciascuno. Per file
              più grandi o numerosi usa un link qui sopra.
            </p>
          </>
        ) : (
          <p className="text-sm text-neutral-400">
            Limite di allegati diretti raggiunto — usa un link qui sopra per altri file.
          </p>
        )}
        {attachError && <p className="text-sm text-error">{attachError}</p>}
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
