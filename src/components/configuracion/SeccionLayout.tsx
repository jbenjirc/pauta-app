// src/components/configuracion/SeccionLayout.tsx
"use client";

import type { ReactNode } from "react";
import { useTranslation } from "@/contextos/LanguageContext";
import type { EstadoGuardado } from "@/hooks/usePerfil";

interface Props {
  titulo: string;
  descripcion?: string;
  children: ReactNode;
  estado?: EstadoGuardado;
  error?: string | null;
  /** Si se omite, la sección no muestra botón (guarda al instante). */
  onGuardar?: () => void;
  puedeGuardar?: boolean;
  peligro?: boolean;
}

/**
 * Carcasa visual común a todas las secciones: título, cuerpo, y la barra de
 * guardado con su feedback. Centralizarlo evita que cada sección reinvente el
 * botón y el "Guardado ✓".
 */
export default function SeccionLayout({
  titulo,
  descripcion,
  children,
  estado = "inactivo",
  error,
  onGuardar,
  puedeGuardar = true,
  peligro = false,
}: Props) {
  const { t } = useTranslation();

  return (
    <section
      className={`rounded-lg border p-6 ${
        peligro ? "border-danger/40" : "border-line"
      }`}
    >
      <header className="mb-5">
        <h2
          className={`text-lg font-medium ${peligro ? "text-danger" : "text-main"}`}
        >
          {titulo}
        </h2>
        {descripcion && (
          <p className="mt-1 text-sm text-muted">{descripcion}</p>
        )}
      </header>

      <div className="space-y-4">{children}</div>

      {onGuardar && (
        <footer className="mt-6 flex items-center gap-3 border-t border-line pt-4">
          <button
            type="button"
            onClick={onGuardar}
            disabled={!puedeGuardar || estado === "guardando"}
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-text
                       transition-opacity hover:opacity-90
                       disabled:cursor-not-allowed disabled:opacity-40"
          >
            {estado === "guardando"
              ? t("configuracion.guardando")
              : t("configuracion.guardar")}
          </button>

          {estado === "guardado" && (
            <span className="text-sm text-success">
              {t("configuracion.guardado")}
            </span>
          )}
          {estado === "error" && error && (
            <span className="text-sm text-danger">{error}</span>
          )}
        </footer>
      )}
    </section>
  );
}
