// src/hooks/useTemaPreferencia.ts
"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import type { TemaModo } from "@/lib/perfiles/perfilQueries";

/**
 * Puente entre la preferencia de tema guardada en la BD y next-themes.
 *
 * ¿Por qué hace falta? next-themes persiste en localStorage, que es POR
 * DISPOSITIVO. La BD es la fuente de verdad entre dispositivos: al cargar el
 * perfil, se impone lo que diga la BD; al cambiar el tema, se escribe a ambos.
 *
 * Dos ejes independientes:
 *   temaModo -> claro | oscuro | sistema  (lo maneja next-themes)
 *   tema     -> paleta/variante ('default' hoy). Se aplica como
 *               data-tema en <html>, para que el CSS pueda colgar de
 *               [data-tema="sepia"] cuando agregues más.
 */

// La BD habla español; next-themes habla inglés.
const A_NEXT_THEMES: Record<TemaModo, string> = {
  claro: "light",
  oscuro: "dark",
  sistema: "system",
};

const A_BD: Record<string, TemaModo> = {
  light: "claro",
  dark: "oscuro",
  system: "sistema",
};

interface Opciones {
  /** Valores de la BD (null mientras carga el perfil). */
  temaModoBd: TemaModo | null;
  temaBd: string | null;
  /** Persiste el cambio. Normalmente el `guardar` de usePerfil. */
  onGuardar: (cambios: {
    temaModo?: TemaModo;
    tema?: string;
  }) => Promise<boolean>;
}

export function useTemaPreferencia({
  temaModoBd,
  temaBd,
  onGuardar,
}: Opciones) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const sincronizado = useRef(false);

  // 1. BD -> cliente. Sólo UNA vez por carga: si el usuario eligió 'oscuro' en
  //    su laptop, al abrir en el móvil se impone 'oscuro' aunque el
  //    localStorage de ese móvil diga otra cosa.
  useEffect(() => {
    if (sincronizado.current) return;
    if (!temaModoBd) return;

    const deseado = A_NEXT_THEMES[temaModoBd];
    if (deseado !== theme) setTheme(deseado);
    sincronizado.current = true;
  }, [temaModoBd, theme, setTheme]);

  // 2. Variante/paleta -> atributo en <html>. Hoy sólo 'default'; el CSS puede
  //    ignorarlo hasta que agregues más paletas.
  useEffect(() => {
    if (!temaBd) return;
    document.documentElement.dataset.tema = temaBd;
  }, [temaBd]);

  /** Cambia el modo: aplica al instante y persiste en la BD. */
  const cambiarModo = useCallback(
    async (modo: TemaModo) => {
      setTheme(A_NEXT_THEMES[modo]);
      await onGuardar({ temaModo: modo });
    },
    [setTheme, onGuardar],
  );

  /** Cambia la paleta (para cuando tengas más de una). */
  const cambiarTema = useCallback(
    async (nuevo: string) => {
      document.documentElement.dataset.tema = nuevo;
      await onGuardar({ tema: nuevo });
    },
    [onGuardar],
  );

  // Modo actual en el idioma de la BD, para pintar el selector.
  const modoActual: TemaModo = theme ? (A_BD[theme] ?? "sistema") : "sistema";

  return {
    modoActual,
    /** Lo que realmente se ve ('claro'|'oscuro'), ya resuelto si es 'sistema'. */
    modoResuelto: resolvedTheme === "dark" ? "oscuro" : "claro",
    cambiarModo,
    cambiarTema,
  };
}
