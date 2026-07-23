"use client";

import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Question } from "@/content/questionnaire";

interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}

export function TextShortField({ value, onChange, onSubmit, placeholder }: TextFieldProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <Input
      ref={ref}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSubmit?.();
      }}
      className="h-14 border-0 border-b-2 border-neutral-200 rounded-none px-1 text-xl focus-visible:ring-0 focus-visible:border-accent-400"
    />
  );
}

export function EmailFieldInput({ value, onChange, onSubmit, placeholder }: TextFieldProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <Input
      ref={ref}
      type="email"
      value={value ?? ""}
      placeholder={placeholder ?? "nome@azienda.it"}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSubmit?.();
      }}
      className="h-14 border-0 border-b-2 border-neutral-200 rounded-none px-1 text-xl focus-visible:ring-0 focus-visible:border-accent-400"
    />
  );
}

export function TextLongField({ value, onChange, placeholder }: TextFieldProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <Textarea
      ref={ref}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      rows={5}
      className="resize-none border-0 border-b-2 border-neutral-200 rounded-none px-1 text-lg leading-relaxed focus-visible:ring-0 focus-visible:border-accent-400"
    />
  );
}

export function DateFieldInput({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  return (
    <Input
      type="date"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="h-14 w-full max-w-xs border-0 border-b-2 border-neutral-200 rounded-none px-1 text-lg focus-visible:ring-0 focus-visible:border-accent-400"
    />
  );
}

interface SingleChoiceProps {
  options: NonNullable<Question["options"]>;
  value?: string;
  onChange: (value: string) => void;
}

export function SingleChoiceField({ options, value, onChange }: SingleChoiceProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((opt, i) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "group flex items-center gap-3 rounded-lg border px-4 py-3.5 text-left text-base transition-colors",
              selected
                ? "border-accent-400 bg-accent-50 text-neutral-900"
                : "border-neutral-200 text-neutral-700 hover:border-accent-300 hover:bg-accent-50/50"
            )}
          >
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-medium",
                selected
                  ? "border-accent-400 bg-accent-300 text-neutral-900"
                  : "border-neutral-300 text-neutral-400"
              )}
            >
              {String.fromCharCode(65 + i)}
            </span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
