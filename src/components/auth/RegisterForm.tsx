// src/components/auth/RegisterForm.tsx
"use client";
// Formulario de registro. Compone: validación en vivo (useAuthValidation) +
// primitiva ValidatedInput + alta en Supabase. La página sólo lo monta.
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/contextos/LanguageContext";
import { useAuthValidation } from "@/hooks/useAuthValidation";
import ValidatedInput from "@/components/ui/ValidatedInput";

export default function RegisterForm() {
  const router = useRouter();
  const supabase = createClient();
  const { t, currentLang } = useTranslation();

  const {
    email,
    password,
    setEmail,
    setPassword,
    tocado,
    marcarTocado,
    emailVal,
    passwordVal,
    puedeEnviar,
  } = useAuthValidation();

  const [loading, setLoading] = useState(false);
  const [errorMsj, setErrorMsj] = useState("");

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!puedeEnviar) return;
    setLoading(true);
    setErrorMsj("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Guardamos el idioma para que el trigger de BD lo use al crear el perfil.
          data: { idioma_preferente: currentLang },
          // A dónde vuelve el usuario tras confirmar el correo (2 pasos).
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/registro/confirmado`,
        },
      });
      if (error) throw error;

      // Si la confirmación por correo está DESACTIVADA (modo test), Supabase
      // ya devuelve sesión -> vamos directo a la pantalla de confirmado.
      // Si está ACTIVADA, no hay sesión aún -> "revisa tu correo".
      if (data.session) {
        router.push("/registro/confirmado");
      } else {
        router.push("/registro/verifica");
      }
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al crear la cuenta.";
      setErrorMsj(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-surface rounded-2xl shadow-sm border border-line p-8 transition-colors duration-300">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-main mb-2">
          {t("registro.registroForm.title")}
        </h1>
        <p className="text-muted text-sm">
          {t("registro.registroForm.description")}
        </p>
      </div>

      <form onSubmit={manejarRegistro} className="space-y-5" noValidate>
        <ValidatedInput
          label={t("registro.registroForm.mail-title")}
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          onBlur={() => marcarTocado("email")}
          placeholder={t("registro.registroForm.mail-placeholder")}
          estado={tocado.email ? emailVal.estado : "vacio"}
          mensaje={emailVal.errorKey ? t(emailVal.errorKey) : null}
        />

        <ValidatedInput
          label={t("registro.registroForm.password-title")}
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          onBlur={() => marcarTocado("password")}
          placeholder={t("registro.registroForm.password-placeholder")}
          estado={tocado.password ? passwordVal.estado : "vacio"}
          mensaje={passwordVal.errorKey ? t(passwordVal.errorKey) : null}
        />

        {errorMsj && (
          <div className="bg-danger/10 text-danger text-sm p-3 rounded-lg border border-danger/20 transition-colors">
            {errorMsj}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !puedeEnviar}
          className="w-full flex justify-center items-center gap-2 bg-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-text font-semibold py-2.5 rounded-lg transition-all shadow-sm"
        >
          {loading ? (
            t("registro.registroForm.loading") || "Creando..."
          ) : (
            <>
              <UserPlus className="w-4 h-4" />{" "}
              {t("registro.registroForm.submit-button")}
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted">
        {t("registro.registroForm.login-text")}{" "}
        <Link
          href="/entrar"
          className="font-semibold text-main hover:text-primary transition-colors"
        >
          {t("registro.registroForm.login-link")}
        </Link>
      </div>
    </div>
  );
}
