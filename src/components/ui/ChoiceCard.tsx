// src/components/ui/ChoiceCard.tsx
"use client";
// Tarjeta seleccionable con espacio para ILUSTRACIÓN. Se usan dos de estas
// lado a lado para "¿Soy miembro de la Iglesia Adventista?" (Sí / No).
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface Props {
  titulo: string;
  seleccionada: boolean;
  onSelect: () => void;
  /** Slot para la ilustración (SVG/imagen). Deja el hueco reservado. */
  ilustracion?: ReactNode;
}

export default function ChoiceCard({
  titulo,
  seleccionada,
  onSelect,
  ilustracion,
}: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={seleccionada}
      className={cn(
        "flex-1 flex flex-col items-center gap-3 p-5 rounded-2xl border-2",
        "bg-surface text-main transition-all duration-200",
        "hover:border-primary/70 focus:outline-none focus:ring-2 focus:ring-primary",
        seleccionada ? "border-primary shadow-md scale-[1.02]" : "border-line",
      )}
    >
      {/* Hueco reservado para la ilustración (aspecto cuadrado). */}
      <div className="w-24 h-24 flex items-center justify-center rounded-xl bg-background">
        {ilustracion ?? <span className="text-xs text-muted">ilustración</span>}
      </div>
      <span className="font-semibold">{titulo}</span>
    </button>
  );
}
