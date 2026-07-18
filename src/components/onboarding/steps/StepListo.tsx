// src/components/onboarding/steps/StepListo.tsx
"use client";
// Paso 3: "¡Todo listo para comenzar!". Ilustración (hueco reservado),
// cuenta regresiva de 10s y botón "¡Quiero empezar!" -> /inicio.
import { useTranslation } from "@/contextos/LanguageContext";
import { useCountdownRedirect } from "@/hooks/useCountdownRedirect";

export default function StepListo() {
  const { t } = useTranslation();
  const { restante, redirigirAhora } = useCountdownRedirect("/inicio", 10);

  return (
    <section className="text-center space-y-5">
      {/* Hueco reservado para la ilustración de "persona feliz" */}
      <div className="w-40 h-40 mx-auto flex items-center justify-center rounded-2xl bg-background">
        {/* <IlustracionFeliz /> */}
        <span className="text-xs text-muted">ilustración</span>
      </div>

      <h2 className="text-2xl font-bold text-main">
        {t("onboarding.listo.title")}
      </h2>
      <p className="text-sm text-muted">
        {t("onboarding.listo.description").replace("{s}", String(restante))}
      </p>

      <button
        onClick={redirigirAhora}
        className="w-full bg-primary hover:opacity-90 text-primary-text font-semibold py-2.5 rounded-lg transition-all shadow-sm"
      >
        {t("onboarding.listo.button")}
      </button>
    </section>
  );
}
