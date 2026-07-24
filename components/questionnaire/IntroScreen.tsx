"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { introCopy } from "@/content/questionnaire";
import { motion as motionTokens } from "@/lib/design-tokens";

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: motionTokens.stepDuration, ease: motionTokens.ease }}
      className="flex w-full max-w-xl flex-col gap-6 text-center sm:text-left"
    >
      <h1 className="text-3xl font-semibold text-neutral-900 sm:text-4xl">
        {introCopy.titolo}
      </h1>
      <p className="text-lg text-neutral-500">{introCopy.sottotitolo}</p>
      <p className="text-sm font-medium text-accent-600">
        Tempo stimato: {introCopy.tempoStimato}
      </p>
      <ul className="flex flex-col gap-2 text-left text-sm text-neutral-500">
        {introCopy.punti.map((punto) => (
          <li key={punto} className="flex gap-2.5">
            <span className="mt-0.5 text-accent-500" aria-hidden="true">
              —
            </span>
            <span>{punto}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onStart}
        className="mx-auto flex items-center gap-2 rounded-full bg-accent-300 px-6 py-3 text-base font-semibold text-neutral-900 transition-colors hover:bg-accent-400 sm:mx-0"
      >
        {introCopy.bottone}
        <ArrowRight className="h-4 w-4" />
      </button>
      <p className="text-sm text-neutral-400">
        {introCopy.nota}{" "}
        <Link
          href="/informativa-privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent-600 underline underline-offset-2 hover:text-accent-700"
        >
          Leggi l&apos;informativa privacy
        </Link>
        .
      </p>
    </motion.div>
  );
}
