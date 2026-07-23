/**
 * Limiti per gli allegati diretti via email (alternativa al link incollato).
 * Tetto GLOBALE su tutta la submission, non per singolo campo upload: il body
 * di una funzione serverless è limitato (~4.5MB su Vercel) sull'intera
 * richiesta, quindi 3 campi upload con 2 file ciascuno supererebbero il
 * limite. Stessi valori usati per la validazione client (UX immediata) e
 * server (mai fidarsi solo del client).
 */
export const MAX_ATTACHMENTS = 2;
export const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024; // 2MB

export const ALLOWED_ATTACHMENT_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
];

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

/** Allegato già estratto e validato server-side, pronto per Sheets/email. */
export interface ParsedAttachment {
  filename: string;
  content: Buffer;
  fieldId: string;
}
