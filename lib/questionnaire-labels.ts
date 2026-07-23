import { sections } from "@/content/questionnaire";

/**
 * Mappa id domanda → opzioni, costruita dalla stessa fonte di verità della UI
 * (content/questionnaire.ts) così le label italiane usate altrove (Sheets,
 * email) restano sempre allineate a quelle mostrate nel form.
 */
const optionsByQuestion = new Map<string, { value: string; label: string }[]>();
for (const section of sections) {
  for (const question of section.questions) {
    if (question.options) optionsByQuestion.set(question.id, question.options);
  }
}

export function getOptionLabel(questionId: string, value: string | undefined): string {
  if (!value) return "";
  const options = optionsByQuestion.get(questionId);
  return options?.find((o) => o.value === value)?.label ?? value;
}

export function getOptionLabels(questionId: string, values: string[] | undefined): string[] {
  return (values ?? []).map((value) => getOptionLabel(questionId, value));
}
