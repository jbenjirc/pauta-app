// src/hooks/useFeedback.ts
"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useTranslation } from "@/contextos/LanguageContext";
import {
  enviarFeedback,
  subirImagenFeedback,
  MAX_MENSAJE,
  MAX_IMAGENES,
  type PerfilSnapshot,
  type TipoFeedback,
} from "@/lib/feedback/feedbackQueries";
import { recolectarContextoCliente } from "@/lib/feedback/contexto";

interface ImagenLocal {
  id: string;
  archivo: File;
  preview: string; // objectURL para la miniatura
}

export type EstadoEnvio = "inactivo" | "enviando" | "enviado" | "error";

/**
 * Toda la lógica del formulario de feedback. El componente sólo pinta.
 *
 * El contexto (navegador, viewport, ruta, tema, idioma) se recolecta SOLO al
 * enviar, no al montar: así refleja el momento real del envío y no gasta nada
 * si el usuario abre la página y se arrepiente.
 */
export function useFeedback(userId: string, perfilSnapshot: PerfilSnapshot) {
  const { currentLang } = useTranslation();
  const { theme } = useTheme();
  const ruta = usePathname();

  const [tipo, setTipo] = useState<TipoFeedback>("general");
  const [mensaje, setMensaje] = useState("");
  const [imagenes, setImagenes] = useState<ImagenLocal[]>([]);
  const [errorImagen, setErrorImagen] = useState<string | null>(null);
  const [estado, setEstado] = useState<EstadoEnvio>("inactivo");
  const [error, setError] = useState<string | null>(null);

  // Añade imágenes respetando el tope. Genera preview local (objectURL).
  const agregarImagenes = useCallback((files: FileList | null) => {
    if (!files?.length) return;
    setErrorImagen(null);
    setImagenes((prev) => {
      const cupo = MAX_IMAGENES - prev.length;
      if (cupo <= 0) {
        setErrorImagen("feedback.img-tope");
        return prev;
      }
      const nuevas = Array.from(files)
        .slice(0, cupo)
        .map((archivo) => ({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          archivo,
          preview: URL.createObjectURL(archivo),
        }));
      return [...prev, ...nuevas];
    });
  }, []);

  const quitarImagen = useCallback((id: string) => {
    setImagenes((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview); // evita fuga de memoria
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const restantes = MAX_MENSAJE - mensaje.length;
  const puedeEnviar =
    mensaje.trim().length > 0 && restantes >= 0 && estado !== "enviando";

  // next-themes habla inglés; el resto de la BD guarda español. Se traduce
  // aquí para que el log no quede con dos vocabularios mezclados.
  const temaModoEs =
    theme === "light" ? "claro" : theme === "dark" ? "oscuro" : "sistema";

  // Se calcula una vez para poder mostrárselo al usuario ("¿qué se envía?").
  const contexto = useMemo(() => recolectarContextoCliente(), []);

  const enviar = useCallback(async (): Promise<boolean> => {
    if (!puedeEnviar) return false;

    setEstado("enviando");
    setError(null);

    // Primero suben las imágenes al Storage; se guardan sus rutas en la fila.
    // Si una falla, se aborta el envío y se avisa (no queremos un comentario
    // que dice "mira la captura" sin captura).
    const rutas: string[] = [];
    for (const img of imagenes) {
      const { ruta, error: errImg } = await subirImagenFeedback(
        userId,
        img.archivo,
      );
      if (errImg || !ruta) {
        setError(errImg ?? "feedback.img-fallo");
        setEstado("error");
        return false;
      }
      rutas.push(ruta);
    }

    const { error: err } = await enviarFeedback(userId, {
      tipo,
      mensaje,
      imagenes: rutas,
      ruta,
      idiomaApp: currentLang,
      temaModo: temaModoEs,
      // Paleta: hoy sólo existe 'default'. Cuando agregues más, pásala aquí
      // desde el perfil (perfiles.tema).
      tema: "default",
      contexto: recolectarContextoCliente(),
      perfilSnapshot,
    });

    if (err) {
      setError(err);
      setEstado("error");
      return false;
    }

    // Se limpia para permitir enviar otro mensaje sin recargar: el usuario
    // puede mandar los que quiera.
    imagenes.forEach((i) => URL.revokeObjectURL(i.preview));
    setImagenes([]);
    setMensaje("");
    setTipo("general");
    setEstado("enviado");
    return true;
  }, [
    puedeEnviar,
    userId,
    tipo,
    mensaje,
    imagenes,
    ruta,
    currentLang,
    temaModoEs,
    perfilSnapshot,
  ]);

  /** Vuelve al formulario tras un envío exitoso. */
  const escribirOtro = useCallback(() => setEstado("inactivo"), []);

  return {
    tipo,
    setTipo,
    mensaje,
    setMensaje,
    imagenes,
    agregarImagenes,
    quitarImagen,
    errorImagen,
    restantes,
    puedeEnviar,
    estado,
    error,
    enviar,
    escribirOtro,
    contexto,
  };
}
