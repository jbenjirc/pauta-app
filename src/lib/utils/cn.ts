// src/lib/utils/cn.ts
// Helper para combinar clases de Tailwind de forma segura (resuelve conflictos).
// Ya tienes clsx y tailwind-merge en package.json; sólo faltaba centralizarlo.
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
