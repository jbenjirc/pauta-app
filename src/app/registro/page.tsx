"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { UserPlus } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsj, setErrorMsj] = useState("");

  const router = useRouter();
  const supabase = createClient();

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsj("");

    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      alert("¡Cuenta creada con éxito! Serás redirigido al editor.");
      router.push("/editor");
    } catch (error: any) {
      setErrorMsj(error.message || "Ocurrió un error al crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Crear una cuenta
          </h1>
          <p className="text-gray-500 text-sm">
            Comienza a organizar tus escaletas en Pauta App
          </p>
        </div>

        <form onSubmit={manejarRegistro} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {errorMsj && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
              {errorMsj}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm"
          >
            {loading ? (
              "Creando..."
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Registrarse
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
