"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { motion as motionTokens } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

interface ConsentStepProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  onSubmit: () => void;
  onBack: () => void;
  error: string | null;
  submitting: boolean;
}

export function ConsentStep({
  checked,
  onChange,
  onSubmit,
  onBack,
  error,
  submitting,
}: ConsentStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: motionTokens.stepDuration, ease: motionTokens.ease }}
      className="flex w-full max-w-xl flex-col gap-8"
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-wide text-accent-600">
          Ultimo passo
        </p>
        <h2 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
          Un'ultima cosa prima di inviare
        </h2>
      </div>

      <label
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3.5 text-left text-sm text-neutral-600 transition-colors",
          checked ? "border-accent-400 bg-accent-50" : "border-neutral-200"
        )}
      >
        <Checkbox
          checked={checked}
          onCheckedChange={(v) => onChange(v === true)}
          className="mt-0.5 data-[state=checked]:border-accent-400 data-[state=checked]:bg-accent-300"
        />
        <span>
          Ho letto e accetto{" "}
          <Link
            href="/informativa-privacy"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-medium text-accent-600 underline underline-offset-2 hover:text-accent-700"
          >
            l&apos;informativa privacy
          </Link>
          . Acconsento al trattamento dei miei dati per la gestione del progetto di brand
          identity, nel rispetto del GDPR.
        </span>
      </label>

      {error && <p className="text-sm font-medium text-error">{error}</p>}

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Indietro
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="flex items-center gap-1.5 rounded-full bg-accent-300 px-5 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-accent-400 disabled:opacity-60"
        >
          {submitting ? "Invio..." : "Invia le risposte"}
          <Send className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
