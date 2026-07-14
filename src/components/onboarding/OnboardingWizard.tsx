// src/components/onboarding/OnboardingWizard.tsx
"use client";
// Orquestador visual del onboarding. Recibe el userId (desde la page server),
// usa useOnboarding para el estado y decide qué paso renderizar.
import { useOnboarding } from "@/hooks/useOnboarding";
import ProgressBar from "@/components/ui/ProgressBar";
import StepPersonal from "@/components/onboarding/steps/StepPersonal";
import StepEclesiastica from "@/components/onboarding/steps/StepEclesiastica";
import StepListo from "@/components/onboarding/steps/StepListo";

export default function OnboardingWizard({ userId }: { userId: string }) {
  const ob = useOnboarding(userId);

  return (
    <div className="max-w-lg w-full bg-surface rounded-2xl shadow-sm border border-line p-8 transition-colors duration-300">
      {/* Barra de progreso SIN números (oculta en el paso final "listo") */}
      {ob.pasoActual !== "listo" && (
        <div className="mb-8">
          <ProgressBar valor={ob.progreso} />
        </div>
      )}

      {ob.pasoActual === "personal" && (
        <StepPersonal
          datos={ob.personal}
          onChange={ob.setPersonal}
          puedeAvanzar={ob.personalCompleto}
          onSiguiente={ob.siguiente}
        />
      )}

      {ob.pasoActual === "eclesiastica" && (
        <StepEclesiastica
          esMiembro={ob.esMiembro}
          setEsMiembro={ob.setEsMiembro}
          onSeleccionOrg={ob.setSeleccionOrg}
          iglesiaLibre={ob.iglesiaLibre}
          setIglesiaLibre={ob.setIglesiaLibre}
          iglesiaManual={ob.iglesiaManual}
          setIglesiaManual={ob.setIglesiaManual}
          completa={ob.eclesiasticaCompleta}
          guardando={ob.guardando}
          error={ob.errorGuardado}
          onFinalizar={ob.finalizarEclesiastica}
          onAtras={ob.anterior}
        />
      )}

      {ob.pasoActual === "listo" && <StepListo />}
    </div>
  );
}
