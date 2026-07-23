"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { questionarioSchema, type Questionario } from "@/lib/schema";
import { buildSteps } from "@/lib/questionnaire-steps";
import { validateStep } from "@/lib/validate-step";
import { midFormReminder } from "@/content/questionnaire";
import { ProgressBar } from "@/components/questionnaire/ProgressBar";
import { IntroScreen } from "@/components/questionnaire/IntroScreen";
import { OutroScreen } from "@/components/questionnaire/OutroScreen";
import { QuestionCard } from "@/components/questionnaire/QuestionCard";
import { ConsentStep } from "@/components/questionnaire/ConsentStep";

type Phase = "intro" | "question" | "consent" | "outro";

type Answers = Partial<Record<string, unknown>>;

export function QuestionnaireWizard() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Answers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reminder, setReminder] = useState(false);
  const hasShownReminder = useRef(false);
  const reminderTimeout = useRef<ReturnType<typeof setTimeout>>();

  const tipoProgetto = answers.tipoProgetto as Questionario["tipoProgetto"] | undefined;
  const steps = useMemo(() => buildSteps(tipoProgetto), [tipoProgetto]);
  const totalSteps = steps.length + 1; // + step di consenso
  const question = steps[currentIndex];

  const halfwayIndex = Math.floor(steps.length / 2);

  // Il timeout di chiusura non deve essere ricreato/cancellato ad ogni cambio
  // di domanda: solo lo smontaggio del componente deve poterlo interrompere.
  useEffect(() => {
    if (
      phase === "question" &&
      currentIndex === halfwayIndex &&
      !hasShownReminder.current &&
      steps.length > 4
    ) {
      hasShownReminder.current = true;
      setReminder(true);
      reminderTimeout.current = setTimeout(() => setReminder(false), 4500);
    }
  }, [phase, currentIndex, halfwayIndex, steps.length]);

  useEffect(() => () => clearTimeout(reminderTimeout.current), []);

  const progress =
    phase === "outro"
      ? 100
      : phase === "consent"
        ? (steps.length / totalSteps) * 100
        : ((currentIndex + (phase === "intro" ? 0 : 0.5)) / totalSteps) * 100;

  function handleChange(value: unknown) {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    if (error) setError(null);
  }

  function handleNext(overrideValue?: unknown) {
    if (!question) return;
    const value = overrideValue !== undefined ? overrideValue : answers[question.id];
    const message = validateStep(question, value);
    if (message) {
      setError(message);
      return;
    }
    setError(null);
    if (currentIndex < steps.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setPhase("consent");
    }
  }

  function handleBack() {
    setError(null);
    if (phase === "consent") {
      setPhase("question");
      return;
    }
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    } else {
      setPhase("intro");
    }
  }

  function handleSubmit() {
    if (!consent) {
      setError("Devi accettare l'informativa privacy per continuare");
      return;
    }
    const payload = { ...answers, consensoPrivacy: consent };
    const result = questionarioSchema.safeParse(payload);
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const invalidIndex = steps.findIndex((s) => s.id === firstIssue?.path[0]);
      if (invalidIndex >= 0) {
        setCurrentIndex(invalidIndex);
        setPhase("question");
        setError(firstIssue.message);
        return;
      }
      setError(firstIssue?.message ?? "Controlla le risposte inserite");
      return;
    }

    setSubmitting(true);
    // L'invio a Google Sheets / Resend arriva nello step API successivo (vedi README).
    console.log("Questionario completato:", result.data);
    setTimeout(() => {
      setSubmitting(false);
      setPhase("outro");
    }, 600);
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-6 py-24">
      {phase !== "intro" && <ProgressBar progress={progress} />}

      <AnimatePresence>
        {reminder && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed left-1/2 top-6 z-30 -translate-x-1/2 rounded-full bg-accent-100 px-4 py-2 text-sm font-medium text-accent-700 shadow-sm"
          >
            {midFormReminder}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex w-full flex-1 items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <IntroScreen key="intro" onStart={() => setPhase("question")} />
          )}

          {phase === "question" && question && (
            <QuestionCard
              key={question.id}
              question={question}
              index={currentIndex}
              total={steps.length}
              value={answers[question.id]}
              onChange={handleChange}
              onNext={handleNext}
              onBack={handleBack}
              canGoBack
              error={error}
              autoAdvance={question.type === "single-choice"}
            />
          )}

          {phase === "consent" && (
            <ConsentStep
              key="consent"
              checked={consent}
              onChange={(v) => {
                setConsent(v);
                if (error) setError(null);
              }}
              onSubmit={handleSubmit}
              onBack={handleBack}
              error={error}
              submitting={submitting}
            />
          )}

          {phase === "outro" && <OutroScreen key="outro" />}
        </AnimatePresence>
      </div>
    </div>
  );
}
