// src/hooks/useCountdownRedirect.ts
"use client";
// Cuenta regresiva reutilizable que redirige al terminar.
// Se usa en la pantalla "registrado" y en "¡Todo listo!". Incluye
// `redirigirAhora` para el botón de salto inmediato.
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useCountdownRedirect(destino: string, segundos = 10) {
  const router = useRouter();
  const [restante, setRestante] = useState(segundos);

  const redirigirAhora = useCallback(() => {
    router.push(destino);
  }, [router, destino]);

  useEffect(() => {
    if (restante <= 0) {
      redirigirAhora();
      return;
    }
    const id = setTimeout(() => setRestante((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [restante, redirigirAhora]);

  return { restante, redirigirAhora };
}
