"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FieldRenderer } from "@/components/questionnaire/FieldRenderer";
import type { StepQuestion } from "@/lib/questionnaire-steps";
import { motion as motionTokens } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: StepQuestion;
  index: number;
  total: number;
  value: unknown;
  onChange: (value: unknown) => void;
  onNext: (overrideValue?: unknown) => void;
  onBack: () => void;
  canGoBack: boolean;
  error: string | null;
  autoAdvance: boolean;
}

export function QuestionCard({
  question,
  index,
  total,
  value,
  onChange,
  onNext,
  onBack,
  canGoBack,
  error,
  autoAdvance,
}: QuestionCardProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: motionTokens.stepDuration, ease: motionTokens.ease }}
      className="flex w-full max-w-xl flex-col gap-8"
    >
      <div className="flex flex-col gap-2">
        {question.isFirstOfSection && (
          <p className="text-sm font-medium uppercase tracking-wide text-accent-600">
            {question.sectionTitle}
          </p>
        )}
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
            {question.label}
            {question.required && <span className="ml-1.5 text-accent-500">*</span>}
          </h2>
        </div>
        {question.guida && <p className="text-base text-neutral-500">{question.guida}</p>}
      </div>

      <FieldRenderer
        question={question}
        value={value}
        onChange={(v) => {
          onChange(v);
          if (autoAdvance) onNext(v);
        }}
        onSubmit={() => onNext()}
      />

      {error && (
        <motion.p
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm font-medium text-error"
        >
          {error}
        </motion.p>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          className={cn(
            "flex items-center gap-1.5 text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-700",
            !canGoBack && "invisible"
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Indietro
        </button>

        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-400">
            {index + 1} / {total}
          </span>
          <button
            type="button"
            onClick={() => onNext()}
            className="flex items-center gap-1.5 rounded-full bg-accent-300 px-5 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-accent-400"
          >
            {index === total - 1 ? "Continua" : "Avanti"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      {(question.type === "text-short" || question.type === "email") && (
        <p className="text-xs text-neutral-300">Premi Invio ↵</p>
      )}
    </motion.div>
  );
}
