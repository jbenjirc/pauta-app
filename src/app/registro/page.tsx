"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/contextos/LanguageContext";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsj, setErrorMsj] = useState("");

  const router = useRouter();
  const supabase = createClient();

  const { t } = useTranslation();

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsj("");

    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      alert("¡Cuenta creada con éxito! Inicia sesión para empezar.");
      router.push("/entrar");
    } catch (error: any) {
      setErrorMsj(error.message || "Ocurrió un error al crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 font-sans transition-colors duration-300">
      <div className="max-w-md w-full bg-surface rounded-2xl shadow-sm border border-border-line p-8 transition-colors duration-300">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-main mb-2">
            {t("registro.registroForm.title")}
          </h1>
          <p className="text-text-muted text-sm">
            {t("registro.registroForm.description")}
          </p>
        </div>

        <form onSubmit={manejarRegistro} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              {t("registro.registroForm.mail-title")}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border-line text-text-main placeholder:text-text-muted rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder={t("registro.registroForm.mail-placeholder")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              {t("registro.registroForm.password-title")}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border-line text-text-main placeholder:text-text-muted rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder={t("registro.registroForm.password-placeholder")}
            />
          </div>

          {errorMsj && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg border border-red-100 dark:border-red-800 transition-colors">
              {errorMsj}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-text font-semibold py-2.5 rounded-lg transition-all shadow-sm"
          >
            {loading ? (
              "Creando..."
            ) : (
              <>
                <UserPlus className="w-4 h-4" />{" "}
                {t("registro.registroForm.submit-button")}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <div className="text-sm text-text-muted">
            {t("registro.registroForm.login-text")}{" "}
            <Link
              href="/entrar"
              className="font-semibold text-text-main hover:text-primary transition-colors"
            >
              {t("registro.registroForm.login-link")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
