// src/components/onboarding/steps/StepPersonal.tsx
"use client";
// Paso 1: Información personal. Nombre y Apellidos requeridos; Campo de Perfil
// opcional. Habilita "Continuar" sólo con los requeridos llenos.
import { useTranslation } from "@/contextos/LanguageContext";
import ValidatedInput from "@/components/ui/ValidatedInput";
import type { DatosPersonales } from "@/hooks/useOnboarding";

interface Props {
  datos: DatosPersonales;
  onChange: (d: DatosPersonales) => void;
  puedeAvanzar: boolean;
  onSiguiente: () => void;
}

export default function StepPersonal({
  datos,
  onChange,
  puedeAvanzar,
  onSiguiente,
}: Props) {
  const { t } = useTranslation();
  const set = (k: keyof DatosPersonales, v: string) =>
    onChange({ ...datos, [k]: v });

  return (
    <section className="space-y-5">
      <header>
        <h2 className="text-xl font-bold text-main">
          {t("onboarding.personal.title")}
        </h2>
        <p className="text-sm text-muted">
          {t("onboarding.personal.subtitle")}
        </p>
      </header>

      <ValidatedInput
        label={t("onboarding.personal.nombre")}
        value={datos.nombre}
        onChange={(v) => set("nombre", v)}
        placeholder={t("onboarding.personal.nombre-ph")}
        estado={datos.nombre.trim() ? "valido" : "vacio"}
        autoComplete="given-name"
      />

      <ValidatedInput
        label={t("onboarding.personal.apellidos")}
        value={datos.apellidos}
        onChange={(v) => set("apellidos", v)}
        placeholder={t("onboarding.personal.apellidos-ph")}
        estado={datos.apellidos.trim() ? "valido" : "vacio"}
        autoComplete="family-name"
      />

      <ValidatedInput
        label={t("onboarding.personal.campo-perfil")}
        value={datos.campoPerfil}
        onChange={(v) => set("campoPerfil", v)}
        placeholder={t("onboarding.personal.campo-perfil-ph")}
      />

      <button
        onClick={onSiguiente}
        disabled={!puedeAvanzar}
        className="w-full bg-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-text font-semibold py-2.5 rounded-lg transition-all shadow-sm"
      >
        {t("onboarding.continuar")}
      </button>
    </section>
  );
}
