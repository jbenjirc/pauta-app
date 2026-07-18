// src/components/ui/ProgressBar.tsx
"use client";
// Barra de progreso SIN números. Recibe un valor 0..1 y anima el ancho.
import { cn } from "@/lib/utils/cn";

interface Props {
  /** Progreso entre 0 y 1. */
  valor: number;
  className?: string;
}

export default function ProgressBar({ valor, className }: Props) {
  const pct = Math.min(100, Math.max(0, valor * 100));
  return (
    <div
      className={cn(
        "w-full h-2 rounded-full bg-line/40 overflow-hidden",
        className,
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
    >
      <div
        className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
