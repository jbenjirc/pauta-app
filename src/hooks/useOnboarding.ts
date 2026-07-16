// src/hooks/useOnboarding.ts
"use client";
// Orquestador del wizard de onboarding: estado del formulario, control de
// pasos, cálculo de progreso y guardado final. La UI (OnboardingWizard) sólo
// renderiza según lo que este hook expone.
import { useMemo, useState } from "react";
import { useTranslation } from "@/contextos/LanguageContext";
import { guardarOnboarding } from "@/lib/perfiles/perfilQueries";
import type { SeleccionOrg } from "@/hooks/useOrgCascade";

export type PasoOnboarding = "personal" | "eclesiastica" | "listo";
const ORDEN_PASOS: PasoOnboarding[] = ["personal", "eclesiastica", "listo"];

export interface DatosPersonales {
  nombre: string;
  apellidos: string;
}

export function useOnboarding(userId: string) {
  const { currentLang } = useTranslation();

  const [pasoIndex, setPasoIndex] = useState(0);
  const [guardando, setGuardando] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState<string | null>(null);

  // --- Datos del paso 1 -----------------------------------------------------
  const [personal, setPersonal] = useState<DatosPersonales>({
    nombre: "",
    apellidos: "",
  });

  // --- Datos del paso 2 -----------------------------------------------------
  // esMiembro: null = aún no elige, true/false = elección hecha.
  const [esMiembro, setEsMiembro] = useState<boolean | null>(null);
  const [seleccionOrg, setSeleccionOrg] = useState<SeleccionOrg | null>(null);
  const [iglesiaLibre, setIglesiaLibre] = useState("");
  // Miembro cuya iglesia NO está en el árbol: la escribe a mano.
  const [iglesiaManual, setIglesiaManual] = useState(false);

  const pasoActual = ORDEN_PASOS[pasoIndex];

  // Progreso 0..1 para la barra SIN números.
  const progreso = useMemo(
    () => pasoIndex / (ORDEN_PASOS.length - 1),
    [pasoIndex],
  );

  // --- Reglas de avance -----------------------------------------------------
  const personalCompleto =
    personal.nombre.trim().length > 0 && personal.apellidos.trim().length > 0;

  const eclesiasticaCompleta = useMemo(() => {
    if (esMiembro === null) return false;
    if (esMiembro === false) return iglesiaLibre.trim().length > 0;
    // Miembro: o eligió una iglesia de la lista, o marcó "no aparece" y la
    // escribió a mano.
    if (iglesiaManual) return iglesiaLibre.trim().length > 0;
    return Boolean(seleccionOrg?.iglesiaId);
  }, [esMiembro, iglesiaManual, iglesiaLibre, seleccionOrg]);

  const puedeAvanzar =
    (pasoActual === "personal" && personalCompleto) ||
    (pasoActual === "eclesiastica" && eclesiasticaCompleta) ||
    pasoActual === "listo";

  // --- Navegación -----------------------------------------------------------
  const siguiente = () => {
    if (pasoIndex < ORDEN_PASOS.length - 1 && puedeAvanzar) {
      setPasoIndex((i) => i + 1);
    }
  };
  const anterior = () => setPasoIndex((i) => Math.max(0, i - 1));

  // --- Guardado + avance a "listo" -----------------------------------------
  const finalizarEclesiastica = async () => {
    if (!eclesiasticaCompleta) return;
    setGuardando(true);
    setErrorGuardado(null);

    // Un miembro que escribe su iglesia a mano guarda el nombre en
    // iglesia_libre y deja iglesia_id en null.
    const usaManual = esMiembro === true && iglesiaManual;

    const { error } = await guardarOnboarding(userId, {
      nombre: personal.nombre,
      apellidos: personal.apellidos,
      esMiembroAsd: esMiembro === true,
      divisionId: seleccionOrg?.divisionId,
      unionId: seleccionOrg?.unionId,
      campoLocalId: seleccionOrg?.campoLocalId,
      distritoId: seleccionOrg?.distritoId,
      iglesiaId: usaManual ? null : seleccionOrg?.iglesiaId,
      iglesiaLibre: esMiembro === false || usaManual ? iglesiaLibre : null,
      pais: seleccionOrg?.pais ?? null,
      idiomaPreferente: currentLang,
    });

    setGuardando(false);
    if (error) {
      setErrorGuardado(error);
      return;
    }
    setPasoIndex(ORDEN_PASOS.length - 1); // -> "listo"
  };

  return {
    // estado de pasos
    pasoActual,
    pasoIndex,
    totalPasos: ORDEN_PASOS.length,
    progreso,
    // paso 1
    personal,
    setPersonal,
    personalCompleto,
    // paso 2
    esMiembro,
    setEsMiembro,
    seleccionOrg,
    setSeleccionOrg,
    iglesiaLibre,
    setIglesiaLibre,
    iglesiaManual,
    setIglesiaManual,
    eclesiasticaCompleta,
    // navegación / guardado
    puedeAvanzar,
    siguiente,
    anterior,
    finalizarEclesiastica,
    guardando,
    errorGuardado,
  };
}
