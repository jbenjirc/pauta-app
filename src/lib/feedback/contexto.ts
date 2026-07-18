// src/lib/feedback/contexto.ts
/**
 * Recolecta el contexto del cliente que acompaña a cada comentario.
 *
 * Todo lo de aquí es información técnica del navegador, no datos personales
 * ocultos: sirve para reproducir un error (¿qué pantalla? ¿qué tamaño de
 * ventana? ¿qué navegador?) sin tener que interrogar al usuario.
 *
 * Vive aparte de feedbackQueries a propósito: esto es una util del navegador,
 * no acceso a datos. Además así se puede probar/stubbear por separado.
 */

export interface ContextoCliente {
  userAgent: string | null;
  plataforma: string | null;
  idiomaNavegador: string | null;
  zonaHoraria: string | null;
  viewport: string | null;
  pantalla: string | null;
  appVersion: string | null;
}

export function recolectarContextoCliente(): ContextoCliente {
  // Guardas por si algún día esto corre en el servidor.
  if (typeof window === "undefined") {
    return {
      userAgent: null,
      plataforma: null,
      idiomaNavegador: null,
      zonaHoraria: null,
      viewport: null,
      pantalla: null,
      appVersion: null,
    };
  }

  let zonaHoraria: string | null = null;
  try {
    zonaHoraria = Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;
  } catch {
    zonaHoraria = null;
  }

  return {
    userAgent: navigator.userAgent ?? null,
    plataforma: navigator.platform ?? null,
    idiomaNavegador: navigator.language ?? null,
    zonaHoraria,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    pantalla: `${window.screen?.width ?? "?"}x${window.screen?.height ?? "?"}`,
    // Define NEXT_PUBLIC_APP_VERSION en tu .env / CI para saber qué build
    // estaba corriendo cuando escribieron. Sin esto, "¿en qué versión pasó?"
    // no tiene respuesta.
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? null,
  };
}

/**
 * Lo que se le muestra al usuario en "¿Qué se envía?".
 * Se deriva del mismo objeto para que nunca se desincronice de la realidad:
 * si agregas un campo arriba, aparece aquí solo.
 */
export function resumirContextoParaUsuario(c: ContextoCliente): string[] {
  return [
    c.plataforma && `Sistema: ${c.plataforma}`,
    c.viewport && `Ventana: ${c.viewport}`,
    c.zonaHoraria && `Zona horaria: ${c.zonaHoraria}`,
    c.appVersion && `Versión: ${c.appVersion}`,
  ].filter(Boolean) as string[];
}
