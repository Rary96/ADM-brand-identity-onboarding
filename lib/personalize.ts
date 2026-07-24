/**
 * Interpolazione del token `{{azienda}}` nei testi di content/questionnaire.ts
 * (section intro, midFormReminder, outroCopy) col nome azienda inserito in
 * Sezione 1 — sempre disponibile da lì in poi, essendo `nomeAzienda` un campo
 * obbligatorio validato prima di poter avanzare.
 */
export function personalize(template: string, nomeAzienda: string): string {
  return template.replace(/\{\{azienda\}\}/g, nomeAzienda.trim());
}
