// src/components/configuracion/ConfiguracionShell.tsx
"use client";

import { useState } from "react";
import { useTranslation } from "@/contextos/LanguageContext";
import { usePerfil } from "@/hooks/usePerfil";
import { cn } from "@/lib/utils/cn";
import SeccionPerfil from "@/components/configuracion/secciones/SeccionPerfil";
import SeccionAplicacion from "@/components/configuracion/secciones/SeccionAplicacion";

export type SeccionId =
  | "perfil"
  | "eclesiastico"
  | "seguridad"
  | "aplicacion"
  | "peligro";

interface Props {
  userId: string;
  email: string;
  emailVerificado: boolean;
}

const SECCIONES: { id: SeccionId; claveTitulo: string }[] = [
  { id: "perfil", claveTitulo: "configuracion.perfil.titulo" },
  { id: "eclesiastico", claveTitulo: "configuracion.eclesiastico.titulo" },
  { id: "seguridad", claveTitulo: "configuracion.seguridad.titulo" },
  { id: "aplicacion", claveTitulo: "configuracion.aplicacion.titulo" },
  { id: "peligro", claveTitulo: "configuracion.peligro.titulo" },
];

/**
 * Shell de /configuracion.
 *
 * Es el ÚNICO dueño de usePerfil: lo instancia una vez y se lo pasa a las
 * secciones. Así no hay cinco lecturas del perfil ni estados desincronizados,
 * y cada sección sólo recibe lo que necesita.
 */
export default function ConfiguracionShell({
  userId,
  email,
  emailVerificado,
}: Props) {
  const { t } = useTranslation();
  const [activa, setActiva] = useState<SeccionId>("perfil");

  const {
    perfil,
    cargando,
    errorCarga,
    estado,
    errorGuardado,
    guardar,
    refrescar,
  } = usePerfil(userId);

  if (cargando) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="h-8 w-48 animate-pulse rounded bg-surface" />
        <div className="mt-6 h-64 animate-pulse rounded-lg bg-surface" />
      </div>
    );
  }

  if (errorCarga || !perfil) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <p className="rounded-lg bg-danger/10 p-4 text-danger">
          {t("configuracion.error-carga")}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-main">
          {t("configuracion.titulo")}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {t("configuracion.subtitulo")}
        </p>
      </header>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Navegación de secciones. En móvil es una barra scrolleable. */}
        <nav
          className="flex gap-1 overflow-x-auto border-b border-line pb-2
                     md:w-56 md:shrink-0 md:flex-col md:border-b-0 md:border-r
                     md:pb-0 md:pr-4"
          aria-label={t("configuracion.titulo")}
        >
          {SECCIONES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiva(s.id)}
              aria-current={activa === s.id ? "page" : undefined}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-2 text-left text-sm transition-colors",
                activa === s.id
                  ? "bg-primary text-primary-text"
                  : "text-muted hover:bg-surface hover:text-main",
                s.id === "peligro" && activa !== s.id && "text-danger",
              )}
            >
              {t(s.claveTitulo)}
            </button>
          ))}
        </nav>

        {/* Contenido */}
        <div className="min-w-0 flex-1">
          {activa === "perfil" && (
            <SeccionPerfil
              perfil={perfil}
              estado={estado}
              error={errorGuardado}
              onGuardar={guardar}
            />
          )}

          {activa === "aplicacion" && (
            <SeccionAplicacion
              perfil={perfil}
              estado={estado}
              error={errorGuardado}
              onGuardar={guardar}
            />
          )}

          {/* Pendientes: se construyen en el siguiente paso. */}
          {activa === "eclesiastico" && <Pendiente clave="eclesiastico" />}
          {activa === "seguridad" && <Pendiente clave="seguridad" />}
          {activa === "peligro" && <Pendiente clave="peligro" />}
        </div>
      </div>
    </div>
  );
}

function Pendiente({ clave }: { clave: string }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-lg border border-line border-dashed p-8 text-center">
      <p className="text-sm text-muted">
        {t(`configuracion.${clave}.titulo`)} · {t("configuracion.pendiente")}
      </p>
    </div>
  );
}
