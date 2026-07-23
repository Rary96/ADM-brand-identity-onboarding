"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { outroCopy } from "@/content/questionnaire";
import { motion as motionTokens } from "@/lib/design-tokens";

export function OutroScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionTokens.stepDuration, ease: motionTokens.ease }}
      className="flex w-full max-w-xl flex-col items-center gap-5 text-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-100">
        <Check className="h-7 w-7 text-accent-600" />
      </span>
      <h1 className="text-3xl font-semibold text-neutral-900">{outroCopy.titolo}</h1>
      <p className="text-lg text-neutral-500">{outroCopy.corpo}</p>
    </motion.div>
  );
}
