// src/components/auth/ConfirmRedirect.tsx
"use client";
// Pantalla "¡Cuenta confirmada!" con cuenta regresiva de 10s y salto manual.
import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/contextos/LanguageContext";
import { useCountdownRedirect } from "@/hooks/useCountdownRedirect";

interface Props {
  destino?: string;
  segundos?: number;
}

export default function ConfirmRedirect({
  destino = "/nuevo-usuario",
  segundos = 10,
}: Props) {
  const { t } = useTranslation();
  const { restante, redirigirAhora } = useCountdownRedirect(destino, segundos);

  return (
    <div className="max-w-md w-full bg-surface rounded-2xl shadow-sm border border-line p-8 text-center transition-colors duration-300">
      <CheckCircle2 className="w-14 h-14 text-success mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-main mb-2">
        {t("registro.confirmado.title")}
      </h1>
      <p className="text-muted text-sm mb-6">
        {t("registro.confirmado.description").replace("{s}", String(restante))}
      </p>
      <button
        onClick={redirigirAhora}
        className="w-full bg-primary hover:opacity-90 text-primary-text font-semibold py-2.5 rounded-lg transition-all shadow-sm"
      >
        {t("registro.confirmado.button")}
      </button>
    </div>
  );
}
