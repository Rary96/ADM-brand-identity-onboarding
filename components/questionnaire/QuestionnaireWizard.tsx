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
import {
  AttachmentsContext,
  type AttachmentItem,
} from "@/components/questionnaire/AttachmentsContext";
import {
  ALLOWED_ATTACHMENT_TYPES,
  MAX_ATTACHMENTS,
  MAX_ATTACHMENT_BYTES,
  formatBytes,
} from "@/lib/attachment-limits";

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
  const [submissionId] = useState(() => crypto.randomUUID());
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);

  function addAttachment(fieldId: string, file: File): string | null {
    if (attachments.length >= MAX_ATTACHMENTS) {
      return "Limite di 2 allegati diretti raggiunto — usa un link per altri file.";
    }
    if (file.size > MAX_ATTACHMENT_BYTES) {
      return `File troppo pesante (max ${formatBytes(MAX_ATTACHMENT_BYTES)}) — usa un link per file più grandi.`;
    }
    if (!ALLOWED_ATTACHMENT_TYPES.includes(file.type)) {
      return "Formato non supportato per l'allegato diretto — usa un link.";
    }
    setAttachments((prev) => [...prev, { id: crypto.randomUUID(), fieldId, file }]);
    return null;
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }

  const attachmentsContextValue = {
    attachments,
    remainingSlots: MAX_ATTACHMENTS - attachments.length,
    addAttachment,
    removeAttachment,
  };

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
    const hasAttachment = attachments.some((a) => a.fieldId === question.id);
    const message = validateStep(question, value, hasAttachment);
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

  async function handleSubmit() {
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
    setError(null);
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(result.data));
      formData.append(
        "meta",
        JSON.stringify({ submissionId, submittedAt: new Date().toISOString() })
      );
      attachments.forEach((attachment, i) => {
        formData.append(`attachment_${i}`, attachment.file, attachment.file.name);
        formData.append(`attachment_${i}_field`, attachment.fieldId);
      });

      const response = await fetch("/api/submit", { method: "POST", body: formData });
      if (!response.ok) throw new Error("submit failed");
      setPhase("outro");
    } catch {
      setError("Non siamo riusciti a inviare le risposte. Riprova.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AttachmentsContext.Provider value={attachmentsContextValue}>
    <div className="flex min-h-dvh flex-col items-center bg-white px-5 py-10 sm:px-6 sm:py-16 lg:py-24">
      {phase !== "intro" && <ProgressBar progress={progress} />}

      <AnimatePresence>
        {reminder && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed left-1/2 top-6 z-30 max-w-[calc(100%-2rem)] -translate-x-1/2 text-balance rounded-full bg-accent-100 px-4 py-2 text-center text-sm font-medium text-accent-700 shadow-sm sm:max-w-sm"
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
    </AttachmentsContext.Provider>
  );
}
