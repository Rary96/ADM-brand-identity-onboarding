"use client";

import { createContext, useContext } from "react";

export interface AttachmentItem {
  id: string;
  fieldId: string;
  file: File;
}

export interface AttachmentsContextValue {
  attachments: AttachmentItem[];
  remainingSlots: number;
  addAttachment: (fieldId: string, file: File) => string | null;
  removeAttachment: (id: string) => void;
}

export const AttachmentsContext = createContext<AttachmentsContextValue | null>(null);

/**
 * Espone solo gli allegati del campo richiesto, ma addAttachment/remainingSlots
 * riflettono il tetto GLOBALE condiviso tra tutti i campi upload del form.
 * Context invece di prop-drilling attraverso QuestionCard/FieldRenderer, che
 * restano dispatcher generici e non devono sapere nulla di allegati.
 */
export function useFieldAttachments(fieldId: string) {
  const ctx = useContext(AttachmentsContext);
  if (!ctx) {
    throw new Error("useFieldAttachments deve essere usato dentro AttachmentsContext.Provider");
  }
  return {
    files: ctx.attachments.filter((a) => a.fieldId === fieldId),
    remainingSlots: ctx.remainingSlots,
    addAttachment: (file: File) => ctx.addAttachment(fieldId, file),
    removeAttachment: ctx.removeAttachment,
  };
}
