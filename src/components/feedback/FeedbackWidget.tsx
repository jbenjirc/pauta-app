// src/components/feedback/FeedbackWidget.tsx
"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { MessageSquarePlus, ImagePlus, X, Check, Loader2 } from "lucide-react";
import { useTranslation } from "@/contextos/LanguageContext";
import { useSession } from "@/contextos/SessionContext";
import { useFeedback } from "@/hooks/useFeedback";
import { useFeedbackSnapshot } from "@/hooks/useFeedbackSnapshot";
import { cn } from "@/lib/utils/cn";
import type { PerfilSnapshot } from "@/lib/feedback/feedbackQueries";
import { MAX_IMAGENES } from "@/lib/feedback/feedbackQueries";

type Orientacion = "vertical" | "horizontal";
type Lado = "arriba" | "abajo" | "derecha" | "izquierda";

interface Props {
  /**
   * userId y perfilSnapshot son opcionales: si no se pasan, el widget los
   * resuelve solo desde la sesión (útil en navbars/sidebar, que son cliente
   * y no tienen el snapshot a la mano).
   */
  userId?: string;
  perfilSnapshot?: PerfilSnapshot;
  orientacion?: Orientacion;
  lado?: Lado;
  soloIcono?: boolean;
  className?: string;
}

/**
 * Disparador + panel de feedback, reutilizable en los tres contenedores.
 * NO reimplementa la lógica: usa el mismo useFeedback que la página /feedback.
 * El panel se monta en un portal para no quedar recortado por overflow del
 * navbar/sidebar.
 */
export default function FeedbackWidget({
  userId: userIdProp,
  perfilSnapshot: snapshotProp,
  orientacion = "vertical",
  lado = orientacion === "vertical" ? "abajo" : "derecha",
  soloIcono = false,
  className,
}: Props) {
  const { t } = useTranslation();
  const { user } = useSession();
  const [abierto, setAbierto] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const dispararRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const userId = userIdProp ?? user?.id ?? null;

  // Dirección de despliegue. Se declara antes del posicionador porque lo usa.
  const transform = lado === "arriba" ? "translateY(-100%)" : undefined;

  // Snapshot: el que venga por prop (páginas server) o uno resuelto en cliente.
  const snapshot = useFeedbackSnapshot(snapshotProp, userId);

  const fb = useFeedback(userId ?? "", snapshot);

  // Sin sesión no se muestra el widget (debe estar logueado).
  const habilitado = Boolean(userId);

  // Calcula la posición midiendo el panel REAL (no estimado) y sin salirse del
  // viewport. Es una función pura respecto al DOM: sólo hace setPos, así que no
  // se retroalimenta (el bug anterior era un callback ref que hacía setState en
  // cada render).
  const posicionar = useCallback(() => {
    const disparador = dispararRef.current;
    if (!disparador) return;

    const r = disparador.getBoundingClientRect();
    const GAP = 8;
    const MARGEN = 8;
    const ANCHO = 340;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let top = r.bottom + GAP;
    let left = r.left;

    if (lado === "arriba") top = r.top - GAP; // el transform lo sube
    if (lado === "derecha") {
      top = r.top;
      left = r.right + GAP;
      // Si a la derecha no cabe (sidebar en pantallas angostas), se voltea.
      if (left + ANCHO + MARGEN > vw) left = r.left - ANCHO - GAP;
    }
    if (lado === "izquierda") {
      top = r.top;
      left = r.left - ANCHO - GAP;
    }

    left = Math.max(MARGEN, Math.min(left, vw - ANCHO - MARGEN));

    // Altura real del panel si ya está montado; si no, una estimación.
    const alto = Math.min(
      panelRef.current?.offsetHeight ?? 420,
      vh - 2 * MARGEN,
    );
    if (transform !== "translateY(-100%)" && top + alto + MARGEN > vh) {
      top = Math.max(MARGEN, vh - alto - MARGEN);
    }

    setPos((prev) =>
      prev && prev.top === top && prev.left === left ? prev : { top, left },
    );
  }, [lado, transform]);

  // Posiciona al abrir y una vez más tras el layout (ya con la altura real).
  // useLayoutEffect corre síncrono tras el montaje del panel: mide y coloca
  // antes de pintar, sin parpadeo y sin bucle.
  useLayoutEffect(() => {
    if (!abierto) return;
    posicionar();
  }, [abierto, posicionar]);

  // Reposiciona en scroll/resize mientras está abierto. Llama a posicionar
  // directamente (no vía estado), así nunca hay realimentación.
  useEffect(() => {
    if (!abierto) return;
    window.addEventListener("resize", posicionar);
    window.addEventListener("scroll", posicionar, true);
    return () => {
      window.removeEventListener("resize", posicionar);
      window.removeEventListener("scroll", posicionar, true);
    };
  }, [abierto, posicionar]);

  // Cuando el contenido cambia de alto (adjuntar/quitar imágenes, error, o el
  // paso de "enviado"), se recoloca. Depende del contenido, no de un contador,
  // por eso no hay bucle.
  useLayoutEffect(() => {
    if (abierto) posicionar();
  }, [
    abierto,
    fb.imagenes.length,
    fb.estado,
    fb.errorImagen,
    fb.error,
    posicionar,
  ]);
  useEffect(() => {
    if (!abierto) return;
    function fuera(e: MouseEvent) {
      if (
        !panelRef.current?.contains(e.target as Node) &&
        !dispararRef.current?.contains(e.target as Node)
      ) {
        setAbierto(false);
      }
    }
    function esc(e: KeyboardEvent) {
      if (e.key === "Escape") setAbierto(false);
    }
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fuera);
      document.removeEventListener("keydown", esc);
    };
  }, [abierto]);

  if (!habilitado) return null;

  return (
    <>
      <button
        ref={dispararRef}
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-haspopup="dialog"
        className={cn(
          "flex items-center gap-2 rounded-lg text-sm font-medium transition-colors",
          soloIcono ? "justify-center p-2" : "px-3 py-2",
          "text-muted hover:bg-border-line/20 hover:text-main",
          className,
        )}
        title={t("feedback.titulo")}
      >
        <MessageSquarePlus className="size-4 shrink-0" />
        {!soloIcono && <span>{t("feedback.abrir")}</span>}
      </button>

      {abierto &&
        pos &&
        createPortal(
          <div
            ref={panelRef}
            role="dialog"
            aria-label={t("feedback.titulo")}
            style={{
              top: pos.top,
              left: pos.left,
              transform,
              width: 340,
              maxHeight: "calc(100vh - 16px)",
            }}
            className="fixed z-[100] overflow-y-auto rounded-xl border border-line bg-surface p-4 shadow-xl"
          >
            <Panel fb={fb} onCerrar={() => setAbierto(false)} />
          </div>,
          document.body,
        )}
    </>
  );
}

// --- Contenido del panel (compartido por las 4 orientaciones) ---------------
function Panel({
  fb,
  onCerrar,
}: {
  fb: ReturnType<typeof useFeedback>;
  onCerrar: () => void;
}) {
  const { t } = useTranslation();

  if (fb.estado === "enviado") {
    return (
      <div className="py-4 text-center">
        <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-success/10">
          <Check className="size-5 text-success" aria-hidden />
        </div>
        <p className="text-sm font-medium text-main">{t("feedback.gracias")}</p>
        <div className="mt-3 flex justify-center gap-2">
          <button
            type="button"
            onClick={fb.escribirOtro}
            className="rounded-md border border-line px-3 py-1.5 text-xs text-main hover:bg-background"
          >
            {t("feedback.enviar-otro")}
          </button>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-md px-3 py-1.5 text-xs text-muted hover:text-main"
          >
            {t("feedback.cerrar")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-main">
          {t("feedback.titulo")}
        </span>
        <button
          type="button"
          onClick={onCerrar}
          className="text-muted hover:text-main"
          aria-label={t("feedback.cerrar")}
        >
          <X className="size-4" />
        </button>
      </div>

      <textarea
        value={fb.mensaje}
        onChange={(e) => fb.setMensaje(e.target.value)}
        rows={4}
        placeholder={t("feedback.mensaje-ph")}
        className="w-full resize-y rounded-md border border-line bg-background px-3 py-2
                   text-sm text-main placeholder:text-muted focus:border-primary focus:outline-none"
      />

      {/* Imágenes adjuntas */}
      {fb.imagenes.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {fb.imagenes.map((img) => (
            <div key={img.id} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.preview}
                alt=""
                className="size-14 rounded-md border border-line object-cover"
              />
              <button
                type="button"
                onClick={() => fb.quitarImagen(img.id)}
                className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center
                           rounded-full bg-danger text-white"
                aria-label={t("feedback.quitar-imagen")}
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {fb.errorImagen && (
        <p className="mt-1 text-xs text-danger">{t(fb.errorImagen)}</p>
      )}
      {fb.error && <p className="mt-1 text-xs text-danger">{fb.error}</p>}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Agregar imágenes */}
          <label
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs text-muted hover:text-main",
              fb.imagenes.length >= MAX_IMAGENES &&
                "cursor-not-allowed opacity-40",
            )}
            title={t("feedback.agregar-imagen")}
          >
            <ImagePlus className="size-4" />
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              disabled={fb.imagenes.length >= MAX_IMAGENES}
              onChange={(e) => fb.agregarImagenes(e.target.files)}
              className="hidden"
            />
          </label>

          <span
            className={cn(
              "text-xs",
              fb.restantes < 0 ? "text-danger" : "text-muted",
            )}
          >
            {fb.restantes}
          </span>
        </div>

        <button
          type="button"
          onClick={fb.enviar}
          disabled={!fb.puedeEnviar}
          className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm
                     text-primary-text hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {fb.estado === "enviando" && (
            <Loader2 className="size-3.5 animate-spin" />
          )}
          {t("feedback.enviar")}
        </button>
      </div>

      {/* Aviso de datos del navegador/sesión */}
      <p className="mt-3 border-t border-line pt-2 text-[11px] leading-snug text-muted">
        {t("feedback.aviso-datos")}{" "}
        <Link href="/feedback" className="text-primary hover:underline">
          {t("feedback.aviso-detalle")}
        </Link>
      </p>
    </>
  );
}
