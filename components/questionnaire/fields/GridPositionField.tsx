"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import type { Questionario } from "@/lib/schema";

type GridValue = NonNullable<Questionario["mappaPosizionamento"]>;

interface GridPositionFieldProps {
  value: GridValue | undefined;
  onChange: (value: GridValue) => void;
}

export function GridPositionField({ value, onChange }: GridPositionFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const current = value ?? { classicoInnovativo: 50, seriosaGiocosa: 50 };

  function setFromClientPoint(clientX: number, clientY: number) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    onChange({ classicoInnovativo: Math.round(x), seriosaGiocosa: Math.round(y) });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-center text-sm text-neutral-500">Seriosa</div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-500">Classico</span>
        <div
          ref={containerRef}
          onClick={(e) => setFromClientPoint(e.clientX, e.clientY)}
          className="relative aspect-square w-full max-w-sm cursor-crosshair rounded-lg border border-neutral-200 bg-[linear-gradient(to_right,theme(colors.neutral.100)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.neutral.100)_1px,transparent_1px)] bg-[size:20%_20%]"
        >
          <div className="absolute left-1/2 top-0 h-full w-px bg-neutral-200" />
          <div className="absolute left-0 top-1/2 h-px w-full bg-neutral-200" />
          <motion.div
            drag
            dragConstraints={containerRef}
            dragElastic={0}
            dragMomentum={false}
            onDrag={(_, info) => setFromClientPoint(info.point.x, info.point.y)}
            animate={{
              left: `${current.classicoInnovativo}%`,
              top: `${current.seriosaGiocosa}%`,
            }}
            transition={{ duration: 0.15 }}
            className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent-400 bg-accent-300 shadow-sm"
          />
        </div>
        <span className="text-sm text-neutral-500">Innovativo</span>
      </div>
      <div className="flex justify-center text-sm text-neutral-500">Giocosa</div>
    </div>
  );
}
