import { z } from "zod";
import type { StepQuestion } from "@/lib/questionnaire-steps";

const emailSchema = z.string().email();
const urlSchema = z.string().url();

/**
 * Validazione "leggera" per singolo step del wizard (solo campi obbligatori
 * di contenuto). La validazione completa e definitiva avviene a fine form
 * con `questionarioSchema` (lib/schema.ts) prima dell'invio.
 */
export function validateStep(
  question: StepQuestion,
  value: unknown,
  hasAttachment = false
): string | null {
  if (!question.required) return null;

  switch (question.id) {
    case "valori": {
      const v = value as { selezionati?: string[]; altro?: string } | undefined;
      const hasValue =
        (v?.selezionati && v.selezionati.length > 0) ||
        (v?.altro && v.altro.trim().length > 0);
      return hasValue ? null : "Indica almeno un valore";
    }
    case "loghiRiferimento": {
      const v = value as { urls?: string[]; note?: string } | undefined;
      const hasValue =
        (v?.urls && v.urls.length > 0) || (v?.note && v.note.trim().length > 0) || hasAttachment;
      return hasValue ? null : "Aggiungi almeno un riferimento (link o allegato)";
    }
    default:
      break;
  }

  switch (question.type) {
    case "email": {
      if (typeof value !== "string" || value.trim().length === 0) {
        return "Campo obbligatorio";
      }
      return emailSchema.safeParse(value).success ? null : "Email non valida";
    }
    case "single-choice":
      return value ? null : "Seleziona un'opzione";
    case "text-short":
    case "text-long":
      return typeof value === "string" && value.trim().length > 0
        ? null
        : "Campo obbligatorio";
    case "upload": {
      const v = value as { urls?: string[]; note?: string } | undefined;
      const hasValue =
        (v?.urls && v.urls.length > 0) || (v?.note && v.note.trim().length > 0) || hasAttachment;
      return hasValue ? null : "Campo obbligatorio";
    }
    default:
      return null;
  }
}

export function isValidUrl(value: string): boolean {
  return urlSchema.safeParse(value).success;
}
