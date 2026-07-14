"use client";
// src/app/(public)/registro/verifica/page.tsx
// Se muestra cuando la confirmación por correo está ACTIVA: el usuario debe
// abrir el enlace del correo, que lo lleva a /auth/callback -> /registro/confirmado.
import { MailCheck } from "lucide-react";
import { useTranslation } from "@/contextos/LanguageContext";

export default function VerificaPage() {
  const { t } = useTranslation();
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-4 w-full">
      <div className="max-w-md w-full bg-surface rounded-2xl shadow-sm border border-line p-8 text-center">
        <MailCheck className="w-14 h-14 text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-main mb-2">
          {t("registro.verifica.title")}
        </h1>
        <p className="text-muted text-sm">
          {t("registro.verifica.description")}
        </p>
      </div>
    </div>
  );
}
