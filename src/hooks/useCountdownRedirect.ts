// src/hooks/useCountdownRedirect.ts
"use client";
// Cuenta regresiva reutilizable que redirige al terminar.
// Se usa en la pantalla "registrado" y en "¡Todo listo!". Incluye
// `redirigirAhora` para el salto inmediato desde el botón.
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

export function useCountdownRedirect(destino: string, segundos = 10) {
  const router = useRouter();
  const [restante, setRestante] = useState(segundos);
  // Evita que la redirección se dispare dos veces (el tick de 0 + un re-render).
  const yaRedirigio = useRef(false);

  const redirigirAhora = useCallback(() => {
    if (yaRedirigio.current) return;
    yaRedirigio.current = true;

    // router.push es lo ideal (SPA), pero si esta pantalla se abrió desde el
    // enlace de correo, a veces la navegación de Next no surte efecto durante
    // la carga inicial. Se intenta push y, si en 150 ms seguimos aquí, se hace
    // una navegación dura con window.location como red de seguridad.
    router.push(destino);
    setTimeout(() => {
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith(destino)
      ) {
        window.location.assign(destino);
      }
    }, 150);
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
