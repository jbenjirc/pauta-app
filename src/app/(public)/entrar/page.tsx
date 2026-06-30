"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/contextos/LanguageContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsj, setErrorMsj] = useState("");

  const router = useRouter();
  const supabase = createClient();
  const { t } = useTranslation();

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsj("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/inicio");
    } catch (error: any) {
      setErrorMsj(error.message || "Credenciales incorrectas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-4 font-sans w-full">
      <div className="max-w-md w-full bg-surface rounded-2xl shadow-sm border border-line p-8 transition-colors duration-300">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-main mb-2">
            {t("entrar.entrarForm.title")}
          </h1>
          <p className="text-muted text-sm">
            {t("entrar.entrarForm.description")}
          </p>
        </div>

        <form onSubmit={manejarLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-main mb-1">
              {t("entrar.entrarForm.mail-title")}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-line text-main placeholder:text-muted rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder={t("entrar.entrarForm.mail-placeholder")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-main mb-1">
              {t("entrar.entrarForm.password-title")}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-line text-main placeholder:text-muted rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder={t("entrar.entrarForm.password-placeholder")}
            />
          </div>

          {errorMsj && (
            <div className="bg-danger/10 text-danger text-sm p-3 rounded-lg border border-danger/20 transition-colors">
              {errorMsj}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-text font-semibold py-2.5 rounded-lg transition-all shadow-sm"
          >
            {loading ? (
              "Iniciando..."
            ) : (
              <>
                <LogIn className="w-4 h-4" />{" "}
                {t("entrar.entrarForm.submit-button")}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <div className="text-sm text-muted mb-2">
            {t("entrar.entrarForm.register-text")}{" "}
            <Link
              href="/registro"
              className="font-semibold text-main hover:text-primary transition-colors"
            >
              {t("entrar.entrarForm.register-link")}
            </Link>
          </div>
          <p className="text-xs text-muted/70 italic">
            Prueba con test@pauta.com y pauta123 para probar funcionalidades.
          </p>
        </div>
      </div>
    </div>
  );
}
