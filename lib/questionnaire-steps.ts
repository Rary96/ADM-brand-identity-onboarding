import { sections, type Question } from "@/content/questionnaire";
import type { Questionario } from "@/lib/schema";

export interface StepQuestion extends Question {
  sectionId: string;
  sectionTitle: string;
  sectionIntro?: string;
  isFirstOfSection: boolean;
}

/** Elenco piatto delle domande visibili, filtrato in base al branching nuovo brand / restyling. */
export function buildSteps(
  tipoProgetto: Questionario["tipoProgetto"] | undefined
): StepQuestion[] {
  const steps: StepQuestion[] = [];

  for (const section of sections) {
    let isFirst = true;
    for (const question of section.questions) {
      if (question.visibleIf && question.visibleIf.equals !== tipoProgetto) {
        continue;
      }
      steps.push({
        ...question,
        sectionId: section.id,
        sectionTitle: section.title,
        sectionIntro: section.intro,
        isFirstOfSection: isFirst,
      });
      isFirst = false;
    }
  }

  return steps;
}
