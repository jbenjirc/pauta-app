// src/components/configuracion/secciones/SeccionAplicacion.tsx
"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslation } from "@/contextos/LanguageContext";
import { useTemaPreferencia } from "@/hooks/useTemaPreferencia";
import { cn } from "@/lib/utils/cn";
import type {
  Perfil,
  PerfilParcial,
  TemaModo,
} from "@/lib/perfiles/perfilQueries";
import type { EstadoGuardado } from "@/hooks/usePerfil";
import SeccionLayout from "../SeccionLayout";

interface Props {
  perfil: Perfil;
  estado: EstadoGuardado;
  error: string | null;
  onGuardar: (cambios: PerfilParcial) => Promise<boolean>;
}

const MODOS: { id: TemaModo; icono: typeof Sun; clave: string }[] = [
  { id: "claro", icono: Sun, clave: "configuracion.aplicacion.tema-claro" },
  { id: "oscuro", icono: Moon, clave: "configuracion.aplicacion.tema-oscuro" },
  {
    id: "sistema",
    icono: Monitor,
    clave: "configuracion.aplicacion.tema-sistema",
  },
];

/**
 * Idioma y tema. Ambos guardan AL INSTANTE (sin botón): son cambios que el
 * usuario ve aplicarse en vivo, así que un "Guardar" sería redundante.
 */
export default function SeccionAplicacion({
  perfil,
  estado,
  error,
  onGuardar,
}: Props) {
  // useTranslation devuelve el contexto completo del LanguageProvider.
  const { t, currentLang, changeLanguage, languages } = useTranslation();

  const { modoActual, cambiarModo } = useTemaPreferencia({
    temaModoBd: perfil.temaModo,
    temaBd: perfil.tema,
    onGuardar,
  });

  async function manejarIdioma(codigo: string) {
    changeLanguage(codigo); // aplica en el cliente (y en localStorage)
    await onGuardar({ idiomaPreferente: codigo }); // persiste entre dispositivos
  }

  return (
    <SeccionLayout
      titulo={t("configuracion.aplicacion.titulo")}
      descripcion={t("configuracion.aplicacion.descripcion")}
      estado={estado}
      error={error}
    >
      {/* Idioma */}
      <div>
        <label className="mb-2 block text-sm text-main">
          {t("configuracion.aplicacion.idioma")}
        </label>
        <div className="flex flex-wrap gap-2">
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => manejarIdioma(l.code)}
              aria-pressed={currentLang === l.code}
              className={cn(
                "flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                currentLang === l.code
                  ? "border-primary bg-primary/10 text-main"
                  : "border-line text-muted hover:bg-surface hover:text-main",
              )}
            >
              <span aria-hidden>{l.flag}</span>
              {l.name}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-muted">
          {t("configuracion.aplicacion.idioma-ayuda")}
        </p>
      </div>

      {/* Tema: claro / oscuro / sistema */}
      <div className="pt-2">
        <label className="mb-2 block text-sm text-main">
          {t("configuracion.aplicacion.tema")}
        </label>
        <div className="grid grid-cols-3 gap-2 sm:max-w-md">
          {MODOS.map((m) => {
            const Icono = m.icono;
            const activo = modoActual === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => cambiarModo(m.id)}
                aria-pressed={activo}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-md border px-3 py-4 text-sm transition-colors",
                  activo
                    ? "border-primary bg-primary/10 text-main"
                    : "border-line text-muted hover:bg-surface hover:text-main",
                )}
              >
                <Icono size={20} aria-hidden />
                {t(m.clave)}
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-xs text-muted">
          {t("configuracion.aplicacion.tema-ayuda")}
        </p>
      </div>

      {/*
        Paleta / variante de tema: hoy sólo existe 'default', así que no se
        pinta selector. Cuando agregues más, este es el lugar:

        <SelectField
          label={t("configuracion.aplicacion.paleta")}
          value={perfil.tema}
          opciones={[{ id: "default", nombre: "Default" }, ...]}
          onChange={(v) => cambiarTema(v ?? "default")}
        />

        La columna perfiles.tema ya lo persiste y useTemaPreferencia ya lo
        aplica como data-tema en <html>.
      */}
    </SeccionLayout>
  );
}
