// src/components/configuracion/secciones/SeccionPerfil.tsx
"use client";

import { useRef, useState } from "react";
import { useTranslation } from "@/contextos/LanguageContext";
import ValidatedInput from "@/components/ui/ValidatedInput";
import SelectField from "@/components/ui/SelectField";
import {
  subirFotoPerfil,
  eliminarFotoPerfil,
  MAX_FOTO_BYTES,
  TIPOS_FOTO,
  type Perfil,
  type PerfilParcial,
} from "@/lib/perfiles/perfilQueries";
import type { EstadoGuardado } from "@/hooks/usePerfil";
import { PAISES } from "@/lib/org/paises";
import SeccionLayout from "../SeccionLayout";

interface Props {
  perfil: Perfil;
  estado: EstadoGuardado;
  error: string | null;
  onGuardar: (cambios: PerfilParcial) => Promise<boolean>;
}

/** Presentacional: sólo pinta y delega. La persistencia vive en usePerfil. */
export default function SeccionPerfil({
  perfil,
  estado,
  error,
  onGuardar,
}: Props) {
  const { t } = useTranslation();

  const [nombre, setNombre] = useState(perfil.nombre ?? "");
  const [apellidos, setApellidos] = useState(perfil.apellidos ?? "");
  const [pais, setPais] = useState(perfil.pais ?? "");

  const [subiendo, setSubiendo] = useState(false);
  const [errorFoto, setErrorFoto] = useState<string | null>(null);
  const inputFoto = useRef<HTMLInputElement>(null);

  const sucio =
    nombre.trim() !== (perfil.nombre ?? "") ||
    apellidos.trim() !== (perfil.apellidos ?? "") ||
    pais !== (perfil.pais ?? "");

  const valido = nombre.trim().length > 0 && apellidos.trim().length > 0;

  async function manejarFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setErrorFoto(null);
    setSubiendo(true);

    const { url, error: err } = await subirFotoPerfil(perfil.id, archivo);

    if (err) {
      // 'tipo-invalido' y 'muy-grande' son claves i18n; el resto es de Supabase.
      setErrorFoto(
        err === "tipo-invalido" || err === "muy-grande"
          ? t(`configuracion.perfil.foto-${err}`)
          : err,
      );
    } else if (url) {
      await onGuardar({ fotoUrl: url });
    }

    setSubiendo(false);
    if (inputFoto.current) inputFoto.current.value = ""; // permite re-subir la misma
  }

  async function quitarFoto() {
    setSubiendo(true);
    await eliminarFotoPerfil(perfil.id, perfil.fotoUrl);
    await onGuardar({ fotoUrl: null });
    setSubiendo(false);
  }

  return (
    <SeccionLayout
      titulo={t("configuracion.perfil.titulo")}
      descripcion={t("configuracion.perfil.descripcion")}
      estado={estado}
      error={error}
      puedeGuardar={sucio && valido}
      onGuardar={() => onGuardar({ nombre, apellidos, pais: pais || null })}
    >
      {/* Foto: se guarda al instante, no espera al botón Guardar. */}
      <div className="flex items-center gap-4">
        <div className="size-20 shrink-0 overflow-hidden rounded-full bg-surface">
          {perfil.fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={perfil.fotoUrl}
              alt={t("configuracion.perfil.foto")}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-xl text-muted">
              {(perfil.nombre?.[0] ?? "?").toUpperCase()}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex gap-2">
            <button
              type="button"
              disabled={subiendo}
              onClick={() => inputFoto.current?.click()}
              className="rounded-md border border-line px-3 py-1.5 text-sm text-main
                         hover:bg-surface disabled:opacity-50"
            >
              {subiendo
                ? t("configuracion.perfil.foto-subiendo")
                : t("configuracion.perfil.foto-cambiar")}
            </button>

            {perfil.fotoUrl && (
              <button
                type="button"
                disabled={subiendo}
                onClick={quitarFoto}
                className="rounded-md px-3 py-1.5 text-sm text-danger hover:underline
                           disabled:opacity-50"
              >
                {t("configuracion.perfil.foto-quitar")}
              </button>
            )}
          </div>

          <p className="text-xs text-muted">
            {t("configuracion.perfil.foto-ayuda")} ·{" "}
            {Math.round(MAX_FOTO_BYTES / 1024 / 1024)} MB
          </p>
          {errorFoto && <p className="text-xs text-danger">{errorFoto}</p>}
        </div>

        <input
          ref={inputFoto}
          type="file"
          accept={TIPOS_FOTO.join(",")}
          onChange={manejarFoto}
          className="hidden"
        />
      </div>

      <ValidatedInput
        label={t("onboarding.personal.nombre")}
        value={nombre}
        onChange={setNombre}
        estado={nombre.trim() ? "valido" : "vacio"}
      />

      <ValidatedInput
        label={t("onboarding.personal.apellidos")}
        value={apellidos}
        onChange={setApellidos}
        estado={apellidos.trim() ? "valido" : "vacio"}
      />

      <SelectField
        label={t("configuracion.perfil.pais")}
        value={pais}
        opciones={PAISES.map((p) => ({ id: p.codigo, nombre: p.nombre }))}
        onChange={(v) => setPais(v)}
        placeholder={t("configuracion.perfil.pais-ph")}
      />
    </SeccionLayout>
  );
}
