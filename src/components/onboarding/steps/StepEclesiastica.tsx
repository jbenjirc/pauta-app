// src/components/onboarding/steps/StepEclesiastica.tsx
"use client";
// Paso 2: Información eclesiástica.
//  - Elección Miembro ASD (Sí/No) con dos ChoiceCard (huecos de ilustración).
//  - Si "Sí": cascada División->Unión->Campo->Distrito->Iglesia (habilitación
//    progresiva; cada dropdown se activa al elegir el anterior).
//  - Si "No": un solo campo de Iglesia en texto libre (resto = N/A en BD).
// La lógica de la cascada vive en useOrgCascade; aquí sólo se pinta.
import { useEffect } from "react";
import { useTranslation } from "@/contextos/LanguageContext";
import { useOrgCascade, type SeleccionOrg } from "@/hooks/useOrgCascade";
import ChoiceCard from "@/components/ui/ChoiceCard";
import SelectField from "@/components/ui/SelectField";
import ValidatedInput from "@/components/ui/ValidatedInput";

interface Props {
  esMiembro: boolean | null;
  setEsMiembro: (v: boolean) => void;
  onSeleccionOrg: (s: SeleccionOrg | null) => void;
  iglesiaLibre: string;
  setIglesiaLibre: (v: string) => void;
  iglesiaManual: boolean;
  setIglesiaManual: (v: boolean) => void;
  completa: boolean;
  guardando: boolean;
  error: string | null;
  onFinalizar: () => void;
  onAtras: () => void;
}

export default function StepEclesiastica({
  esMiembro,
  setEsMiembro,
  onSeleccionOrg,
  iglesiaLibre,
  setIglesiaLibre,
  iglesiaManual,
  setIglesiaManual,
  completa,
  guardando,
  error,
  onFinalizar,
  onAtras,
}: Props) {
  const { t } = useTranslation();
  const { niveles, seleccion, seleccionar } = useOrgCascade(esMiembro === true);

  // Sincroniza la selección de la cascada hacia el hook padre (useOnboarding).
  useEffect(() => {
    if (esMiembro === true) onSeleccionOrg(seleccion);
    else onSeleccionOrg(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    esMiembro,
    seleccion.divisionId,
    seleccion.unionId,
    seleccion.campoLocalId,
    seleccion.distritoId,
    seleccion.iglesiaId,
    seleccion.pais,
  ]);

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-xl font-bold text-main">
          {t("onboarding.eclesiastica.title")}
        </h2>
        <p className="text-sm text-muted">
          {t("onboarding.eclesiastica.pregunta")}
        </p>
      </header>

      {/* Elección con dos ilustraciones */}
      <div className="flex gap-4">
        <ChoiceCard
          titulo={t("onboarding.eclesiastica.si")}
          seleccionada={esMiembro === true}
          onSelect={() => setEsMiembro(true)}
          /* ilustracion={<TuIlustracionSi />} */
        />
        <ChoiceCard
          titulo={t("onboarding.eclesiastica.no")}
          seleccionada={esMiembro === false}
          onSelect={() => setEsMiembro(false)}
          /* ilustracion={<TuIlustracionNo />} */
        />
      </div>

      {/* Rama MIEMBRO: cascada de dropdowns */}
      {esMiembro === true && (
        <div className="space-y-4 pt-2">
          <SelectField
            label={t("onboarding.org.division")}
            value={niveles.division.seleccionId}
            opciones={niveles.division.opciones}
            cargando={niveles.division.cargando}
            onChange={(id) => seleccionar("division", id)}
            placeholder={t("onboarding.org.division-ph")}
          />
          <SelectField
            label={t("onboarding.org.union")}
            value={niveles.union.seleccionId}
            opciones={niveles.union.opciones}
            cargando={niveles.union.cargando}
            disabled={!niveles.division.seleccionId}
            onChange={(id) => seleccionar("union", id)}
            placeholder={t("onboarding.org.union-ph")}
          />
          <SelectField
            label={t("onboarding.org.campo")}
            value={niveles.campo.seleccionId}
            opciones={niveles.campo.opciones}
            cargando={niveles.campo.cargando}
            disabled={!niveles.union.seleccionId}
            onChange={(id) => seleccionar("campo_local", id)}
            placeholder={t("onboarding.org.campo-ph")}
          />
          <SelectField
            label={t("onboarding.org.distrito")}
            value={niveles.distrito.seleccionId}
            opciones={niveles.distrito.opciones}
            cargando={niveles.distrito.cargando}
            disabled={!niveles.campo.seleccionId}
            onChange={(id) => seleccionar("distrito", id)}
            placeholder={t("onboarding.org.distrito-ph")}
          />
          <div className="space-y-2">
            <SelectField
              label={t("onboarding.org.iglesia")}
              value={niveles.iglesia.seleccionId}
              opciones={niveles.iglesia.opciones}
              cargando={niveles.iglesia.cargando}
              disabled={!niveles.distrito.seleccionId || iglesiaManual}
              onChange={(id) => seleccionar("iglesia", id)}
              placeholder={t("onboarding.org.iglesia-ph")}
            />

            {/* Fallback: la iglesia del miembro aún no está en el árbol.
                Disponible en cuanto hay distrito (el dropdown de iglesia ya
                está habilitado, con o sin opciones). */}
            {niveles.distrito.seleccionId && !iglesiaManual && (
              <button
                type="button"
                onClick={() => setIglesiaManual(true)}
                className="text-sm text-primary hover:underline"
              >
                {t("onboarding.org.iglesia-no-en-lista")}
              </button>
            )}

            {iglesiaManual && (
              <div className="space-y-2 pt-1">
                <ValidatedInput
                  label={t("onboarding.org.iglesia")}
                  value={iglesiaLibre}
                  onChange={setIglesiaLibre}
                  placeholder={t("onboarding.org.iglesia-manual-ph")}
                  estado={iglesiaLibre.trim() ? "valido" : "vacio"}
                />
                <button
                  type="button"
                  onClick={() => setIglesiaManual(false)}
                  className="text-sm text-muted hover:underline"
                >
                  {t("onboarding.org.iglesia-volver-lista")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rama NO MIEMBRO: iglesia en texto libre */}
      {esMiembro === false && (
        <div className="pt-2">
          <ValidatedInput
            label={t("onboarding.org.iglesia")}
            value={iglesiaLibre}
            onChange={setIglesiaLibre}
            placeholder={t("onboarding.org.iglesia-libre-ph")}
            estado={iglesiaLibre.trim() ? "valido" : "vacio"}
          />
        </div>
      )}

      {error && (
        <div className="bg-danger/10 text-danger text-sm p-3 rounded-lg border border-danger/20">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onAtras}
          className="px-5 py-2.5 rounded-lg border border-line text-main hover:bg-background transition-all"
        >
          {t("onboarding.atras")}
        </button>
        <button
          onClick={onFinalizar}
          disabled={!completa || guardando}
          className="flex-1 bg-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-text font-semibold py-2.5 rounded-lg transition-all shadow-sm"
        >
          {guardando ? t("onboarding.guardando") : t("onboarding.finalizar")}
        </button>
      </div>
    </section>
  );
}
