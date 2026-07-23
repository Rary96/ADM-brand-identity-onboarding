"use client";

import { motion } from "framer-motion";
import { motion as motionTokens } from "@/lib/design-tokens";

interface ProgressBarProps {
  progress: number; // 0-100
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="fixed left-0 top-0 z-20 h-1.5 w-full bg-neutral-100">
      <motion.div
        className="h-full bg-accent-300"
        initial={false}
        animate={{ width: `${progress}%` }}
        transition={{ duration: motionTokens.stepDuration, ease: motionTokens.ease }}
      />
    </div>
  );
}
